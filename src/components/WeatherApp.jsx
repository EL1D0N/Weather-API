import { useState, useEffect, useRef } from 'react'
import { getCurrentWeather, getForecast } from '../services/weatherApi'
import TemperatureChart from './TemperatureChart'

const WeatherApp = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('weatherRecentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Load default city (London) on mount
  useEffect(() => {
    if (!city) {
      handleCitySearch('London')
    }
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addToRecentSearches = (cityName) => {
    const updated = [
      cityName,
      ...recentSearches.filter((c) => c.toLowerCase() !== cityName.toLowerCase()),
    ].slice(0, 5) // Keep only last 5 searches
    setRecentSearches(updated)
    localStorage.setItem('weatherRecentSearches', JSON.stringify(updated))
  }

  const fetchWeather = async (cityName) => {
    if (!cityName || !cityName.trim()) return

    setLoading(true)
    setError(null)
    setShowSuggestions(false)

    try {
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(cityName),
        getForecast(cityName),
      ])
      setWeather(currentData)
      setForecast(forecastData)
      addToRecentSearches(cityName)
      setCity(cityName) // Update input with the actual city name from API
    } catch (err) {
      setError(err.message)
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySearch = (cityName) => {
    if (cityName && cityName.trim()) {
      fetchWeather(cityName.trim())
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleCitySearch(city)
  }

  const handleRecentSearchClick = (cityName) => {
    setCity(cityName)
    handleCitySearch(cityName)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('weatherRecentSearches')
  }

  const handleInputFocus = () => {
    if (recentSearches.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputChange = (e) => {
    setCity(e.target.value)
    if (e.target.value.trim() && recentSearches.length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Weather API Dashboard
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={city}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Enter city name (e.g., London, New York, Tokyo)..."
                  className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                  disabled={loading}
                />
                {city && (
                  <button
                    type="button"
                    onClick={() => {
                      setCity('')
                      setShowSuggestions(false)
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
                
                {/* Recent Searches Dropdown */}
                {showSuggestions && recentSearches.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">
                        Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {recentSearches.map((searchCity, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleRecentSearchClick(searchCity)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{searchCity}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !city.trim()}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-500/90 text-white rounded-lg">
            <p className="font-semibold">Error: {error}</p>
            <p className="text-sm mt-2">
              Make sure you have set your API key in the .env file or weatherApi.js
            </p>
          </div>
        )}

        {/* Weather Data */}
        {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Weather Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Current Weather - {weather.name}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div>
                    <p className="text-4xl font-bold text-white">
                      {Math.round(weather.main.temp)}°C
                    </p>
                    <p className="text-white/80 capitalize">
                      {weather.weather[0].description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white/70 text-sm">Feels Like</p>
                    <p className="text-white font-semibold">
                      {Math.round(weather.main.feels_like)}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Humidity</p>
                    <p className="text-white font-semibold">{weather.main.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Wind Speed</p>
                    <p className="text-white font-semibold">
                      {weather.wind.speed} m/s
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Pressure</p>
                    <p className="text-white font-semibold">
                      {weather.main.pressure} hPa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Temperature Range Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Temperature Range</h2>
              <div className="space-y-4">
                {(() => {
                  // Calculate min/max for the NEXT 24 HOURS in the city's local time
                  // This avoids cases where we only have one remaining forecast point "today"
                  let rangeMin = weather.main.temp_min
                  let rangeMax = weather.main.temp_max
                  
                  if (forecast && forecast.list) {
                    const tzOffsetSec = forecast?.city?.timezone ?? 0
                    const nowUtcSec = Math.floor(Date.now() / 1000)
                    const windowStartSec = nowUtcSec
                    const windowEndSec = nowUtcSec + 24 * 60 * 60 // next 24h

                    const mins = []
                    const maxs = []
                    
                    forecast.list.forEach((item) => {
                      // item.dt is UTC seconds
                      if (item.dt >= windowStartSec && item.dt <= windowEndSec) {
                        const t = item.main.temp
                        mins.push(item.main.temp_min ?? t)
                        maxs.push(item.main.temp_max ?? t)
                      }
                    })
                    
                    if (mins.length > 0 && maxs.length > 0) {
                      rangeMin = Math.min(...mins)
                      rangeMax = Math.max(...maxs)
                    }
                  }
                  
                  const minTemp = Math.round(rangeMin)
                  const maxTemp = Math.round(rangeMax)
                  const currentTemp = Math.round(weather.main.temp)
                  
                  // Calculate percentage for visual bar (where current temp sits between min and max)
                  const tempRange = maxTemp - minTemp
                  const currentPosition = tempRange > 0 
                    ? ((currentTemp - minTemp) / tempRange) * 100 
                    : 50
                  
                  return (
                    <>
                      <div>
                        <div className="flex justify-between text-white/70 text-sm mb-1">
                          <span>Min</span>
                          <span>Max</span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-blue-300 to-red-400"
                            style={{
                              width: '100%',
                            }}
                          />
                          {/* Indicator for current temperature */}
                          {tempRange > 0 && (
                            <div
                              className="absolute top-0 h-full w-1 bg-white shadow-lg"
                              style={{
                                left: `${currentPosition}%`,
                                transform: 'translateX(-50%)',
                              }}
                            />
                          )}
                        </div>
                        <div className="flex justify-between text-white font-semibold mt-2">
                          <span>{minTemp}°C</span>
                          <span>{maxTemp}°C</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-white/70 text-sm mb-2">Current Temperature</p>
                        <p className="text-3xl font-bold text-white">
                          {currentTemp}°C
                        </p>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Temperature Chart */}
        {forecast && <TemperatureChart forecast={forecast} />}
      </div>
    </div>
  )
}

export default WeatherApp

