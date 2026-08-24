export type TransitGeometry =
  | "No transit"
  | "Grazing"
  | "Full transit";

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.max(
    minimum,
    Math.min(maximum, value),
  );
}

export function calculateCircleOverlapArea(
  firstRadius: number,
  secondRadius: number,
  centerDistance: number,
) {
  const radiusOne = Math.max(
    firstRadius,
    0,
  );

  const radiusTwo = Math.max(
    secondRadius,
    0,
  );

  const distance = Math.max(
    centerDistance,
    0,
  );

  if (
    radiusOne === 0 ||
    radiusTwo === 0
  ) {
    return 0;
  }

  if (
    distance >=
    radiusOne + radiusTwo
  ) {
    return 0;
  }

  if (
    distance <=
    Math.abs(radiusOne - radiusTwo)
  ) {
    const smallerRadius = Math.min(
      radiusOne,
      radiusTwo,
    );

    return (
      Math.PI *
      smallerRadius *
      smallerRadius
    );
  }

  const firstAngle = Math.acos(
    clamp(
      (
        distance * distance +
        radiusOne * radiusOne -
        radiusTwo * radiusTwo
      ) /
        (
          2 *
          distance *
          radiusOne
        ),
      -1,
      1,
    ),
  );

  const secondAngle = Math.acos(
    clamp(
      (
        distance * distance +
        radiusTwo * radiusTwo -
        radiusOne * radiusOne
      ) /
        (
          2 *
          distance *
          radiusTwo
        ),
      -1,
      1,
    ),
  );

  const triangleArea =
    0.5 *
    Math.sqrt(
      Math.max(
        0,
        (-distance +
          radiusOne +
          radiusTwo) *
          (distance +
            radiusOne -
            radiusTwo) *
          (distance -
            radiusOne +
            radiusTwo) *
          (distance +
            radiusOne +
            radiusTwo),
      ),
    );

  return (
    radiusOne *
      radiusOne *
      firstAngle +
    radiusTwo *
      radiusTwo *
      secondAngle -
    triangleArea
  );
}

export function calculateTransitVisibility(
  planetRadius: number,
  starRadius: number,
  projectedDistance: number,
) {
  if (planetRadius <= 0) {
    return 0;
  }

  const overlapArea =
    calculateCircleOverlapArea(
      planetRadius,
      starRadius,
      projectedDistance,
    );

  const planetDiskArea =
    Math.PI *
    planetRadius *
    planetRadius;

  return clamp(
    overlapArea / planetDiskArea,
    0,
    1,
  );
}

export function getTransitGeometry(
  transitVisibility: number,
): TransitGeometry {
  if (transitVisibility <= 0.0001) {
    return "No transit";
  }

  if (transitVisibility < 0.9999) {
    return "Grazing";
  }

  return "Full transit";
}