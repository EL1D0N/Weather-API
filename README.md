# Weather API Project

A modern React application built with Vite, Tailwind CSS, and Recharts to display weather data with interactive temperature bar charts.

## Features

-  Real-time weather data from OpenWeatherMap API
-  Interactive bar chart showing temperature forecasts
-  Beautiful UI with Tailwind CSS
-  Responsive design
-  Search weather by city name

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get API Key

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory:

```env
VITE_WEATHER_API_KEY=your-api-key-here
```

Alternatively, you can directly edit `src/services/weatherApi.js` and replace `'your-api-key-here'` with your API key.

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
whetherAPI/
├── src/
│   ├── components/
│   │   ├── WeatherApp.jsx      # Main weather application component
│   │   └── TemperatureChart.jsx # Bar chart component for temperature
│   ├── services/
│   │   └── weatherApi.js       # Weather API service
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind CSS imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library for React
- **Axios** - HTTP client for API requests
- **OpenWeatherMap API** - Weather data source

## Usage

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View current weather information
4. See the 5-day temperature forecast in the bar chart below

## Chart Features

The temperature bar chart displays:
- **Min Temperature** (blue bars)
- **Max Temperature** (red bars)
- **Average Temperature** (green bars)

Hover over the bars to see detailed temperature information.

## License

MIT

