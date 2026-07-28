"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHECKLIST_SECTIONS } from "@/lib/data/jeonseChecklist";
import TermHint from "@/components/common/TermHint";

const STORAGE_KEY = "jeonse-checklist-checked";

const totalItems = CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

function readStoredChecked() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등) 시 그냥 빈 상태로 시작한다.
    return {};
  }
}

export default function JeonseChecklist() {
  const [checked, setChecked] = useState(readStoredChecked);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // 저장 실패해도 화면 동작에는 영향 없음.
    }
  }, [checked]);

  function toggle(itemId) {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-brand-100/40">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-slate-700">체크 현황</span>
          <span className="font-bold text-brand-700">
            {checkedCount} / {totalItems}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          체크 상태는 이 브라우저에만 저장돼요(서버로 전송되지 않아요). 법적
          조언이 아니라 일반적으로 권장되는 확인 항목이니, 실제 계약은
          공인중개사·법률 전문가와 함께 진행하세요.
        </p>
      </div>

      {CHECKLIST_SECTIONS.map((section) => (
        <div
          key={section.id}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-brand-100/40"
        >
          <p className="mb-4 text-sm font-bold text-slate-700">{section.label}</p>
          <ul className="space-y-4">
            {section.items.map((item) => {
              const isChecked = Boolean(checked[item.id]);
              return (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-5 w-5 shrink-0 accent-brand-600"
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isChecked ? "text-slate-400 line-through" : "text-slate-900"
                        }`}
                      >
                        {item.text}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {item.note}
                      </p>
                      {item.termId && <TermHint termId={item.termId} />}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <p className="text-center text-xs text-slate-400">
        모르는 용어가 있으신가요?{" "}
        <Link href="/glossary" className="text-brand-500 underline">
          전세 용어 사전 보기
        </Link>
      </p>
    </div>
  );
}
