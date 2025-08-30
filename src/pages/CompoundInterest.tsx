import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import './CompoundInterest.css';

const CompoundInterest = () => {
  const [principal, setPrincipal] = useState<string>('1000000');
  const [rate, setRate] = useState<string>('5');
  const [years, setYears] = useState<string>('10');
  const [compound, setCompound] = useState<string>('12');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('100000');

  const [result, setResult] = useState({
    finalAmount: 0,
    totalInvested: 0,
    totalInterest: 0,
    yearlyBreakdown: [] as Array<{
      year: number;
      amount: number;
      invested: number;
      interest: number;
    }>,
  });

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, rate, years, compound, monthlyDeposit]);

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compound) || 1;
    const PMT = parseFloat(monthlyDeposit) || 0;

    const yearlyBreakdown = [];
    let currentAmount = P;
    let totalInvested = P;

    for (let year = 1; year <= t; year++) {
      // 복리 계산 (연 복리)
      currentAmount = currentAmount * Math.pow(1 + r / n, n);

      // 월 적립금 추가
      if (PMT > 0) {
        const monthlyRate = r / 12;
        for (let month = 1; month <= 12; month++) {
          currentAmount += PMT;
          currentAmount *= 1 + monthlyRate;
          totalInvested += PMT;
        }
      }

      const interest = currentAmount - totalInvested;

      yearlyBreakdown.push({
        year,
        amount: Math.round(currentAmount),
        invested: Math.round(totalInvested),
        interest: Math.round(interest),
      });
    }

    setResult({
      finalAmount: Math.round(currentAmount),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(currentAmount - totalInvested),
      yearlyBreakdown,
    });
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(num);
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
            <label>
              <DollarSign size={18} />
              초기 투자금 (원)
            </label>
            <input
              type="number"
              className="input"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="1000000"
            />
          </div>

          <div className="input-group">
            <label>
              <Percent size={18} />연 수익률 (%)
            </label>
            <input
              type="number"
              className="input"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5"
              step="0.1"
            />
          </div>

          <div className="input-group">
            <label>
              <Calendar size={18} />
              투자 기간 (년)
            </label>
            <input
              type="number"
              className="input"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
            />
          </div>

          <div className="input-group">
            <label>
              <DollarSign size={18} />월 적립금 (원)
            </label>
            <input
              type="number"
              className="input"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value)}
              placeholder="100000"
            />
          </div>
        </div>

        <div className="result-section">
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
                <span className="result-value success">{formatCurrency(result.totalInterest)}</span>
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
        </div>
      </div>
    </div>
  );
};

export default CompoundInterest;
