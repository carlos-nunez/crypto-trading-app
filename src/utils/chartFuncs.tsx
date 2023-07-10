/**
Gets the max/min y and x values of an array
@param data array of {x, y} values
@returns {maxX, maxY, minX, minY}
**/

type Coord = {
  x: number;
  y: number;
};

export const getMaxMin = (data: Array<Coord>) => {
  let maxX = 0,
    maxY = 0,
    minX = data[0].x,
    minY = data[0].y;

  data.forEach((item) => {
    if (item.x > maxX) maxX = item.x;
    if (item.y > maxY) maxY = item.y;
    if (item.x < minX) minX = item.x;
    if (item.y < minY) minY = item.y;
  });

  return {maxX, maxY, minY, minX};
};
