import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StockAveragePage from '../../src/app/stock-average/page';

// 컴포넌트를 렌더링하고 userEvent를 설정하는 헬퍼 함수
const setup = () => {
  const user = userEvent.setup();
  render(<StockAveragePage />);
  return { user };
};

// 통화 형식(₩1,234)에서 숫자만 추출하는 함수
const parseCurrency = (text: string | null | undefined): number => {
  if (!text) return 0;
  return parseInt(text.replace(/[^0-9-]/g, ''), 10) || 0;
};

describe('StockAverage 컴포넌트', () => {
  beforeEach(() => {
    // 각 테스트 전에 DOM을 정리
    document.body.innerHTML = '';
  });

  describe('초기 렌더링', () => {
    it('페이지 제목과 설명이 올바르게 렌더링된다', () => {
      setup();
      expect(screen.getByText('주식 물타기 계산기')).toBeInTheDocument();
      expect(
        screen.getByText('평균 매수가를 계산하고 추가 매수를 시뮬레이션하세요'),
      ).toBeInTheDocument();
    });

    it('초기 매수 내역 입력 필드가 표시된다', () => {
      setup();
      const priceInputs = screen.getAllByPlaceholderText('50000');
      const quantityInputs = screen.getAllByPlaceholderText('10');

      expect(priceInputs).toHaveLength(1);
      expect(quantityInputs).toHaveLength(2); // 수량 입력과 추가 매수 수량 입력
      expect(priceInputs[0]).toHaveValue(50000);
      expect(quantityInputs[0]).toHaveValue(10);
    });

    it('초기 평균 매수가가 올바르게 계산된다', () => {
      setup();
      // 초기값: 50000원 * 10주 = 500,000원, 평균가 50,000원
      expect(screen.getByText('총 수량').nextSibling).toHaveTextContent('10주');
      expect(screen.getByText('평균 매수가').nextSibling?.textContent).toContain('50,000');
    });

    it('현재가 입력 필드가 초기값과 함께 표시된다', () => {
      setup();
      const currentPriceInput = screen.getByPlaceholderText('현재 주가');
      expect(currentPriceInput).toBeInTheDocument();
      expect(currentPriceInput).toHaveValue(45000);
    });
  });

  describe('매수 내역 관리', () => {
    it('매수 추가 버튼 클릭시 새로운 입력 필드가 추가된다', async () => {
      const { user } = setup();
      const addButton = screen.getByText('매수 추가');

      await user.click(addButton);

      const priceInputs = screen.getAllByPlaceholderText('50000');
      const quantityInputs = screen.getAllByPlaceholderText('10');

      expect(priceInputs).toHaveLength(2);
      expect(quantityInputs).toHaveLength(3); // 2개 매수 + 1개 추가 매수 시뮬레이션
    });

    it('매수 내역이 2개 이상일 때 삭제 버튼이 표시된다', async () => {
      const { user } = setup();
      const addButton = screen.getByText('매수 추가');

      // 초기에는 삭제 버튼이 없음
      expect(screen.queryByRole('button', { name: '삭제' })).not.toBeInTheDocument();

      // 매수 추가
      await user.click(addButton);

      // 삭제 버튼이 나타남
      const deleteButtons = screen.getAllByRole('button', { name: '삭제' });
      expect(deleteButtons).toHaveLength(2);
    });

    it('삭제 버튼 클릭시 매수 내역이 제거된다', async () => {
      const { user } = setup();
      const addButton = screen.getByText('매수 추가');

      // 매수 추가
      await user.click(addButton);

      // 삭제 버튼 클릭
      const deleteButtons = screen.getAllByRole('button', { name: '삭제' });
      await user.click(deleteButtons[0]);

      // 입력 필드가 1개로 줄어듦
      const priceInputs = screen.getAllByPlaceholderText('50000');
      expect(priceInputs).toHaveLength(1);
    });
  });

  describe('평균 매수가 계산', () => {
    it('여러 매수 내역의 평균가가 올바르게 계산된다', async () => {
      const { user } = setup();
      const addButton = screen.getByText('매수 추가');

      // 두 번째 매수 추가
      await user.click(addButton);

      const priceInputs = screen.getAllByPlaceholderText('50000');
      const quantityInputs = screen.getAllByPlaceholderText('10');

      // 두 번째 매수: 40000원 * 20주
      await user.clear(priceInputs[1]);
      await user.type(priceInputs[1], '40000');
      await user.clear(quantityInputs[1]);
      await user.type(quantityInputs[1], '20');

      await waitFor(() => {
        // (50000*10 + 40000*20) / (10+20) = 1,300,000 / 30 = 43,333원
        expect(screen.getByText('총 수량').nextSibling).toHaveTextContent('30주');
        const avgPrice = screen.getByText('평균 매수가').nextSibling?.textContent;
        expect(avgPrice).toContain('43,333');
      });
    });

    it('매수가나 수량이 0일 때도 계산이 정상 작동한다', async () => {
      const { user } = setup();
      const priceInput = screen.getByPlaceholderText('50000');
      const quantityInputs = screen.getAllByPlaceholderText('10');
      const quantityInput = quantityInputs[0]; // 첫 번째 수량 입력 필드

      // 수량을 0으로 변경
      await user.clear(quantityInput);
      await user.type(quantityInput, '0');

      await waitFor(() => {
        expect(screen.getByText('총 수량').nextSibling).toHaveTextContent('0주');
        expect(screen.getByText('평균 매수가').nextSibling?.textContent).toContain('0');
      });
    });

    it('빈 값 입력시 0으로 처리된다', async () => {
      const { user } = setup();
      const priceInput = screen.getByPlaceholderText('50000');

      // 가격을 지움
      await user.clear(priceInput);

      await waitFor(() => {
        // 0원 * 10주 = 0원
        const totalAmount = screen.getByText('총 투자금액').nextSibling?.textContent;
        expect(totalAmount).toContain('0');
      });
    });
  });

  describe('현재가 입력 및 손익 계산', () => {
    it('현재가 입력시 평가손익이 계산된다', async () => {
      const { user } = setup();
      const currentPriceInput = screen.getByPlaceholderText('현재 주가');

      // 현재가를 60000원으로 변경 (이익 상황)
      await user.clear(currentPriceInput);
      await user.type(currentPriceInput, '60000');

      await waitFor(() => {
        // 평가금액: 60000 * 10 = 600,000원
        expect(screen.getByText('평가금액').nextSibling?.textContent).toContain('600,000');
        // 평가손익: 600,000 - 500,000 = 100,000원 (이익)
        expect(screen.getByText('평가손익').nextSibling?.textContent).toContain('100,000');
        // 수익률: 100,000 / 500,000 * 100 = 20%
        expect(screen.getByText('수익률').nextSibling).toHaveTextContent('20.00%');
      });
    });

    it('손실 상황에서 올바른 스타일이 적용된다', () => {
      setup();
      // 초기 현재가 45000원 (손실 상황)

      const profitLossElement = screen.getByText('평가손익').closest('.evaluation-item');
      const profitRateElement = screen.getByText('수익률').closest('.evaluation-item');

      expect(profitLossElement).toHaveClass('loss');
      expect(profitRateElement).toHaveClass('loss');
    });

    it('이익 상황에서 올바른 스타일이 적용된다', async () => {
      const { user } = setup();
      const currentPriceInput = screen.getByPlaceholderText('현재 주가');

      // 현재가를 60000원으로 변경 (이익 상황)
      await user.clear(currentPriceInput);
      await user.type(currentPriceInput, '60000');

      await waitFor(() => {
        const profitLossElement = screen.getByText('평가손익').closest('.evaluation-item');
        const profitRateElement = screen.getByText('수익률').closest('.evaluation-item');

        expect(profitLossElement).toHaveClass('profit');
        expect(profitRateElement).toHaveClass('profit');
      });
    });

    it('현재가를 지우면 평가 결과가 숨겨진다', async () => {
      const { user } = setup();
      const currentPriceInput = screen.getByPlaceholderText('현재 주가');

      // 현재가가 있을 때 평가금액이 표시됨
      expect(screen.getByText('평가금액')).toBeInTheDocument();

      // 현재가를 지움
      await user.clear(currentPriceInput);

      // 평가 결과가 사라짐
      await waitFor(() => {
        expect(screen.queryByText('평가금액')).not.toBeInTheDocument();
      });
    });
  });

  describe('추가 매수 시뮬레이션', () => {
    it('현재가가 입력되면 시뮬레이션 섹션이 표시된다', () => {
      setup();
      // 초기 현재가가 있으므로 시뮬레이션 섹션이 표시됨
      expect(screen.getByText('추가 매수 시뮬레이션')).toBeInTheDocument();
    });

    it('현재가가 없으면 시뮬레이션 섹션이 숨겨진다', async () => {
      const { user } = setup();
      const currentPriceInput = screen.getByPlaceholderText('현재 주가');

      // 현재가를 지움
      await user.clear(currentPriceInput);

      // 시뮬레이션 섹션이 사라짐
      await waitFor(() => {
        expect(screen.queryByText('추가 매수 시뮬레이션')).not.toBeInTheDocument();
      });
    });

    it('추가 매수 수량 입력시 새로운 평균가가 계산된다', async () => {
      const { user } = setup();
      const quantityInputs = screen.getAllByPlaceholderText('10');
      const additionalQuantityInput = quantityInputs[1]; // 두 번째가 추가 매수 수량

      // 추가 매수 수량을 20주로 변경
      await user.clear(additionalQuantityInput);
      await user.type(additionalQuantityInput, '20');

      await waitFor(() => {
        // 기존: 50000원 * 10주 = 500,000원
        // 추가: 45000원 * 20주 = 900,000원
        // 새 평균: (500,000 + 900,000) / (10 + 20) = 46,666.67원 (반올림하면 46,667원)
        const newAvgPrice = screen.getByText('새로운 평균 매수가').nextSibling?.textContent;
        expect(newAvgPrice).toContain('46,667');

        // 새로운 총 수량: 30주
        expect(screen.getByText('새로운 총 수량').nextSibling).toHaveTextContent('30주');
      });
    });

    it('평균가 변화가 올바르게 표시된다', async () => {
      const { user } = setup();
      const quantityInputs = screen.getAllByPlaceholderText('10');
      const additionalQuantityInput = quantityInputs[1]; // 두 번째가 추가 매수 수량

      await user.clear(additionalQuantityInput);
      await user.type(additionalQuantityInput, '20');

      await waitFor(() => {
        const priceChange = screen.getByText(/평균가 변화:/);
        // ₩50,000 → ₩46,667 (하락)
        expect(priceChange.textContent).toContain('₩50,000');
        expect(priceChange.textContent).toContain('₩46,667');
        expect(priceChange.querySelector('.decrease')).toBeInTheDocument();
      });
    });

    it('현재가가 평균가보다 높을 때 평균가가 상승한다', async () => {
      const { user } = setup();
      const currentPriceInput = screen.getByPlaceholderText('현재 주가');
      const quantityInputs = screen.getAllByPlaceholderText('10');
      const additionalQuantityInput = quantityInputs[1]; // 두 번째가 추가 매수 수량

      // 현재가를 60000원으로 변경 (평균가보다 높음)
      await user.click(currentPriceInput);
      await user.clear(currentPriceInput);
      await user.type(currentPriceInput, '60000');

      // 추가 매수 10주 (기본값이 이미 10이므로 변경할 필요 없음)
      // additionalQuantityInput의 기본값이 이미 10이므로 그대로 사용

      await waitFor(() => {
        // 기존: 50000원 * 10주 = 500,000원
        // 추가: 60000원 * 10주 = 600,000원
        // 새 평균: (500,000 + 600,000) / 20 = 55,000원 (상승)
        const priceChange = screen.getByText(/평균가 변화:/);
        expect(priceChange.querySelector('.increase')).toBeInTheDocument();
        expect(priceChange.textContent).toContain('↑');
      });
    });
  });

  describe('투자금액 계산', () => {
    it('각 매수 내역의 투자금액이 올바르게 표시된다', async () => {
      const { user } = setup();

      // 초기값: 50000원 * 10주 = 500,000원
      const investmentDisplay = screen.getByText(/투자금액:/);
      expect(investmentDisplay.textContent).toContain('500,000');
    });

    it('매수 내역 변경시 투자금액이 실시간 업데이트된다', async () => {
      const { user } = setup();
      const quantityInputs = screen.getAllByPlaceholderText('10');
      const quantityInput = quantityInputs[0]; // 첫 번째 수량 입력

      // 수량을 20주로 변경
      await user.clear(quantityInput);
      await user.type(quantityInput, '20');

      await waitFor(() => {
        // 50000원 * 20주 = 1,000,000원
        const investmentDisplay = screen.getByText(/투자금액:/);
        expect(investmentDisplay.textContent).toContain('1,000,000');
      });
    });
  });

  describe('숫자 포맷팅', () => {
    it('큰 숫자가 천 단위 구분자와 함께 표시된다', async () => {
      const { user } = setup();
      const priceInput = screen.getByPlaceholderText('50000');
      const quantityInputs = screen.getAllByPlaceholderText('10');
      const quantityInput = quantityInputs[0]; // 첫 번째 수량 입력

      // 큰 금액 입력
      await user.clear(priceInput);
      await user.type(priceInput, '1000000');
      await user.clear(quantityInput);
      await user.type(quantityInput, '100');

      await waitFor(() => {
        // 1,000,000원 * 100주 = 100,000,000원
        const totalAmount = screen.getByText('총 투자금액').nextSibling?.textContent;
        expect(totalAmount).toContain('100,000,000');
      });
    });
  });
});
