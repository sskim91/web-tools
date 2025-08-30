/**
 * 복리 계산 관련 유틸리티 함수들
 */

export interface CompoundInterestParams {
  principal: number; // 초기 투자금
  rate: number; // 연 이율 (%)
  years: number; // 투자 기간 (년)
  monthlyDeposit: number; // 월 적립금
  compound?: number; // 복리 횟수 (기본값: 12 - 월복리)
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  amount: number;
  invested: number;
  interest: number;
}

/**
 * 복리 계산 함수
 * @param params 계산에 필요한 매개변수
 * @returns 계산 결과
 */
export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
  const { principal, rate, years, monthlyDeposit, compound = 12 } = params;

  // 음수 방지
  const P = Math.max(0, principal);
  const r = Math.max(0, rate) / 100;
  const t = Math.max(0, years);
  const n = Math.max(1, compound);
  const PMT = Math.max(0, monthlyDeposit);

  const yearlyBreakdown: YearlyBreakdown[] = [];
  let currentAmount = P;
  let totalInvested = P;
  const monthlyRate = r / n;
  const totalPeriods = t * n;
  const periodsPerYear = n;

  for (let period = 1; period <= totalPeriods; period++) {
    currentAmount *= 1 + monthlyRate;

    // 월 적립금 추가 (매월 복리 기준)
    if (PMT > 0 && n === 12) {
      currentAmount += PMT;
      totalInvested += PMT;
    }

    // 연간 내역 기록
    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      const yearInterest = currentAmount - totalInvested;
      yearlyBreakdown.push({
        year,
        amount: Math.round(currentAmount),
        invested: Math.round(totalInvested),
        interest: Math.round(yearInterest),
      });
    }
  }

  // 월 적립금이 있지만 연 복리(n!=12)인 경우 별도 계산
  if (PMT > 0 && n !== 12) {
    // 참고: 월 적립금은 월 복리(n=12) 계산에 최적화되어 있습니다.
    // 연 복리 등 다른 복리 주기에서의 월 적립금 계산은 더 복잡한 모델이 필요할 수 있습니다.
    // 여기서는 연말에 1년치 적립금이 추가되고 연 복리가 적용되는 것으로 가정합니다.
    currentAmount = P;
    totalInvested = P;
    yearlyBreakdown.length = 0; // Reset breakdown

    for (let year = 1; year <= t; year++) {
      const yearlyDeposit = PMT * 12;
      totalInvested += yearlyDeposit;
      currentAmount += yearlyDeposit;
      currentAmount *= 1 + r; // 연 복리 적용

      const yearInterest = currentAmount - totalInvested;
      yearlyBreakdown.push({
        year,
        amount: Math.round(currentAmount),
        invested: Math.round(totalInvested),
        interest: Math.round(yearInterest),
      });
    }
  }

  const finalAmount = Math.round(currentAmount);
  const totalInterest = finalAmount - totalInvested;

  return {
    finalAmount,
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(totalInterest),
    yearlyBreakdown,
  };
}

/**
 * 할인 계산 관련 함수들
 */

export interface DiscountParams {
  originalPrice: number;
  discountRate: number;
}

export interface MultipleDiscountParams {
  originalPrice: number;
  discounts: number[]; // 여러 할인율 배열
}

/**
 * 단순 할인 계산
 */
export function calculateDiscount(params: DiscountParams): number {
  const { originalPrice, discountRate } = params;
  const price = Math.max(0, originalPrice);
  const rate = Math.max(0, Math.min(100, discountRate)); // 0-100% 제한

  return Math.round(price * (1 - rate / 100));
}

/**
 * 다중 할인 계산 (순차 적용)
 */
export function calculateMultipleDiscounts(params: MultipleDiscountParams): number {
  const { originalPrice, discounts } = params;
  let price = Math.max(0, originalPrice);

  for (const discount of discounts) {
    const rate = Math.max(0, Math.min(100, discount));
    price = price * (1 - rate / 100);
  }

  return Math.round(price);
}

/**
 * 실제 할인율 계산
 */
export function calculateActualDiscountRate(originalPrice: number, finalPrice: number): number {
  if (originalPrice <= 0) return 0;
  const rate = ((originalPrice - finalPrice) / originalPrice) * 100;
  return Math.round(rate * 100) / 100; // 소수점 2자리
}
