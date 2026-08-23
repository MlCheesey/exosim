export type PlanetVisualProfile = {
  label: string;
  lowlandColor: [number, number, number];
  highlandColor: [number, number, number];
  atmosphereColor: string;
  atmosphereOpacity: number;
  terrainContrast: number;
  craterStrength: number;
  bumpScale: number;
};

const customRockyProfile: PlanetVisualProfile = {
  label: "Rust rocky",
  lowlandColor: [48, 29, 25],
  highlandColor: [148, 87, 61],
  atmosphereColor: "#d98267",
  atmosphereOpacity: 0.11,
  terrainContrast: 1,
  craterStrength: 1,
  bumpScale: 0.045,
};

const planetProfiles: Record<
  string,
  PlanetVisualProfile
> = {
  "Kepler-10 b": {
    label: "Volcanic rocky",
    lowlandColor: [24, 18, 17],
    highlandColor: [178, 67, 30],
    atmosphereColor: "#e25d2f",
    atmosphereOpacity: 0.07,
    terrainContrast: 1.25,
    craterStrength: 0.8,
    bumpScale: 0.052,
  },

  "Kepler-186 f": {
    label: "Cool iron-rich",
    lowlandColor: [28, 38, 38],
    highlandColor: [91, 112, 91],
    atmosphereColor: "#82978c",
    atmosphereOpacity: 0.09,
    terrainContrast: 0.9,
    craterStrength: 1.15,
    bumpScale: 0.04,
  },

  "Kepler-20 e": {
    label: "Scorched terrestrial",
    lowlandColor: [43, 31, 28],
    highlandColor: [166, 104, 65],
    atmosphereColor: "#c57958",
    atmosphereOpacity: 0.06,
    terrainContrast: 1.1,
    craterStrength: 1.05,
    bumpScale: 0.048,
  },
};

export function getPlanetVisualProfile(
  planetName?: string,
): PlanetVisualProfile {
  if (!planetName) {
    return customRockyProfile;
  }

  return (
    planetProfiles[planetName] ??
    customRockyProfile
  );
}
