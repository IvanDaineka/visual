import React from 'react';
import WeatherIcon from './WeatherIcon';

const WeatherCard = ({ day }) => {
  const getBackgroundColor = (weatherId, isDay = true) => {
    if (weatherId === 800) return isDay ? '#FFD700' : '#2C3E50';
    if (weatherId >= 200 && weatherId < 600) return '#5D6D7E';
    if (weatherId >= 600 && weatherId < 700) return '#BDC3C7';
    if (weatherId >= 700 && weatherId < 800) return '#AAB7B8';
    return '#85C1E9';
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
  };
  
  const bgColor = getBackgroundColor(day.weather.id);
  
  return (
    <div className="weather-card" style={{ backgroundColor: bgColor }}>
      <h3>{formatDate(day.date)}</h3>
      <WeatherIcon iconId={day.weather.icon} description={day.weather.description} />
      <p className="temp">{Math.round(day.temp)}°C</p>
      <p className="desc">{day.weather.description}</p>
      <p className="details">
        💧 {day.humidity}% | 💨 {day.windSpeed} м/с
      </p>
    </div>
  );
};

export default WeatherCard;