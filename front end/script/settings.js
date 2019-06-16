let ip = window.location.hostname;

const set = function(object) {
  if (object == 1) {
    document.querySelector('.log').checked = false;
  } else {
    document.querySelector('.log').checked = true;
  }
};

const toon = function(object) {
  console.log(object);
};

const setCheckbox = function() {
  handleData(`http://${ip}:5000/api/v1/check`, set);
};

const init = function() {
  setCheckbox();
  document.querySelector('.log').addEventListener('click', function() {
    if (this.checked == true) {
      handleData(`http://${ip}:5000/api/v1/enable`, toon);
    } else {
      handleData(`http://${ip}:5000/api/v1/disable`, toon);
    }
  });
};

document.addEventListener('DOMContentLoaded', init);
