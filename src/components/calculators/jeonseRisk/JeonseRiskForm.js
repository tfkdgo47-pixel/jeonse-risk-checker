"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { REGIONS } from "@/lib/data/regionCodes";
import {
  analyzeJeonseRisk,
  SAFE_RATIO_THRESHOLD,
  CAUTION_RATIO_THRESHOLD,
} from "@/lib/calculators/jeonseRisk";
import {
  analyzeHugEligibility,
  PUBLIC_PRICE_RATIO,
} from "@/lib/calculators/hugEligibility";
import TermHint from "@/components/common/TermHint";

const METRO_REGION_IDS = ["seoul", "gyeonggi", "incheon"];

function formatWon(amount) {
  return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

const GRADE_INFO = {
  safe: {
    emoji: "✅",
    label: "안전",
    headline: "이 정도면 안심할 만해요",
    cardClassName: "border-emerald-200 bg-emerald-50",
    badgeClassName: "bg-emerald-500 text-white",
    barClassName: "bg-emerald-500",
  },
  caution: {
    emoji: "⚠️",
    label: "주의",
    headline: "조금 더 꼼꼼히 확인해보세요",
    cardClassName: "border-amber-200 bg-amber-50",
    badgeClassName: "bg-amber-500 text-white",
    barClassName: "bg-amber-500",
  },
  danger: {
    emoji: "🚨",
    label: "위험",
    headline: "계약 전 반드시 전문가와 상담하세요",
    cardClassName: "border-red-200 bg-red-50",
    badgeClassName: "bg-red-500 text-white",
    barClassName: "bg-red-500",
  },
};

// 0~100+ 비율을 0~110% 구간의 막대 위치(%)로 변환 (110% 넘는 값은 끝에 붙임)
function ratioToBarPosition(ratio) {
  return Math.min(Math.max(ratio, 0), 110) / 1.1;
}

function RatioGauge({ ratio, label }) {
  const position = ratioToBarPosition(ratio);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{label}</span>
        <span className="text-base text-slate-900">{ratio.toFixed(1)}%</span>
      </div>
      <div className="relative mt-2 h-4 w-full overflow-visible rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-l-full bg-emerald-400"
          style={{ width: `${ratioToBarPosition(SAFE_RATIO_THRESHOLD)}%` }}
        />
        <div
          className="absolute inset-y-0 bg-amber-400"
          style={{
            left: `${ratioToBarPosition(SAFE_RATIO_THRESHOLD)}%`,
            width: `${
              ratioToBarPosition(CAUTION_RATIO_THRESHOLD) -
              ratioToBarPosition(SAFE_RATIO_THRESHOLD)
            }%`,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 rounded-r-full bg-red-400"
          style={{
            left: `${ratioToBarPosition(CAUTION_RATIO_THRESHOLD)}%`,
            width: `${100 - ratioToBarPosition(CAUTION_RATIO_THRESHOLD)}%`,
          }}
        />
        <div
          className="absolute top-1/2 flex h-6 w-6 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-brand-600 shadow-md"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-300">
        <span>0%</span>
        <span>{SAFE_RATIO_THRESHOLD}%</span>
        <span>{CAUTION_RATIO_THRESHOLD}%</span>
        <span>110%+</span>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-brand-100/40">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-lg">
          {icon}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-700">{title}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function JeonseRiskForm() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [area, setArea] = useState("");
  const [aptName, setAptName] = useState("");
  const [deposit, setDeposit] = useState("");
  const [priorLien, setPriorLien] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [publicPrice, setPublicPrice] = useState("");
  const [priceState, setPriceState] = useState({ status: "idle" });

  const districts = REGIONS.find((r) => r.id === selectedRegion)?.districts ?? [];

  async function handleFetchPrice() {
    setPriceState({ status: "loading" });
    try {
      const params = new URLSearchParams({
        region: selectedRegion,
        district: selectedDistrict,
        area,
      });
      if (aptName.trim()) params.set("aptName", aptName.trim());

      const res = await fetch(`/api/market-price?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "조회에 실패했어요.");
      setPriceState({ status: "success", data });
    } catch (err) {
      setPriceState({ status: "error", message: err.message });
    }
  }

  const marketPrice =
    priceState.status === "success" && priceState.data.estimatedPrice != null
      ? priceState.data.estimatedPrice
      : Number(manualPrice) || null;

  const result = useMemo(
    () =>
      analyzeJeonseRisk({
        deposit: Number(deposit) || 0,
        priorLien: Number(priorLien) || 0,
        marketPrice,
      }),
    [deposit, priorLien, marketPrice]
  );

  const showManualFallback =
    priceState.status === "success" && priceState.data.estimatedPrice == null;

  const canFetchPrice = selectedDistrict && Number(area) > 0 && priceState.status !== "loading";

  const grade = result.grade ? GRADE_INFO[result.grade] : null;

  const isMetro = METRO_REGION_IDS.includes(selectedRegion);
  const hugResult = useMemo(
    () =>
      analyzeHugEligibility({
        deposit: Number(deposit) || 0,
        publicPrice: Number(publicPrice) || 0,
        isMetro,
      }),
    [deposit, publicPrice, isMetro]
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <SectionCard icon="🏠" title="우리 집 정보" subtitle="주변 실거래가를 찾을 위치예요">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedDistrict("");
              setPriceState({ status: "idle" });
            }}
            className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400"
          >
            <option value="">시/도 선택</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setPriceState({ status: "idle" });
            }}
            disabled={!selectedRegion}
            className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 disabled:opacity-50"
          >
            <option value="">구/시군구 선택</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-500">전용면적 (㎡)</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setPriceState({ status: "idle" });
              }}
              placeholder="예: 84.98"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right text-base text-slate-900 outline-none focus:border-brand-400"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-500">
              아파트명 (선택)
            </span>
            <input
              type="text"
              value={aptName}
              onChange={(e) => {
                setAptName(e.target.value);
                setPriceState({ status: "idle" });
              }}
              placeholder="정확히 입력하면 더 정확해요"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleFetchPrice}
          disabled={!canFetchPrice}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-300/50 transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
        >
          {priceState.status === "loading" ? "시세 조회 중... 🔍" : "🔍 시세 조회하기"}
        </button>

        {priceState.status === "error" && (
          <p className="mt-3 text-sm text-red-600">{priceState.message}</p>
        )}

        {priceState.status === "success" && priceState.data.estimatedPrice != null && (
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-50 to-gold-400/10 p-4 text-sm text-brand-800">
            <p>
              📍 {priceState.data.districtLabel} 최근 실거래가 {priceState.data.sampleSize}건
              기준 추정 시세
            </p>
            <p className="font-display mt-1 text-2xl text-brand-700">
              {formatWon(priceState.data.estimatedPrice)}
            </p>
          </div>
        )}

        {showManualFallback && (
          <div className="mt-4">
            <p className="text-sm text-slate-500">
              🤔 해당 조건에 맞는 최근 실거래가를 찾지 못했어요. 시세를 직접
              입력하면 계산할 수 있어요.
            </p>
            <label className="mt-2 block">
              <span className="mb-1 block text-sm text-slate-500">
                추정 매매시세 (원, 직접 입력)
              </span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right text-base text-slate-900 outline-none focus:border-brand-400"
              />
            </label>
          </div>
        )}
      </SectionCard>

      <SectionCard icon="📝" title="전세 계약 정보">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-500">전세보증금 (원)</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right text-base text-slate-900 outline-none focus:border-brand-400"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm text-slate-500">
            선순위채권 (근저당권 등, 원, 선택)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={priorLien}
            onChange={(e) => setPriorLien(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right text-base text-slate-900 outline-none focus:border-brand-400"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          선순위채권(근저당권 등)은 등기부등본 열람이 필요해 자동으로 가져올
          수 없어요. 등기부등본에서 직접 확인한 금액을 입력해주세요(모르면
          비워둬도 계산돼요).
        </p>
        <TermHint termId="prior-lien" />
      </SectionCard>

      <SectionCard icon="🛡️" title="HUG 전세보증금 반환보증 가입 가능성">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-500">
            공시가격 (원, 직접 입력)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={publicPrice}
            onChange={(e) => setPublicPrice(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right text-base text-slate-900 outline-none focus:border-brand-400"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          공시가격은{" "}
          <a
            href="https://www.realtyprice.kr:447/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-500 underline"
          >
            부동산공시가격 알리미
          </a>
          에서 무료로 조회할 수 있어요. 실거래가와는 다른 값이라 자동으로
          가져올 수 없어요.
        </p>
        <TermHint termId="public-price" />
        <TermHint termId="hug-guarantee" />

        {Number(deposit) > 0 && Number(publicPrice) > 0 && (
          <div
            className={`mt-4 rounded-2xl border p-4 text-sm ${
              hugResult.eligible
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <p className="font-display text-base">
              {hugResult.eligible ? "✅ 가입 가능성 있음" : "🚨 가입 어려울 수 있음"}
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>
                {hugResult.withinDepositLimit ? "✅" : "❌"} 보증한도(
                {isMetro ? "수도권 7억원" : "비수도권 5억원"}) 이내
              </li>
              <li>
                {hugResult.withinPriceRatio ? "✅" : "❌"} 전세보증금이 공시가격의{" "}
                {PUBLIC_PRICE_RATIO * 100}% ({formatWon(hugResult.maxAllowedDeposit)}) 이내
              </li>
            </ul>
            <p className="mt-2 text-xs leading-relaxed opacity-80">
              실제 가입 심사는 주택 유형, 임대인 신용 상태 등 다른 조건도
              함께 봐요. 이 결과는 참고용이고, 정확한 가입 가능 여부는 HUG나
              보증보험 대리점에 직접 확인하세요.
            </p>
          </div>
        )}
      </SectionCard>

      {marketPrice != null && Number(deposit) > 0 && grade && (
        <div className={`rounded-3xl border-2 p-6 shadow-sm ${grade.cardClassName}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-500">위험도 진단 결과</p>
              <p className="font-display mt-1 text-xl text-slate-900">
                {grade.emoji} {grade.headline}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold ${grade.badgeClassName}`}
            >
              {grade.label}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {result.jeonseRatio != null && (
              <>
                <RatioGauge ratio={result.jeonseRatio} label="전세가율 (전세보증금 / 시세)" />
                <TermHint termId="jeonse-ratio" />
              </>
            )}
            {result.hasLienInput && result.combinedRatio != null && (
              <RatioGauge
                ratio={result.combinedRatio}
                label="합산 비율 ((전세보증금+선순위채권) / 시세)"
              />
            )}
          </div>

          <p className="mt-6 rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-slate-700">
            이 등급 기준({SAFE_RATIO_THRESHOLD}% 이하 안전 · {SAFE_RATIO_THRESHOLD}~
            {CAUTION_RATIO_THRESHOLD}% 주의 · {CAUTION_RATIO_THRESHOLD}% 초과 위험)은 법적
            기준이 아니라 언론·HUG 가이드에서 흔히 언급되는 참고용 수치예요.
            실제 계약 전에는 등기부등본과 전문가 상담을 함께 확인하세요.
          </p>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        모르는 용어가 있으신가요?{" "}
        <Link href="/glossary" className="text-brand-500 underline">
          전세 용어 사전 보기
        </Link>
      </p>
    </div>
  );
}
