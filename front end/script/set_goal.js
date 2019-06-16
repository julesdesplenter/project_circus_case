let ip = window.location.hostname;

const updateKlaar = function() {
  window.alert('inserted');
  window.location.href = `http://${ip}/goals.html`;
};

const init = function() {
  document.querySelector('.o-submit').addEventListener('click', function() {
    const url = `http://${ip}:5000/api/v1/goals`;
    const body = JSON.stringify({
      circus_equipment: document.querySelector('#action').value,
      begin: document.querySelector('#begin').value,
      end: document.querySelector('#end').value,
      number_of_times: document.querySelector('#number_of_times').value,
      duration: document.querySelector('#duration').value
    });
    console.log(body);
    handleData(url, updateKlaar, 'POST', body);
  });
};

document.addEventListener('DOMContentLoaded', init);
