let ip = window.location.hostname;

const updateKlaar = function() {
  window.alert('inserted');
  window.location.href = `http://${ip}/actions.html`;
};

const showInhoud = function(jsonObject) {
  console.log(jsonObject);
  console.log(jsonObject[0]);
  let date = new Date(jsonObject[0].date_of_entry);
  let date_begin = date
    .toISOString()
    .replace('T', ' ')
    .replace('.000Z', '');
  document.querySelector('#date_of_entry').value = date_begin;
  document.querySelector('#action').value = jsonObject[0].action;
  document.querySelector('#sensor').value = jsonObject[0].sensorid;
  document.querySelector('#value').value = jsonObject[0].value;
};

const init = function() {
  let id = window.location.search.split('=')[1];
  console.log(id);
  handleData(`http://${ip}:5000/api/v1/action/${id}`, showInhoud);
  document.querySelector('.o-submit').addEventListener('click', function() {
    const url = `http://${ip}:5000/api/v1/action/${id}`;
    const body = JSON.stringify({
      date_of_entry: document.querySelector('#date_of_entry').value,
      action: document.querySelector('#action').value,
      sensorid: document.querySelector('#sensor').value,
      value: document.querySelector('#value').value
    });
    console.log(body);
    handleData(url, updateKlaar, 'PUT', body);
    console.log('fun');
  });
};

document.addEventListener('DOMContentLoaded', init);
