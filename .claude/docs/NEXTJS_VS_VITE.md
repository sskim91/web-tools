# Next.js vs Vite 폴더 구조 비교

## 📁 현재 Vite 프로젝트 구조
```
web-tools/
├── src/
│   ├── App.tsx              # 라우터 설정 (수동)
│   ├── main.tsx             # 앱 진입점
│   ├── pages/               # 페이지 컴포넌트 (단순 컴포넌트)
│   │   ├── Home.tsx
│   │   ├── CompoundInterest.tsx
│   │   └── CharacterCounter.tsx
│   ├── components/          # 재사용 컴포넌트
│   └── styles/              # CSS 파일들
├── index.html               # HTML 템플릿
├── vite.config.ts           # Vite 설정
└── package.json

라우팅: React Router로 수동 설정
```

## 📁 Next.js로 변경 시 구조
```
web-tools-nextjs/
├── app/                     # App Router (Next.js 13+)
│   ├── layout.tsx           # 루트 레이아웃 (자동 적용)
│   ├── page.tsx             # 홈페이지 (/)
│   ├── compound-interest/
│   │   └── page.tsx         # /compound-interest 페이지
│   ├── character-counter/
│   │   └── page.tsx         # /character-counter 페이지
│   ├── api/                 # API Routes
│   │   ├── calculate/
│   │   │   └── route.ts     # POST /api/calculate
│   │   └── export/
│   │       └── route.ts     # GET /api/export
│   └── globals.css          # 전역 스타일
├── components/              # 재사용 컴포넌트
├── lib/                     # 유틸리티 함수
├── public/                  # 정적 파일
├── next.config.js           # Next.js 설정
└── package.json

라우팅: 파일 시스템 기반 자동 라우팅
```

## 🔄 마이그레이션 필요한 부분들

### 1. 라우팅 변경
**현재 (React Router):**
```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="compound-interest" element={<CompoundInterest />} />
  </Route>
</Routes>
```

**Next.js:**
```tsx
// 파일 구조가 곧 라우팅!
// app/compound-interest/page.tsx
export default function CompoundInterestPage() {
  return <CompoundInterest />
}
```

### 2. 페이지 컴포넌트 변경
**현재:**
```tsx
// src/pages/Home.tsx
const Home = () => {
  return <div>...</div>
}
export default Home
```

**Next.js:**
```tsx
// app/page.tsx
export default function HomePage() {
  // 서버 컴포넌트 (기본값)
  return <div>...</div>
}

// 또는 클라이언트 컴포넌트
'use client'
export default function HomePage() {
  const [state, setState] = useState() // hooks 사용 가능
  return <div>...</div>
}
```

### 3. API 추가 (Next.js의 장점)
```tsx
// app/api/calculate/route.ts
export async function POST(request: Request) {
  const data = await request.json()
  
  // 서버에서 계산 수행
  const result = calculateCompoundInterest(data)
  
  // 데이터베이스 저장 가능
  await db.save(result)
  
  return Response.json(result)
}
```

### 4. 환경 변수
**현재 (Vite):**
```tsx
// .env
VITE_API_KEY=xxx

// 사용
import.meta.env.VITE_API_KEY
```

**Next.js:**
```tsx
// .env.local
NEXT_PUBLIC_API_KEY=xxx  // 클라이언트
DATABASE_URL=xxx         // 서버만

// 사용
process.env.NEXT_PUBLIC_API_KEY
process.env.DATABASE_URL
```

## 🤔 언제 마이그레이션할까?

### Next.js로 전환이 필요한 경우:
✅ 사용자 인증/로그인 시스템 필요
✅ 데이터베이스 연동 필요
✅ SEO 최적화 필요 (검색 노출)
✅ 서버에서 계산하고 싶을 때
✅ API를 같은 프로젝트에서 관리

### 현재 구조 유지가 나은 경우:
✅ 순수 프론트엔드 앱으로 충분
✅ 정적 호스팅으로 배포 간편
✅ 빠른 개발 속도 유지
✅ 백엔드를 다른 언어로 구축 예정

## 🚀 단계별 마이그레이션 전략

### Phase 1: 현재 구조 유지
```
React(Vite) + LocalStorage
- 현재처럼 브라우저에서 모든 계산
- 사용자 데이터는 LocalStorage 저장
```

### Phase 2: 백엔드 추가
```
React(Vite) + Express API
- 프론트엔드는 그대로
- Express로 별도 API 서버 구축
- 사용자 인증, DB 저장 기능 추가
```

### Phase 3: Next.js 전환 (필요시)
```
Next.js 풀스택
- 하나의 프로젝트로 통합
- SSR/SSG로 성능 개선
- API Routes로 백엔드 통합
```

## 💡 추천 사항

현재 프로젝트는 **계산기 도구 모음**이므로:

1. **당장은 Vite 유지** - 충분히 잘 작동함
2. **필요하면 Supabase/Firebase 추가** - 간단한 백엔드
3. **복잡해지면 Next.js 고려** - 완전한 재구축

마이그레이션은 꽤 큰 작업이므로, 정말 필요할 때 하는 것이 좋습니다!