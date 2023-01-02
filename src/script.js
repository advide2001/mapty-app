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

function getUserLocation() {
  function success(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude + ' ' + longitude);
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
