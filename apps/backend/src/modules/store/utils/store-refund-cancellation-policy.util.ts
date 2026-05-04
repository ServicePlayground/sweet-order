import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import {
  RefundCancellationPolicyDto,
  RefundRuleItemDto,
} from "@apps/backend/modules/store/dto/store-refund-cancellation-policy.dto";

const EMPTY_POLICY = (): RefundCancellationPolicyDto => ({
  rules: [{ daysBeforePickup: 0, refundDescription: "" }],
});

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseRuleItem(raw: unknown): RefundRuleItemDto | null {
  if (!isRecord(raw)) return null;
  const d = raw.daysBeforePickup;
  if (typeof d !== "number" || !Number.isInteger(d) || d < 0 || d > 999) return null;
  const refundDescription =
    typeof raw.refundDescription === "string" ? raw.refundDescription.trim() : "";
  return { daysBeforePickup: d, refundDescription };
}

function parseRulesArray(arr: unknown): RefundRuleItemDto[] | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const rules: RefundRuleItemDto[] = [];
  for (const item of arr) {
    const r = parseRuleItem(item);
    if (!r) return null;
    rules.push(r);
  }
  if (rules.length > 30) return null;
  return rules;
}

/**
 * DB JSON → API 응답용.
 * - 신규: `{ rules: [...] }`
 * - 이전 단일 객체: `{ daysBeforePickup, refundDescription }` → rules 1개로 승격
 */
export function refundCancellationPolicyFromDb(value: unknown): RefundCancellationPolicyDto {
  const fallback = EMPTY_POLICY;
  if (!isRecord(value)) return fallback();

  const fromRules = parseRulesArray(value.rules);
  if (fromRules) {
    return { rules: fromRules };
  }

  const d = value.daysBeforePickup;
  if (typeof d === "number" && Number.isInteger(d) && d >= 0 && d <= 999) {
    const refundDescription =
      typeof value.refundDescription === "string" ? value.refundDescription.trim() : "";
    return { rules: [{ daysBeforePickup: d, refundDescription }] };
  }

  return fallback();
}

export function assertRefundCancellationPolicyOrThrow(dto: RefundCancellationPolicyDto): void {
  const { rules } = dto;
  if (!Array.isArray(rules) || rules.length === 0 || rules.length > 30) {
    throw new BadRequestException("환불·취소 규칙은 1개 이상 30개 이하여야 합니다.");
  }
  for (let i = 0; i < rules.length; i++) {
    const r = rules[i];
    const d = r.daysBeforePickup;
    if (d === undefined || !Number.isInteger(d) || d < 0 || d > 999) {
      throw new BadRequestException(
        `${i + 1}번째 규칙: 픽업 며칠 전은 0~999 사이 정수로 입력해 주세요.`,
      );
    }
    const t = (r.refundDescription ?? "").trim();
    if (!t) {
      throw new BadRequestException(`${i + 1}번째 규칙: 환불·취소 조건은 빈 값일 수 없습니다.`);
    }
    if (t.length > 500) {
      throw new BadRequestException(`${i + 1}번째 규칙: 환불·취소 조건은 500자 이하여야 합니다.`);
    }
  }
}

export function sanitizeRefundCancellationPolicyForDb(
  dto: RefundCancellationPolicyDto,
): Prisma.InputJsonValue {
  assertRefundCancellationPolicyOrThrow(dto);
  const rules = dto.rules.map((r) => ({
    daysBeforePickup: r.daysBeforePickup,
    refundDescription: r.refundDescription.trim(),
  }));
  return { rules } as Prisma.InputJsonValue;
}
