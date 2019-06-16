let ip = window.location.hostname;
var bal_oefen, kegel_oefen, flowerstick_oefen, bal_count, kegel_count, flowerstick_count;

//#region ***********  Callback - HTML Generation (After select) ***********
const laadGrafiek = function() {
  var ctx = document.getElementById('myChart').getContext('2d');

  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['bal practiced', 'bal goal', 'club practiced', 'club goal', 'flowerstick practiced', 'flowerstick goal'],
      datasets: [
        {
          label: 'seconds',
          data: [bal_oefen.getSeconds() + bal_oefen.getMinutes() * 60 + bal_oefen.getHours() * 3600, bal_count.getSeconds() + bal_count.getMinutes() * 60 + bal_count.getHours() * 3600, kegel_oefen.getSeconds() + kegel_oefen.getMinutes() * 60 + kegel_oefen.getHours() * 3600, kegel_count.getSeconds() + kegel_count.getMinutes() * 60 + kegel_count.getHours() * 3600, flowerstick_oefen.getSeconds() + flowerstick_oefen.getMinutes() * 60 + flowerstick_oefen.getHours() * 3600, flowerstick_count.getSeconds() + flowerstick_count.getMinutes() * 60 + flowerstick_count.getHours() * 3600],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
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

  var ctxx = document.querySelector('#test').getContext('2d');
  var chart = new Chart(ctxx, {
    type: 'bar',
    data: {
      labels: ['ball', 'club', 'flowerstick'],
      datasets: [
        {
          label: 'seconds of practice',
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
  var ctxxx = document.querySelector('#another').getContext('2d');
  var chart = new Chart(ctxxx, {
    type: 'bar',
    data: {
      labels: ['ball', 'club', 'flowerstick'],
      datasets: [
        {
          label: 'seconds of goals',
          data: [bal_count.getSeconds() + bal_count.getMinutes() * 60 + bal_count.getHours() * 3600, kegel_count.getSeconds() + kegel_count.getMinutes() * 60 + kegel_count.getHours() * 3600, flowerstick_count.getSeconds() + flowerstick_count.getMinutes() * 60 + flowerstick_count.getHours() * 3600],
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
  // console.log(object);
  if (object.length > 7) {
    let bal_split = object.slice(object.length - 8, object.length + 1).split(':');
    bal_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  } else {
    let bal_split = object.split(':');
    bal_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  }
};
const log_kegel = function(object) {
  if (object.length > 7) {
    let bal_split = object.slice(object.length - 8, object.length + 1).split(':');
    kegel_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  } else {
    let bal_split = object.split(':');
    kegel_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  }
};
const log_flowerstick = function(object) {
  if (object.length > 7) {
    let bal_split = object.slice(object.length - 8, object.length + 1).split(':');
    flowerstick_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  } else {
    let bal_split = object.split(':');
    flowerstick_oefen = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  }
};
const log_bal_count = function(object) {
  if (object.length > 7) {
    let bal_split = object.slice(object.length - 8, object.length + 1).split(':');
    bal_count = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  } else {
    let bal_split = object.split(':');
    bal_count = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  }
  console.log('test');
  console.log(bal_count);
};
const log_kegel_count = function(object) {
  if (object.length > 7) {
    let bal_split = object.slice(object.length - 8, object.length + 1).split(':');
    kegel_count = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  } else {
    let bal_split = object.split(':');
    kegel_count = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  }
};
const log_flowerstick_count = function(object) {
  if (object.length > 7) {
    let bal_split = object.slice(object.length - 8, object.length + 1).split(':');
    flowerstick_count = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  } else {
    let bal_split = object.split(':');
    flowerstick_count = new Date(0, 0, 0, bal_split[0], bal_split[1], bal_split[2]);
  }
  laadGrafiek();
};
const fun = function(object) {
  console.log(object);
};
//#endregion

//#region ***********  Callback - (After update/delete/insert) ***********
// callback______

//#endregion
//#region ***********  Data Access ***********
const get_practice = function() {
  handleData(`http://${ip}:5000/api/v1/bal`, log_bal);
  handleData(`http://${ip}:5000/api/v1/kegel`, log_kegel);
  handleData(`http://${ip}:5000/api/v1/flowerstick`, log_flowerstick);
  handleData(`http://${ip}:5000/api/v1/bal_count`, log_bal_count);
  handleData(`http://${ip}:5000/api/v1/kegel_count`, log_kegel_count);
  handleData(`http://${ip}:5000/api/v1/flowerstick_count`, log_flowerstick_count);
};
const close = function() {
  handleData(`http://${ip}:5000/api/v1/close`, fun);
};
//#endregion

//#region ***********  Event Listeners ***********
const listenToButton = function() {
  document.querySelector('.js-button').addEventListener('click', function() {
    if (this.innerHTML == 'open') {
      this.classList.remove('c-circle--open');
      this.classList.add('c-circle--closed');
      this.innerHTML = 'closed';
      handleData(`http://${ip}:5000/api/v1/close`, fun);
    } else {
      this.classList.remove('c-circle--closed');
      this.classList.add('c-circle--open');
      this.innerHTML = 'open';
      console.log('open');
      handleData(`http://${ip}:5000/api/v1/open`, fun);
    }
  });
};

//#region ***********  INIT / DOMContentLoaded ***********
const init = function() {
  close();
  get_practice();
  listenToButton();
};

document.addEventListener('DOMContentLoaded', init);

//#endregion
