'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Type, Copy, Check } from 'lucide-react';
import '@/src/styles/pages/CharacterCounter.css';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  bytes: number;
  koreanChars: number;
  englishChars: number;
  numbers: number;
  spaces: number;
  special: number;
}

const initialStats: TextStats = {
  characters: 0,
  charactersNoSpaces: 0,
  words: 0,
  sentences: 0,
  paragraphs: 0,
  bytes: 0,
  koreanChars: 0,
  englishChars: 0,
  numbers: 0,
  spaces: 0,
  special: 0,
};

export default function CharacterCounterPage() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stats: TextStats = useMemo(() => {
    if (!text) {
      return initialStats;
    }

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\n+/).filter(Boolean).length;
    const bytes = new Blob([text]).size;

    const koreanChars = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = chars - koreanChars - englishChars - numbers - spaces;

    return {
      characters: chars,
      charactersNoSpaces: charsNoSpaces,
      words,
      sentences,
      paragraphs,
      bytes,
      koreanChars,
      englishChars,
      numbers,
      spaces,
      special,
    };
  }, [text]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCharTypePercentage = useCallback(
    (count: number) => {
      if (stats.characters === 0) return 0;
      return (count / stats.characters) * 100;
    },
    [stats.characters],
  );

  return (
    <div className="character-counter">
      <div className="page-header">
        <Type size={32} className="page-icon" />
        <h1>글자수 계산기</h1>
        <p>텍스트의 글자수, 단어수, 바이트를 실시간으로 계산합니다</p>
      </div>

      <div className="counter-container">
        <div className="input-section glass">
          <div className="input-header">
            <h2>텍스트 입력</h2>
            <button className="copy-btn" onClick={handleCopy} aria-label="복사">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
          <textarea
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 텍스트를 입력하세요..."
            aria-label="텍스트 입력"
          />
        </div>

        <div className="stats-section">
          <div className="main-stats glass">
            <div className="stat-item primary">
              <span className="stat-value">{stats.characters.toLocaleString()}</span>
              <span className="stat-label">글자수 (공백 포함)</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.charactersNoSpaces.toLocaleString()}</span>
              <span className="stat-label">글자수 (공백 제외)</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.words.toLocaleString()}</span>
              <span className="stat-label">단어수</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.bytes.toLocaleString()}</span>
              <span className="stat-label">바이트</span>
            </div>
          </div>

          <div className="detail-stats glass">
            <h3>상세 분석</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">문장</span>
                <span className="detail-value">{stats.sentences}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">단락</span>
                <span className="detail-value">{stats.paragraphs}</span>
              </div>
            </div>
          </div>

          <div className="char-analysis glass">
            <h3>문자 구성</h3>
            <div className="char-types">
              <div className="char-type">
                <div className="char-type-header">
                  <span>한글</span>
                  <span>{stats.koreanChars}</span>
                </div>
                <div className="char-type-bar">
                  <div
                    className="bar-fill korean"
                    style={{ width: `${getCharTypePercentage(stats.koreanChars)}%` }}
                    role="progressbar"
                    aria-valuenow={getCharTypePercentage(stats.koreanChars)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`한글: ${stats.koreanChars} 글자`}
                  />
                </div>
              </div>
              <div className="char-type">
                <div className="char-type-header">
                  <span>영문</span>
                  <span>{stats.englishChars}</span>
                </div>
                <div className="char-type-bar">
                  <div
                    className="bar-fill english"
                    style={{ width: `${getCharTypePercentage(stats.englishChars)}%` }}
                    role="progressbar"
                    aria-valuenow={getCharTypePercentage(stats.englishChars)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`영문: ${stats.englishChars} 글자`}
                  />
                </div>
              </div>
              <div className="char-type">
                <div className="char-type-header">
                  <span>숫자</span>
                  <span>{stats.numbers}</span>
                </div>
                <div className="char-type-bar">
                  <div
                    className="bar-fill numbers"
                    style={{ width: `${getCharTypePercentage(stats.numbers)}%` }}
                    role="progressbar"
                    aria-valuenow={getCharTypePercentage(stats.numbers)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`숫자: ${stats.numbers} 글자`}
                  />
                </div>
              </div>
              <div className="char-type">
                <div className="char-type-header">
                  <span>공백</span>
                  <span>{stats.spaces}</span>
                </div>
                <div className="char-type-bar">
                  <div
                    className="bar-fill spaces"
                    style={{ width: `${getCharTypePercentage(stats.spaces)}%` }}
                    role="progressbar"
                    aria-valuenow={getCharTypePercentage(stats.spaces)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`공백: ${stats.spaces} 글자`}
                  />
                </div>
              </div>
              <div className="char-type">
                <div className="char-type-header">
                  <span>특수문자</span>
                  <span>{stats.special}</span>
                </div>
                <div className="char-type-bar">
                  <div
                    className="bar-fill special"
                    style={{ width: `${getCharTypePercentage(stats.special)}%` }}
                    role="progressbar"
                    aria-valuenow={getCharTypePercentage(stats.special)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`특수문자: ${stats.special} 글자`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
