import { useState, useEffect } from 'react';
import { Type, FileText, Hash, Space, Copy, Trash2 } from 'lucide-react';
import './CharacterCounter.css';

const CharacterCounter = () => {
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    bytes: 0,
    koreanChars: 0,
    englishChars: 0,
    numbers: 0,
    spaces: 0,
    specialChars: 0,
  });

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (inputText: string) => {
    if (!inputText) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        bytes: 0,
        koreanChars: 0,
        englishChars: 0,
        numbers: 0,
        spaces: 0,
        specialChars: 0,
      });
      return;
    }

    // 기본 통계
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const lines = inputText.split('\n').length;
    const paragraphs = inputText.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const bytes = new Blob([inputText]).size;

    // 문자 유형별 통계
    const koreanChars = (inputText.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) || []).length;
    const englishChars = (inputText.match(/[a-zA-Z]/g) || []).length;
    const numbers = (inputText.match(/[0-9]/g) || []).length;
    const spaces = (inputText.match(/\s/g) || []).length;
    const specialChars = characters - koreanChars - englishChars - numbers - spaces;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      bytes,
      koreanChars,
      englishChars,
      numbers,
      spaces,
      specialChars,
    });
  };

  const handleClear = () => {
    setText('');
  };

  const handleCopy = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      // 복사 완료 피드백 (간단한 alert 대신 나중에 toast 추가 가능)
      const button = document.querySelector('.action-btn') as HTMLButtonElement;
      if (button) {
        const originalText = button.innerText;
        button.innerText = '복사됨!';
        setTimeout(() => {
          button.innerText = originalText;
        }, 1500);
      }
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <div className="character-counter">
      <div className="page-header">
        <Type size={32} className="page-icon" />
        <h1>글자수 계산기</h1>
        <p>텍스트의 다양한 통계를 실시간으로 확인하세요</p>
      </div>

      <div className="counter-container">
        <div className="input-area">
          <div className="textarea-wrapper glass">
            <textarea
              className="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="텍스트를 입력하거나 붙여넣으세요..."
            />
            <div className="input-actions">
              <button className="action-btn" onClick={handleCopy} disabled={!text}>
                <Copy size={18} />
                복사
              </button>
              <button className="action-btn danger" onClick={handleClear} disabled={!text}>
                <Trash2 size={18} />
                지우기
              </button>
            </div>
          </div>
        </div>

        <div className="stats-area">
          <div className="stats-grid">
            <div className="stat-card glass primary">
              <div className="stat-icon">
                <Type size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">전체 글자수</span>
                <span className="stat-value">{formatNumber(stats.characters)}</span>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">
                <Space size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">공백 제외</span>
                <span className="stat-value">{formatNumber(stats.charactersNoSpaces)}</span>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">단어</span>
                <span className="stat-value">{formatNumber(stats.words)}</span>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">
                <Hash size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">바이트</span>
                <span className="stat-value">{formatNumber(stats.bytes)}</span>
              </div>
            </div>
          </div>

          <div className="detailed-stats glass">
            <h3>상세 분석</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">한글</span>
                <span className="detail-value">{formatNumber(stats.koreanChars)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">영문</span>
                <span className="detail-value">{formatNumber(stats.englishChars)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">숫자</span>
                <span className="detail-value">{formatNumber(stats.numbers)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">공백</span>
                <span className="detail-value">{formatNumber(stats.spaces)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">특수문자</span>
                <span className="detail-value">{formatNumber(stats.specialChars)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">줄 수</span>
                <span className="detail-value">{formatNumber(stats.lines)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">문단</span>
                <span className="detail-value">{formatNumber(stats.paragraphs)}</span>
              </div>
            </div>
          </div>

          {stats.characters > 0 && (
            <div className="character-distribution glass">
              <h3>문자 구성</h3>
              <div className="distribution-bars">
                {stats.koreanChars > 0 && (
                  <div className="distribution-item">
                    <div className="distribution-label">
                      <span>한글</span>
                      <span>{((stats.koreanChars / stats.characters) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="distribution-bar">
                      <div
                        className="distribution-fill korean"
                        style={{ width: `${(stats.koreanChars / stats.characters) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {stats.englishChars > 0 && (
                  <div className="distribution-item">
                    <div className="distribution-label">
                      <span>영문</span>
                      <span>{((stats.englishChars / stats.characters) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="distribution-bar">
                      <div
                        className="distribution-fill english"
                        style={{ width: `${(stats.englishChars / stats.characters) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {stats.numbers > 0 && (
                  <div className="distribution-item">
                    <div className="distribution-label">
                      <span>숫자</span>
                      <span>{((stats.numbers / stats.characters) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="distribution-bar">
                      <div
                        className="distribution-fill numbers"
                        style={{ width: `${(stats.numbers / stats.characters) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {stats.spaces > 0 && (
                  <div className="distribution-item">
                    <div className="distribution-label">
                      <span>공백</span>
                      <span>{((stats.spaces / stats.characters) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="distribution-bar">
                      <div
                        className="distribution-fill spaces"
                        style={{ width: `${(stats.spaces / stats.characters) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCounter;
