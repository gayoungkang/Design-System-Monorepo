# CONTRIBUTING

## 1. 기본 원칙

- UI 컴포넌트는 `packages/ui`에서만 개발합니다.
- 앱(`apps/*`)에서는 UI 컴포넌트(스타일/토큰 포함) 작성이 금지됩니다.
- `@acme/ui`는 반드시 public entry(`@acme/ui`)로만 import 합니다.
- `@acme/ui/internal`은 예외적으로 필요한 경우에만 사용합니다.
- deep import (`@acme/ui/components/...`)는 금지합니다.

---

## 2. PR 규칙 (필수)

### 2-1. changeset

- `packages/ui` 변경이 포함되면 `.changeset/*` 파일 추가가 필수입니다.
- 변경 범위에 따라 `patch / minor / major`를 선택합니다.
- 앱(`apps/*`) 변경만 있는 경우 changeset은 필요 없습니다.

---

### 2-2. Storybook 스토리

- 신규 컴포넌트 또는 UI 변경 시 스토리 추가/수정이 필수입니다.

최소 포함:

- Playground (args 기반 인터랙션)
- Variants 또는 AllCases (상태 / variant / disabled / size 등)

---

### 2-3. 머지 조건

PR은 아래 조건을 모두 만족해야 머지 가능합니다.

- `yarn lint`
- `yarn typecheck`
- `yarn test`
- `yarn build`
- `yarn storybook:ci`
- CI / Chromatic / changeset 체크 통과

---

## 3. 코드 규칙 (핵심)

### 3-1. 토큰 / 컬러

- 임의 HEX 컬러 사용 금지 (theme/tokens 사용)
- 스타일은 `BaseMixinProps` / `sx` 기반으로 작성합니다.

---

### 3-2. 앱 레이어 제한

- `apps/*`에서 `styled-components` 직접 import 금지
- 앱은 ThemeProvider만 적용하고, 스타일은 UI 패키지에서 제공합니다.

---

### 3-3. API 규칙

- 외부 노출 API는 `@acme/ui` public entry만 사용합니다.
- 내부 상태(store) 및 유틸은 `@acme/ui/internal`로만 접근합니다.
- public API에 포함되는 타입/컴포넌트는 `@public` 태그를 사용합니다.
- internal 구현은 `@internal` 태그를 사용합니다.

---

## 4. 아이콘 스프라이트

- 아이콘 변경 시 아래 명령으로 타입 및 스프라이트를 갱신합니다.

```bash
yarn icons:build
yarn icons:copy:web
```
