'use strict';
class Workout {
  date = new Date();
  id = new Date().toISOString().slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    //

    return (this.description = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )}
    on ${months[this.date.getMonth()]} ${this.date.getDate()}`);
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.description = this._setDescription();
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevation = elevationGain;
    this.description = this._setDescription();
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// APPLICATION ARCHITECTURE--------------------------------

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Class App is the main app from where the js engine is loaded
class App {
  // Properties of the class
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  // Construtor invoked when the page is fully loaded
  constructor() {
    this._getPosition(); // Fetch user position

    // EVENT LISTENERS
    // Add event listener to listen to submit events on the form in side bar
    form.addEventListener('submit', this._newWorkout.bind(this));

    // Add an event listener to listen to the change in type of activity
    inputType.addEventListener('change', this._toggleElevationField);

    // Add event listener to listen to clicks on the activity side bar
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
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
      zoom: this.#mapZoomLevel,
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

  _hideForm() {
    // Empty the inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  // Method to change variables based on activity
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // Method to create a new activity when form is submitted to save the data from the form
  _newWorkout(e) {
    // Helper function to validate if the input values are  numbers
    function validateInputs(...inputs) {
      return inputs.every(input => Number.isFinite(input));
    }

    // Helper function to validate if the input values are positive integers
    function checkPositiveInputs(...inputs) {
      return inputs.every(input => input > 0);
    }

    // Submitting the form automatically refreshes the page
    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout is running, create running object
    if (type == 'running') {
      const cadence = Number(inputCadence.value);
      // check if the data is valid
      if (
        !validateInputs(cadence, distance, duration) &&
        !checkPositiveInputs(distance, cadence, duration)
      )
        return alert('Please enter a positive number!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, create cycle object
    if (type == 'cycling') {
      const elevation = Number(inputElevation.value);
      // check if the data is valid
      if (
        !validateInputs(elevation, distance, duration) &&
        !checkPositiveInputs(distance, elevation)
      )
        return alert('Please enter a positive number!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);

    // Call the render methods to render workouts on the map and sidebar
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);

    // Clear the input fields and hide the form
    this._hideForm();

    // Set local storage
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          maxHeight: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">
            ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}
            </span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === 'cycling') {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(2)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
    }
    if (workout.type === 'running') {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(2)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutElement = e.target.closest('.workout');

    // Guard class - when the list of workouts is empty
    if (!workoutElement) return;

    const workout = this.#workouts.find(
      workout => workout.id === workoutElement.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
}

const app = new App();
