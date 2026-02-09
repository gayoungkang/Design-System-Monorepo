# Component-first Design System Monorepo

**Yarn + Vite + React + TypeScript + styled-components + Storybook + tsup**

전세계 대규모 기술 기업들이 사용하는  
**확장 가능한 Component-first 디자인 시스템 아키텍처** 기반으로 설계된 Monorepo입니다.

---

## 디자인 시스템 핵심 규칙

- 모든 UI는 **`@acme/ui` 패키지에서만 개발**
- 앱(`apps/web`)에는 UI 컴포넌트 작성 금지
- UI 수정 PR은 **Storybook 스크린샷/링크 필수**
- 모든 페이지는 디자인 시스템 컴포넌트 기반
- `ThemeProvider`는 앱 루트에서만 적용

---

## Component-first 철학

Atomic은 사고 방식, Component-first는 구현 방식입니다.

- UI는 독립 단위로 구성
- 재사용성 / 접근성 / 일관성 보장
- 컴포넌트는 **표현 전용**, 비즈니스 로직 없음

---

## 아키텍처

```
my-org/
├─ apps/
│  └─ web/
└─ packages/
   └─ ui/
```

---

## 설치

```bash
yarn
```

---

## 개발 서버

```bash
yarn dev
yarn storybook
```

---

## UI 패키지 빌드

```bash
yarn workspace @acme/ui build
```

---

## 테스트 레이어 (Vitest)

```bash
yarn workspace @acme/ui test
yarn workspace @acme/ui test:run
yarn workspace @acme/ui test:ui
```

---

## 접근성(A11y) 자동 검사

Storybook + @storybook/addon-a11y

---

## Visual Regression (Chromatic)

```bash
yarn chromatic --project-token=YOUR_TOKEN
```

---

## 번들 분석 / Tree-shaking

`apps/web/dist/stats.html`

---

## 번들 크기 예산

```bash
yarn build:check
```

---

## API 안정성 (API Extractor)

```bash
yarn workspace @acme/ui api:check
```

---

## Icon 시스템

```tsx
<Icon name="CloseLine" />
```

---

## 버전 관리 (Changesets)

```bash
yarn dlx @changesets/cli init
yarn changeset
yarn version-packages
yarn release
```

---

## 개발 규칙 요약

- UI는 `@acme/ui`에서만 개발
- Storybook 없는 UI PR 금지
- 테스트 없는 컴포넌트 금지

---

Shopify Polaris / Atlassian / Adobe Spectrum / Fluent UI 구조 참고
