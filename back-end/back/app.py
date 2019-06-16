from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from helpers.Database import Database
# # PY1. importeer SocketIO
from flask_socketio import SocketIO
# from MCP import MCP
from RPi import GPIO
import time
import threading
from py532lib.i2c import *
import threading
import datetime
from helpers.hx711 import HX711
import Adafruit_SSD1306

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from subprocess import check_output

import subprocess

RST = None

disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST)
disp.begin()
disp.clear()
disp.display()
width = disp.width
height = disp.height
image = Image.new('1', (width, height))
padding = -2
top = padding
bottom = height - padding
x = 0
draw = ImageDraw.Draw(image)
font = ImageFont.load_default()
draw.rectangle((0, 0, width, height), outline=0, fill=0)
IP = check_output(['hostname', '--all-ip-addresses'])
if len(str(IP).split(" ")[1]) < 16:
    draw.text((x, top), "IP: " + str(IP).split(" ")[1], font=font, fill=255)
else:
    draw.text((x, top), "IP: " + str(IP).split(" ")[0], font=font, fill=255)
disp.image(image)
disp.display()
time.sleep(.1)

# INIT THE APP
app = Flask(__name__)

# SETTINGS
endpoint = '/api/v1'
CORS(app)
conn = Database(app=app, user='mct', password='mct', db='koffer')
disabled = 0

socket = SocketIO(app)
nfc = 0
in_devilstick = 1

