import { useEffect, useState } from "react";
import {
  CloudSun, Sun, Cloud, CloudRain, CloudSnow,
  CloudLightning, Wind, Droplets, MapPin, Loader2,
  CloudDrizzle, Eye,
} from "lucide-react";

interface CurrentWeather {
  temp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

interface DayForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitation: number;
}

interface WeatherData {
  current: CurrentWeather;
  forecast: DayForecast[];
  location: string;
}

function wmoLabel(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return code === 1 ? "Mainly Clear" : code === 2 ? "Partly Cloudy" : "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 65) return "Rainy";
  if (code <= 75) return "Snowy";
  if (code <= 82) return "Rain Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function WmoIcon({ code, className }: { code: number; className?: string }) {
  if (code === 0) return <Sun className={className} />;
  if (code <= 2) return <CloudSun className={className} />;
  if (code <= 3) return <Cloud className={className} />;
  if (code <= 48) return <Eye className={className} />;
  if (code <= 55) return <CloudDrizzle className={className} />;
  if (code <= 65) return <CloudRain className={className} />;
  if (code <= 75) return <CloudSnow className={className} />;
  if (code <= 82) return <CloudRain className={className} />;
  return <CloudLightning className={className} />;
}

function wmoIconColor(code: number): string {
  if (code === 0) return "text-amber-300";
  if (code <= 2) return "text-amber-300";
  if (code <= 3) return "text-slate-300";
  if (code <= 48) return "text-slate-400";
  if (code <= 65) return "text-sky-300";
  if (code <= 75) return "text-blue-200";
  if (code <= 82) return "text-sky-400";
  return "text-yellow-300";
}

function dayLabel(dateStr: string, idx: number): string {
  if (idx === 0) return "Today";
  if (idx === 1) return "Tmrw";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

async function fetchLocation(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const addr = data.address;
    return addr.city || addr.town || addr.village || addr.county || "Your Location";
  } catch {
    return "Your Location";
  }
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum",
    timezone: "Asia/Kolkata",
    forecast_days: "7",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const data = await res.json();

  const location = await fetchLocation(lat, lon);

  return {
    location,
    current: {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
    },
    forecast: (data.daily.time as string[]).map((date: string, i: number) => ({
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      weatherCode: data.daily.weather_code[i],
      precipitation: Math.round(data.daily.precipitation_sum[i]),
    })),
  };
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = (lat: number, lon: number) =>
      fetchWeather(lat, lon)
        .then(setWeather)
        .catch(() => setError(true))
        .finally(() => setLoading(false));

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude),
        () => load(12.97, 77.59)
      );
    } else {
      load(12.97, 77.59);
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600" />
      <img
        src="https://images.unsplash.com/photo-1510987836583-e3fb9586c7b3?q=80&w=2070&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen pointer-events-none select-none"
      />
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute top-16 -left-6 w-28 h-28 rounded-full bg-white/8" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-700/40 to-transparent" />

      <div className="relative z-10 p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg text-white leading-tight">Local Weather</h3>
            {weather && (
              <p className="text-sky-200 text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {weather.location}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : weather ? (
              <WmoIcon code={weather.current.weatherCode} className="w-6 h-6 text-white" />
            ) : (
              <CloudSun className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sky-200 text-sm">Fetching weather…</p>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sky-200 text-sm">Could not load weather data.</p>
          </div>
        )}

        {weather && !loading && (
          <>
            {/* Current temp */}
            <div className="flex items-end gap-3 mt-4 mb-2">
              <span className="text-6xl font-display font-bold text-white leading-none">
                {weather.current.temp}°
              </span>
              <div className="pb-1">
                <p className="text-white font-semibold text-lg leading-tight">
                  {wmoLabel(weather.current.weatherCode)}
                </p>
                <p className="text-sky-200 text-sm">
                  H: {weather.forecast[0]?.tempMax}° &nbsp;L: {weather.forecast[0]?.tempMin}°
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 mt-3 mb-4">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                <Droplets className="w-4 h-4 text-sky-200" />
                <span className="text-white text-sm font-semibold">{weather.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                <Wind className="w-4 h-4 text-sky-200" />
                <span className="text-white text-sm font-semibold">{weather.current.windSpeed} km/h</span>
              </div>
              {weather.forecast[0]?.precipitation > 0 && (
                <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                  <CloudRain className="w-4 h-4 text-sky-200" />
                  <span className="text-white text-sm font-semibold">{weather.forecast[0].precipitation} mm</span>
                </div>
              )}
            </div>

            {/* 7-day forecast */}
            <div className="grid grid-cols-7 gap-1 pt-4 border-t border-white/20">
              {weather.forecast.map((day, i) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <span className="text-sky-200 text-[9px] font-bold uppercase">
                    {dayLabel(day.date, i)}
                  </span>
                  <WmoIcon
                    code={day.weatherCode}
                    className={`w-4 h-4 ${wmoIconColor(day.weatherCode)}`}
                  />
                  <span className="text-white font-bold text-[10px]">{day.tempMax}°</span>
                  <span className="text-sky-300 text-[9px]">{day.tempMin}°</span>
                </div>
              ))}
            </div>

            <p className="text-sky-300/70 text-[10px] mt-2 text-right">
              via Open-Meteo · updated now
            </p>
          </>
        )}
      </div>
    </div>
  );
}
