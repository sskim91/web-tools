# 테스트 전략

## 🧪 테스트 도구: Vitest + Next.js

### 환경
- **프레임워크**: Next.js 15 with App Router
- **테스트 런너**: Vitest
- **테스트 라이브러리**: React Testing Library
- **언어**: TypeScript

## 📦 필요한 패키지

```bash
# 테스트 프레임워크
npm install -D vitest

# React 테스트 도구
npm install -D @testing-library/react @testing-library/user-event

# DOM 매처 (toBeInTheDocument 등)
npm install -D @testing-library/jest-dom

# 브라우저 환경 시뮬레이션
npm install -D jsdom

# 테스트 커버리지
npm install -D @vitest/coverage-v8
```

## 🎯 테스트 대상 (기존 기능) - ✅ 완료

### 1. 복리 계산기 (CompoundInterest) ✅
- [x] 기본 복리 계산 로직
- [x] 월 적립금 포함 계산
- [x] 입력값 유효성 검증
- [x] 연도별 결과 테이블 생성
- **테스트 케이스**: 8개

### 2. 할인율 계산기 (DiscountCalculator) ✅
- [x] 단일 할인 계산
- [x] 다중 할인 순차 적용
- [x] 실제 할인율 역산
- [x] 할인 항목 추가/삭제
- **테스트 케이스**: 11개

### 3. 글자수 계산기 (CharacterCounter) ✅
- [x] 한글/영문 문자 카운트
- [x] 공백 포함/제외 카운트
- [x] 단어 수 계산
- [x] 문단 수 계산
- [x] 바이트 계산
- [x] 복사 기능
- **테스트 케이스**: 15개

### 4. 주식 물타기 계산기 (StockAverage) ✅
- [x] 평균 단가 계산
- [x] 총 투자금액 계산
- [x] 구매 항목 추가/삭제
- [x] 추가 구매 시뮬레이션
- [x] 손익 계산 및 표시
- **테스트 케이스**: 22개

### 5. 유틸리티 함수 (calculations.ts) ✅
- [x] 복리 계산 함수
- [x] 할인 계산 함수
- **테스트 케이스**: 18개

## 📁 테스트 파일 구조 (현재)

```
web-tools/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── compound-interest/
│   │   ├── discount-calculator/
│   │   ├── character-counter/
│   │   └── stock-average/
│   └── utils/
│       └── calculations.ts
└── test/
    ├── pages/                    # 컴포넌트 테스트
    │   ├── CompoundInterest.test.tsx    ✅
    │   ├── DiscountCalculator.test.tsx  ✅
    │   ├── CharacterCounter.test.tsx    ✅
    │   └── StockAverage.test.tsx        ✅
    └── utils/                    # 유틸리티 테스트
        └── calculations.test.ts         ✅
```

## 🔧 설정 파일

### vitest.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

### test/setup.ts
```typescript
import '@testing-library/jest-dom'
```

## 📝 테스트 작성 패턴

### 단위 테스트 예시
```typescript
// CharacterCounter.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

describe('CharacterCounter', () => {
  const setup = () => {
    const user = userEvent.setup()
    render(<CharacterCounter />)
    return { user }
  }

  it('한글 텍스트 입력시 올바른 통계가 계산된다', async () => {
    const { user } = setup()
    const textarea = screen.getByPlaceholderText('여기에 텍스트를 입력하세요...')
    
    await user.type(textarea, '안녕하세요')
    
    expect(screen.getByText('5')).toBeInTheDocument() // 글자수
  })
})
```

## 🚀 NPM Scripts

package.json에 설정됨:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 📊 테스트 커버리지 현황

### 현재 달성
- **총 테스트**: 74개 모두 통과 ✅
- **기능 커버리지**: 100% (4/4 기능)
- **테스트 실행 시간**: ~2.5초

### 향후 목표
- 전체 코드 커버리지: 80% 이상
- E2E 테스트 추가
- 통합 테스트 추가

## 🎯 다음 테스트 계획

### 새로운 기능 추가 시
1. **TDD 사이클 준수**
   - 테스트 먼저 작성 (Red)
   - 최소한의 코드로 테스트 통과 (Green)
   - 사용자 검증 (Verify)
   - 리팩토링 (Refactor)

2. **테스트 커버리지 유지**
   - 모든 새 기능에 테스트 필수
   - 버그 수정 시 회귀 테스트 추가

3. **E2E 테스트 추가 계획**
   - Playwright 또는 Cypress 도입 검토
   - 주요 사용자 플로우 테스트

## 🔍 테스트 실행 방법

```bash
# 감시 모드로 테스트 실행
npm test

# 한 번만 실행
npm run test:run

# UI 모드로 실행 (브라우저에서 확인)
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage

# 특정 파일만 테스트
npx vitest test/pages/CharacterCounter.test.tsx

# 특정 테스트 케이스만 실행
npx vitest -t "복사 기능"
```

## ⚠️ 주의사항

### Next.js App Router 테스트 시
- `'use client'` 디렉티브가 있는 컴포넌트 테스트 시 주의
- 서버 컴포넌트는 별도 테스트 전략 필요
- `useRouter` 등 Next.js 특정 훅 모킹 필요

### 비동기 작업 테스트
- `waitFor`로 비동기 작업 완료 대기
- `userEvent`는 항상 `await`와 함께 사용
- Debounced 입력은 적절한 대기 시간 설정

---

*마지막 업데이트: 2025-09-01 20:20*