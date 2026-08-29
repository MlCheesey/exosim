export type PlanetVisualProfile = {
  label: string;
  lowlandColor: [number, number, number];
  highlandColor: [number, number, number];
  atmosphereColor: string;
  atmosphereOpacity: number;
};

const defaultProfile: PlanetVisualProfile = {
  label: "dry rocky",
  lowlandColor: [70, 45, 36],
  highlandColor: [160, 105, 72],
  atmosphereColor: "#c78967",
  atmosphereOpacity: 0.1,
};

const planetProfiles: Record<string, PlanetVisualProfile> = {
  "TRAPPIST-1 e": {
    label: "cold basalt",
    lowlandColor: [38, 42, 40],
    highlandColor: [112, 118, 105],
    atmosphereColor: "#8fa08f",
    atmosphereOpacity: 0.12,
  },
  "Kepler-186 f": {
    label: "iron rich",
    lowlandColor: [34, 43, 40],
    highlandColor: [96, 112, 89],
    atmosphereColor: "#87947f",
    atmosphereOpacity: 0.11,
  },
  "HD 209458 b": {
    label: "hot gas giant",
    lowlandColor: [112, 69, 48],
    highlandColor: [221, 157, 92],
    atmosphereColor: "#d69866",
    atmosphereOpacity: 0.2,
  },
  "Kepler-10 b": {
    label: "scorched rock",
    lowlandColor: [46, 30, 26],
    highlandColor: [175, 88, 44],
    atmosphereColor: "#cc6f4b",
    atmosphereOpacity: 0.08,
  },
};

export function getPlanetVisualProfile(planetName?: string): PlanetVisualProfile {
  if (!planetName) {
    return defaultProfile;
  }

  return planetProfiles[planetName] ?? defaultProfile;
}