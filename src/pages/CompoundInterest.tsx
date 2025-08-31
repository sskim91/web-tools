import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { calculateCompoundInterest as calculateCompound } from '../utils/calculations';
import useDebounce from '../hooks/useDebounce';
import './CompoundInterest.css';

const CompoundInterest = () => {
  const [principal, setPrincipal] = useState<number | ''>(1000000);
  const [rate, setRate] = useState<number | ''>(5);
  const [years, setYears] = useState<number | ''>(10);
  const [compound] = useState<number | ''>(12);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | ''>(100000);

  const debouncedPrincipal = useDebounce(principal, 500);
  const debouncedRate = useDebounce(rate, 500);
  const debouncedYears = useDebounce(years, 500);
  const debouncedCompound = useDebounce(compound, 500);
  const debouncedMonthlyDeposit = useDebounce(monthlyDeposit, 500);

  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    try {
      setError(null);
      return calculateCompound({
        principal: Number(debouncedPrincipal) || 0,
        rate: Number(debouncedRate) || 0,
        years: Number(debouncedYears) || 0,
        monthlyDeposit: Number(debouncedMonthlyDeposit) || 0,
        compound: Number(debouncedCompound) || 12,
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      return null;
    }
  }, [
    debouncedPrincipal,
    debouncedRate,
    debouncedYears,
    debouncedCompound,
    debouncedMonthlyDeposit,
  ]);

  const formatCurrency = useCallback((num: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(num);
  }, []);

  const handleNumericInputChange =
    (setter: React.Dispatch<React.SetStateAction<number | ''>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') {
        setter('');
      } else {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          setter(num);
        }
      }
    };

  return (
    <div className="compound-interest">
      <div className="page-header">
        <TrendingUp size={32} className="page-icon" />
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
              onChange={handleNumericInputChange(setPrincipal)}
              placeholder="1000000"
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
              onChange={handleNumericInputChange(setRate)}
              placeholder="5"
              step="0.1"
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
              onChange={handleNumericInputChange(setYears)}
              placeholder="10"
            />
          </div>

          <div className="input-group">
            <label htmlFor="monthlyDeposit">
              <DollarSign size={18} />월 적립금 (원)
            </label>
            <input
              id="monthlyDeposit"
              type="number"
              className="input"
              value={monthlyDeposit}
              onChange={handleNumericInputChange(setMonthlyDeposit)}
              placeholder="100000"
            />
          </div>
        </div>

        <div className="result-section">
          {error && <div className="error-message">{error}</div>}
          {result && (
            <>
              <div className="result-summary glass">
                <h2>계산 결과</h2>
                <div className="result-cards">
                  <div className="result-card">
                    <span className="result-label">최종 금액</span>
                    <span className="result-value primary">
                      {formatCurrency(result.finalAmount)}
                    </span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoundInterest;
