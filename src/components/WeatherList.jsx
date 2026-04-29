import React from 'react';
import WeatherCard from './WeatherCard';

const WeatherList = ({ forecast }) => {
  return (
    <div className="weather-list">
      {forecast.map((day, index) => (
        <WeatherCard key={index} day={day} />
      ))}
    </div>
  );
};

export default WeatherList;