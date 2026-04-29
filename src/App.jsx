import React from 'react';
import WeatherList from './components/WeatherList';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import AirQuality from './components/AirQuality';
import { useWeather } from './hooks/useWeather';
import './App.css';

const getBackgroundColor = (weatherId) => {
  if (!weatherId) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  if (weatherId === 800) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  if (weatherId >= 200 && weatherId < 300) return 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
  if (weatherId >= 300 && weatherId < 600) return 'linear-gradient(135deg, #5D6D7E 0%, #2C3E50 100%)';
  if (weatherId >= 600 && weatherId < 700) return 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)';
  if (weatherId >= 700 && weatherId < 800) return 'linear-gradient(135deg, #AAB7B8 0%, #78909C 100%)';
  if (weatherId > 800) return 'linear-gradient(135deg, #85C1E9 0%, #3498DB 100%)';
  return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
};

function App() {
  const { forecast, currentWeather, airQuality, loading, error, searchCity, currentCity } = useWeather();
  
  const bgStyle = currentWeather 
    ? { background: getBackgroundColor(currentWeather.weather.id) }
    : { background: getBackgroundColor(null) };
  
  return (
    <div className="app" style={bgStyle}>
      <div className="app-content">
        <h1>Прогноз погоды</h1>
        <SearchBar onSearch={searchCity} isLoading={loading} />
        
        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Загрузка...</div>}
        
        {!loading && currentCity && currentWeather && (
          <>
            <CurrentWeather data={currentWeather} city={currentCity} />
            {forecast.length > 0 && (
              <>
                <h2>Прогноз на 5 дней</h2>
                <WeatherList forecast={forecast} />
              </>
            )}
            <AirQuality data={airQuality} city={currentCity} />
          </>
        )}
        
        {!loading && !currentCity && !error && (
          <div className="welcome-message">
            <p>Введите название города, чтобы узнать прогноз погоды</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;