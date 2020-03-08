// 0.0 黒
// 1.0 灰
// 1.5 茶
// 2.0 緑
// 2.5 水
// 3.0 青
// 3.5 黃
// 4.0 橙
// 4.5 赤
// 5.0 銅
// 5.5 銀
// 6.0 金

// 問題の難易度レベル→色，の変換
export const getDifficultyLevelColor = (level) => {
  if (!level) {
    return '';
  }
  if (level < 1) {
    return '#000000'; // black
  }
  if (level <= 1) {
    return '#808080'; // grey
  }
  if (level <= 1.5) {
    return '#804000'; // brown
  }
  if (level <= 2) {
    return '#008000'; // green
  }
  if (level <= 2.5) {
    return '#00C0C0'; // cyan
  }
  if (level <= 3) {
    return '#0000FF'; // blue
  }
  if (level <= 3.5) {
    return '#C0C000'; // yellow
  }
  if (level <= 4) {
    return '#FF8000'; // orange
  }
  if (level <= 4.5) {
    return '#FF0000'; // red
  }
  if (level <= 5) {
    return '#725a36'; // bronze
  }
  if (level <= 5.5) {
    return '#808080'; // silver
  }
  return '#ffd700'; // gold
};

// 問題の難易度レベル→色クラス，の変換
export const getDifficultyLevelColorClass = (level) => {
  if (!level) {
    return '';
  }
  if (level < 1) {
    return 'difficulty-black'; // black
  }
  if (level <= 1) {
    return 'difficulty-grey'; // grey
  }
  if (level <= 1.5) {
    return 'difficulty-brown'; // brown
  }
  if (level <= 2) {
    return 'difficulty-green'; // green
  }
  if (level <= 2.5) {
    return 'difficulty-cyan'; // cyan
  }
  if (level <= 3) {
    return 'difficulty-blue'; // blue
  }
  if (level <= 3.5) {
    return 'difficulty-yellow'; // yellow
  }
  if (level <= 4) {
    return 'difficulty-orange'; // orange
  }
  return 'difficulty-red'; // red
};

export const ordinalSuffixOf = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};
