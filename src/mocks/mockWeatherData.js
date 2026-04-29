export const mockForecast = [
  {
    date: '2025-04-29',
    temp: 26,
    feelsLike: 26,
    humidity: 80,
    windSpeed: 5,
    weather: { id: 800, main: 'Clear', description: 'ясно', icon: '01d' }
  },
  {
    date: '2025-04-30',
    temp: 26,
    feelsLike: 25,
    humidity: 75,
    windSpeed: 4.5,
    weather: { id: 801, main: 'Clouds', description: 'облачно', icon: '02d' }
  },
  {
    date: '2025-05-01',
    temp: 26,
    feelsLike: 25,
    humidity: 70,
    windSpeed: 4,
    weather: { id: 801, main: 'Clouds', description: 'облачно', icon: '02d' }
  },
  {
    date: '2025-05-02',
    temp: 26,
    feelsLike: 26,
    humidity: 65,
    windSpeed: 3.5,
    weather: { id: 800, main: 'Clear', description: 'ясно', icon: '01d' }
  },
  {
    date: '2025-05-03',
    temp: 26,
    feelsLike: 26,
    humidity: 60,
    windSpeed: 3,
    weather: { id: 800, main: 'Clear', description: 'ясно', icon: '01d' }
  }
];

export const mockHourlyForecast = [
  { dt_txt: new Date().setHours(12,0), main: { temp: 27 }, weather: [{ icon: '01d', description: 'ясно' }] },
  { dt_txt: new Date().setHours(13,0), main: { temp: 28 }, weather: [{ icon: '01d', description: 'ясно' }] },
  { dt_txt: new Date().setHours(14,0), main: { temp: 28 }, weather: [{ icon: '01d', description: 'ясно' }] },
  { dt_txt: new Date().setHours(15,0), main: { temp: 27 }, weather: [{ icon: '01d', description: 'ясно' }] },
  { dt_txt: new Date().setHours(16,0), main: { temp: 27 }, weather: [{ icon: '01d', description: 'ясно' }] },
  { dt_txt: new Date().setHours(17,0), main: { temp: 26 }, weather: [{ icon: '01d', description: 'ясно' }] },
  { dt_txt: new Date().setHours(18,0), main: { temp: 25 }, weather: [{ icon: '01d', description: 'ясно' }] }
];

export const mockAirQuality = {
  main: { aqi: 2 },
  components: {
    co: 300,
    no: 0.5,
    no2: 15,
    o3: 30,
    so2: 5,
    pm2_5: 12,
    pm10: 20,
    nh3: 3
  }
};