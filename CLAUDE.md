# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web Tools - Next.js 기반 웹 유틸리티 도구 모음
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules with glassmorphism design system

## Essential Commands

```bash
# Development
npm run dev          # Start Next.js dev server (http://localhost:3000)

# Testing
npm test            # Run all tests in watch mode
npm run test:run    # Single test run
npm run test:ui     # Vitest UI for debugging
npm run test:coverage # Generate coverage report

# Build & Production
npm run build       # Production build
npm run start       # Start production server
npm run lint        # ESLint check
```

### Running Specific Tests
```bash
# Run tests for a specific file
npx vitest test/pages/CompoundInterest.test.tsx

# Run tests matching a pattern
npx vitest -t "복리 계산"

# Debug mode with UI
npx vitest --ui test/pages/DiscountCalculator.test.tsx
```

## Architecture & Key Patterns

### Next.js App Router Structure
```
src/app/
├── layout.tsx                    # Root layout with Header component
├── page.tsx                      # Home page with tool cards
├── compound-interest/page.tsx    # 복리 계산기
├── character-counter/page.tsx    # 글자수 계산기
├── discount-calculator/page.tsx  # 할인율 계산기
└── stock-average/page.tsx        # 주식 물타기 계산기
```

### Component Pattern
Each calculator follows a consistent pattern:
1. **State Management**: Local state with `useState`
2. **Real-time Calculation**: `useEffect` with debounced inputs
3. **Type Safety**: Strict TypeScript with proper number/string handling
4. **UI Structure**: Glass morphism cards with consistent styling

Example pattern from compound-interest:
```typescript
// State for input values (as strings for controlled inputs)
const [principal, setPrincipal] = useState<string>('1000000');

// Debounce for performance
const debouncedPrincipal = useDebounce(principal, 300);

// Calculate on debounced value changes
useEffect(() => {
  const calculated = calculateCompound({...});
  setResult(calculated);
}, [debouncedPrincipal, ...]);
```

### Testing Strategy
- **Unit Tests**: `test/utils/` for calculation logic
- **Component Tests**: `test/pages/` for UI behavior
- **Test Utilities**: Custom `parseCurrency` helper for Korean currency format
- **User Interaction**: `@testing-library/user-event` for realistic interactions

### Path Aliases
Configured in both `vitest.config.ts` and `tsconfig.json`:
```typescript
'@/src': './src'
'@/components': './src/components'
'@/styles': './src/styles'
'@/utils': './src/utils'
```

## Critical Implementation Details

### YearlyBreakdown Interface Alignment
The `calculateCompoundInterest` function returns:
```typescript
interface YearlyBreakdown {
  year: number;
  amount: number;    // NOT 'total'
  invested: number;  // NOT 'principal'
  interest: number;
}
```

### Number Input Handling
- Store as `string` in state for controlled inputs
- Parse to `number` only when calculating
- Handle empty strings and NaN gracefully

### Currency Formatting
```typescript
const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(num);
};
```

## Git Workflow Requirements

### Commit Rules
- **Language**: 한글 커밋 메시지 사용
- **No Auto-commit**: 명시적 요청시에만 커밋
- **User Confirmation**: 커밋 전 사용자 확인 필수

### Commit Message Format
```
<type>: <description>

[optional body]
```
Types: feat, fix, test, docs, style, refactor

## Development Principles

### File Operations
- Read entire files before modifying (no partial reads)
- Check all references before changing symbols
- Verify test coverage for new features

### Code Quality
- Max 300 lines per file
- Max 50 lines per function
- Max 5 parameters per function
- Cyclomatic complexity ≤ 10

### Testing Requirements
- Write failing test first (TDD)
- Include regression tests for bug fixes
- Test both success and failure paths

## Project-Specific Context

### Current Tools
1. **복리 계산기**: Monthly deposits, yearly breakdown table
2. **글자수 계산기**: Korean/English detection, visual distribution
3. **할인율 계산기**: Multiple discounts, reverse calculation
4. **주식 물타기 계산기**: Dynamic purchase list, average calculation

### Style System
- Dark theme with glassmorphism effects
- CSS variables in `globals.css`
- Component-specific styles in `/styles/pages/`
- Consistent spacing: 8px grid system

### Common Patterns
- `useDebounce` hook for input optimization
- Glass card containers for sections
- Lucide React icons for consistency
- Real-time calculations without submit buttons

## References
- Detailed rules: `.claude/CLAUDE.md`
- TDD workflow: `.claude/WORKFLOW.md`
- Conventions: `.claude/CONVENTIONS.md`
- Current work: `.claude/CURRENT.md`