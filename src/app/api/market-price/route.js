import { NextResponse } from "next/server";
import { findDistrict } from "@/lib/data/regionCodes";
import { getEstimatedMarketPrice } from "@/lib/rtms/rtmsApi";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const district = searchParams.get("district");
  const area = Number(searchParams.get("area"));
  const aptName = searchParams.get("aptName") ?? "";

  if (!region || !district || !Number.isFinite(area) || area <= 0) {
    return NextResponse.json(
      { error: "region, district, area(전용면적) 쿼리 파라미터가 필요해요." },
      { status: 400 }
    );
  }

  const districtInfo = findDistrict(region, district);
  if (!districtInfo) {
    return NextResponse.json({ error: "알 수 없는 지역이에요." }, { status: 400 });
  }

  try {
    const result = await getEstimatedMarketPrice({
      sigunguCode: districtInfo.sigunguCode,
      area,
      aptName,
    });
    return NextResponse.json({
      districtLabel: districtInfo.label,
      ...result,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
