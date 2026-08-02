# Weather App

A React + TypeScript + Vite weather app that shows current conditions and hourly/daily forecasts for your detected location or any city you search for, with saved locations, severe weather alerts, theme/unit customization, and offline caching.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A free API key from [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key

Create a `.env` file in the project root:

```
VITE_WEATHERAPI_KEY=your_key_here
```

### 3. Run the dev server

```bash
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173`) in your browser.

### Other scripts

| Command           | Description                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload |
| `npm run build`     | Type-check and build for production       |
| `npm run preview`   | Preview the production build locally      |
| `npm run lint`      | Run ESLint                                |

## Using the App

### Home

- **Location detection**: on first load, the app asks for permission to use your location. Allow it to see weather for where you are; if you deny it (or it's unavailable), just search for a city instead.
- **Search**: type a city name in the search bar and pick a result to add it as a saved location.
- **Saved locations**: switch between saved locations using the tabs under the search bar; remove any saved location (except your current one) with its `×` button.
- **Current conditions**: temperature, condition, humidity, wind, feels-like, and UV index for the active location.
- **Forecast**: toggle between an **Hourly** and **Daily** view of the forecast.
- **Severe weather alerts**: shown as a banner at the top of the conditions card; high-severity alerts also trigger a browser notification if you've granted permission.
- **Offline access**: if a live request fails, the app falls back to the last cached data for that location.

### Settings

- **Theme**: switch between light and dark mode.
- **Units**: switch between Celsius (°C) and Fahrenheit (°F).

All saved locations, theme, and unit preferences persist across sessions via `localStorage`.
