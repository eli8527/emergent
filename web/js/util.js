// Return a random number in [lo, hi)
export function randomUniform(lo, hi) {
  return (hi - lo) * Math.random() + lo;
}

// Return an exponentially distributed random number
export function randomExponential(expected) {
  return Math.log(Math.random()) / -(1 / expected);
}

// Return the Euclidean distance between two points.
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
