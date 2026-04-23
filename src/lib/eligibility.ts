// Pure eligibility scoring + repayment math for RovaCredit.
// All UGX. Tiers map to a down-payment percentage of asset_price.

export type EmploymentType =
  | "Salaried"
  | "Self-employed"
  | "Boda"
  | "Student"
  | "Farmer";

export type RepaymentCadence = "Daily" | "Weekly" | "Monthly";

export type IncomeBand =
  | "<150k"
  | "150k-300k"
  | "300k-600k"
  | "600k-1.5M"
  | ">1.5M";

export const INCOME_BANDS: { value: IncomeBand; label: string }[] = [
  { value: "<150k", label: "Under UGX 150,000" },
  { value: "150k-300k", label: "UGX 150,000 – 300,000" },
  { value: "300k-600k", label: "UGX 300,000 – 600,000" },
  { value: "600k-1.5M", label: "UGX 600,000 – 1,500,000" },
  { value: ">1.5M", label: "Over UGX 1,500,000" },
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Salaried",
  "Self-employed",
  "Boda",
  "Student",
  "Farmer",
];

export const CADENCES: RepaymentCadence[] = ["Daily", "Weekly", "Monthly"];

export type EligibilityTier = "A" | "B" | "C" | "D" | "E";

export interface EligibilityResult {
  tier: EligibilityTier;
  downPaymentPct: number; // 0.05 – 0.25
  score: number;
  label: string;
  description: string;
}

function incomeBand(b: IncomeBand): number {
  switch (b) {
    case ">1.5M": return 3;
    case "600k-1.5M": return 3;
    case "300k-600k": return 2;
    case "150k-300k": return 1;
    case "<150k": return 0;
  }
}

function employmentBand(e: EmploymentType): number {
  switch (e) {
    case "Salaried": return 2;
    case "Self-employed": return 2;
    case "Farmer": return 1;
    case "Boda": return 1;
    case "Student": return 0;
  }
}

function cadenceBand(c: RepaymentCadence): number {
  // More frequent = better collection signal
  return c === "Daily" ? 1 : c === "Weekly" ? 1 : 0;
}

export function computeEligibility(input: {
  income: IncomeBand;
  employment: EmploymentType;
  cadence: RepaymentCadence;
}): EligibilityResult {
  const score =
    incomeBand(input.income) +
    employmentBand(input.employment) +
    cadenceBand(input.cadence);

  if (score >= 5) return { tier: "A", downPaymentPct: 0.05, score, label: "Tier A — Excellent", description: "Lowest risk profile. Smallest deposit required." };
  if (score === 4) return { tier: "B", downPaymentPct: 0.10, score, label: "Tier B — Strong", description: "Strong profile with minimal deposit required." };
  if (score === 3) return { tier: "C", downPaymentPct: 0.15, score, label: "Tier C — Standard", description: "Standard terms with a moderate deposit." };
  if (score === 2) return { tier: "D", downPaymentPct: 0.20, score, label: "Tier D — Building", description: "Building credit profile — slightly higher deposit." };
  return { tier: "E", downPaymentPct: 0.25, score, label: "Tier E — Starter", description: "First-time borrower terms — higher deposit to begin." };
}

export interface RepaymentPlan {
  downPayment: number;
  financedAmount: number;
  totalRepayable: number;
  installmentAmount: number;
  installmentsCount: number;
  cadence: RepaymentCadence;
  termWeeks: number;
  feesPct: number;
}

export function buildRepaymentPlan(args: {
  assetPrice: number;
  downPaymentPct: number;
  cadence: RepaymentCadence;
  termWeeks?: number; // up to 52
  feesPct?: number;   // simple flat fee on financed amount
}): RepaymentPlan {
  const termWeeks = Math.min(Math.max(args.termWeeks ?? 52, 4), 52);
  const feesPct = args.feesPct ?? 0.18; // illustrative service fee
  const downPayment = Math.round(args.assetPrice * args.downPaymentPct);
  const financedAmount = Math.max(args.assetPrice - downPayment, 0);
  const totalRepayable = Math.round(financedAmount * (1 + feesPct));
  const installmentsCount =
    args.cadence === "Daily" ? termWeeks * 7 :
    args.cadence === "Weekly" ? termWeeks :
    Math.max(Math.round(termWeeks / 4), 1);
  const installmentAmount = installmentsCount > 0 ? Math.ceil(totalRepayable / installmentsCount) : totalRepayable;
  return {
    downPayment,
    financedAmount,
    totalRepayable,
    installmentAmount,
    installmentsCount,
    cadence: args.cadence,
    termWeeks,
    feesPct,
  };
}

export function leadRefFromId(id: string): string {
  return `RC-${id.slice(0, 4).toUpperCase()}`;
}
