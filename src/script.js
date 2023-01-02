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

// Global Variables
let map, mapEvent;

// Using geo-location api to access the user location data
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API#examples
function getUserLocation() {
  function success(position) {
    const coords = [position.coords.latitude, position.coords.longitude];
    console.log(coords);

    map = L.map('map', {
      center: coords,
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

    // Handling clicks on the map. map.on is similar to an event listener on the map
    map.on('click', function (mapE) {
      form.classList.remove('hidden');
      inputDistance.focus();
      mapEvent = mapE;
    });
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

form.addEventListener('submit', function (e) {
  // Submitting the form automatically refreshes the page
  e.preventDefault();

  // Clear the input fields
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  // Create a marker on the map
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        maxHeight: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

// Add an event listener to listen to the change in type of activity
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
