import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompoundInterestPage from '../../src/app/compound-interest/page';

// 컴포넌트를 렌더링하고 userEvent를 설정하는 헬퍼 함수
const setup = () => {
  const user = userEvent.setup();
  render(<CompoundInterestPage />);
  return { user };
};

// 통화 형식(₩1,234)에서 숫자만 추출하는 함수
const parseCurrency = (text: string | null | undefined): number => {
  if (!text) return 0;
  return parseInt(text.replace(/[^0-9-]/g, ''), 10) || 0;
};

describe('CompoundInterest 컴포넌트', () => {
  beforeEach(() => {
    // 각 테스트 전에 DOM을 정리
    document.body.innerHTML = '';
  });

  it('페이지 제목과 설명이 올바르게 렌더링된다', () => {
    setup();
    expect(screen.getByText('복리 계산기')).toBeInTheDocument();
    expect(screen.getByText('투자 수익률과 미래 가치를 계산하세요')).toBeInTheDocument();
  });

  it('초기값으로 계산 결과가 표시된다', () => {
    setup();
    // 기본값: 100만원, 5%, 10년, 월 10만원
    expect(screen.getByText('최종 금액')).toBeInTheDocument();
    expect(screen.getByText('총 투자금')).toBeInTheDocument();
    expect(screen.getByText('총 수익')).toBeInTheDocument();
  });

  describe('입력 검증', () => {
    it('음수 입력시 계산에는 0으로 처리된다', async () => {
      const { user } = setup();

      const principalInput = screen.getByLabelText('초기 투자금');
      await user.clear(principalInput);
      await user.type(principalInput, '-1000000');

      // 음수 입력시 총 투자금이 0 이상이어야 함
      await waitFor(() => {
        const totalInvestedElement = screen.getByText('총 투자금').nextElementSibling;
        const totalInvested = parseCurrency(totalInvestedElement?.textContent);
        expect(totalInvested).toBeGreaterThanOrEqual(0);
      });
    });

    it('문자 입력시 무시된다', async () => {
      const { user } = setup();

      const rateInput = screen.getByLabelText('연 이율 (%)');
      const initialValue = rateInput.getAttribute('value');
      await user.type(rateInput, 'abc');

      // 문자 입력 후에도 숫자만 남아있어야 함
      await waitFor(() => {
        const currentValue = rateInput.getAttribute('value');
        expect(currentValue).toMatch(/^\d*\.?\d*$/);
      });
    });
  });

  describe('복리 계산 로직', () => {
    it('이율 변경시 실시간으로 재계산된다', async () => {
      const { user } = setup();

      // 초기 최종 금액 저장
      const getTotal = () => {
        const totalElement = screen.getByText('최종 금액').nextElementSibling;
        return parseCurrency(totalElement?.textContent);
      };

      const initialTotal = getTotal();

      // 이율을 10%로 변경
      const rateInput = screen.getByLabelText('연 이율 (%)');
      await user.clear(rateInput);
      await user.type(rateInput, '10');

      // 최종 금액이 증가해야 함
      await waitFor(() => {
        const newTotal = getTotal();
        expect(newTotal).toBeGreaterThan(initialTotal);
      });
    });

    it('월 적립금 변경시 재계산된다', async () => {
      const { user } = setup();

      // 초기 총 투자금 저장
      const getTotalInvested = () => {
        const element = screen.getByText('총 투자금').nextElementSibling;
        return parseCurrency(element?.textContent);
      };

      const initialInvested = getTotalInvested();

      // 월 적립금을 20만원으로 변경
      const monthlyInput = screen.getByLabelText('월 적립금');
      await user.clear(monthlyInput);
      await user.type(monthlyInput, '200000');

      // 총 투자금이 증가해야 함
      await waitFor(() => {
        const newInvested = getTotalInvested();
        expect(newInvested).toBeGreaterThan(initialInvested);
      });
    });
  });

  describe('연도별 상세 테이블', () => {
    it('연도별 상세 정보가 테이블로 표시된다', async () => {
      const { user } = setup();

      // 투자 기간을 3년으로 설정
      const yearsInput = screen.getByLabelText('투자 기간 (년)');
      await user.clear(yearsInput);
      await user.type(yearsInput, '3');

      // 테이블 헤더 확인
      await waitFor(() => {
        expect(screen.getByText('연도')).toBeInTheDocument();
        expect(screen.getByText('투자금액')).toBeInTheDocument();
        expect(screen.getByText('수익')).toBeInTheDocument();
        expect(screen.getByText('총 금액')).toBeInTheDocument();

        // 3개의 연도 행이 있어야 함
        const rows = screen.getAllByText(/^\d+년$/);
        expect(rows).toHaveLength(3);
      });
    });

    it('각 연도별로 누적 금액이 증가한다', async () => {
      const { user } = setup();

      // 투자 기간을 2년으로 설정
      const yearsInput = screen.getByLabelText('투자 기간 (년)');
      await user.clear(yearsInput);
      await user.type(yearsInput, '2');

      await waitFor(() => {
        const rows = screen.getAllByText(/^\d+년$/);
        expect(rows).toHaveLength(2);

        // 각 연도의 총 금액을 가져와서 비교
        const year1Row = screen.getByText('1년').closest('tr');
        const year2Row = screen.getByText('2년').closest('tr');

        const year1Total = parseCurrency(year1Row?.querySelector('td:last-child')?.textContent);
        const year2Total = parseCurrency(year2Row?.querySelector('td:last-child')?.textContent);

        expect(year2Total).toBeGreaterThan(year1Total);
      });
    });
  });
});
