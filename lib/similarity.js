import { playerStyles } from "./playerStyles";

export function calculateSimilarity(userData) {
  const results = [];

  for (const player in playerStyles) {
    const style = playerStyles[player];

    let score = 0;
    let count = 0;

    for (const key in style) {
      const diff = Math.abs(style[key] - userData[key]);
      score += (100 - diff); // 차이가 적을수록 점수 높음
      count++;
    }

    const finalScore = Math.round(score / count);

    results.push({
      player,
      score: finalScore,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}
