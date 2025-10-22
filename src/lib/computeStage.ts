export type Stage = "Emerging" | "Developing" | "Established" | "Breakout";

export function computeStageFromScores(scores: { craft: number; catalog: number; brand: number; team: number; audience: number; ops: number }): Stage {
  const avg = (scores.craft + scores.catalog + scores.brand + scores.team + scores.audience + scores.ops) / 6;
  if (avg < 2) return "Emerging";
  if (avg < 3) return "Developing";
  if (avg < 4) return "Established";
  return "Breakout";
}

export default computeStageFromScores;
