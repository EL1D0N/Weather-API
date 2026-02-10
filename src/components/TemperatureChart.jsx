import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const TemperatureChart = ({ forecast }) => {
  // Process forecast data to get daily temperature data
  const processForecastData = () => {
    if (!forecast || !forecast.list) return []

    // Group by date and calculate min/max for each day
    const dailyData = {}
    
    forecast.list.forEach((item) => {
      // OpenWeather `dt` is UTC. Convert to the *city's* local day using timezone offset.
      const tzOffsetSec = forecast?.city?.timezone ?? 0
      const localMs = (item.dt + tzOffsetSec) * 1000
      const date = new Date(localMs)

      // Use city-local date only (without time) as key to group by day
      const dateKey = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

      // Use period min/max when available (more accurate for ranges) and temp for avg
      const temp = item.main.temp
      const periodMin = item.main.temp_min ?? temp
      const periodMax = item.main.temp_max ?? temp
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          temps: [temp], // Store all temperatures for the day
          min: periodMin,
          max: periodMax,
        }
      } else {
        // Add temperature to the array
        dailyData[dateKey].temps.push(temp)
        // Update min and max based on actual temperatures
        dailyData[dateKey].min = Math.min(dailyData[dateKey].min, periodMin)
        dailyData[dateKey].max = Math.max(dailyData[dateKey].max, periodMax)
      }
    })

    // Convert to array, calculate average, and limit to 5 days
    return Object.values(dailyData)
      .slice(0, 5)
      .map((day) => {
      // Calculate average temperature for the day
      const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length
      
      return {
        date: day.date,
        'Min Temp': Math.round(day.min),
        'Max Temp': Math.round(day.max),
        'Avg Temp': Math.round(avgTemp),
      }
      })
  }

  const chartData = processForecastData()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}°C
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return null
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">5-Day Temperature Forecast</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.8)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.8)"
              style={{ fontSize: '12px' }}
              label={{
                value: 'Temperature (°C)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.8)' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: 'rgba(255,255,255,0.9)' }}
              iconType="rect"
            />
            <Bar
              dataKey="Min Temp"
              fill="#60a5fa"
              radius={[4, 4, 0, 0]}
              name="Min Temperature"
            />
            <Bar
              dataKey="Max Temp"
              fill="#f87171"
              radius={[4, 4, 0, 0]}
              name="Max Temperature"
            />
            <Bar
              dataKey="Avg Temp"
              fill="#34d399"
              radius={[4, 4, 0, 0]}
              name="Average Temperature"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TemperatureChart

