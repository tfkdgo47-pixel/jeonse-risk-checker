// data.go.kr(국토교통부) 실거래가 OpenAPI 공통 호출 래퍼.
// 반드시 서버 사이드에서만 호출한다 (인증키가 클라이언트로 노출되면 안 됨).
const BASE_URL = "https://apis.data.go.kr/1613000";

// 국토교통부 OpenAPI 공통 응답 포맷: { response: { header, body: { items: { item }, totalCount } } }
async function callRtmsApi(servicePath, operation, params) {
  const serviceKey = process.env.DATA_GO_KR_RTMS_KEY;
  if (!serviceKey) {
    throw new Error("DATA_GO_KR_RTMS_KEY 환경변수가 설정되어 있지 않아요.");
  }

  const url = new URL(`${BASE_URL}/${servicePath}/${operation}`);
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("_type", "json");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  // User-Agent가 없는 요청은 data.go.kr 게이트웨이 WAF가 400(Request Blocked)으로
  // 차단하는 것을 실제 호출로 확인했다(2026-07-27). 브라우저 UA를 명시해 우회한다.
  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    // 인증키 오류(활용신청 미승인 등)는 JSON이 아니라 평문으로 오는 경우가 있다.
    throw new Error(`실거래가 API 응답을 파싱할 수 없어요: ${text.slice(0, 200)}`);
  }

  const header = json?.response?.header;
  // 이 API는 성공 코드로 "000"(K-apt API의 "00"과 다름)을 쓰는 것을 실제 호출로
  // 확인했다(2026-07-27) — 두 코드 모두 성공으로 처리한다.
  if (header && header.resultCode !== "00" && header.resultCode !== "000") {
    throw new Error(`실거래가 API 오류(${header.resultCode}): ${header.resultMsg}`);
  }

  const body = json?.response?.body;
  // 이 API는 body.items.item에 배열(또는 결과가 1건이면 객체 하나)로 온다 —
  // K-apt API의 body.items(배열 직접) 형태와 다르다. 실제 호출로 확인한 실제 구조다.
  const rawItems = body?.items?.item ?? body?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return { items, totalCount: body?.totalCount ?? items.length };
}

export { callRtmsApi };
