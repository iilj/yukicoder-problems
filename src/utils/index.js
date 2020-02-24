
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
    return "";
  }
  if (level < 1) {
    return "#000000"; // black
  } else if (level <= 1) {
    return "#808080"; // grey
  } else if (level <= 1.5) {
    return "#804000"; // brown
  } else if (level <= 2) {
    return "#008000"; // green
  } else if (level <= 2.5) {
    return "#00C0C0"; // cyan
  } else if (level <= 3) {
    return "#0000FF"; // blue
  } else if (level <= 3.5) {
    return "#C0C000"; // yellow
  } else if (level <= 4) {
    return "#FF8000"; // orange
  } else if (level <= 4.5) {
    return "#FF0000"; // red
  } else if (level <= 5) {
    return "#725a36"; // bronze
  } else if (level <= 5.5) {
    return "#808080"; // silver
  } else {
    return "#ffd700"; // gold
  }
};

// 問題の難易度レベル→色クラス，の変換
export const getDifficultyLevelColorClass = (level) => {
  if (!level) {
    return "";
  }
  if (level < 1) {
    return "difficulty-black"; // black
  } else if (level <= 1) {
    return "difficulty-grey"; // grey
  } else if (level <= 1.5) {
    return "difficulty-brown"; // brown
  } else if (level <= 2) {
    return "difficulty-green"; // green
  } else if (level <= 2.5) {
    return "difficulty-cyan"; // cyan
  } else if (level <= 3) {
    return "difficulty-blue"; // blue
  } else if (level <= 3.5) {
    return "difficulty-yellow"; // yellow
  } else if (level <= 4) {
    return "difficulty-orange"; // orange
  } else {
    return "difficulty-red"; // red
  }
};

export const ordinalSuffixOf = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};