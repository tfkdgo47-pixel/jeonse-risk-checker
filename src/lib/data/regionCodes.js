// 법정동코드(행정표준코드관리시스템 code.go.kr 기준) 앞 5자리 = 시군구코드.
// K-apt 단지 목록 API(getSigunguAptList3)는 이 시군구코드로 단지 목록을 조회한다.
// 우선 서울 25개구만 채워두고, 필요할 때 다른 지역(경기 등)을 같은 형식으로 추가하면 된다.
export const SEOUL_DISTRICTS = [
  { id: "jongno", label: "종로구", sigunguCode: "11110" },
  { id: "jung", label: "중구", sigunguCode: "11140" },
  { id: "yongsan", label: "용산구", sigunguCode: "11170" },
  { id: "seongdong", label: "성동구", sigunguCode: "11200" },
  { id: "gwangjin", label: "광진구", sigunguCode: "11215" },
  { id: "dongdaemun", label: "동대문구", sigunguCode: "11230" },
  { id: "jungnang", label: "중랑구", sigunguCode: "11260" },
  { id: "seongbuk", label: "성북구", sigunguCode: "11290" },
  { id: "gangbuk", label: "강북구", sigunguCode: "11305" },
  { id: "dobong", label: "도봉구", sigunguCode: "11320" },
  { id: "nowon", label: "노원구", sigunguCode: "11350" },
  { id: "eunpyeong", label: "은평구", sigunguCode: "11380" },
  { id: "seodaemun", label: "서대문구", sigunguCode: "11410" },
  { id: "mapo", label: "마포구", sigunguCode: "11440" },
  { id: "yangcheon", label: "양천구", sigunguCode: "11470" },
  { id: "gangseo", label: "강서구", sigunguCode: "11500" },
  { id: "guro", label: "구로구", sigunguCode: "11530" },
  { id: "geumcheon", label: "금천구", sigunguCode: "11545" },
  { id: "yeongdeungpo", label: "영등포구", sigunguCode: "11560" },
  { id: "dongjak", label: "동작구", sigunguCode: "11590" },
  { id: "gwanak", label: "관악구", sigunguCode: "11620" },
  { id: "seocho", label: "서초구", sigunguCode: "11650" },
  { id: "gangnam", label: "강남구", sigunguCode: "11680" },
  { id: "songpa", label: "송파구", sigunguCode: "11710" },
  { id: "gangdong", label: "강동구", sigunguCode: "11740" },
];

// 경기도 31개 시군. 수원/성남/안양/안산/고양/용인/부천/화성은 구가 나뉘어 있어
// 각 구를 개별 항목으로 넣었다(시군구코드가 구 단위라 구별로 따로 조회해야 함).
// 모든 코드는 실제 K-apt API(getSigunguAptList3)로 직접 호출해 단지명·행정동명이
// 정확히 매칭되는지 확인한 값이다(추측 아님, 2026-07-21 확인).
export const GYEONGGI_DISTRICTS = [
  { id: "suwon-jangan", label: "수원시 장안구", sigunguCode: "41111" },
  { id: "suwon-gwonseon", label: "수원시 권선구", sigunguCode: "41113" },
  { id: "suwon-paldal", label: "수원시 팔달구", sigunguCode: "41115" },
  { id: "suwon-yeongtong", label: "수원시 영통구", sigunguCode: "41117" },
  { id: "seongnam-sujeong", label: "성남시 수정구", sigunguCode: "41131" },
  { id: "seongnam-jungwon", label: "성남시 중원구", sigunguCode: "41133" },
  { id: "seongnam-bundang", label: "성남시 분당구", sigunguCode: "41135" },
  { id: "uijeongbu", label: "의정부시", sigunguCode: "41150" },
  { id: "anyang-manan", label: "안양시 만안구", sigunguCode: "41171" },
  { id: "anyang-dongan", label: "안양시 동안구", sigunguCode: "41173" },
  { id: "bucheon-wonmi", label: "부천시 원미구", sigunguCode: "41192" },
  { id: "bucheon-sosa", label: "부천시 소사구", sigunguCode: "41194" },
  { id: "bucheon-ojeong", label: "부천시 오정구", sigunguCode: "41196" },
  { id: "gwangmyeong", label: "광명시", sigunguCode: "41210" },
  { id: "pyeongtaek", label: "평택시", sigunguCode: "41220" },
  { id: "dongducheon", label: "동두천시", sigunguCode: "41250" },
  { id: "ansan-sangnok", label: "안산시 상록구", sigunguCode: "41271" },
  { id: "ansan-danwon", label: "안산시 단원구", sigunguCode: "41273" },
  { id: "goyang-deogyang", label: "고양시 덕양구", sigunguCode: "41281" },
  { id: "goyang-ilsandong", label: "고양시 일산동구", sigunguCode: "41285" },
  { id: "goyang-ilsanseo", label: "고양시 일산서구", sigunguCode: "41287" },
  { id: "gwacheon", label: "과천시", sigunguCode: "41290" },
  { id: "guri", label: "구리시", sigunguCode: "41310" },
  { id: "namyangju", label: "남양주시", sigunguCode: "41360" },
  { id: "osan", label: "오산시", sigunguCode: "41370" },
  { id: "siheung", label: "시흥시", sigunguCode: "41390" },
  { id: "gunpo", label: "군포시", sigunguCode: "41410" },
  { id: "uiwang", label: "의왕시", sigunguCode: "41430" },
  { id: "hanam", label: "하남시", sigunguCode: "41450" },
  { id: "yongin-cheoin", label: "용인시 처인구", sigunguCode: "41461" },
  { id: "yongin-giheung", label: "용인시 기흥구", sigunguCode: "41463" },
  { id: "yongin-suji", label: "용인시 수지구", sigunguCode: "41465" },
  { id: "paju", label: "파주시", sigunguCode: "41480" },
  { id: "icheon", label: "이천시", sigunguCode: "41500" },
  { id: "anseong", label: "안성시", sigunguCode: "41550" },
  { id: "gimpo", label: "김포시", sigunguCode: "41570" },
  { id: "hwaseong-hyohaeng", label: "화성시 효행구", sigunguCode: "41593" },
  { id: "hwaseong-byeongjeom", label: "화성시 병점구", sigunguCode: "41595" },
  { id: "hwaseong-dongtan", label: "화성시 동탄구", sigunguCode: "41597" },
  { id: "gwangju", label: "광주시", sigunguCode: "41610" },
  { id: "yangju", label: "양주시", sigunguCode: "41630" },
  { id: "pocheon", label: "포천시", sigunguCode: "41650" },
  { id: "yeoju", label: "여주시", sigunguCode: "41670" },
  { id: "yeoncheon", label: "연천군", sigunguCode: "41800" },
  { id: "gapyeong", label: "가평군", sigunguCode: "41820" },
  { id: "yangpyeong", label: "양평군", sigunguCode: "41830" },
];

export const REGIONS = [
  { id: "seoul", label: "서울특별시", districts: SEOUL_DISTRICTS },
  { id: "gyeonggi", label: "경기도", districts: GYEONGGI_DISTRICTS },
];

export function findDistrict(regionId, districtId) {
  const region = REGIONS.find((r) => r.id === regionId);
  return region?.districts.find((d) => d.id === districtId) ?? null;
}
