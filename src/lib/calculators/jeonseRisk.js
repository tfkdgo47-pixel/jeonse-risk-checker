// 참고용 위험도 기준(언론·HUG 가이드에서 흔히 언급되는 통용치). 법적 기준이 아니다.
export const SAFE_RATIO_THRESHOLD = 70; // 이하: 안전
export const CAUTION_RATIO_THRESHOLD = 80; // 이하: 주의, 초과: 위험

export function analyzeJeonseRisk({ deposit, priorLien = 0, marketPrice }) {
  const hasMarketPrice = Number.isFinite(marketPrice) && marketPrice > 0;

  const jeonseRatio = hasMarketPrice ? (deposit / marketPrice) * 100 : null;
  const combinedRatio =
    hasMarketPrice && priorLien > 0 ? ((deposit + priorLien) / marketPrice) * 100 : null;

  // 선순위채권 정보가 있으면 더 보수적인(합산) 비율로 등급을 매긴다.
  const gradeRatio = combinedRatio ?? jeonseRatio;
  const grade =
    gradeRatio == null
      ? null
      : gradeRatio <= SAFE_RATIO_THRESHOLD
        ? "safe"
        : gradeRatio <= CAUTION_RATIO_THRESHOLD
          ? "caution"
          : "danger";

  return {
    jeonseRatio,
    combinedRatio,
    grade,
    hasLienInput: priorLien > 0,
  };
}
