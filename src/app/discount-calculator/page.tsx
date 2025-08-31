'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, X, Calculator } from 'lucide-react';
import {
  calculateDiscount,
  calculateMultipleDiscounts,
  calculateActualDiscountRate,
} from '@/src/utils/calculations';
import '@/src/styles/pages/DiscountCalculator.css';

export default function DiscountCalculatorPage() {
  // 단일 할인 계산
  const [originalPrice, setOriginalPrice] = useState<string>('10000');
  const [discountRate, setDiscountRate] = useState<string>('20');

  // 다중 할인 계산
  const [multipleDiscounts, setMultipleDiscounts] = useState<string[]>(['20']);

  // 역계산 (실제 할인율)
  const [reverseOriginal, setReverseOriginal] = useState<string>('');
  const [reverseFinal, setReverseFinal] = useState<string>('');

  // 계산 결과
  const [singleResult, setSingleResult] = useState(0);
  const [multipleResult, setMultipleResult] = useState(0);
  const [actualRate, setActualRate] = useState(0);

  // 단일 할인 계산
  useEffect(() => {
    const price = parseFloat(originalPrice) || 0;
    const rate = parseFloat(discountRate) || 0;

    const result = calculateDiscount({ originalPrice: price, discountRate: rate });
    setSingleResult(result);
  }, [originalPrice, discountRate]);

  // 다중 할인 계산
  useEffect(() => {
    const price = parseFloat(originalPrice) || 0;
    const discounts = multipleDiscounts.map((d) => parseFloat(d) || 0);

    const result = calculateMultipleDiscounts({ originalPrice: price, discounts });
    setMultipleResult(result);
  }, [originalPrice, multipleDiscounts]);

  // 실제 할인율 계산
  useEffect(() => {
    const original = parseFloat(reverseOriginal) || 0;
    const final = parseFloat(reverseFinal) || 0;

    const rate = calculateActualDiscountRate(original, final);
    setActualRate(rate);
  }, [reverseOriginal, reverseFinal]);

  const addDiscount = () => {
    setMultipleDiscounts([...multipleDiscounts, '']);
  };

  const removeDiscount = (index: number) => {
    setMultipleDiscounts(multipleDiscounts.filter((_, i) => i !== index));
  };

  const updateDiscount = (index: number, value: string) => {
    const updated = [...multipleDiscounts];
    updated[index] = value;
    setMultipleDiscounts(updated);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="discount-calculator">
      <div className="page-header">
        <Tag size={32} className="page-icon" />
        <h1>할인율 계산기</h1>
        <p>할인 가격을 쉽게 계산하세요</p>
      </div>

      <div className="calculator-container">
        {/* 단일 할인 계산 */}
        <div className="section glass">
          <h2>단일 할인 계산</h2>

          <div className="input-group">
            <label>원가</label>
            <input
              type="number"
              className="input"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="input-group">
            <label>할인율 (%)</label>
            <input
              type="number"
              className="input"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="20"
              min="0"
              max="100"
            />
          </div>

          <div className="result-box">
            <div className="result-item">
              <span className="label">할인가</span>
              <span className="value primary">{formatCurrency(singleResult)}</span>
            </div>
            <div className="result-item">
              <span className="label">절약 금액</span>
              <span className="value success">
                {formatCurrency((parseFloat(originalPrice) || 0) - singleResult)}
              </span>
            </div>
          </div>
        </div>

        {/* 다중 할인 계산 */}
        <div className="section glass">
          <h2>다중 할인 계산</h2>
          <p className="section-desc">여러 할인을 순차적으로 적용합니다</p>

          <div className="input-group">
            <label>원가</label>
            <span className="input-display">{formatCurrency(parseFloat(originalPrice) || 0)}</span>
          </div>

          <div className="discounts-list">
            {multipleDiscounts.map((discount, index) => (
              <div key={index} className="discount-item">
                <span className="discount-number">{index + 1}차</span>
                <input
                  type="number"
                  className="input"
                  value={discount}
                  onChange={(e) => updateDiscount(index, e.target.value)}
                  placeholder={`할인율 ${index + 1}`}
                  min="0"
                  max="100"
                />
                <span className="percent">%</span>
                {multipleDiscounts.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeDiscount(index)}
                    aria-label="할인 제거"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="add-btn" onClick={addDiscount}>
            <Plus size={16} />
            할인 추가
          </button>

          <div className="result-box">
            <div className="result-item">
              <span className="label">최종 가격</span>
              <span className="value primary">{formatCurrency(multipleResult)}</span>
            </div>
            <div className="result-item">
              <span className="label">총 절약</span>
              <span className="value success">
                {formatCurrency((parseFloat(originalPrice) || 0) - multipleResult)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">실제 할인율</span>
              <span className="value">
                {calculateActualDiscountRate(parseFloat(originalPrice) || 0, multipleResult)}%
              </span>
            </div>
          </div>
        </div>

        {/* 실제 할인율 계산 */}
        <div className="section glass">
          <h2>
            <Calculator size={20} />
            실제 할인율 계산
          </h2>
          <p className="section-desc">원가와 할인가로 할인율을 역계산합니다</p>

          <div className="input-group">
            <label>원가</label>
            <input
              type="number"
              className="input"
              value={reverseOriginal}
              onChange={(e) => setReverseOriginal(e.target.value)}
              placeholder="10000"
              data-testid="reverse-original"
            />
          </div>

          <div className="input-group">
            <label>할인가</label>
            <input
              type="number"
              className="input"
              value={reverseFinal}
              onChange={(e) => setReverseFinal(e.target.value)}
              placeholder="7000"
              data-testid="reverse-final"
            />
          </div>

          {reverseOriginal && reverseFinal && (
            <div className="result-box">
              <div className="result-item large">
                <span className="label">실제 할인율</span>
                <span className="value primary">{actualRate}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
