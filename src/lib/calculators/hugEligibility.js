// HUG(주택도시보증공사) 전세보증금 반환보증 가입 가능성 판정.
// 2026-07 기준 실제 가입요건("126% 룰": 공시가격의 140%에 전세가율 90%를
// 곱한 값 = 공시가격의 126%)을 반영한다. 공시가격은 자동 조회가 불가능해
// 사용자가 부동산공시가격 알리미에서 직접 확인해 입력하는 값을 쓴다.
export const METRO_DEPOSIT_LIMIT_WON = 700_000_000; // 수도권(서울·경기·인천) 한도
export const NON_METRO_DEPOSIT_LIMIT_WON = 500_000_000; // 그 외 지역 한도
export const PUBLIC_PRICE_RATIO = 1.26; // 공시가격 × 126%까지만 가입 가능

export function analyzeHugEligibility({ deposit, publicPrice, isMetro }) {
  const depositLimit = isMetro ? METRO_DEPOSIT_LIMIT_WON : NON_METRO_DEPOSIT_LIMIT_WON;
  const withinDepositLimit = deposit > 0 ? deposit <= depositLimit : null;

  const hasPublicPrice = Number.isFinite(publicPrice) && publicPrice > 0;
  const maxAllowedDeposit = hasPublicPrice ? publicPrice * PUBLIC_PRICE_RATIO : null;
  const withinPriceRatio = hasPublicPrice && deposit > 0 ? deposit <= maxAllowedDeposit : null;

  const eligible =
    withinDepositLimit === true && withinPriceRatio === true
      ? true
      : withinDepositLimit === false || withinPriceRatio === false
        ? false
        : null;

  return {
    depositLimit,
    withinDepositLimit,
    maxAllowedDeposit,
    withinPriceRatio,
    eligible,
  };
}
