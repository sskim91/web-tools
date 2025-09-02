'use client';

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { calculateCompoundInterest as calculateCompound } from '@/src/utils/calculations';
import useDebounce from '@/src/hooks/useDebounce';
import '@/src/styles/pages/CompoundInterest.css';

type YearlyBreakdown = {
  year: number;
  amount: number;
  invested: number;
  interest: number;
};

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100000);

  const debouncedPrincipal = useDebounce(principal, 300);
  const debouncedRate = useDebounce(rate, 300);
  const debouncedYears = useDebounce(years, 300);
  const debouncedMonthlyDeposit = useDebounce(monthlyDeposit, 300);

  const result = useMemo(() => {
    const principalNum = Number(debouncedPrincipal) || 0;
    const rateNum = Number(debouncedRate) || 0;
    const yearsNum = Number(debouncedYears) || 0;
    const monthlyNum = Number(debouncedMonthlyDeposit) || 0;

    if (yearsNum <= 0) {
      return {
        finalAmount: 0,
        totalInvested: 0,
        totalInterest: 0,
        yearlyBreakdown: [] as YearlyBreakdown[],
      };
    }

    return calculateCompound({
      principal: principalNum,
      rate: rateNum,
      years: yearsNum,
      monthlyDeposit: monthlyNum,
    });
  }, [debouncedPrincipal, debouncedRate, debouncedYears, debouncedMonthlyDeposit]);

  const formatCurrency = useCallback((num: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(num);
  }, []);

  const handleNumberChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
          setter(0);
        } else {
          const num = parseFloat(value);
          if (!isNaN(num) && num >= 0) {
            setter(num);
          }
        }
      },
    [],
  );

  return (
    <div className="compound-interest">
      <div className="page-header">
        <TrendingUp size={32} className="page-icon" aria-hidden="true" />
        <h1>복리 계산기</h1>
        <p>복리의 마법을 경험해보세요</p>
      </div>

      <div className="calculator-container">
        <div className="input-section glass">
          <h2>입력값</h2>

          <div className="input-group">
            <label htmlFor="principal">
              <DollarSign size={18} />
              초기 투자금 (원)
            </label>
            <input
              id="principal"
              type="number"
              className="input"
              value={principal}
              onChange={handleNumberChange(setPrincipal)}
              placeholder="1000000"
              min="0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="rate">
              <Percent size={18} />연 수익률 (%)
            </label>
            <input
              id="rate"
              type="number"
              className="input"
              value={rate}
              onChange={handleNumberChange(setRate)}
              placeholder="5"
              step="0.1"
              min="0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="years">
              <Calendar size={18} />
              투자 기간 (년)
            </label>
            <input
              id="years"
              type="number"
              className="input"
              value={years}
              onChange={handleNumberChange(setYears)}
              placeholder="10"
              min="0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="monthly">
              <DollarSign size={18} />월 적립금 (원)
            </label>
            <input
              id="monthly"
              type="number"
              className="input"
              value={monthlyDeposit}
              onChange={handleNumberChange(setMonthlyDeposit)}
              placeholder="100000"
              min="0"
            />
          </div>
        </div>

        <div className="result-section">
          <>
            <div className="result-summary glass">
              <h2>계산 결과</h2>
              <div className="result-cards">
                <div className="result-card">
                  <span className="result-label">최종 금액</span>
                  <span className="result-value primary">{formatCurrency(result.finalAmount)}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">총 투자금</span>
                  <span className="result-value">{formatCurrency(result.totalInvested)}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">총 수익</span>
                  <span className="result-value success">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>
                <div className="result-card">
                  <span className="result-label">수익률</span>
                  <span className="result-value">
                    {result.totalInvested > 0
                      ? ((result.totalInterest / result.totalInvested) * 100).toFixed(2)
                      : '0.00'}
                    %
                  </span>
                </div>
              </div>
            </div>
            {result.yearlyBreakdown.length > 0 && (
              <div className="yearly-breakdown glass">
                <h3>연도별 상세 내역</h3>
                <div className="breakdown-table">
                  <div className="table-header">
                    <span>연차</span>
                    <span>투자금액</span>
                    <span>수익</span>
                    <span>총 금액</span>
                  </div>
                  {result.yearlyBreakdown.map((year) => (
                    <div key={year.year} className="table-row">
                      <span>{year.year}년</span>
                      <span>{formatCurrency(year.invested)}</span>
                      <span className="success">{formatCurrency(year.interest)}</span>
                      <span className="primary">{formatCurrency(year.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
