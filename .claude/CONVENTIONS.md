# 📏 코딩 컨벤션

## TypeScript/React 규칙

### 네이밍
```typescript
// 컴포넌트 - PascalCase
const DiscountCalculator: React.FC = () => {}

// 함수 - camelCase
function calculateDiscount(price: number, rate: number): number {}

// 상수 - UPPER_SNAKE_CASE
const MAX_DISCOUNT_RATE = 99;

// 타입/인터페이스 - PascalCase
interface CalculatorProps {
  initialValue?: number;
}
```

### 파일 구조
```
src/
├── components/
│   └── DiscountCalculator/
│       ├── DiscountCalculator.tsx      # 컴포넌트
│       ├── DiscountCalculator.css      # 스타일
│       └── DiscountCalculator.test.tsx # 테스트
```

### React 패턴
```typescript
// ✅ Good - 함수 컴포넌트 + hooks
const Calculator: React.FC = () => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    // 사이드 이펙트
  }, [value]);
  
  return <div>{value}</div>;
};

// ❌ Bad - 클래스 컴포넌트 (신규 코드에서 사용 금지)
```

## CSS 규칙

### 클래스명 - BEM 변형
```css
/* Block */
.calculator { }

/* Element */
.calculator__input { }
.calculator__button { }

/* Modifier */
.calculator--disabled { }
.calculator__button--primary { }
```

### CSS 변수 활용
```css
/* 색상은 App.css의 CSS 변수 사용 */
.calculator {
  background: var(--card-bg);
  color: var(--text-primary);
}
```

## Git 커밋 메시지

### 형식 (한글)
```
타입: 제목

본문 (선택사항)

이슈: #번호 (있는 경우)
```

### 타입
- 기능: 새로운 기능 추가
- 수정: 버그 수정
- 개선: 코드 개선, 리팩토링
- 스타일: 코드 포맷팅, 세미콜론 누락 등
- 테스트: 테스트 추가/수정
- 문서: 문서 수정
- 설정: 빌드 설정, 패키지 관련

### 예시
```
기능: 할인율 계산기 컴포넌트 추가

- 기본 할인 계산 로직 구현
- 다중 할인 적용 기능 추가
- 실시간 계산 결과 표시

이슈: #12
```

## 테스트 규칙

### 테스트 파일명
```
ComponentName.test.tsx  // 컴포넌트 테스트
utils.test.ts          // 유틸 함수 테스트
```

### 테스트 구조
```typescript
describe('DiscountCalculator', () => {
  describe('calculateDiscount', () => {
    it('should calculate simple discount correctly', () => {
      // Given
      const price = 10000;
      const rate = 20;
      
      // When
      const result = calculateDiscount(price, rate);
      
      // Then
      expect(result).toBe(8000);
    });
    
    it('should handle edge cases', () => {
      // 경계값 테스트
    });
  });
});
```

## 코드 품질 기준

### 함수
- 최대 50줄
- 매개변수 최대 5개
- 단일 책임 원칙

### 파일
- 최대 300줄
- 하나의 주요 export

### 복잡도
- 순환 복잡도 ≤ 10
- 중첩 깊이 ≤ 3

## 주석 규칙

```typescript
// ✅ Good - WHY를 설명
// 세금 계산은 별도 API 호출이 필요하므로 나중에 처리
const priceWithoutTax = calculateDiscount(price, rate);

// ❌ Bad - WHAT을 설명 (코드로 충분)
// 가격에서 할인율을 뺀다
const discounted = price - (price * rate / 100);
```

## 에러 처리

```typescript
// 구체적인 에러 메시지
if (rate < 0 || rate > 100) {
  throw new Error(`할인율은 0-100 사이여야 합니다. 입력값: ${rate}`);
}

// 사용자 친화적 메시지
try {
  const result = await fetchData();
} catch (error) {
  console.error('데이터 로드 실패:', error);
  showToast('데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
}
```