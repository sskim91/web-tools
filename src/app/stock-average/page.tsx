'use client';

import { useState, useMemo, useCallback } from 'react';
import { LineChart, Plus, X, TrendingDown, TrendingUp } from 'lucide-react';
import '@/src/styles/pages/StockAverage.css';

interface Purchase {
  id: number;
  price: number;
  quantity: number;
}

export default function StockAveragePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([{ id: 1, price: 50000, quantity: 10 }]);
  const [nextId, setNextId] = useState(2);
  const [currentPrice, setCurrentPrice] = useState<number | ''>(45000);
  const [additionalQuantity, setAdditionalQuantity] = useState<number | ''>(10);

  const averageInfo = useMemo(() => {
    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount = purchases.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const averagePrice = totalQuantity > 0 ? totalAmount / totalQuantity : 0;
    const current = Number(currentPrice) || 0;
    const evaluationAmount = current * totalQuantity;
    const profitLoss = evaluationAmount - totalAmount;
    const profitLossRate = totalAmount > 0 ? (profitLoss / totalAmount) * 100 : 0;

    return {
      totalQuantity,
      totalAmount,
      averagePrice,
      evaluationAmount,
      profitLoss,
      profitLossRate,
    };
  }, [purchases, currentPrice]);

  const simulationResult = useMemo(() => {
    const current = Number(currentPrice) || 0;
    const additionalQty = Number(additionalQuantity) || 0;
    const additionalInvestment = current * additionalQty;

    const newTotalQuantity = averageInfo.totalQuantity + additionalQty;
    const newTotalAmount = averageInfo.totalAmount + additionalInvestment;
    const newAveragePrice = newTotalQuantity > 0 ? newTotalAmount / newTotalQuantity : 0;

    return {
      newAveragePrice,
      newTotalQuantity,
      newTotalAmount,
      additionalInvestment,
    };
  }, [currentPrice, additionalQuantity, averageInfo]);

  const addPurchase = useCallback(() => {
    setPurchases((prev) => [...prev, { id: nextId, price: 0, quantity: 0 }]);
    setNextId((prev) => prev + 1);
  }, [nextId]);

  const removePurchase = useCallback((id: number) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePurchase = useCallback((id: number, field: 'price' | 'quantity', value: string) => {
    const numericValue = value === '' ? 0 : Number(value);
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: numericValue } : p)));
  }, []);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
  };

  return (
    <div className="stock-average">
      <div className="page-header">
        <LineChart size={32} className="page-icon" />
        <h1>주식 물타기 계산기</h1>
        <p>평균 매수가를 계산하고 추가 매수를 시뮬레이션하세요</p>
      </div>

      <div className="calculator-container">
        <div className="purchase-section glass">
          <h2>매수 내역</h2>

          <div className="purchase-list">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-item">
                <div className="purchase-inputs">
                  <div className="input-group">
                    <label>매수가</label>
                    <input
                      type="number"
                      className="input"
                      value={purchase.price || ''}
                      onChange={(e) => updatePurchase(purchase.id, 'price', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div className="input-group">
                    <label>수량</label>
                    <input
                      type="number"
                      className="input"
                      value={purchase.quantity || ''}
                      onChange={(e) => updatePurchase(purchase.id, 'quantity', e.target.value)}
                      placeholder="10"
                    />
                  </div>
                  {purchases.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removePurchase(purchase.id)}
                      aria-label="삭제"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="purchase-summary">
                  투자금액: {formatCurrency(purchase.price * purchase.quantity)}
                </div>
              </div>
            ))}
          </div>

          <button className="add-btn" onClick={addPurchase}>
            <Plus size={18} />
            매수 추가
          </button>
        </div>

        <div className="result-section glass">
          <h2>평균 매수가 계산 결과</h2>

          <div className="result-grid">
            <div className="result-item">
              <span className="label">총 수량</span>
              <span className="value">{formatNumber(averageInfo.totalQuantity)}주</span>
            </div>
            <div className="result-item">
              <span className="label">총 투자금액</span>
              <span className="value">{formatCurrency(averageInfo.totalAmount)}</span>
            </div>
            <div className="result-item primary">
              <span className="label">평균 매수가</span>
              <span className="value">{formatCurrency(averageInfo.averagePrice)}</span>
            </div>
          </div>

          <div className="current-price-section">
            <h3>현재가 입력</h3>
            <input
              type="number"
              className="input"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="현재 주가"
            />

            {currentPrice && (
              <div className="evaluation-result">
                <div className="evaluation-item">
                  <span className="label">평가금액</span>
                  <span className="value">{formatCurrency(averageInfo.evaluationAmount)}</span>
                </div>
                <div
                  className={`evaluation-item ${averageInfo.profitLoss >= 0 ? 'profit' : 'loss'}`}
                >
                  <span className="label">평가손익</span>
                  <span className="value">
                    {averageInfo.profitLoss >= 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {formatCurrency(Math.abs(averageInfo.profitLoss))}
                  </span>
                </div>
                <div
                  className={`evaluation-item ${averageInfo.profitLossRate >= 0 ? 'profit' : 'loss'}`}
                >
                  <span className="label">수익률</span>
                  <span className="value">{averageInfo.profitLossRate.toFixed(2)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentPrice && (
          <div className="simulation-section glass">
            <h2>추가 매수 시뮬레이션</h2>

            <div className="simulation-inputs">
              <div className="input-group">
                <label>추가 매수 수량</label>
                <input
                  type="number"
                  className="input"
                  value={additionalQuantity}
                  onChange={(e) =>
                    setAdditionalQuantity(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="10"
                />
              </div>
            </div>

            <div className="simulation-result">
              <h3>시뮬레이션 결과</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">추가 투자금액</span>
                  <span className="value">
                    {formatCurrency(simulationResult.additionalInvestment)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">새로운 총 수량</span>
                  <span className="value">{formatNumber(simulationResult.newTotalQuantity)}주</span>
                </div>
                <div className="result-item">
                  <span className="label">새로운 총 투자금액</span>
                  <span className="value">{formatCurrency(simulationResult.newTotalAmount)}</span>
                </div>
                <div className="result-item primary">
                  <span className="label">새로운 평균 매수가</span>
                  <span className="value">{formatCurrency(simulationResult.newAveragePrice)}</span>
                </div>
              </div>

              <div className="price-change">
                평균가 변화: {formatCurrency(averageInfo.averagePrice)} →{' '}
                {formatCurrency(simulationResult.newAveragePrice)}
                <span
                  className={
                    simulationResult.newAveragePrice < averageInfo.averagePrice
                      ? 'decrease'
                      : 'increase'
                  }
                >
                  ({simulationResult.newAveragePrice < averageInfo.averagePrice ? '↓' : '↑'}
                  {formatCurrency(
                    Math.abs(simulationResult.newAveragePrice - averageInfo.averagePrice),
                  )}
                  )
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
