import React from 'react';

const WeatherIcon = ({ iconId, description }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
  
  return (
    <img 
      src={iconUrl} 
      alt={description} 
      className="weather-icon"
    />
  );
};

export default WeatherIcon;