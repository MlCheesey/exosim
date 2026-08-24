import {
  describe,
  expect,
  it,
} from "vitest";
import {
  calculateCircleOverlapArea,
  calculateTransitVisibility,
  getTransitGeometry,
} from "./transitMath";

describe("calculateCircleOverlapArea", () => {
  it("returns zero when either radius is zero", () => {
    expect(
      calculateCircleOverlapArea(
        0,
        1,
        0,
      ),
    ).toBe(0);

    expect(
      calculateCircleOverlapArea(
        1,
        0,
        0,
      ),
    ).toBe(0);
  });

  it("treats negative inputs safely", () => {
    expect(
      calculateCircleOverlapArea(
        -1,
        1,
        -4,
      ),
    ).toBe(0);
  });

  it("returns zero for separate circles", () => {
    expect(
      calculateCircleOverlapArea(
        1,
        2,
        3,
      ),
    ).toBe(0);

    expect(
      calculateCircleOverlapArea(
        1,
        2,
        4,
      ),
    ).toBe(0);
  });

  it("returns the smaller disk area when one circle is contained", () => {
    expect(
      calculateCircleOverlapArea(
        1,
        3,
        1,
      ),
    ).toBeCloseTo(Math.PI, 12);
  });

  it("returns the full area for identical concentric circles", () => {
    expect(
      calculateCircleOverlapArea(
        2,
        2,
        0,
      ),
    ).toBeCloseTo(
      Math.PI * 4,
      12,
    );
  });

  it("matches the analytical overlap of two unit circles", () => {
    const expectedArea =
      (2 * Math.PI) / 3 -
      Math.sqrt(3) / 2;

    expect(
      calculateCircleOverlapArea(
        1,
        1,
        1,
      ),
    ).toBeCloseTo(
      expectedArea,
      12,
    );
  });

  it("is symmetrical when the radii are exchanged", () => {
    const firstResult =
      calculateCircleOverlapArea(
        0.4,
        1.2,
        1,
      );

    const secondResult =
      calculateCircleOverlapArea(
        1.2,
        0.4,
        1,
      );

    expect(firstResult).toBeCloseTo(
      secondResult,
      12,
    );
  });
});

describe("calculateTransitVisibility", () => {
  it("returns one for a planet fully inside the stellar disk", () => {
    expect(
      calculateTransitVisibility(
        0.4,
        1,
        0.2,
      ),
    ).toBeCloseTo(1, 12);
  });

  it("returns a fractional value for a grazing transit", () => {
    const visibility =
      calculateTransitVisibility(
        0.4,
        1,
        1.1,
      );

    expect(visibility).toBeGreaterThan(0);
    expect(visibility).toBeLessThan(1);
  });

  it("returns zero when the planet misses the star", () => {
    expect(
      calculateTransitVisibility(
        0.4,
        1,
        1.4,
      ),
    ).toBe(0);
  });

  it("returns zero for a non-positive planet radius", () => {
    expect(
      calculateTransitVisibility(
        0,
        1,
        0,
      ),
    ).toBe(0);

    expect(
      calculateTransitVisibility(
        -0.5,
        1,
        0,
      ),
    ).toBe(0);
  });

  it("decreases as projected separation increases", () => {
    const distances = [
      0.6,
      0.8,
      1,
      1.2,
      1.4,
    ];

    const visibilityValues =
      distances.map((distance) => {
        return calculateTransitVisibility(
          0.4,
          1,
          distance,
        );
      });

    for (
      let index = 1;
      index < visibilityValues.length;
      index += 1
    ) {
      expect(
        visibilityValues[index],
      ).toBeLessThanOrEqual(
        visibilityValues[index - 1],
      );
    }
  });

  it("always stays between zero and one", () => {
    const distances = Array.from(
      { length: 101 },
      (_, index) => index / 50,
    );

    for (const distance of distances) {
      const visibility =
        calculateTransitVisibility(
          0.5,
          1,
          distance,
        );

      expect(visibility).toBeGreaterThanOrEqual(0);
      expect(visibility).toBeLessThanOrEqual(1);
    }
  });
});

describe("getTransitGeometry", () => {
  it("classifies no-transit values at the lower threshold", () => {
    expect(getTransitGeometry(0)).toBe(
      "No transit",
    );

    expect(
      getTransitGeometry(0.0001),
    ).toBe("No transit");
  });

  it("classifies partial visibility as grazing", () => {
    expect(
      getTransitGeometry(0.00011),
    ).toBe("Grazing");

    expect(
      getTransitGeometry(0.5),
    ).toBe("Grazing");

    expect(
      getTransitGeometry(0.99989),
    ).toBe("Grazing");
  });

  it("classifies full-transit values at the upper threshold", () => {
    expect(
      getTransitGeometry(0.9999),
    ).toBe("Full transit");

    expect(getTransitGeometry(1)).toBe(
      "Full transit",
    );
  });

  it("agrees with calculated full, grazing, and missed visibility", () => {
    const fullVisibility =
      calculateTransitVisibility(
        0.4,
        1,
        0.2,
      );

    const grazingVisibility =
      calculateTransitVisibility(
        0.4,
        1,
        1.1,
      );

    const missedVisibility =
      calculateTransitVisibility(
        0.4,
        1,
        1.4,
      );

    expect(
      getTransitGeometry(fullVisibility),
    ).toBe("Full transit");

    expect(
      getTransitGeometry(
        grazingVisibility,
      ),
    ).toBe("Grazing");

    expect(
      getTransitGeometry(
        missedVisibility,
      ),
    ).toBe("No transit");
  });
});
