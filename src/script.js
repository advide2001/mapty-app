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

class Workout {
  date = new Date();
  id = new Date().toISOString().slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duraction = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duraction / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.cadence = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// APPLICATION ARCHITECTURE--------------------------------
// Class App is the main app from where the js engine is loaded
class App {
  // Properties of the class
  #map;
  #mapEvent;
  // Construtor invoked when the page is fully loaded
  constructor() {
    this._getPosition(); // Fetch user position

    // EVENT LISTENERS
    form.addEventListener('submit', this._newWorkout.bind(this));

    // Add an event listener to listen to the change in type of activity
    inputType.addEventListener('change', this._toggleElevationField);
  }

  // Method to fetch user location co-ordinates
  _getPosition() {
    function error() {
      alert('Please allow us to access your location!');
    }

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported on your system.');
    } else {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), error);
    }
  }

  // Method to render map and place markers on the map
  _loadMap(position) {
    const coords = [position.coords.latitude, position.coords.longitude];

    // create map using the user location coordinates
    this.#map = L.map('map', {
      center: coords,
      zoom: 13,
    });

    // add design style to the map
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(this.#map);

    // handle clicks on the map. map.on is similar to an event listener on the map.
    this.#map.on('click', this._showForm.bind(this));
  }

  // Method to show the workout input form when map is clicked
  _showForm(mapE) {
    form.classList.remove('hidden');
    inputDistance.focus();
    this.#mapEvent = mapE;
  }

  // Method to change variables based on activity
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // Method to create a new activity when form is submitted to save the data from the form
  _newWorkout(e) {
    // Submitting the form automatically refreshes the page
    e.preventDefault();

    // Clear the input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Create a marker on the map
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

const app = new App();
