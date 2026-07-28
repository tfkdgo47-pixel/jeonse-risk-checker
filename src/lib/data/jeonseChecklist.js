// 전세 계약 전/계약 시/입주 시 확인해야 할 항목들. 자동 조회가 불가능한
// 항목(등기부등본, 임대인 세금 체납 등)이 많아 체크리스트 형태로 안내한다.
export const CHECKLIST_SECTIONS = [
  {
    id: "registry",
    label: "등기부등본 확인 (계약 전 필수)",
    items: [
      {
        id: "owner-match",
        text: "등기부등본상 소유자와 계약 상대방(임대인)이 일치하나요?",
        note: "위임장 없이 대리인이 나오면 반드시 소유자 본인 확인 및 위임장·인감증명서를 확인하세요.",
      },
      {
        id: "lien-check",
        text: "근저당권·가압류·압류 등 권리관계를 확인했나요?",
        note: "이 앱의 전세가율 계산에 '선순위채권'으로 반영할 수 있어요.",
        termId: "prior-lien",
      },
      {
        id: "trust-registry",
        text: "신탁 등기가 되어 있다면, 신탁회사 동의서를 확인했나요?",
        note: "신탁 부동산은 소유자(수탁자)가 아닌 사람과 계약하면 무효가 될 수 있어요.",
        termId: "trust-registry",
      },
      {
        id: "multi-household",
        text: "다가구주택이라면 건물 전체의 선순위 임차인 보증금 총액을 확인했나요?",
        note: "다가구주택은 등기부에 세대별 전세금이 나오지 않아 임대인에게 별도로 확인이 필요해요.",
        termId: "multi-household",
      },
    ],
  },
  {
    id: "landlord",
    label: "임대인 정보 확인",
    items: [
      {
        id: "tax-arrears",
        text: "임대인의 국세·지방세 체납 여부를 열람했나요?",
        note: "임대인 동의를 받아 세무서·정부24에서 '미납국세 열람'이 가능해요.",
      },
      {
        id: "multi-owner",
        text: "임대인이 여러 채를 보유한 다주택자(이른바 갭투자)인지 확인했나요?",
        note: "세금 체납이나 전세금 반환 지연 위험이 상대적으로 높을 수 있어요.",
      },
    ],
  },
  {
    id: "contract",
    label: "계약서 작성 시",
    items: [
      {
        id: "lien-clear-clause",
        text: "\"잔금일까지 기존 근저당권을 말소한다\" 같은 특약을 넣었나요?",
        note: "말소가 안 되면 잔금을 미루거나 계약을 해제할 수 있다는 조항도 함께 넣으면 좋아요.",
      },
      {
        id: "address-match",
        text: "계약서 주소가 등기부등본상 주소(동/호수 포함)와 정확히 일치하나요?",
        note: "주소가 다르면 나중에 대항력을 인정받지 못할 수 있어요.",
      },
      {
        id: "guarantee-insurance",
        text: "전세보증금 반환보증(HUG·HF·SGI) 가입 여부와 가능 여부를 확인했나요?",
        note: "전세가율이 높으면 가입이 거절될 수 있으니 계약 전에 미리 확인하는 게 좋아요.",
        termId: "hug-guarantee",
      },
    ],
  },
  {
    id: "move-in",
    label: "이사 당일 (잔금일)",
    items: [
      {
        id: "move-in-report",
        text: "잔금 지급과 동시에 전입신고를 했나요?",
        note: "전입신고를 해야 대항력이 생겨요(다음 날 0시부터 효력 발생).",
        termId: "move-in-report",
      },
      {
        id: "fixed-date",
        text: "확정일자를 받았나요?",
        note: "전입신고 + 확정일자가 있어야 나중에 경매·공매 시 우선변제권이 생겨요.",
        termId: "fixed-date",
      },
      {
        id: "recheck-registry",
        text: "이사 당일(잔금 지급 직전) 등기부등본을 다시 한번 확인했나요?",
        note: "계약일과 잔금일 사이에 새로운 근저당이 설정되는 경우가 있어요.",
      },
      {
        id: "move-in-defects",
        text: "입주 시 기존 하자를 사진·영상으로 기록해뒀나요?",
        note: "나중에 퇴거할 때 원상복구 비용을 두고 다투는 걸 예방할 수 있어요.",
      },
    ],
  },
  {
    id: "during-and-move-out",
    label: "계약 기간 중 ~ 퇴거 시",
    items: [
      {
        id: "renewal-right",
        text: "계약 만료 6개월~2개월 전 사이에 계약갱신청구권을 챙겼나요?",
        note: "임차인은 1회에 한해 2년 더 연장을 요구할 수 있어요. 이 기간을 놓치면 권리를 주장하기 어려워요.",
        termId: "renewal-right",
      },
      {
        id: "implied-renewal",
        text: "별다른 통지가 없었다면, 묵시적 갱신으로 자동 연장된 건 아닌지 확인했나요?",
        note: "만료 2개월 전까지 서로 통지가 없으면 이전과 같은 조건으로 2년 자동 연장돼요.",
        termId: "implied-renewal",
      },
      {
        id: "rental-report",
        text: "계약일로부터 30일 이내에 전월세 신고를 했나요?",
        note: "보증금 6천만원 또는 월세 30만원 초과 시 신고 대상이에요(수도권·광역시·세종·제주시·도의 시 지역, 군 지역은 제외). 안 하면 과태료가 나올 수 있어요.",
        termId: "rental-report",
      },
      {
        id: "lease-registration-order",
        text: "보증금을 못 받았는데 이사해야 한다면, 이사 전에 임차권등기명령부터 신청했나요?",
        note: "등기부에 기재되기 전에 이사하면 대항력·우선변제권이 함께 사라질 수 있어요. 등기부 기재를 확인한 뒤에 전출하세요.",
        termId: "lease-registration-order",
      },
      {
        id: "reserve-fund-return",
        text: "이사 나갈 때 장기수선충당금 반환을 청구했나요?",
        note: "관리사무소에서 '납부확인서'를 발급받아 집주인에게 청구하면 돼요. 청구기한은 계약 종료일로부터 10년이에요.",
        termId: "long-term-repair-reserve",
      },
    ],
  },
];
