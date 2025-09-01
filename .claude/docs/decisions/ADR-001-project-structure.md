# ADR-001: 프로젝트 구조 및 문서화 체계

## 날짜
2025-08-30

## 상태
Accepted

## 배경 (Context)
Anthropic의 Claude Code 베스트 프랙티스를 참고하여 web-tools 프로젝트에 체계적인 개발 프로세스를 도입하고자 함. 
특히 TDD(Test-Driven Development) 방식과 체계적인 문서화가 필요했음.

## 고민 사항
1. **날짜별 vs 기능별 폴더 구조**
   - 날짜별: 시간 순서는 명확하지만, 나중에 특정 기능 찾기 어려움
   - 기능별: 기능은 찾기 쉽지만, 언제 작업했는지 추적 어려움

2. **문서 과다 생성 문제**
   - 매일 PLAN/TEST/IMPLEMENT/REVIEW 4개 문서 → 관리 부담
   - 간단한 작업도 문서화 → 개발 속도 저하

3. **CLAUDE.md 위치**
   - 루트에 이미 있는데 .claude/ 폴더에도 필요한가?

## 결정 사항

### 최종 구조
```
web-tools/
├── CLAUDE.md                   # 프로젝트 컨텍스트 (기존)
├── TODO.md                      # 전체 기능 목록
├── CURRENT.md                   # 현재 작업 중인 내용
├── .claude/                     
│   ├── WORKFLOW.md             # TDD 사이클 정의
│   ├── CONVENTIONS.md          # 코딩 컨벤션
│   └── templates/              
├── docs/
│   ├── planning/features/      # 기능별 계획
│   ├── worklog/                # 월별 작업 기록
│   └── decisions/              # ADR
```

### 핵심 원칙
1. **계획과 실행 분리**: planning(미래) vs worklog(과거)
2. **월별 통합 기록**: 일별 문서 대신 월별 통합
3. **현재 포커스 명확화**: CURRENT.md에 실시간 업데이트
4. **반복 개선**: 완벽한 구조보다 시작이 중요

## 대안
1. ~~날짜별 폴더 (daily/2025-01-30/)~~ → 관리 부담
2. ~~스프린트 기반 (sprints/week-05/)~~ → 우리 프로젝트엔 과함
3. ~~단일 WORKLOG.md~~ → 너무 길어질 수 있음

## 결과
- ✅ 체계적인 문서화 가능
- ✅ 관리 부담 최소화
- ✅ 나중에 개선 가능한 유연한 구조
- ⚠️ 초기 설정 필요

## 참고
- [Anthropic Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [How Anthropic Teams Use Claude Code](https://www.anthropic.com/news/how-anthropic-teams-use-claude-code)