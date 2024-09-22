// script.js
const apiKey = 'f4ac7d4a5b4840f086d151316242209'; // Replace with your actual API key
let forecastDays = [];
let currentLocation = { name: '', country: '' }; // Store current location

// Fetch weather forecast for the given city
async function fetchWeather(city) {
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no`;

    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        forecastDays = data.forecast.forecastday; // Store forecast days for sorting
        currentLocation = { name: data.location.name, country: data.location.country }; // Store current location
        displayWeather(data);
    } catch (error) {
        displayError(error);
    }
}

// Display weather for 7 days
function displayWeather(data) {
    const weatherContainer = document.getElementById('weather');

    let forecastHTML = `<h2>Daily Weather Forecast for ${currentLocation.name}, ${currentLocation.country}</h2>`;

    forecastDays.forEach(day => {
        forecastHTML += `
           <div class="forecast">
    <h3>${new Date(day.date).toDateString()}</h3>
    <p class="temp">Temperature: ${day.day.avgtemp_c} °C 🌡️</p>
    <p class="condition">Condition: ${day.day.condition.text} ☁️</p>
    <img src="${day.day.condition.icon}" alt="Weather Icon">
    <p>Max Temp: ${day.day.maxtemp_c} °C 🔼</p>
    <p>Min Temp: ${day.day.mintemp_c} °C 🔽</p>
    <p>Humidity: ${day.day.avghumidity}% 💧</p>
    <p>Wind Speed: ${day.day.maxwind_kph} kph 🌬️</p>
             </div>
        `;
    });

    weatherContainer.innerHTML = forecastHTML;
}

// Display error message
function displayError(error) {
    const errorContainer = document.getElementById('error');
    errorContainer.innerHTML = `<p>${error.message}</p>`;
    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 3000);
}

// Search weather for input city
function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput) {
        fetchWeather(cityInput);
    } else {
        displayError(new Error('Please enter a city name'));
    }
}

// Sort forecast based on selected option
function sortForecast() {
    const sortOption = document.getElementById('sortOptions').value;

    if (sortOption === 'temp') {
        forecastDays.sort((a, b) => a.day.avgtemp_c - b.day.avgtemp_c);
    } else {
        forecastDays.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Re-display the sorted weather with updated location
    const weatherContainer = document.getElementById('weather');
    weatherContainer.innerHTML = ''; // Clear current display
    displayWeather({ location: currentLocation, forecast: { forecastday: forecastDays } });
}
