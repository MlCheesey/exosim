# ExoSim

ExoSim is an interactive simulator that shows how an exoplanet transit works.

When a planet passes in front of a star, it blocks a small amount of the star's light. Astronomers can use this dip in brightness to detect planets outside our solar system. I wanted to make this easier to understand by showing the planet's orbit and the resulting light curve together.

**Live demo:** [exosim.vercel.app](https://exosim.vercel.app)

## What you can do

You can change the planet radius, star radius, orbital inclination, telescope noise, and simulation speed. The 3D view and light curve use the same values, so they update together when a setting is changed.

There are also presets for Kepler-10 b, Kepler-186 f, and Kepler-20 e. Their values are rounded from information available through the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).

The simulator includes:

- A 3D view of the star, planet, and orbit
- Full, grazing, and missed transits
- A live theoretical light curve
- Simulated telescope readings with adjustable noise
- Pause, reset, and speed controls
- CSV export for the generated light-curve data
- An explanation of the basic calculations

## How it works

For a planet crossing near the centre of a star, the approximate transit depth is:

```text
transit depth = (planet radius / star radius)²
```

The amount of light blocked depends on the area of the planet compared with the area of the star. A larger planet therefore creates a deeper dip in brightness.

Inclination changes the planet's path from our point of view. At 90 degrees, the planet crosses the star directly. At lower inclinations, it may cross only part of the star or miss it completely.

The normal radius calculation is not enough for a grazing transit because only part of the planet overlaps the star. ExoSim uses a circle-overlap calculation for this situation.

The telescope-noise setting is measured in parts per million. The generated noise is deterministic, so the same settings produce the same graph. This makes it easier to compare different systems.

## Running it locally

You need Node.js 20 or newer.

```bash
git clone https://github.com/MlCheesey/exosim.git
cd exosim
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a production build:

```bash
npm run build
npm start
```

## Built with

- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js
- React Three Fiber
- Chart.js
- Vercel

The star and planet textures are generated inside the browser. The simulator does not need external texture files or an API key.

## Challenges

The most difficult part was keeping the animation, orbital phase, transit calculation, and graph synchronized. They are separate parts of the interface, but they all need to represent the same moment in the orbit.

Grazing transits were also challenging. The usual radius-ratio formula assumes that the entire planet is passing in front of the star. I needed a separate overlap calculation for cases where the planet only crosses the edge.

Performance was another issue because the 3D scene is much heavier than the rest of the page, especially on mobile devices. The scene is loaded separately, and generated textures are reused instead of being recreated during every render.

## Limitations

ExoSim is an educational simulator and not a professional astronomy tool.

The orbit is accelerated so users do not have to wait for a real orbital period. The current model also does not simulate:

- Limb darkening
- Eccentric orbits
- Starspots
- Stellar variability
- Multiple planets

The included presets are reference examples, and their visual orbital speeds do not match their real orbital periods.

## Credits

Planet data is based on information from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).

ExoSim was created by [MlCheesey](https://github.com/MlCheesey). AI tools were used to assist with inspiration for frontend work, grammatical work and font selection.
