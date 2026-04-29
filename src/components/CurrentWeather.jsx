import React from 'react';
import WeatherIcon from './WeatherIcon';
import './CurrentWeather.css';

const CurrentWeather = ({ data, city }) => {
  if (!data) return null;
  
  return (
    <div className="current-weather">
      <div className="current-weather-main">
        <div className="city-date">
          <h2 className="city-name">{city}</h2>
          <p className="date">
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        <div className="temperature-section">
          <div className="big-temp">
            <WeatherIcon iconId={data.weather.icon} description={data.weather.description} />
            <span className="temp-value">{Math.round(data.temp)}°</span>
          </div>
          <p className="weather-desc">{data.weather.description}</p>
        </div>
      </div>
      
      <div className="current-weather-details">
        <div className="detail-item">
          <span className="detail-label">Сейчас</span>
          <span className="detail-value">{Math.round(data.temp)}°</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Влажность</span>
          <span className="detail-value">{data.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Ветер</span>
          <span className="detail-value">{data.windSpeed} м/с</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Ощущается как</span>
          <span className="detail-value">{Math.round(data.feelsLike)}°</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;