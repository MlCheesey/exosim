ExoSim

Interactive Exoplanet Transit Laboratory

Explore how planetary size, stellar size, orbital inclination, and telescope noise shape an observed transit signal.

Open the live simulator · View the source

</div>

About

ExoSim is an interactive 3D exoplanet transit simulator. It places the observer behind an orbiting planet, looking through a space-station-style observation window toward its host star.

As the planet crosses the stellar disk, ExoSim synchronizes the 3D orbit with a live photometric light curve. Users can change the physical system, add telescope noise, load confirmed exoplanets, and inspect the mathematics behind the resulting brightness dip.

Features

Real-time 3D star, planet, atmosphere, orbit, and observation-window scene

Full, grazing, and missed transit geometry

Exact circle-overlap calculation for partial transits

Live theoretical and simulated telescope light curves

Adjustable planet radius, star radius, inclination, noise, and orbital speed

Pause, resume, and orbit reset controls

Confirmed exoplanet presets from the NASA Exoplanet Archive

Live transit-depth calculations and educational explanations

Responsive interface for desktop and mobile

Accessible reduced-motion and keyboard-focus support

How to use ExoSim

Choose a system — begin with the default system, adjust it manually, or load a confirmed planet from the archive.

Set the geometry — change the planet radius, star radius, orbital inclination, and observation noise.

Observe the transit — watch the planet cross the star and use the pause, reset, and speed controls.

Read the signal — compare the live brightness dip with the calculated transit depth and Science section.

The science

For a centered transit, the approximate fractional loss of light is:

$$
\frac{\Delta F}{F} = \left(\frac{R_p}{R_\star}\right)^2
$$

Where:

$R_p$ is the planet radius.

$R_\star$ is the stellar radius.

$\Delta F/F$ is the fraction of starlight blocked.

Inclination determines whether the planet fully crosses, grazes, or misses the visible stellar disk. During a grazing event, ExoSim calculates the exact overlap area of the two projected circles instead of scaling the signal linearly.

Observation noise is specified in parts per million and is added deterministically to the simulated measurements, allowing the same settings to produce a stable and comparable dataset.

Included planetary systems

System

Planet type

Planet radius

Stellar radius

Period

Kepler-10 b

Super Earth

1.47 R⊕

1.06 R☉

0.84 days

Kepler-186 f

Super Earth

1.17 R⊕

0.52 R☉

129.9 days

Kepler-20 e

Terrestrial

0.82 R⊕

0.94 R☉

6.1 days

Preset measurements are rounded from published records in the NASA Exoplanet Archive.

Technology

Area

Technology

Application

Next.js 16, React 19, TypeScript

Styling

Tailwind CSS 4

3D rendering

Three.js, React Three Fiber, Drei

Visual effects

React Three Postprocessing

Charts

Chart.js, React Chart.js 2

Icons

Lucide React

Deployment

Vercel

The stellar and planetary surfaces are generated procedurally in the browser. ExoSim does not require external texture files or an API key.

Run locally

Requirements

Node.js 20 or newer

npm

Installation

git clone https://github.com/MlCheesey/exosim.git
cd exosim
npm install
npm run dev

Open http://localhost:3000.

Production build

npm run build
npm start

Project structure

src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ExoSimLogo.tsx
│   ├── HowToUse.tsx
│   ├── LightCurveChart.tsx
│   ├── OrbitalScene.tsx
│   ├── PlanetPresetLibrary.tsx
│   └── ScienceMath.tsx
├── data/
│   └── planetVisualProfiles.ts
└── lib/
    └── transitMath.ts

Design approach

ExoSim uses three distinct typographic roles:

Space Grotesk for display headings and the project identity

Inter for controls, descriptions, and navigation

JetBrains Mono for telemetry, measurements, and scientific values

The interface avoids conventional dashboard cards. Instead, it uses an open observation-console layout with fine dividers, restrained amber and rose signals, and a custom eclipse-and-light-curve logo.

Current limitations

The visual orbital period is accelerated for practical interaction and is not mapped directly to a preset's real period.

The current model focuses on transit geometry and does not simulate limb darkening, stellar variability, multiple planets, or orbital eccentricity.

Preset values are educational reference inputs and should not replace professional astronomical analysis tools.

Planned improvements

Export simulated observations as CSV

Add automated tests for transit geometry and brightness calculations

Extend accessibility and performance audits

Add more confirmed planetary systems and observation modes

Data and credits

Planetary measurements are based on the NASA Exoplanet Archive.

ExoSim was designed, tested, and integrated by MlCheesey. AI assistance was used during implementation, debugging, and design iteration; final product decisions and verification remained with the project author.