btn = [26, 19, 13, 6]
nfcbtn = 5
slot = 22
led = 27
closed = 1
bal_in = 1
GPIO.setmode(GPIO.BCM)
GPIO.setup(btn, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(nfcbtn, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(slot, GPIO.OUT)
GPIO.setup(led, GPIO.OUT)


hx = HX711(dout_pin=20, pd_sck_pin=16)
reading = hx.get_raw_data_mean()
reading = hx.get_data_mean()
ratio = reading / 325
hx.set_scale_ratio(ratio)
print(hx.get_weight_mean(20), 'g')


def get_count(id):
    a = conn.get_data(
        "select * from actions where sensorid = %s and DATE(date_of_entry) > (NOW() - INTERVAL 7 DAY) order by date_of_entry asc",
        id)
    count = 0
    tijd_totaal = datetime.timedelta(0)
    for i in a:
        if count == 0:
            if i['action'] == 'out':
                tijd_begin = i['date_of_entry']
                count += 1
        elif count == 1:
            if i['action'] == 'in':
                tijd_einde = i['date_of_entry']
                count += 1
                tijd_totaal += (tijd_einde - tijd_begin)
                count = 0
    return str(tijd_totaal)


def get_count_between(id, begin_var, end_var):
    a = conn.get_data(
        "select * from actions where sensorid = %s and DATE(date_of_entry) between %s and %s order by date_of_entry asc",
        [id, begin_var, end_var])
    in_bal = 1
    new = 1
    time
    tijd_totaal = datetime.timedelta(0)
    for i in a:
        if in_bal == 1:
            if i['action'] == 'out':
                in_bal = 0
                tijd_begin = i['date_of_entry']
        else:
            if i['action'] == 'in':
                # if new == 1:
                #     tijd_einde = i['date_of_entry']
                #     tijd_totaal = (tijd_einde - tijd_begin)
                #     new = 0
                # else:
                tijd_einde = i['date_of_entry']
                tijd_totaal += (tijd_einde - tijd_begin)
                in_bal = 0
    return str(tijd_totaal)


def get_practice_between(name, begin, end):
    tijd_totaal = datetime.timedelta(0)
    a = conn.get_data(
        "select * from goals where circus_equipment = %s and DATE(end) between %s and %s", [name, begin, end])
    for i in a:
        tijd_totaal = (i["duration"] * i["number_of_times"])
    return str(tijd_totaal)


def get_practice(name):
    tijd_totaal = datetime.timedelta(0)
    a = conn.get_data(
        "select * from goals where circus_equipment = %s and DATE(end) > (NOW() - INTERVAL 7 DAY)", name)
    for i in a:
        tijd_totaal = (i["duration"] * i["number_of_times"])
    return str(tijd_totaal)


def weight_callback():
    global disabled
    if disabled == 0:
        b = conn.set_data("insert into actions(action,sensorid,value) values ('out',3,%s)", mcp.read_channel(1))
        socket.emit('refresh')
        return jsonify(b)


#
def btn_callback(pinnumer):
    global disabled
    if disabled == 0:
        if (GPIO.input(pinnumer)):
            a = conn.set_data("insert into actions(action,sensorid,value) values ('out',1,%s)", pinnumer)
            socket.emit('refresh')
            print("in")
            return jsonify(a)
        else:
            a = conn.set_data("insert into actions(action,sensorid,value) values ('in',1,%s)", pinnumer)
            socket.emit('refresh')
            print("uit")
            return jsonify(a)


def nfc_callback(pinnumer):
    global disabled
    if disabled == 0:
        global led
        GPIO.output(led, 1)
        print('on')
        global disabled
        global in_devilstick
        if disabled == 0:
            global nfc
            if nfc == 0:
                pn532 = Pn532_i2c()
                pn532.SAMconfigure()
                print("done")
                nfc = 1
            global pn532
            card_data = pn532.read_mifare().get_data()
            print(card_data)
            if in_devilstick == 1:
                a = conn.set_data("insert into actions(action,sensorid,value) values ('out',2,%s)",
                                  str(card_data).split("'")[1])
                in_devilstick = 0
            else:
                a = conn.set_data("insert into actions(action,sensorid,value) values ('in',2,%s)",
                                  str(card_data).split("'")[1])
                in_devilstick = 1
            GPIO.output(led, 0)
            time.sleep(3)
            return jsonify(a)


@app.after_request
def after_request(response):
    headers = response.headers
    headers['Access-Control-Allow-Headers'] = '*'
    headers['Access-Control-Allow-Method'] = "*"
    return response


# #
#
# HELPERS
# Generic error showing / handling
# TESTROUTE
@app.route(endpoint + '/bal', methods=["GET"])
def bal():
    return jsonify(get_count(3))


@app.route(endpoint + '/kegel', methods=["GET"])
def kegell():
    return jsonify(get_count(1))


@app.route(endpoint + '/flowerstick', methods=["GET"])
def flowerstick():
    return jsonify(get_count(2))


@app.route(endpoint + '/bal/between/<begin>/<end>', methods=["GET"])
def bal_between(begin, end):
    return jsonify(get_count_between(3, begin, end))


@app.route(endpoint + '/kegel/between/<begin>/<end>', methods=["GET"])
def kegel_between(begin, end):
    return jsonify(get_count_between(1, begin, end))


@app.route(endpoint + '/flowerstick/between/<begin>/<end>', methods=["GET"])
def flowerstick_between(begin, end):
    return jsonify(get_count_between(2, begin, end))


@app.route(endpoint + '/bal_count', methods=["GET"])
def bal_count():
    return jsonify(get_practice("ball"))


@app.route(endpoint + '/kegel_count', methods=["GET"])
def kegel_count():
    return jsonify(get_practice("club"))


@app.route(endpoint + '/flowerstick_count', methods=["GET"])
def flowerstick_count():
    return jsonify(get_practice("flowerstick"))


@app.route(endpoint + '/bal_count/between/<begin>/<end>', methods=["GET"])
def bal_count_between(begin, end):
    return jsonify(get_practice_between('ball', begin, end))


@app.route(endpoint + '/kegel_count/between/<begin>/<end>', methods=["GET"])
def kegel_count_between(begin, end):
    return jsonify(get_practice_between('club', begin, end))


@app.route(endpoint + '/flowerstick_count/between/<begin>/<end>', methods=["GET"])
def flowerstick_count_between(begin, end):
    return jsonify(get_practice_between('flowerstick', begin, end))


@app.route(endpoint + '/goals', methods=['GET', 'POST'])
def set_goals():
    if request.method == 'POST':
        js = request.get_json()
        a = conn.set_data(
            "insert into goals (circus_equipment,begin,end,number_of_times,duration) values (%s,%s,%s,%s,%s)",
            [js["circus_equipment"], js["begin"], js["end"], js["number_of_times"],
             js["duration"]])
    elif request.method == 'GET':
        a = conn.get_data("select idgoals from goals")
    print("goals ok")
    return jsonify(a)


@app.route(endpoint + '/')
def get_data():
    return 'poh'


@app.route(endpoint + '/sensor', methods=['GET'])
def sensor():
    a = conn.get_data('select * from sensor')
    return jsonify(a)


@app.route(endpoint + '/action/small', methods=['GET'])
def action_small():
    a = conn.get_data('select * from actions join sensorid on actions.sensorid = sensorid.idsensorid order by date_of_entry desc limit 5')
    return jsonify(a)


@app.route(endpoint + '/action/big', methods=['GET'])
def action():
    a = conn.get_data('select * from actions join sensorid on actions.sensorid = sensorid.idsensorid  order by date_of_entry desc limit 100')
    return jsonify(a)


@app.route(endpoint + '/goals/small', methods=['GET'])
def small_goals():
    a = conn.get_data(
        'select idgoals,circus_equipment,begin,sum(duration) as "duration",end,number_of_times from goals group by idgoals limit 5')
    return jsonify(a)


@app.route(endpoint + '/goals/big', methods=['GET'])
def big_goals():
    a = conn.get_data(
        'select idgoals,circus_equipment,begin,sum(duration) as "duration",end,number_of_times from goals group by idgoals limit 100')
    return jsonify(a)


@app.route(endpoint + '/actions', methods=['POST'])
def set_action():
    js = request.get_json()
    a = conn.set_data("insert into actions (date_of_entry, action, sensorid, value) values (%s,%s,%s,%s)",
                      [js["date_of_entry"], js["action"], js["sensorid"], js["value"]])
    return jsonify(a)


@app.route(endpoint + '/goal/<id>', methods=['GET', 'PUT', 'DELETE'])
def goal_id(id):
    if request.method == 'GET':
        a = conn.get_data(
            "select idgoals,circus_equipment,begin,sum(duration) as 'duration',number_of_times as 'times',end from goals  where idgoals = %s group by idgoals",
            id)
    elif request.method == 'PUT':
        js = request.get_json()
        a = conn.set_data(
            "update goals set circus_equipment = %s, begin = %s, end = %s, number_of_times = %s,duration = %s  where idgoals = %s",
            [js["circus_equipment"], js['begin'], js['end'], js['number_of_times'], js['duration'], id])
    elif request.method == 'DELETE':
        a = conn.set_data("delete from goals where idgoals = %s", id)
    return jsonify(a)


@app.route(endpoint + '/action/<id>', methods=['GET', 'PUT', 'DELETE'])
def action_id(id):
    if request.method == 'GET':
        a = conn.get_data("select * from actions  where idactions = %s", id)
    elif request.method == 'PUT':
        js = request.get_json()
        a = conn.set_data(
            "update actions set date_of_entry = %s,action = %s, sensorid = %s, value = %s  where idactions = %s",
            [js["date_of_entry"], js['action'], js['sensorid'], js['value'], id])
    elif request.method == 'DELETE':
        a = conn.set_data("delete from actions where idactions = %s", id)
    return jsonify(a)


@app.route(endpoint + '/open', methods=['GET'])
def open():
    global closed
    GPIO.output(slot, 1)
    return jsonify('open')


@app.route(endpoint + '/close', methods=['GET'])
def close():
    global closed
    GPIO.output(slot, 0)
    return jsonify('close')


@app.route(endpoint + '/disable')
def disable():
    global disabled
    disabled = 1
    print(disable)
    return str(disabled)


@app.route(endpoint + '/enable')
def enable():
    global disabled
    disabled = 0
    print(disable)
    return str(disabled)


@app.route(endpoint + '/check')
def check():
    global disabled
    return str(disabled)


# @app.route(endpoint + '/lock')
# def lock():
#     global closed
#     return jsonify(closed)


def getWeight():
    global disabled
    if disabled == 0:
        global bal_in
        # print(hx.get_weight_mean(20))
        if bal_in == 1:
            if hx.get_weight_mean(20) < 323:
                print('uit')
                a = conn.set_data("insert into actions(action,sensorid,value) values ('out',3,%s)", hx.get_weight_mean(20))
                bal_in = 0
        elif bal_in == 0:
            if hx.get_weight_mean(20) > 325:
                print('in')
                a = conn.set_data("insert into actions(action,sensorid,value) values ('in',3,%s)", hx.get_weight_mean(20))
                bal_in = 1
    threading.Timer(1, getWeight).start()


getWeight()

# eventdetects
for i in btn:
    GPIO.add_event_detect(i, GPIO.BOTH, btn_callback, 200)
GPIO.add_event_detect(nfcbtn, GPIO.FALLING, nfc_callback, 200)
print("done")

# Start app
print("hallo")
if __name__ == '__main__':
    socket.run(app, host='0.0.0.0', port=5000)
