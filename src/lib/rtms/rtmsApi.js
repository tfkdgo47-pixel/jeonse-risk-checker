import { callRtmsApi } from "./client";

const SERVICE_PATH = "RTMSDataSvcAptTradeDev";
const OPERATION = "getRTMSDataSvcAptTradeDev";

// 아파트 전용면적은 정확히 일치하는 거래를 찾기 어려워 ±허용오차 안에서 매칭한다.
const AREA_TOLERANCE_M2 = 5;

// 신고 지연을 감안해 이번 달은 제외하고 최근 N개월치를 조회한다.
function recentYearMonths(n, monthsAgoStart = 1) {
  const months = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgoStart - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, "").toLowerCase();
}

// dealAmount는 "만원 단위, 콤마/공백 포함 문자열"로 온다. 원 단위 숫자로 변환한다.
function parseDealAmountWon(raw) {
  const cleaned = String(raw ?? "").trim().replace(/,/g, "");
  const manwon = Number(cleaned);
  return Number.isFinite(manwon) ? manwon * 10000 : null;
}

function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function fetchMonthTrades(sigunguCode, yearMonth) {
  const { items } = await callRtmsApi(SERVICE_PATH, OPERATION, {
    LAWD_CD: sigunguCode,
    DEAL_YMD: yearMonth,
    pageNo: 1,
    numOfRows: 1000,
  });
  return items
    .map((item) => ({
      aptNm: item.aptNm,
      umdNm: item.umdNm,
      floor: item.floor,
      buildYear: item.buildYear,
      excluUseAr: Number(item.excluUseAr),
      dealAmountWon: parseDealAmountWon(item.dealAmount),
      dealYear: item.dealYear,
      dealMonth: item.dealMonth,
      dealDay: item.dealDay,
    }))
    .filter((t) => Number.isFinite(t.excluUseAr) && t.dealAmountWon !== null);
}

function filterByArea(trades, area) {
  return trades.filter((t) => Math.abs(t.excluUseAr - area) <= AREA_TOLERANCE_M2);
}

function filterByName(trades, aptName) {
  const target = normalizeName(aptName);
  return trades.filter((t) => normalizeName(t.aptNm ?? "") === target);
}

// 단지코드/법정동코드로 실거래가를 조회해 추정 시세(중앙값)를 계산한다.
// 매칭 우선순위: (아파트명+면적) -> (면적만) -> (조회 월 범위 확장 후 면적만) -> 데이터 없음.
export async function getEstimatedMarketPrice({ sigunguCode, area, aptName }) {
  let searchedMonths = recentYearMonths(3);
  let allTrades = (
    await Promise.all(searchedMonths.map((ym) => fetchMonthTrades(sigunguCode, ym)))
  ).flat();

  let method = "area-only";
  let matched = [];

  if (aptName) {
    matched = filterByName(filterByArea(allTrades, area), aptName);
    if (matched.length > 0) method = "exact-complex";
  }

  if (matched.length === 0) {
    matched = filterByArea(allTrades, area);
    method = "area-only";
  }

  if (matched.length === 0) {
    searchedMonths = recentYearMonths(6);
    allTrades = (
      await Promise.all(searchedMonths.map((ym) => fetchMonthTrades(sigunguCode, ym)))
    ).flat();
    matched = filterByArea(allTrades, area);
    method = "widened-months";
  }

  if (matched.length === 0) {
    return {
      searchedMonths,
      areaTarget: area,
      method: null,
      estimatedPrice: null,
      sampleSize: 0,
      sampleTransactions: [],
    };
  }

  const estimatedPrice = median(matched.map((t) => t.dealAmountWon));

  return {
    searchedMonths,
    areaTarget: area,
    method,
    estimatedPrice,
    sampleSize: matched.length,
    sampleTransactions: matched.map((t) => ({
      aptNm: t.aptNm,
      excluUseAr: t.excluUseAr,
      dealAmountWon: t.dealAmountWon,
      dealYearMonth: `${t.dealYear}-${String(t.dealMonth).padStart(2, "0")}`,
      floor: t.floor,
    })),
  };
}
