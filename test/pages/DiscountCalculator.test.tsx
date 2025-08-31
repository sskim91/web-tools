import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DiscountCalculatorPage from '../../src/app/discount-calculator/page';

describe('DiscountCalculator 컴포넌트', () => {
  beforeEach(() => {
    render(<DiscountCalculatorPage />);
  });

  describe('초기 렌더링', () => {
    it('제목이 올바르게 표시된다', () => {
      expect(screen.getByText('할인율 계산기')).toBeInTheDocument();
    });

    it('모든 입력 필드가 표시된다', () => {
      // 단일 할인 섹션
      expect(screen.getAllByText('원가')[0]).toBeInTheDocument();
      expect(screen.getByText('할인율 (%)')).toBeInTheDocument();

      // 다중 할인 섹션
      expect(screen.getByText('다중 할인 계산')).toBeInTheDocument();

      // 실제 할인율 계산 섹션
      expect(screen.getByText('실제 할인율 계산')).toBeInTheDocument();
    });

    it('초기값이 올바르게 설정되어 있다', () => {
      const priceInputs = screen.getAllByPlaceholderText('10000');
      expect(priceInputs[0]).toHaveValue(10000);

      const rateInputs = screen.getAllByPlaceholderText('20');
      expect(rateInputs[0]).toHaveValue(20);
    });
  });

  describe('단일 할인 계산', () => {
    it('원가와 할인율 입력시 할인가가 계산된다', async () => {
      const priceInput = screen.getAllByPlaceholderText('10000')[0];
      const rateInput = screen.getAllByPlaceholderText('20')[0];

      fireEvent.change(priceInput, { target: { value: '50000' } });
      fireEvent.change(rateInput, { target: { value: '30' } });

      await waitFor(() => {
        // 50000원의 30% 할인 = 35000원
        const results = screen.getAllByText('할인가');
        expect(results[0]).toBeInTheDocument();
        const result = results[0].nextElementSibling;
        expect(result?.textContent).toContain('35');
      });
    });

    it('할인율 0%일 때 할인가는 원가와 동일하다', async () => {
      const priceInput = screen.getAllByPlaceholderText('10000')[0];
      const rateInput = screen.getAllByPlaceholderText('20')[0];

      fireEvent.change(priceInput, { target: { value: '10000' } });
      fireEvent.change(rateInput, { target: { value: '0' } });

      await waitFor(() => {
        const results = screen.getAllByText('할인가');
        const result = results[0].nextElementSibling;
        expect(result?.textContent).toContain('10');
      });
    });

    it('할인율 100%일 때 할인가는 0원이다', async () => {
      const rateInput = screen.getAllByPlaceholderText('20')[0];
      fireEvent.change(rateInput, { target: { value: '100' } });

      await waitFor(() => {
        const results = screen.getAllByText('할인가');
        const result = results[0].nextElementSibling;
        expect(result?.textContent).toContain('0');
      });
    });
  });

  describe('다중 할인 계산', () => {
    it('할인 추가 버튼 클릭시 새 할인 입력 필드가 추가된다', () => {
      const addButton = screen.getByText('할인 추가');

      const initialDiscounts = screen.getAllByText('1차');
      expect(initialDiscounts).toHaveLength(1);

      fireEvent.click(addButton);

      const updatedDiscounts = screen.getAllByText(/^\d차$/);
      expect(updatedDiscounts).toHaveLength(2);
    });

    it('다중 할인이 순차적으로 적용된다', async () => {
      // 10000원에 20% 할인 = 8000원
      // 8000원에 추가 10% 할인 = 7200원
      const addButton = screen.getByText('할인 추가');
      fireEvent.click(addButton);

      const discountInputs = screen.getAllByPlaceholderText(/할인율/);
      fireEvent.change(discountInputs[1], { target: { value: '10' } });

      await waitFor(() => {
        const finalPrice = screen.getByText('최종 가격').nextElementSibling;
        expect(finalPrice?.textContent).toContain('7,200');
      });
    });

    it('할인 제거 버튼 클릭시 할인이 제거된다', () => {
      const addButton = screen.getByText('할인 추가');
      fireEvent.click(addButton);
      fireEvent.click(addButton); // 총 3개로 만들기

      let removeButtons = screen.getAllByLabelText('할인 제거');
      expect(removeButtons).toHaveLength(3); // 할인이 3개일 때 모두 제거 버튼 표시

      fireEvent.click(removeButtons[0]);

      const updatedDiscounts = screen.getAllByText(/^\d차$/);
      expect(updatedDiscounts).toHaveLength(2); // 하나 제거 후 2개 남음
    });
  });

  describe('실제 할인율 계산', () => {
    it('원가와 할인가 입력시 실제 할인율이 계산된다', async () => {
      const originalInput = screen.getByTestId('reverse-original');
      const finalInput = screen.getByTestId('reverse-final');

      fireEvent.change(originalInput, { target: { value: '10000' } });
      fireEvent.change(finalInput, { target: { value: '7000' } });

      await waitFor(() => {
        // 10000원 → 7000원 = 30% 할인
        expect(screen.getAllByText('실제 할인율')[1]).toBeInTheDocument();
        const rateElement = screen.getAllByText('실제 할인율')[1].nextElementSibling;
        expect(rateElement?.textContent).toContain('30%');
      });
    });

    it('할인가가 원가보다 크면 음수 할인율(인상)이 표시된다', async () => {
      const originalInput = screen.getByTestId('reverse-original');
      const finalInput = screen.getByTestId('reverse-final');

      fireEvent.change(originalInput, { target: { value: '10000' } });
      fireEvent.change(finalInput, { target: { value: '12000' } });

      await waitFor(() => {
        const rateElement = screen.getAllByText('실제 할인율')[1].nextElementSibling;
        expect(rateElement?.textContent).toContain('-20%');
      });
    });
  });
});
