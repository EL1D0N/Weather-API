import axios from 'axios'

// Replace with your OpenWeatherMap API key
// Get one free at: https://openweathermap.org/api
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'your-api-key-here'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Get current weather for a city
export const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // Use metric for Celsius
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data')
  }
}

// Get 5-day forecast for a city
export const getForecast = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast data')
  }
}

