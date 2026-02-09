# CONTRIBUTING

## 1. 기본 원칙

- UI 컴포넌트는 `packages/ui`에서만 개발합니다.
- 앱(`apps/*`)에는 UI 컴포넌트(스타일/토큰 포함) 작성 금지입니다.
- `@acme/ui`는 public entry(`@acme/ui`)로만 import 합니다. deep import는 금지합니다.

## 2. PR 규칙 (필수)

### 2-1. changeset

- `packages/ui` 변경이 포함되면 `.changeset/*` 파일 추가가 필수입니다.
- 변경 범위에 따라 `patch / minor / major`를 선택합니다.
- 앱(`apps/*`) 변경만 있는 경우 changeset은 필요 없습니다.

### 2-2. Storybook 스토리

- 신규 컴포넌트/기능 변경 시 스토리 추가 또는 업데이트가 필수입니다.
- 최소 구성:
  - Playground (args 기반)
  - Variants 또는 AllCases (상태/variant/disabled/size 등)

### 2-3. 머지 조건

PR은 아래 명령이 모두 통과해야 합니다.

- `yarn lint`
- `yarn typecheck`
- `yarn test`
- `yarn build`
- `yarn storybook:ci`

## 3. 코드 규칙 (핵심)

### 3-1. 토큰/컬러

- 임의 HEX 컬러 사용 금지 (theme/tokens 사용)
- 공통 스타일은 `BaseMixinProps`/`sx` 규칙을 따릅니다.

### 3-2. 앱 레이어 제한

- `apps/*`에서 `styled-components` 직접 import 금지
- 앱은 ThemeProvider만 적용하고, 스타일은 UI 패키지에서 제공합니다.

## 4. 아이콘 스프라이트

- 아이콘 변경 시 아래 명령으로 타입/스프라이트를 갱신합니다.
  - `yarn icons:build`
  - `yarn icons:copy:web`
