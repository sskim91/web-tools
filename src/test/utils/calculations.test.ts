import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateDiscount,
  calculateMultipleDiscounts,
  calculateActualDiscountRate,
} from '../../utils/calculations';

describe('복리 계산 함수', () => {
  describe('calculateCompoundInterest', () => {
    it('월 적립금 없이 단순 복리 계산', () => {
      const result = calculateCompoundInterest({
        principal: 1000000,
        rate: 5,
        years: 10,
        monthlyDeposit: 0,
      });

      // 100만원, 5%, 10년 = 약 162만원
      expect(result.finalAmount).toBeGreaterThan(1600000);
      expect(result.finalAmount).toBeLessThan(1700000);
      expect(result.totalInvested).toBe(1000000);
      expect(result.totalInterest).toBe(result.finalAmount - 1000000);
    });

    it('월 적립금 포함 복리 계산', () => {
      const result = calculateCompoundInterest({
        principal: 1000000,
        rate: 5,
        years: 1,
        monthlyDeposit: 100000,
      });

      // 초기 100만원 + 월 10만원 × 12개월 = 220만원 투자
      expect(result.totalInvested).toBe(2200000);
      expect(result.finalAmount).toBeGreaterThan(2200000); // 이자 포함
      expect(result.yearlyBreakdown).toHaveLength(1);
    });

    it('음수 입력시 0으로 처리', () => {
      const result = calculateCompoundInterest({
        principal: -1000000,
        rate: 5,
        years: 10,
        monthlyDeposit: 0,
      });

      expect(result.finalAmount).toBe(0);
      expect(result.totalInvested).toBe(0);
      expect(result.totalInterest).toBe(0);
    });

    it('0% 이율 처리', () => {
      const result = calculateCompoundInterest({
        principal: 1000000,
        rate: 0,
        years: 10,
        monthlyDeposit: 0,
      });

      expect(result.finalAmount).toBe(1000000);
      expect(result.totalInterest).toBe(0);
    });

    it('연도별 상세 내역 생성', () => {
      const result = calculateCompoundInterest({
        principal: 1000000,
        rate: 5,
        years: 3,
        monthlyDeposit: 0,
      });

      expect(result.yearlyBreakdown).toHaveLength(3);
      expect(result.yearlyBreakdown[0].year).toBe(1);
      expect(result.yearlyBreakdown[1].year).toBe(2);
      expect(result.yearlyBreakdown[2].year).toBe(3);

      // 매년 금액이 증가해야 함
      expect(result.yearlyBreakdown[1].amount).toBeGreaterThan(result.yearlyBreakdown[0].amount);
      expect(result.yearlyBreakdown[2].amount).toBeGreaterThan(result.yearlyBreakdown[1].amount);
    });
  });
});

describe('할인 계산 함수', () => {
  describe('calculateDiscount', () => {
    it('정상적인 할인 계산', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        discountRate: 20,
      });

      expect(result).toBe(8000);
    });

    it('100% 할인시 0원', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        discountRate: 100,
      });

      expect(result).toBe(0);
    });

    it('0% 할인시 원가 그대로', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        discountRate: 0,
      });

      expect(result).toBe(10000);
    });

    it('음수 가격은 0으로 처리', () => {
      const result = calculateDiscount({
        originalPrice: -10000,
        discountRate: 20,
      });

      expect(result).toBe(0);
    });

    it('100% 초과 할인율은 100%로 제한', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        discountRate: 150,
      });

      expect(result).toBe(0); // 100% 할인과 동일
    });
  });

  describe('calculateMultipleDiscounts', () => {
    it('다중 할인 순차 적용', () => {
      const result = calculateMultipleDiscounts({
        originalPrice: 10000,
        discounts: [20, 10], // 20% 할인 후 10% 추가 할인
      });

      // 10000 -> 8000 (20% off) -> 7200 (10% off)
      expect(result).toBe(7200);
    });

    it('빈 할인 배열시 원가 반환', () => {
      const result = calculateMultipleDiscounts({
        originalPrice: 10000,
        discounts: [],
      });

      expect(result).toBe(10000);
    });

    it('세 개 이상의 할인 적용', () => {
      const result = calculateMultipleDiscounts({
        originalPrice: 10000,
        discounts: [10, 10, 10], // 10% 할인 3번
      });

      // 10000 -> 9000 -> 8100 -> 7290
      expect(result).toBe(7290);
    });
  });

  describe('calculateActualDiscountRate', () => {
    it('실제 할인율 계산', () => {
      const rate = calculateActualDiscountRate(10000, 8000);
      expect(rate).toBe(20); // 20% 할인
    });

    it('할인 없을 때 0%', () => {
      const rate = calculateActualDiscountRate(10000, 10000);
      expect(rate).toBe(0);
    });

    it('전액 할인시 100%', () => {
      const rate = calculateActualDiscountRate(10000, 0);
      expect(rate).toBe(100);
    });

    it('원가가 0일 때 0% 반환', () => {
      const rate = calculateActualDiscountRate(0, 0);
      expect(rate).toBe(0);
    });

    it('소수점 2자리까지 반올림', () => {
      const rate = calculateActualDiscountRate(10000, 6666);
      expect(rate).toBe(33.34); // 33.34%
    });
  });
});
