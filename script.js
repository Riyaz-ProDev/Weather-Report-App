const apiKey = 'a995e3333e9f43e512332f21a46fdf4f'; // Replace with your OpenWeatherMap API key

document.getElementById('fetchWeather').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  
  const loadingIndicator = document.getElementById('loading');
  const weatherDisplay = document.getElementById('weatherDisplay');
  const forecastDisplay = document.getElementById('forecast');

  // Show loading indicator
  loadingIndicator.style.display = 'block';
  weatherDisplay.innerHTML = '';
  forecastDisplay.innerHTML = '';

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      loadingIndicator.style.display = 'none';

      const weatherHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="Weather Icon">
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      `;
      weatherDisplay.innerHTML = weatherHTML;
    })
    .catch(error => {
      loadingIndicator.style.display = 'none';
      weatherDisplay.innerHTML = `<p>${error.message}</p>`;
    });

  // Fetch 5-day forecast data
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastHTML = data.list
        .filter((_, index) => index % 8 === 0) // Filter for daily forecasts (every 24 hours)
        .map(day => `
          <div>
            <p><strong>${new Date(day.dt * 1000).toLocaleDateString()}</strong></p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>Temp: ${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
          </div>
        `)
        .join('');
      forecastDisplay.innerHTML = forecastHTML;
    });
});
