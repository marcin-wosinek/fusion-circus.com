# Fusion Circus Website Monitoring

BackstopJS setup for monitoring [Fusion Circus](https://fusion-circus.com/) website for visual regressions.

## Features

- Visual regression testing with BackstopJS
- Custom lazy-loaded image handling
- Daily GitHub Actions workflow (3 AM European time)

## Quick Start

```bash
# Install dependencies
npm install

# Create reference images
npx backstop reference

# Run tests
npx backstop test

# Approve changes
npx backstop approve
```

## Key Files

- `backstop.json` - Main configuration
- `backstop_data/engine_scripts/puppet/onReady.js` - Custom lazy-load handler
- `.github/workflows/daily-backstop-test.yml` - Daily test workflow

## License

ISC - Marcin Wosinek
