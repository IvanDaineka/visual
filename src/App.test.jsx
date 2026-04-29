import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const mockSearchCity = vi.fn();

vi.mock('./hooks/useWeather', () => ({
  useWeather: () => ({
    forecast: [
      {
        date: '2025-04-29',
        temp: 22,
        feelsLike: 21,
        humidity: 45,
        windSpeed: 3.5,
        weather: { id: 800, main: 'Clear', description: 'ясно', icon: '01d' }
      }
    ],
    airQuality: {
      main: { aqi: 2 },
      components: { pm2_5: 12, pm10: 20, o3: 30, no2: 15 }
    },
    loading: false,
    error: '',
    searchCity: mockSearchCity,
    currentCity: 'Москва'
  })
}));

describe('App', () => {
  it('renders search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/введите город/i)).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<App />);
    expect(screen.getByText(/прогноз погоды/i)).toBeInTheDocument();
  });

  it('displays city name when weather is loaded', () => {
    render(<App />);
    expect(screen.getByText(/погода в москва/i)).toBeInTheDocument();
  });

  it('calls searchCity when form is submitted', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/введите город/i);
    const button = screen.getByRole('button', { name: /поиск/i });
    
    fireEvent.change(input, { target: { value: 'Москва' } });
    fireEvent.click(button);
    
    expect(mockSearchCity).toHaveBeenCalledWith('Москва');
  });
});