import { useState } from 'react';
import { LineChart, Plus, Trash2, Calculator, TrendingDown, TrendingUp } from 'lucide-react';
import './StockAverage.css';

interface Purchase {
  id: string;
  price: number;
  quantity: number;
  totalAmount: number;
}

const StockAverage = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: '1', price: 10000, quantity: 10, totalAmount: 100000 },
  ]);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [targetQuantity, setTargetQuantity] = useState<string>('');

  const addPurchase = () => {
    const price = parseFloat(newPrice);
    const quantity = parseFloat(newQuantity);

    if (price > 0 && quantity > 0) {
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        price,
        quantity,
        totalAmount: price * quantity,
      };

      setPurchases([...purchases, newPurchase]);
      setNewPrice('');
      setNewQuantity('');
    }
  };

  const removePurchase = (id: string) => {
    setPurchases(purchases.filter((p) => p.id !== id));
  };

  const calculateAverage = () => {
    if (purchases.length === 0) return { avgPrice: 0, totalQuantity: 0, totalAmount: 0 };

    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const avgPrice = totalAmount / totalQuantity;

    return { avgPrice, totalQuantity, totalAmount };
  };

  const calculateTargetAverage = () => {
    const current = calculateAverage();
    const targetPriceNum = parseFloat(targetPrice) || 0;
    const targetQtyNum = parseFloat(targetQuantity) || 0;

    if (targetPriceNum > 0 && targetQtyNum > 0) {
      const newTotalAmount = current.totalAmount + targetPriceNum * targetQtyNum;
      const newTotalQuantity = current.totalQuantity + targetQtyNum;
      const newAvgPrice = newTotalAmount / newTotalQuantity;

      return {
        newAvgPrice,
        newTotalQuantity,
        newTotalAmount,
        additionalInvestment: targetPriceNum * targetQtyNum,
      };
    }

    return null;
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

  const currentStats = calculateAverage();
  const targetStats = calculateTargetAverage();

  // 수익률 계산
  const lastPrice = purchases.length > 0 ? purchases[purchases.length - 1].price : 0;
  const profitRate =
    currentStats.avgPrice > 0
      ? ((lastPrice - currentStats.avgPrice) / currentStats.avgPrice) * 100
      : 0;

  return (
    <div className="stock-average">
      <div className="page-header">
        <LineChart size={32} className="page-icon" />
        <h1>주식 물타기 계산기</h1>
        <p>평균 매수가를 계산하고 추가 매수 전략을 세워보세요</p>
      </div>

      <div className="calculator-container">
        <div className="purchases-section glass">
          <h2>보유 내역</h2>

          <div className="purchase-list">
            <div className="purchase-header">
              <span>매수가</span>
              <span>수량</span>
              <span>금액</span>
              <span></span>
            </div>

            {purchases.map((purchase, index) => (
              <div key={purchase.id} className="purchase-item">
                <span>{formatCurrency(purchase.price)}</span>
                <span>{formatNumber(purchase.quantity)}주</span>
                <span>{formatCurrency(purchase.totalAmount)}</span>
                <button
                  className="remove-btn"
                  onClick={() => removePurchase(purchase.id)}
                  disabled={purchases.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="add-purchase">
            <input
              type="number"
              className="input"
              placeholder="매수가"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <input
              type="number"
              className="input"
              placeholder="수량"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addPurchase}>
              <Plus size={18} />
              추가
            </button>
          </div>
        </div>

        <div className="results-section">
          <div className="current-stats glass">
            <h2>현재 상태</h2>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">평균 매수가</span>
                <span className="stat-value primary">{formatCurrency(currentStats.avgPrice)}</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">총 수량</span>
                <span className="stat-value">{formatNumber(currentStats.totalQuantity)}주</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">총 투자금</span>
                <span className="stat-value">{formatCurrency(currentStats.totalAmount)}</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">수익률</span>
                <span className={`stat-value ${profitRate >= 0 ? 'success' : 'danger'}`}>
                  {profitRate >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {profitRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="target-calculator glass">
            <h2>추가 매수 시뮬레이션</h2>

            <div className="target-inputs">
              <div className="input-group">
                <label>추가 매수가 (원)</label>
                <input
                  type="number"
                  className="input"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="8000"
                />
              </div>

              <div className="input-group">
                <label>추가 수량 (주)</label>
                <input
                  type="number"
                  className="input"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  placeholder="20"
                />
              </div>
            </div>

            {targetStats && (
              <div className="target-results">
                <h3>예상 결과</h3>
                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">새 평균가</span>
                    <span className="result-value primary">
                      {formatCurrency(targetStats.newAvgPrice)}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">총 수량</span>
                    <span className="result-value">
                      {formatNumber(targetStats.newTotalQuantity)}주
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">추가 투자금</span>
                    <span className="result-value warning">
                      {formatCurrency(targetStats.additionalInvestment)}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">총 투자금</span>
                    <span className="result-value">
                      {formatCurrency(targetStats.newTotalAmount)}
                    </span>
                  </div>
                </div>

                <div className="average-change">
                  <span>평균가 변화</span>
                  <div className="change-bar">
                    <span className="before">{formatCurrency(currentStats.avgPrice)}</span>
                    <span className="arrow">→</span>
                    <span className="after">{formatCurrency(targetStats.newAvgPrice)}</span>
                  </div>
                  <span className="change-percent">
                    {(
                      ((targetStats.newAvgPrice - currentStats.avgPrice) / currentStats.avgPrice) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAverage;
