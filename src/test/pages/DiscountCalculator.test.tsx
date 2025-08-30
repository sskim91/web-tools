import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DiscountCalculator from '../../pages/DiscountCalculator';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DiscountCalculator 컴포넌트', () => {
  beforeEach(() => {
    renderWithRouter(<DiscountCalculator />);
  });

  describe('초기 렌더링', () => {
    it('제목이 올바르게 표시된다', () => {
      expect(screen.getByText('할인율 계산기')).toBeInTheDocument();
    });

    it('모든 입력 필드가 표시된다', () => {
      expect(screen.getByPlaceholderText('10000')).toBeInTheDocument(); // 원가
      expect(screen.getByPlaceholderText('20')).toBeInTheDocument(); // 할인율
    });
  });

  describe('단일 할인 계산', () => {
    it('할인율 입력시 할인가격을 계산한다', async () => {
      const priceInput = screen.getByPlaceholderText('10000') as HTMLInputElement;
      const discountInput = screen.getByPlaceholderText('20') as HTMLInputElement;

      fireEvent.change(priceInput, { target: { value: '10000' } });
      fireEvent.change(discountInput, { target: { value: '20' } });

      await waitFor(() => {
        expect(screen.getByText('₩8,000')).toBeInTheDocument(); // 할인가
        expect(screen.getByText('₩2,000')).toBeInTheDocument(); // 절약 금액
      });
    });

    it('100% 할인시 0원이 된다', async () => {
      const priceInput = screen.getByPlaceholderText('10000') as HTMLInputElement;
      const discountInput = screen.getByPlaceholderText('20') as HTMLInputElement;

      fireEvent.change(priceInput, { target: { value: '10000' } });
      fireEvent.change(discountInput, { target: { value: '100' } });

      await waitFor(() => {
        expect(screen.getByText('₩0')).toBeInTheDocument();
      });
    });

    it('음수 입력시 0으로 처리된다', async () => {
      const priceInput = screen.getByPlaceholderText('10000') as HTMLInputElement;

      fireEvent.change(priceInput, { target: { value: '-1000' } });

      await waitFor(() => {
        expect(screen.getByText('₩0')).toBeInTheDocument();
      });
    });
  });

  describe('다중 할인 계산', () => {
    it('할인 추가 버튼이 존재한다', () => {
      expect(screen.getByText('할인 추가')).toBeInTheDocument();
    });

    it('할인을 추가하면 새 입력 필드가 나타난다', async () => {
      const addButton = screen.getByText('할인 추가');

      fireEvent.click(addButton);

      await waitFor(() => {
        const discountInputs = screen.getAllByPlaceholderText(/할인율/);
        expect(discountInputs.length).toBeGreaterThan(1);
      });
    });

    it('다중 할인이 순차적으로 적용된다', async () => {
      const priceInput = screen.getByPlaceholderText('10000') as HTMLInputElement;
      const firstDiscount = screen.getByPlaceholderText('20') as HTMLInputElement;

      fireEvent.change(priceInput, { target: { value: '10000' } });
      fireEvent.change(firstDiscount, { target: { value: '20' } });

      // 두 번째 할인 추가
      const addButton = screen.getByText('할인 추가');
      fireEvent.click(addButton);

      await waitFor(() => {
        const discountInputs = screen.getAllByPlaceholderText(/할인율/) as HTMLInputElement[];
        fireEvent.change(discountInputs[1], { target: { value: '10' } });
      });

      // 10000 -> 8000 (20% off) -> 7200 (10% off)
      await waitFor(() => {
        expect(screen.getByText('₩7,200')).toBeInTheDocument();
      });
    });
  });

  describe('실제 할인율 계산', () => {
    it('원가와 할인가로 실제 할인율을 계산한다', () => {
      // 역계산 섹션이 있는지 확인
      expect(screen.getByText(/실제 할인율 계산/)).toBeInTheDocument();
    });

    it('할인가 입력시 실제 할인율을 표시한다', async () => {
      // 역계산 섹션의 입력 필드들
      const originalInput = screen.getByTestId('reverse-original') as HTMLInputElement;
      const finalInput = screen.getByTestId('reverse-final') as HTMLInputElement;

      fireEvent.change(originalInput, { target: { value: '10000' } });
      fireEvent.change(finalInput, { target: { value: '7000' } });

      await waitFor(() => {
        expect(screen.getByText('30%')).toBeInTheDocument();
      });
    });
  });
});
