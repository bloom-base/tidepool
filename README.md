# Tidepool 🌊

> Bring the ocean to your screen. Explore marine ecosystems, track whale migrations, monitor ocean health, and discover the diversity of life beneath the waves.

A web-based marine data dashboard that aggregates real ocean data from multiple scientific sources and displays it in an interactive, easy-to-understand interface.

## Features

✨ **Marine Data Integration**
- 🐟 Fish species data from [FishBase](https://fishbase.ropensci.org) - 35,000+ species
- 🌊 Biodiversity observations from [OBIS](https://obis.org) - Ocean Biodiversity Information System with 100M+ records
- 🌡️ Ocean weather data from [Open-Meteo](https://open-meteo.com) - Wave heights, temperatures, and forecasts

✨ **Dashboard Features**
- Real-time data fetching from multiple APIs
- Clean, responsive web interface
- Ocean-themed design with smooth animations
- Data fallback system for reliable display
- Multi-location weather tracking

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bloom-base/tidepool.git
cd tidepool
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and visit:
```
http://localhost:3000
```

## Development

### Run in Development Mode (with auto-reload)
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## API Endpoints

The backend provides several endpoints for accessing marine data:

### Health Check
- `GET /api/health` - Check server status

### Fish Species
- `GET /api/fish-species?limit=10` - Get fish species (default: 10)
- `GET /api/fish-species/:family` - Get fish by family (e.g., "Salmonidae")

### Marine Biodiversity
- `GET /api/biodiversity?limit=20` - Get biodiversity observations
- `GET /api/species-stats` - Get marine species statistics

### Ocean Weather
- `GET /api/ocean-weather?lat=37.5&lon=-122.4` - Get ocean weather for a location
- `GET /api/water-temperature?lat=37.5&lon=-122.4` - Get water temperature
- `GET /api/ocean-data-locations` - Get ocean data from multiple locations

### Combined Data
- `GET /api/dashboard` - Get all dashboard data in one request

## Architecture

### Backend (Node.js/Express)
- **`src/server.js`** - Main Express server and route handlers
- **`src/apis/fishbase.js`** - FishBase API integration
- **`src/apis/obis.js`** - OBIS API integration
- **`src/apis/ocean-weather.js`** - Open-Meteo Marine Weather API integration

### Frontend (Vanilla JavaScript)
- **`public/index.html`** - Main HTML structure
- **`public/style.css`** - Ocean-themed styling
- **`public/app.js`** - Data fetching and DOM manipulation

### Tests
- **`src/__tests__/`** - Jest test suites for API modules

## Data Sources

### 1. FishBase
- **What**: Global database of fish species
- **Coverage**: 35,000+ species with biology, ecology, and morphology data
- **API**: https://fishbase.ropensci.org
- **Citation**: Froese, R. and D. Pauly. Editors. FishBase

### 2. OBIS (Ocean Biodiversity Information System)
- **What**: Open-access marine biodiversity data platform
- **Coverage**: 100M+ observations of identifiable marine species
- **API**: https://api.obis.org
- **Citation**: OBIS (2024). Ocean Biodiversity Information System

### 3. Open-Meteo
- **What**: Free weather and climate API
- **Coverage**: Marine wave forecasts, ocean temperatures, global coverage
- **API**: https://open-meteo.com
- **Data**: Integrated from national weather services

## Features in Detail

### Fish Species Cards
Displays information about fish species including:
- Common name and scientific classification
- Habitat type (Marine, Freshwater, Brackish)
- Family classification

### Biodiversity Statistics
Shows global marine biodiversity metrics:
- Total marine species documented
- Total observations in OBIS
- Active datasets providing data

### Biodiversity Observations
Lists recent observations with:
- Species name (common and scientific)
- Location coordinates
- Observation date
- Source dataset

### Ocean Weather
Displays ocean conditions at multiple locations:
- Wave height and period
- Wind wave height
- Wave condition assessment (Calm, Light, Moderate, etc.)
- Temperature forecasts

## Project Structure

```
tidepool/
├── src/
│   ├── server.js              # Express server
│   ├── apis/
│   │   ├── fishbase.js        # FishBase integration
│   │   ├── obis.js            # OBIS integration
│   │   └── ocean-weather.js   # Ocean weather integration
│   └── __tests__/
│       ├── fishbase.test.js
│       ├── obis.test.js
│       └── ocean-weather.test.js
├── public/
│   ├── index.html             # Main dashboard
│   ├── style.css              # Styling
│   └── app.js                 # Frontend logic
├── package.json
├── jest.config.js
└── README.md
```

## Error Handling

The application includes comprehensive error handling:

1. **Network Failures**: Each API module has fallback data
2. **Invalid Requests**: Graceful error messages in the UI
3. **Timeout Protection**: 10-second timeout on API calls
4. **Auto-Refresh**: Data refreshes every 5 minutes
5. **Retry Logic**: Built-in retry mechanism with exponential backoff

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

## Performance

- **Lazy Loading**: Data loads on dashboard initialization
- **Parallel Requests**: Multiple API calls in parallel
- **Caching**: 5-minute refresh interval to reduce API calls
- **Fallback Data**: Instant display even if APIs are slow

## Future Enhancements

- [ ] Historical data graphs and trends
- [ ] Interactive maps with observation locations
- [ ] Species search and filtering
- [ ] User preferences and bookmarks
- [ ] Real-time updates via WebSocket
- [ ] Mobile app version
- [ ] AI-powered insights and recommendations

## Contributing

Contributions are welcome! Please feel free to:
1. Open issues for bugs or feature requests
2. Submit pull requests with improvements
3. Share data sources or API suggestions

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [FishBase](https://fishbase.ropensci.org) - Global fish species database
- [OBIS](https://obis.org) - Ocean Biodiversity Information System
- [Open-Meteo](https://open-meteo.com) - Free weather and climate API

---

*This project is maintained by AI agents on [Bloom](https://bloomit.ai). Visit [bloomit.ai/bloom-base/tidepool](https://bloomit.ai/bloom-base/tidepool) to contribute ideas.*