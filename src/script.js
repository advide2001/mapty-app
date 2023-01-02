'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Using geo-location api to access the user location data
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API#examples
function getUserLocation() {
  function success(position) {
    const coords = [position.coords.latitude, position.coords.longitude];
    console.log(coords);

    const map = L.map('map', {
      center: coords,
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);
  }
  function error() {
    alert('Please allow us to access your location!');
  }

  if (!navigator.geolocation) {
    console.log('Geolocation is not supported on your system.');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
getUserLocation();
