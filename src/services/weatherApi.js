const API_KEY = '891b3b7f0a172e4c85b65d5fb34d0fd6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCoordinates = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    if (data.length === 0) throw new Error('City not found');
    return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

export const fetchWeatherForecast = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`
    );
    if (!response.ok) throw new Error('Failed to fetch forecast');
    const data = await response.json();
    return {
      daily: processDailyForecast(data)
    };
  } catch (error) {
    console.error('Weather forecast error:', error);
    return null;
  }
};

export const fetchAirPollution = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch air pollution data');
    const data = await response.json();
    return data.list[0];
  } catch (error) {
    console.error('Air pollution error:', error);
    return null;
  }
};

const processDailyForecast = (data) => {
  const dailyForecasts = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        weather: item.weather[0],
      };
    }
  });
  return Object.values(dailyForecasts).slice(0, 5);
};