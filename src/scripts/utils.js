export const getDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2), Math.pow(y2 - y1, 2));
export const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const round = (value) => Math.round(value);
export const floor = (value) => Math.floor(value);