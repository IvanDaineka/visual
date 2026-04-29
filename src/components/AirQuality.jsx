import React from 'react';
import './AirQuality.css';

const AirQuality = ({ data, city }) => {
  if (!data) return null;
  
  const getAQIInfo = (aqi) => {
    const levels = {
      1: { text: 'Отличное', color: '#00E400' },
      2: { text: 'Хорошее', color: '#FFFF00' },
      3: { text: 'Умеренное', color: '#FF7E00' },
      4: { text: 'Плохое', color: '#FF0000' },
      5: { text: 'Очень плохое', color: '#8F3F97' }
    };
    return levels[aqi] || levels[1];
  };
  
  const aqiInfo = getAQIInfo(data.main.aqi);
  
  return (
    <div className="air-quality-card" style={{ borderColor: aqiInfo.color }}>
      <div className="aqi-header">
        <h3>🌍 Качество воздуха в {city}</h3>
        <div className="aqi-level" style={{ backgroundColor: aqiInfo.color, color: aqiInfo.text === 'Хорошее' ? '#000' : '#fff' }}>
          {aqiInfo.text}
        </div>
      </div>
    </div>
  );
};

export default AirQuality;