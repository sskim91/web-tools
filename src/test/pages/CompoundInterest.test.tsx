import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CompoundInterest from '../../pages/CompoundInterest';

// 컴포넌트를 Router로 감싸고 userEvent를 설정하는 헬퍼 함수
const setup = () => {
  const user = userEvent.setup();
  render(
    <BrowserRouter>
      <CompoundInterest />
    </BrowserRouter>,
  );
  return { user };
};

// 통화 형식(₩1,234)에서 숫자만 추출하는 함수
const parseCurrency = (text: string | null | undefined): number => {
  if (!text) return 0;
  const num = parseInt(text.replace(/[^\d]/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

// 최종 금액을 가져오는 헬퍼 함수
const getFinalAmount = () => {
  const finalAmountEl = screen.getByText('최종 금액').nextElementSibling;
  if (!finalAmountEl?.textContent) {
    // 테스트 환경에서 요소를 찾지 못하면 명시적으로 에러를 발생시켜 테스트를 실패시킵니다.
    throw new Error('최종 금액 요소를 찾거나 텍스트 컨텐츠를 읽을 수 없습니다.');
  }
  return parseCurrency(finalAmountEl.textContent);
};

describe('CompoundInterest 컴포넌트', () => {
  // userEvent 인스턴스를 저장할 변수
  let user: ReturnType<typeof userEvent.setup>;

  // 각 테스트 전에 컴포넌트를 렌더링하고 user를 설정합니다.
  beforeEach(() => {
    const { user: setupUser } = setup();
    user = setupUser;
  });

  describe('초기 렌더링', () => {
    it('제목이 올바르게 표시된다', () => {
      expect(screen.getByRole('heading', { name: '복리 계산기' })).toBeInTheDocument();
    });

    it('모든 입력 필드가 표시되고 기본값을 가진다', () => {
      expect(screen.getByLabelText(/초기 투자금/)).toHaveValue(1000000);
      expect(screen.getByLabelText(/연 수익률/)).toHaveValue(5);
      expect(screen.getByLabelText(/투자 기간/)).toHaveValue(10);
      expect(screen.getByLabelText(/월 적립금/)).toHaveValue(100000);
    });
  });

  describe('복리 계산 로직', () => {
    it('기본값으로 올바른 최종 금액을 계산한다', async () => {
      await waitFor(() => {
        // 온라인 표준 계산기 값: 17,175,237원
        expect(getFinalAmount()).toBeCloseTo(17175237, -2);
      });
    });

    it('월 적립금 변경시 재계산된다', async () => {
      const monthlyInput = screen.getByLabelText(/월 적립금/);
      await user.clear(monthlyInput);
      await user.type(monthlyInput, '0');

      await waitFor(() => {
        // 월 적립금 0원일 때: 1,647,009원
        expect(getFinalAmount()).toBeCloseTo(1647009, -2);
      });
    });

    it('이율 변경시 실시간으로 재계산된다', async () => {
      const rateInput = screen.getByLabelText(/연 수익률/);
      await user.clear(rateInput);
      await user.type(rateInput, '10');

      await waitFor(() => {
        // 이율 10%일 때: 실제 계산값 23,191,539원
        expect(getFinalAmount()).toBeCloseTo(23191539, -2);
      });
    });
  });

  describe('입력 검증', () => {
    it('음수 입력시 계산에는 0으로 처리된다', async () => {
      const principalInput = screen.getByLabelText(/초기 투자금/);
      const monthlyInput = screen.getByLabelText(/월 적립금/);

      await user.clear(monthlyInput);
      await user.type(monthlyInput, '0');

      await user.clear(principalInput);
      await user.type(principalInput, '-1000');

      await waitFor(() => {
        expect(principalInput).toHaveValue(-1000);
        // 초기 투자금이 음수이면 0으로 처리되어 결과는 0원
        expect(getFinalAmount()).toBe(0);
      });
    });
  });

  describe('결과 테이블', () => {
    it('연도별 상세 내역 헤더가 표시된다', async () => {
      await waitFor(() => {
        expect(screen.getByText('연차')).toBeInTheDocument();
        expect(screen.getByText('투자금액')).toBeInTheDocument();
        expect(screen.getByText('수익')).toBeInTheDocument();
        expect(screen.getByText('총 금액')).toBeInTheDocument();
      });
    });

    it('10년치 데이터가 모두 표시된다', async () => {
      await waitFor(() => {
        for (let year = 1; year <= 10; year++) {
          expect(screen.getByText(`${year}년`)).toBeInTheDocument();
        }
      });
    });
  });
});
