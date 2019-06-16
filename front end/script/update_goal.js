let ip = window.location.hostname;

const updateKlaar = function() {
  window.alert('geupdaet');
  window.location.href = `http://${ip}/goals.html`;
};

const toongegevens = function(jsonObject) {
  let date = new Date(jsonObject[0].begin);
  let date_begin = date
    .toISOString()
    .replace('T', ' ')
    .replace('.000Z', '');
  let date_2 = new Date(jsonObject[0].end);
  let date_end = date_2
    .toISOString()
    .replace('T', ' ')
    .replace('.000Z', '');
  let date_4 = '0'.repeat(6 - String(jsonObject[0].duration).length) + String(jsonObject[0].duration);
  let date_3 = `${date_4.slice(0, 2)}:${date_4.slice(2, 4)}:${date_4.slice(4, 6)}`;
  console.log(date_4);
  document.querySelector('#action').value = jsonObject[0].circus_equipment;
  document.querySelector('#begin').value = date_begin;
  document.querySelector('#end').value = date_end;
  document.querySelector('#number_of_times').value = jsonObject[0].times;
  document.querySelector('#duration').value = date_3;
};

const init = function() {
  let id = window.location.search.split('=')[1];
  handleData(`http://${ip}:5000/api/v1/goal/${id}`, toongegevens);
  document.querySelector('.o-submit').addEventListener('click', function() {
    const url = `http://${ip}:5000/api/v1/goal/${id}`;
    const body = JSON.stringify({
      circus_equipment: document.querySelector('#action').value,
      begin: document.querySelector('#begin').value,
      end: document.querySelector('#end').value,
      number_of_times: document.querySelector('#number_of_times').value,
      duration: document.querySelector('#duration').value
    });
    console.log(body);
    handleData(url, updateKlaar, 'PUT', body);
  });
};

document.addEventListener('DOMContentLoaded', init);
