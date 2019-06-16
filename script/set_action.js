let ip = window.location.hostname;

const updateKlaar = function() {
  window.alert('inserted');
  window.location.href = `http://${ip}/actions.html`;
};

const init = function() {
  document.querySelector('.o-submit').addEventListener('click', function() {
    const url = `http://${ip}:5000/api/v1/actions`;
    const body = JSON.stringify({
      date_of_entry: document.querySelector('#date_of_entry').value,
      action: document.querySelector('#action').value,
      sensorid: document.querySelector('#sensor').value,
      value: document.querySelector('#value').value
    });
    console.log(body);
    handleData(url, updateKlaar, 'POST', body);
  });
};

document.addEventListener('DOMContentLoaded', init);
