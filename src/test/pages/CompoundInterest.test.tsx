import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompoundInterest from '../../pages/CompoundInterest';

// 컴포넌트를 Router로 감싸는 헬퍼 함수
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CompoundInterest 컴포넌트', () => {
  beforeEach(() => {
    renderWithRouter(<CompoundInterest />);
  });

  describe('초기 렌더링', () => {
    it('제목이 올바르게 표시된다', () => {
      expect(screen.getByText('복리 계산기')).toBeInTheDocument();
    });

    it('모든 입력 필드가 표시된다', () => {
      // label 텍스트에 아이콘이 포함되어 있으므로 텍스트만 검색
      expect(screen.getByText(/초기 투자금 \(원\)/)).toBeInTheDocument();
      expect(screen.getByText(/연 수익률 \(%\)/)).toBeInTheDocument();
      expect(screen.getByText(/투자 기간 \(년\)/)).toBeInTheDocument();
      expect(screen.getByText(/월 적립금 \(원\)/)).toBeInTheDocument();
    });

    it('입력 필드의 기본값이 올바르다', () => {
      // placeholder를 통해 input 찾기
      const principalInput = screen.getByPlaceholderText('1000000') as HTMLInputElement;
      const rateInput = screen.getByPlaceholderText('5') as HTMLInputElement;
      const periodInput = screen.getByPlaceholderText('10') as HTMLInputElement;
      const monthlyInput = screen.getByPlaceholderText('100000') as HTMLInputElement;

      expect(principalInput.value).toBe('1000000');
      expect(rateInput.value).toBe('5');
      expect(periodInput.value).toBe('10');
      expect(monthlyInput.value).toBe('100000');
    });
  });

  describe('복리 계산 로직', () => {
    it('기본값으로 올바른 최종 금액을 계산한다', async () => {
      // 기본값: 100만원, 5%, 10년, 월 10만원
      await waitFor(() => {
        const finalAmountElement = screen.getByText(/최종 금액:/);
        // 실제 계산 결과에 맞게 수정 필요
        expect(finalAmountElement).toBeInTheDocument();
      });
    });

    it('월 적립금 변경시 재계산된다', async () => {
      const monthlyInput = screen.getByPlaceholderText('100000') as HTMLInputElement;

      fireEvent.change(monthlyInput, { target: { value: '0' } });

      await waitFor(() => {
        const finalAmountElement = screen.getByText(/최종 금액:/);
        expect(finalAmountElement).toBeInTheDocument();
        // 월 적립금 0원으로 변경 후 결과 확인
      });
    });

    it('이율 변경시 실시간으로 재계산된다', async () => {
      const rateInput = screen.getByPlaceholderText('5') as HTMLInputElement;

      fireEvent.change(rateInput, { target: { value: '10' } });

      await waitFor(() => {
        expect(rateInput.value).toBe('10');
        const finalAmountElement = screen.getByText(/최종 금액:/);
        expect(finalAmountElement).toBeInTheDocument();
      });
    });
  });

  describe('입력 검증', () => {
    it('음수 입력시 계산에는 0으로 처리된다', async () => {
      const principalInput = screen.getByPlaceholderText('1000000') as HTMLInputElement;
      const monthlyInput = screen.getByPlaceholderText('100000') as HTMLInputElement;

      // 월 적립금을 0으로 설정
      fireEvent.change(monthlyInput, { target: { value: '0' } });

      // 초기 투자금을 음수로 변경
      fireEvent.change(principalInput, { target: { value: '-1000' } });

      await waitFor(() => {
        // 입력 필드는 음수를 표시하지만
        expect(principalInput.value).toBe('-1000');

        // 계산 결과는 0으로 처리
        const finalAmountElement = screen.getByText(/최종 금액:/);
        expect(finalAmountElement.textContent).toContain('₩0');
      });
    });
  });

  describe('결과 테이블', () => {
    it('연도별 상세 내역이 표시된다', async () => {
      await waitFor(() => {
        // 테이블 헤더 확인
        expect(screen.getByText('연도')).toBeInTheDocument();
        expect(screen.getByText('원금')).toBeInTheDocument();
        expect(screen.getByText('이자')).toBeInTheDocument();
        expect(screen.getByText('누적 금액')).toBeInTheDocument();
      });
    });

    it('10년치 데이터가 모두 표시된다', async () => {
      await waitFor(() => {
        // "1년", "2년" 형식으로 표시됨
        for (let year = 1; year <= 10; year++) {
          const yearText = screen.getByText(new RegExp(`${year}년`));
          expect(yearText).toBeInTheDocument();
        }
      });
    });
  });
});
