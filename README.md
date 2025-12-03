## 🚀 프로젝트 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

## 🛠 기술 스택 (Tech Stack)

### **Frontend**

- React 18
- React Router DOM
- TypeScript
- Recharts
- React Toastify

---

## 주요 구현 기능 요약

# 1) 게시판 기능

### 게시글 목록

- 검색 기능
- 카테고리 필터
- 정렬 기능
- **무한 스크롤 기반 페이지네이션**
- 게시글 열람 / 수정 / 삭제

### 글 작성

- 제목 / 본문 / 카테고리 / 태그 입력
- **금칙어 검사 기능** (제목/본문/태그 모두)
- 태그 최대 5개, 24자 제한
- 태그 중복 방지
- React-Toastify 알림

### 글 상세보기

- 제목 / 본문 / 태그 / 작성일
- 삭제 / 수정 기능 통합 제공

### 글 수정

- 기존 데이터 자동 채움
- 수정 성공 시 Toast

---

# 2) 데이터 시각화 대시보드

## (1) 인기 스낵 브랜드

- Bar Chart
- Donut Chart

## (2) Weekly Mood Trend

- 주차별 Bar Chart
- 전체 요약 Donut Chart

## (3) Stacked Charts

데이터:

- `/mock/weekly-mood-trend`
- `/mock/weekly-workout-trend`

구현:

- Stacked Bar Chart
- Stacked Area Chart
- 항목별 비율(%) 누적 표현

## (4) Multi-Line Chart (핵심 요구사항)

데이터:

- `/mock/coffee-consumption`
- `/mock/snack-impact`

구현 기능:

- 실선: 문제지표 (bugs / meetingsMissed)
- 점선: 평가지표 (productivity / morale)
- 동일 팀은 동일 색상 유지
- Circle/Square Dot 마커 형태 구분
- X축: 커피잔수 / 스낵수
- Y축 좌우 분리
- **Custom Tooltip (해당 팀 데이터만 표시)**
- **범례에서 팀 보이기/숨기기 가능**
- **범례에서 색상 변경 가능**

---
