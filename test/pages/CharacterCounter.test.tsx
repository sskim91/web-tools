import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterCounterPage from '../../src/app/character-counter/page';

// 컴포넌트를 렌더링하고 userEvent를 설정하는 헬퍼 함수
const setup = () => {
  const user = userEvent.setup();
  render(<CharacterCounterPage />);
  return { user };
};

describe('CharacterCounter 컴포넌트', () => {
  beforeEach(() => {
    // 각 테스트 전에 DOM을 정리
    document.body.innerHTML = '';
  });

  describe('초기 렌더링', () => {
    it('페이지 제목과 설명이 올바르게 렌더링된다', () => {
      setup();
      expect(screen.getByText('글자수 계산기')).toBeInTheDocument();
      expect(
        screen.getByText('텍스트의 글자수, 단어수, 바이트를 실시간으로 계산합니다'),
      ).toBeInTheDocument();
    });

    it('빈 텍스트 입력 필드가 표시된다', () => {
      setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('');
    });

    it('초기 통계가 모두 0으로 표시된다', () => {
      setup();
      expect(screen.getByText('글자수 (공백 포함)').previousElementSibling).toHaveTextContent('0');
      expect(screen.getByText('글자수 (공백 제외)').previousElementSibling).toHaveTextContent('0');
      expect(screen.getByText('단어수').previousElementSibling).toHaveTextContent('0');
      expect(screen.getByText('바이트').previousElementSibling).toHaveTextContent('0');
    });

    it('복사 버튼이 표시된다', () => {
      setup();
      expect(screen.getByRole('button', { name: '복사' })).toBeInTheDocument();
    });
  });

  describe('텍스트 입력 및 계산', () => {
    it('한글 텍스트 입력시 올바른 통계가 계산된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      await user.type(textarea, '안녕하세요 테스트입니다');

      await waitFor(() => {
        // 글자수 (공백 포함): 12
        expect(screen.getByText('글자수 (공백 포함)').previousElementSibling).toHaveTextContent(
          '12',
        );
        // 글자수 (공백 제외): 11
        expect(screen.getByText('글자수 (공백 제외)').previousElementSibling).toHaveTextContent(
          '11',
        );
        // 단어수: 2
        expect(screen.getByText('단어수').previousElementSibling).toHaveTextContent('2');
      });
    });

    it('영문 텍스트 입력시 올바른 통계가 계산된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      await user.type(textarea, 'Hello World');

      await waitFor(() => {
        // 글자수 (공백 포함): 11
        expect(screen.getByText('글자수 (공백 포함)').previousElementSibling).toHaveTextContent(
          '11',
        );
        // 글자수 (공백 제외): 10
        expect(screen.getByText('글자수 (공백 제외)').previousElementSibling).toHaveTextContent(
          '10',
        );
        // 단어수: 2
        expect(screen.getByText('단어수').previousElementSibling).toHaveTextContent('2');
      });
    });

    it('혼합된 텍스트 입력시 문자 구성이 올바르게 분석된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      await user.type(textarea, '안녕 Hello 123!');

      await waitFor(() => {
        // 전체 글자수: 13 (공백 2개 포함) - "안녕 Hello 123!" = 13글자
        expect(screen.getByText('글자수 (공백 포함)').previousElementSibling).toHaveTextContent(
          '13',
        );

        // 문자 구성 확인
        const charTypes = screen.getAllByText(/^한글$|^영문$|^숫자$|^공백$|^특수문자$/);
        const koreanSection = charTypes.find((el) => el.textContent === '한글')?.nextSibling;
        const englishSection = charTypes.find((el) => el.textContent === '영문')?.nextSibling;
        const numbersSection = charTypes.find((el) => el.textContent === '숫자')?.nextSibling;
        const spacesSection = charTypes.find((el) => el.textContent === '공백')?.nextSibling;
        const specialSection = charTypes.find((el) => el.textContent === '특수문자')?.nextSibling;

        expect(koreanSection).toHaveTextContent('2'); // 안녕
        expect(englishSection).toHaveTextContent('5'); // Hello
        expect(numbersSection).toHaveTextContent('3'); // 123
        expect(spacesSection).toHaveTextContent('2'); // 2 spaces
        expect(specialSection).toHaveTextContent('1'); // !
      });
    });

    it('여러 줄 텍스트의 문장과 단락이 올바르게 계산된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      const multilineText =
        '첫 번째 문장입니다. 두 번째 문장입니다!\n\n세 번째 문장은 새 단락입니다.';
      await user.clear(textarea);
      await user.type(textarea, multilineText);

      await waitFor(() => {
        // 문장 수: 3
        expect(screen.getByText('문장').nextSibling).toHaveTextContent('3');
        // 단락 수: 2
        expect(screen.getByText('단락').nextSibling).toHaveTextContent('2');
      });
    });

    it('텍스트를 지우면 통계가 0으로 초기화된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      // 텍스트 입력
      await user.type(textarea, '테스트 텍스트');

      // 텍스트가 입력되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('글자수 (공백 포함)').previousElementSibling?.textContent).not.toBe(
          '0',
        );
      });

      // 텍스트 모두 지우기
      await user.clear(textarea);

      // 통계가 0으로 초기화되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('글자수 (공백 포함)').previousElementSibling).toHaveTextContent(
          '0',
        );
        expect(screen.getByText('글자수 (공백 제외)').previousElementSibling).toHaveTextContent(
          '0',
        );
        expect(screen.getByText('단어수').previousElementSibling).toHaveTextContent('0');
        expect(screen.getByText('바이트').previousElementSibling).toHaveTextContent('0');
      });
    });
  });

  describe('복사 기능', () => {
    it('텍스트가 있을 때 복사 버튼을 클릭하면 클립보드에 복사된다', async () => {
      const { user } = setup();

      // navigator.clipboard.writeText 모킹
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: {
          writeText: writeTextMock,
        },
      });

      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');
      const copyButton = screen.getByRole('button', { name: '복사' });

      // 텍스트 입력
      await user.type(textarea, '복사할 텍스트');

      // 복사 버튼 클릭
      await user.click(copyButton);

      // writeText가 올바른 텍스트로 호출되었는지 확인
      expect(writeTextMock).toHaveBeenCalledWith('복사할 텍스트');

      // 버튼 텍스트가 '복사됨!'으로 변경되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('복사됨!')).toBeInTheDocument();
      });
    });

    it('빈 텍스트일 때는 복사가 실행되지 않는다', async () => {
      const { user } = setup();

      const writeTextMock = vi.fn();
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: {
          writeText: writeTextMock,
        },
      });

      const copyButton = screen.getByRole('button', { name: '복사' });

      // 빈 상태에서 복사 버튼 클릭
      await user.click(copyButton);

      // writeText가 호출되지 않았는지 확인
      expect(writeTextMock).not.toHaveBeenCalled();
    });
  });

  describe('문자 구성 시각화', () => {
    it('문자 타입별 프로그레스 바가 올바른 비율로 표시된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      // 50% 한글, 50% 영문
      await user.type(textarea, '한글English');

      await waitFor(() => {
        const koreanBar = screen.getByLabelText(/한글:/);
        const englishBar = screen.getByLabelText(/영문:/);

        // 한글 2자, 영문 7자 = 총 9자
        // 한글: 2/9 = 약 22%
        // 영문: 7/9 = 약 78%
        expect(koreanBar).toHaveAttribute('aria-valuenow', expect.stringMatching(/22/));
        expect(englishBar).toHaveAttribute('aria-valuenow', expect.stringMatching(/77/));
      });
    });

    it('텍스트가 없을 때 모든 프로그레스 바가 0%로 표시된다', () => {
      setup();

      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach((bar) => {
        expect(bar).toHaveAttribute('aria-valuenow', '0');
      });
    });
  });

  describe('바이트 계산', () => {
    it('한글은 3바이트로 계산된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      await user.type(textarea, '가');

      await waitFor(() => {
        expect(screen.getByText('바이트').previousElementSibling).toHaveTextContent('3');
      });
    });

    it('영문은 1바이트로 계산된다', async () => {
      const { user } = setup();
      const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...');

      await user.type(textarea, 'A');

      await waitFor(() => {
        expect(screen.getByText('바이트').previousElementSibling).toHaveTextContent('1');
      });
    });
  });
});
