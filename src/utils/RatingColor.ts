export const RatingColors = [
  'Black',
  'Grey',
  'Brown',
  'Green',
  'Cyan',
  'Blue',
  'Yellow',
  'Orange',
  'Red',
] as const;

export type RatingColor = typeof RatingColors[number];
export const getRatingColor = (rating: number): RatingColor => {
  const index = Math.min(Math.floor(rating / 400), RatingColors.length - 2);
  return RatingColors[index + 1];
};
export const getRatingColorCode = (ratingColor: RatingColor): string => {
  switch (ratingColor) {
    case 'Black':
      return '#000000'; // black
    case 'Grey':
      return '#808080'; // grey
    case 'Brown':
      return '#804000'; // brown
    case 'Green':
      return '#008000'; // green
    case 'Cyan':
      return '#00C0C0'; // cyan
    case 'Blue':
      return '#0000FF'; // blue
    case 'Yellow':
      return '#C0C000'; // yellow
    case 'Orange':
      return '#FF8000'; // orange
    case 'Red':
      return '#FF0000'; // red
  }
};

export type RatingColorClassName =
  | 'difficulty-black'
  | 'difficulty-grey'
  | 'difficulty-brown'
  | 'difficulty-green'
  | 'difficulty-cyan'
  | 'difficulty-blue'
  | 'difficulty-yellow'
  | 'difficulty-orange'
  | 'difficulty-red';
export const getRatingColorClass = (rating: number): RatingColorClassName => {
  const ratingColor = getRatingColor(rating);
  switch (ratingColor) {
    case 'Black':
      return 'difficulty-black';
    case 'Grey':
      return 'difficulty-grey';
    case 'Brown':
      return 'difficulty-brown';
    case 'Green':
      return 'difficulty-green';
    case 'Cyan':
      return 'difficulty-cyan';
    case 'Blue':
      return 'difficulty-blue';
    case 'Yellow':
      return 'difficulty-yellow';
    case 'Orange':
      return 'difficulty-orange';
    case 'Red':
      return 'difficulty-red';
  }
};
