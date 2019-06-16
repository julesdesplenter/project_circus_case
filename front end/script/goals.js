let table, meer, body;
let ip = window.location.hostname;

// show
const laadGrafiek = function() {
  var ctxx = document.getElementById('test').getContext('2d');
  var chart = new Chart(ctxx, {
    type: 'bar',
    data: {
      labels: ['ball', 'club', 'flowerstick'],
      datasets: [
        {
          label: 'seconds of goals',
          data: [bal_oefen.getSeconds() + bal_oefen.getMinutes() * 60 + bal_oefen.getHours() * 3600, kegel_oefen.getSeconds() + kegel_oefen.getMinutes() * 60 + kegel_oefen.getHours() * 3600, flowerstick_oefen.getSeconds() + flowerstick_oefen.getMinutes() * 60 + flowerstick_oefen.getHours() * 3600],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
};
const log_bal = function(object) {
  console.log(object);
  let bal_split = object.split(':');
  bal_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
};
const log_kegel = function(object) {
  console.log(object);
  let kegel_split = object.split(':');
  kegel_oefen = new Date(0, 0, 0, kegel_split[0], kegel_split[1], kegel_split[2]);
};
const log_flowerstick = function(object) {
  console.log(object);
  let flowerstick_split = object.split(':');
  flowerstick_oefen = new Date(0, 0, 0, flowerstick_split[0], flowerstick_split[1], flowerstick_split[2]);
  laadGrafiek();
};

const getGraph = function() {
  let begin = document.querySelector('#from').value;
  let end = document.querySelector('#till').value;
  console.log(begin);
  console.log(end);
  handleData(`http://${ip}:5000/api/v1/bal_count/between/${begin}/${end}`, log_bal, 'GET');
  handleData(`http://${ip}:5000/api/v1/kegel_count/between/${begin}/${end}`, log_kegel, 'GET');
  handleData(`http://${ip}:5000/api/v1/flowerstick_count/between/${begin}/${end}`, log_flowerstick, 'GET');
};

const showTable = function(object) {
  html = '<table class="c-table"><thead><tr><th>begin</th><th>end</th><th>equipment</th><th>number of times</th><th>duration</th><th>update</th><th>delete</th></tr></thead><tbody>';
  for (let i of object) {
    let date_4 = '0'.repeat(6 - String(i.duration).length) + String(i.duration);
    let date_3 = `${date_4.slice(0, 2)}:${date_4.slice(2, 4)}:${date_4.slice(4, 6)}`;
    html += `<tr><td>${i.begin}</td><td>${i.end}</td><td>${i.circus_equipment}</td><td>${i.number_of_times}</td><td>${date_3}</td><td><a href="http://${ip}/update_goal.html?id=${i.idgoals}">Update</a></td><td><a href="http://${ip}/delete_goal.html?id=${i.idgoals}">delete</a></td></td></tr>`;
  }
  html += '<tbody></table>';
  table.innerHTML = html;
};

const showMore = function() {
  if (meer == 0) {
    handleData(`http://${ip}:5000/api/v1/goals/big`, showTable);
    document.querySelector('.js-button').innerHTML = 'less info';
    meer = 1;
  } else {
    handleData(`http://${ip}:5000/api/v1/goals/small`, showTable);
    document.querySelector('.js-button').innerHTML = 'more info';
    meer = 0;
  }
};

// listeners

const init = function() {
  meer = 1;
  table = document.querySelector('.js-table');
  showMore();
  document.querySelector('.js-button').addEventListener('click', showMore);
  document.querySelector('.js-set').addEventListener('click', function() {
    window.location.href = `http://${ip}/set_goal.html`;
  });
  document.querySelector('.o-submit').addEventListener('click', getGraph);
};

document.addEventListener('DOMContentLoaded', init);
