import { useState, useEffect, useRef } from 'react';
import { fetchWeatherForecast, getCoordinates, fetchAirPollution } from '../services/weatherApi';
import { mockForecast, mockAirQuality } from '../mocks/mockWeatherData';

const USE_MOCK = false;

export const useWeather = () => {
  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // ← здесь был пропущен знак =
  const [currentCity, setCurrentCity] = useState('');
  const intervalRef = useRef(null);

  const searchCity = async (city) => {
    setLoading(true);
    setError('');
    
    if (USE_MOCK) {
      setTimeout(() => {
        setForecast(mockForecast);
        setCurrentWeather({
          temp: 27,
          feelsLike: 26,
          humidity: 80,
          windSpeed: 5,
          weather: { id: 800, main: 'Clear', description: 'ясно', icon: '01d' }
        });
        setAirQuality(mockAirQuality);
        setCurrentCity(city);
        setLoading(false);
      }, 500);
      return;
    }
    
    try {
      const coords = await getCoordinates(city);
      const [weatherData, pollutionData] = await Promise.all([
        fetchWeatherForecast(coords.lat, coords.lon),
        fetchAirPollution(coords.lat, coords.lon)
      ]);
      
      if (weatherData) {
        setForecast(weatherData.daily);
        // Текущая погода — первый день из прогноза
        if (weatherData.daily && weatherData.daily[0]) {
          setCurrentWeather(weatherData.daily[0]);
        }
        setAirQuality(pollutionData);
        setCurrentCity(coords.name);
        setError('');
      } else {
        setError('Не удалось получить прогноз погоды');
        setForecast([]);
        setAirQuality(null);
      }
    } catch (err) {
      setError(err.message || 'Город не найден');
      setForecast([]);
      setAirQuality(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (currentCity && !loading && !USE_MOCK) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        searchCity(currentCity);
      }, 3 * 60 * 60 * 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [currentCity, loading]);

  return { forecast, currentWeather, airQuality, loading, error, searchCity, currentCity };
};