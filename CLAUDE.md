# Web Tools - Claude Code 가이드

## 🎯 프로젝트 개요
React + TypeScript + Vite 기반 웹 도구 모음
- 복리 계산기
- 글자수 계산기  
- 주식 물타기 계산기

## 🚀 빠른 시작
```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run test     # 테스트 실행
```

## 📌 Git 규칙
- **커밋 메시지는 한글로 작성**
- **자동 커밋/푸시 금지** - 명시적 요청시에만
- **커밋 전 사용자 확인 필수**

## 📁 프로젝트 구조
```
src/
├── components/     # 공통 컴포넌트
├── pages/         # 각 도구 페이지
└── App.tsx        # 라우터 설정
```

## 🔍 더 자세한 정보
상세한 개발 가이드와 규칙은 `.claude/` 폴더 참조:
- `.claude/CLAUDE.md` - 상세 아키텍처 및 개발 규칙
- `.claude/WORKFLOW.md` - TDD 워크플로우
- `.claude/CONVENTIONS.md` - 코딩 컨벤션
- `.claude/TODO.md` - 기능 목록
- `.claude/CURRENT.md` - 현재 작업