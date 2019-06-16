const updateKlaar = function() {
  window.alert('deleted');
  window.location.href = `http://${ip}/goals.html`;
};

let ip = window.location.hostname;
let id = window.location.search.split('=')[1];
const url = `http://${ip}:5000/api/v1/goal/${id}`;
handleData(url, updateKlaar, 'DELETE');
