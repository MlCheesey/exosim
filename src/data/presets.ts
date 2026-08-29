export type ExoplanetPreset = {
  name: string;
  planetType: string;
  planetRadius: number;
  starRadius: number;
  orbitalPeriod: number;
  discoveryYear: number;
  description: string;
  sourceUrl: string;
  inclination?: number;
  suggestedSpeed?: number;
  noisePpm?: number;
};

export const exoplanetPresets: ExoplanetPreset[] = [
  {
    name: "TRAPPIST-1 e",
    planetType: "rocky",
    planetRadius: 0.92,
    starRadius: 0.12,
    orbitalPeriod: 6.1,
    discoveryYear: 2017,
    inclination: 89,
    suggestedSpeed: 1.4,
    noisePpm: 45,
    description: "Small star, Earth-sized planet. The dip is easy to see.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/TRAPPIST-1",
  },
  {
    name: "Kepler-186 f",
    planetType: "super Earth",
    planetRadius: 1.17,
    starRadius: 0.52,
    orbitalPeriod: 129.9,
    discoveryYear: 2014,
    inclination: 89,
    suggestedSpeed: 0.9,
    noisePpm: 55,
    description: "A small planet around a cool red dwarf.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-186",
  },
  {
    name: "HD 209458 b",
    planetType: "hot Jupiter",
    planetRadius: 15.4,
    starRadius: 1.2,
    orbitalPeriod: 3.5,
    discoveryYear: 1999,
    inclination: 88,
    suggestedSpeed: 1.8,
    noisePpm: 25,
    description: "A famous hot Jupiter with a very obvious transit.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/HD%20209458",
  },
  {
    name: "Kepler-10 b",
    planetType: "scorched rock",
    planetRadius: 1.47,
    starRadius: 1.06,
    orbitalPeriod: 0.84,
    discoveryYear: 2011,
    inclination: 86,
    suggestedSpeed: 2.2,
    noisePpm: 30,
    description: "A close-in rocky planet with a short orbit.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-10",
  },
];
