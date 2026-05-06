import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, Flex, Typography, theme } from "@acme/ui"

type DashboardItem = {
  title: string
  description: string
}

type MetricItem = DashboardItem & {
  value: string
  signal: string
}

type TimelineItem = {
  step: string
  title: string
  description: string
}

const executiveSummary: DashboardItem[] = [
  {
    title: "운영 화면의 반복 비용을 줄이기 위해",
    description:
      "검색, 필터, 정렬, 페이지네이션, 내보내기처럼 반복되는 관리 화면 기능을 컴포넌트 계약과 소비 앱 검증으로 묶었습니다.",
  },
  {
    title: "Component-first를 선택한 이유",
    description:
      "페이지별 임시 구현이 아니라 public API, 접근성, 테스트, Storybook 문서가 함께 움직이는 구조가 장기 유지보수에 유리합니다.",
  },
  {
    title: "실제 앱 소비까지 포함한 검증",
    description:
      "packages/ui 내부 테스트에서 끝내지 않고 apps/web Admin 화면에서 React Query, Router, URL state와 함께 검증합니다.",
  },
]

const architecture: DashboardItem[] = [
  { title: "packages/ui", description: "컴포넌트, theme token, icon sprite, public API, Storybook 문서를 소유합니다." },
  { title: "apps/web", description: "Admin과 Market IA에서 @acme/ui를 실제 서비스 화면처럼 소비합니다." },
  { title: "Storybook", description: "단품 나열이 아니라 form, table, feedback 운영 시나리오를 문서화합니다." },
  { title: "Vitest", description: "컴포넌트 interaction과 route-level regression을 빠르게 검증합니다." },
  { title: "API Extractor", description: "public surface 변화를 report로 추적해 소비 코드 파손 위험을 낮춥니다." },
  { title: "tsup", description: "라이브러리 번들, 타입 선언, ESM/CJS 산출물을 안정적으로 생성합니다." },
]

const qualityFlow = [
  "Design System",
  "Storybook",
  "API Extractor",
  "Consumer App",
  "Route Regression Test",
  "Build Verification",
]

const metrics: MetricItem[] = [
  {
    value: "50+",
    title: "UI surfaces",
    signal: "coverage",
    description: "컴포넌트, stories, interaction tests를 함께 관리해 변경 영향 범위를 좁힙니다.",
  },
  {
    value: "7",
    title: "Admin route checks",
    signal: "regression",
    description: "/admin 렌더링, search, filter, view 전환, drawer, detail, legacy redirect를 검증합니다.",
  },
  {
    value: "1",
    title: "Consumer app",
    signal: "integration",
    description: "패키지 내부가 아니라 실제 apps/web에서 URL state, query, layout과 결합해 확인합니다.",
  },
  {
    value: "0",
    title: "Fake toolbar",
    signal: "operational",
    description: "검색, 필터, 정렬, 내보내기, 컬럼 표시를 실제 rows/query state와 연결합니다.",
  },
]

const designRules: DashboardItem[] = [
  { title: "Token first", description: "색상, border, radius, shadow는 theme token을 기준으로 사용합니다." },
  { title: "Contract over markup", description: "소비 앱은 public API와 props 계약에 의존하고 내부 DOM 구조 의존을 줄입니다." },
  { title: "Accessible states", description: "loading, disabled, empty, error, keyboard, focus return을 운영 품질 기준으로 봅니다." },
]

const tableEcosystem: DashboardItem[] = [
  { title: "Toolbar search", description: "테이블 내부 검색은 local state와 data pipeline에 연결되어 Skeleton 전환 없이 동작합니다." },
  { title: "Filter drawer", description: "draft/applied filter를 분리해 적용/초기화 흐름을 명확하게 유지합니다." },
  { title: "Sort / pagination", description: "header sort, rowsPerPage, page 상태가 URL query와 table meta에 반영됩니다." },
  { title: "Export / columns", description: "현재 filtered/sorted rows와 visible columns 기준으로 운영 액션을 실행합니다." },
  { title: "InfiniteTable", description: "같은 search/filter/sort 결과를 Table View와 Infinite View에서 공유합니다." },
]

const qualityGates: DashboardItem[] = [
  { title: "Typecheck", description: "apps/web와 packages/ui의 props 계약 및 refactor side effect를 빠르게 발견합니다." },
  { title: "Build", description: "Vite/tsup 산출물 생성과 consumer app 번들 가능성을 확인합니다." },
  { title: "Route regression", description: "Admin 운영 흐름이 구조 분리 이후에도 깨지지 않았다는 증거를 남깁니다." },
  { title: "Storybook", description: "운영 시나리오형 문서로 컴포넌트 사용 맥락을 보여줍니다." },
  { title: "API surface", description: "API Extractor report로 public type boundary를 검토합니다." },
  { title: "Public boundary", description: "apps/web이 내부 구현 path에 기대지 않도록 책임 경계를 유지합니다." },
]

const roleComparison = [
  {
    title: "Admin Operations",
    description: "운영 관리 화면. Table ecosystem과 복잡한 상태 흐름을 검증하는 기준 화면입니다.",
    items: ["Search / Filter / Sort", "Export / Column Visibility", "Pagination / InfiniteTable", "CRUD 확장 예정"],
  },
  {
    title: "Market Experience",
    description: "사용자용 반응형 탐색 앱. 카드 기반 탐색과 모바일 UX 검증을 맡을 예정입니다.",
    items: ["Responsive browse", "Drawer / BottomNavigation", "Card and image-first UX", "모바일 사용성 검증"],
  },
]

const timeline: TimelineItem[] = [
  {
    step: "STEP 1",
    title: "IA 정리",
    description: "/admin, /market, /demo redirect로 포트폴리오 정보 구조와 운영 화면 역할을 분리했습니다.",
  },
  {
    step: "STEP 2",
    title: "Page 책임 축소",
    description: "ProductListPage를 얇게 만들고 ProductListContainer 중심의 orchestration 구조로 이동했습니다.",
  },
  {
    step: "STEP 3",
    title: "Hook / section 분리",
    description: "toolbar, scroll restore, preview drawer, rendering section을 운영 단위별로 나눴습니다.",
  },
  {
    step: "STEP 4",
    title: "Data pipeline 분리",
    description: "React Query 결과에서 search/filter/sort/paginate/table config 계산 책임을 hook으로 분리했습니다.",
  },
  {
    step: "STEP 5",
    title: "Regression test 추가",
    description: "Admin route의 핵심 동작을 route-level test로 고정해 리팩토링 안정성을 확보했습니다.",
  },
]

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: "grid", gap: "20px" }}>
      <HeroSection onAdminClick={() => navigate("/admin")} onMarketClick={() => navigate("/market")} />

      <DashboardSection
        title="Executive Summary"
        description="이 프로젝트는 컴포넌트 자체보다 운영 화면에서 반복되는 문제를 어떻게 줄였는지 설명하는 데 초점을 둡니다."
        columns={3}
      >
        {executiveSummary.map((item) => (
          <InfoCard key={item.title} title={item.title} description={item.description} tone="strong" />
        ))}
      </DashboardSection>

      <DashboardSection
        title="Monorepo Architecture"
        description="패키지, 문서, 검증, 소비 앱이 분리되어 있지만 같은 품질 흐름 안에서 연결됩니다."
        columns={3}
      >
        {architecture.map((item) => (
          <InfoCard key={item.title} title={item.title} description={item.description} />
        ))}
      </DashboardSection>

      <QualityFlowSection />

      <DashboardSection
        title="Operational Metrics"
        description="숫자는 규모를 과장하기보다 어떤 품질 신호를 추적하는지 보여주는 용도입니다."
        columns={4}
      >
        {metrics.map((item) => (
          <MetricCard key={item.title} item={item} />
        ))}
      </DashboardSection>

      <DashboardSection
        title="Design Rules"
        description="운영 화면에서 오래 버티는 UI를 위해 스타일, 접근성, public boundary를 기본 제약으로 둡니다."
        columns={3}
      >
        {designRules.map((item) => (
          <InfoCard key={item.title} title={item.title} description={item.description} />
        ))}
      </DashboardSection>

      <DashboardSection
        title="Table Ecosystem"
        description="Admin 화면은 단순 샘플이 아니라 Table 생태계의 실제 계약을 검증하는 소비 앱입니다."
        columns={5}
      >
        {tableEcosystem.map((item) => (
          <InfoCard key={item.title} title={item.title} description={item.description} />
        ))}
      </DashboardSection>

      <RoleComparisonSection />

      <DashboardSection
        title="Quality Gate"
        description="타입, 빌드, 문서, API surface, 라우트 회귀 테스트를 단계별로 통과해야 운영 가능한 상태로 봅니다."
        columns={3}
      >
        {qualityGates.map((item) => (
          <InfoCard key={item.title} title={item.title} description={item.description} />
        ))}
      </DashboardSection>

      <TimelineSection />

      <CtaSection onAdminClick={() => navigate("/admin")} onMarketClick={() => navigate("/market")} />
    </Box>
  )
}

const HeroSection = ({
  onAdminClick,
  onMarketClick,
}: {
  onAdminClick: () => void
  onMarketClick: () => void
}) => (
  <Box
    as="section"
    p="28px"
    sx={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.45fr) minmax(280px, 0.55fr)",
      gap: "20px",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: theme.colors.grayscale.white,
      "@media (max-width: 860px)": {
        gridTemplateColumns: "1fr",
        p: "22px",
      },
    }}
  >
    <Box sx={{ display: "grid", alignContent: "center", gap: "14px" }}>
      <Typography
        as="h2"
        variant="h1"
        text="운영 가능한 디자인 시스템과 실제 소비 앱을 함께 검증한 프로젝트"
        color={theme.colors.text.primary}
      />
      <Typography
        as="p"
        variant="b1Regular"
        text="public API, Storybook, API Extractor, React Query 소비 앱, route regression test를 하나의 품질 흐름으로 연결했습니다."
        color={theme.colors.text.secondary}
      />
      <Flex gap="8px" wrap="wrap">
        <Button text="Admin Operations 열기" onClick={onAdminClick} />
        <Button text="Market 계획 보기" variant="outlined" color="normal" onClick={onMarketClick} />
      </Flex>
    </Box>

    <Box
      aria-label="Project operating signals"
      p="16px"
      sx={{
        display: "grid",
        gap: "10px",
        border: `1px solid ${theme.colors.primary[100]}`,
        borderRadius: theme.borderRadius[8],
        background: theme.colors.primary[50],
      }}
    >
      <Signal label="Primary surface" value="/admin" />
      <Signal label="Boundary" value="packages/ui public API" />
      <Signal label="Verification" value="typecheck + build + route test" />
    </Box>
  </Box>
)

const DashboardSection = ({
  title,
  description,
  columns,
  children,
}: {
  title: string
  description: string
  columns: 3 | 4 | 5
  children: ReactNode
}) => (
  <Box as="section" sx={{ display: "grid", gap: "12px" }}>
    <SectionHeader title={title} description={description} />
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "12px",
        "@media (max-width: 1180px)": {
          gridTemplateColumns: columns >= 4 ? "repeat(2, minmax(0, 1fr))" : "1fr",
        },
        "@media (max-width: 680px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      {children}
    </Box>
  </Box>
)

const SectionHeader = ({ title, description }: DashboardItem) => (
  <Box sx={{ display: "grid", gap: "4px" }}>
    <Typography as="h3" variant="h2" text={title} color={theme.colors.text.primary} />
    <Typography as="p" variant="b2Regular" text={description} color={theme.colors.text.secondary} />
  </Box>
)

const InfoCard = ({
  title,
  description,
  tone = "default",
}: DashboardItem & {
  tone?: "default" | "strong"
}) => (
  <Box
    as="article"
    p="18px"
    sx={{
      display: "grid",
      alignContent: "start",
      gap: "8px",
      minHeight: "132px",
      border: `1px solid ${tone === "strong" ? theme.colors.primary[100] : theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: tone === "strong" ? theme.colors.primary[50] : theme.colors.grayscale.white,
    }}
  >
    <Typography variant="b1Bold" text={title} color={theme.colors.text.primary} />
    <Typography variant="b2Regular" text={description} color={theme.colors.text.secondary} />
  </Box>
)

const MetricCard = ({ item }: { item: MetricItem }) => (
  <Box
    as="article"
    p="18px"
    sx={{
      display: "grid",
      alignContent: "start",
      gap: "8px",
      minHeight: "164px",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: theme.colors.grayscale.white,
    }}
  >
    <Flex justify="space-between" align="flex-start" gap="10px">
      <Typography variant="h1" text={item.value} color={theme.colors.primary[400]} />
      <Typography variant="b3Medium" text={item.signal} color={theme.colors.text.tertiary} />
    </Flex>
    <Typography variant="b1Bold" text={item.title} color={theme.colors.text.primary} />
    <Typography variant="b2Regular" text={item.description} color={theme.colors.text.secondary} />
  </Box>
)

const QualityFlowSection = () => (
  <Box as="section" sx={{ display: "grid", gap: "12px" }}>
    <SectionHeader
      title="Operational Quality Flow"
      description="디자인 시스템이 앱에 들어가기 전후로 어떤 검증 단계를 거치는지 흐름으로 보여줍니다."
    />
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gap: "10px",
        "@media (max-width: 1180px)": {
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        },
        "@media (max-width: 680px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      {qualityFlow.map((item, index) => (
        <FlowStep key={item} index={index + 1} title={item} />
      ))}
    </Box>
  </Box>
)

const FlowStep = ({ index, title }: { index: number; title: string }) => (
  <Box
    as="article"
    p="14px"
    sx={{
      display: "grid",
      gap: "8px",
      minHeight: "98px",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: theme.colors.grayscale.white,
    }}
  >
    <Typography variant="b3Medium" text={`0${index}`} color={theme.colors.primary[400]} />
    <Typography variant="b2Medium" text={title} color={theme.colors.text.primary} />
  </Box>
)

const RoleComparisonSection = () => (
  <Box as="section" sx={{ display: "grid", gap: "12px" }}>
    <SectionHeader
      title="Admin / Market Role"
      description="같은 디자인 시스템을 운영자 화면과 사용자 탐색 화면에서 서로 다른 기준으로 검증합니다."
    />
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "12px",
        "@media (max-width: 780px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      {roleComparison.map((role) => (
        <Box
          key={role.title}
          as="article"
          p="20px"
          sx={{
            display: "grid",
            gap: "12px",
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius[8],
            background: theme.colors.grayscale.white,
          }}
        >
          <Box sx={{ display: "grid", gap: "6px" }}>
            <Typography variant="h3" text={role.title} color={theme.colors.text.primary} />
            <Typography variant="b2Regular" text={role.description} color={theme.colors.text.secondary} />
          </Box>
          <Box as="ul" sx={{ display: "grid", gap: "6px", m: 0, p: 0, listStyle: "none" }}>
            {role.items.map((item) => (
              <Box key={item} as="li">
                <Typography variant="b2Medium" text={item} color={theme.colors.text.secondary} />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
)

const TimelineSection = () => (
  <Box as="section" sx={{ display: "grid", gap: "12px" }}>
    <SectionHeader
      title="Operational Improvement Timeline"
      description="완성된 결과뿐 아니라 구조를 어떻게 개선해왔는지 추적 가능한 형태로 정리했습니다."
    />
    <Box sx={{ display: "grid", gap: "10px" }}>
      {timeline.map((item) => (
        <Box
          key={item.step}
          as="article"
          p="16px"
          sx={{
            display: "grid",
            gridTemplateColumns: "110px minmax(0, 1fr)",
            gap: "14px",
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius[8],
            background: theme.colors.grayscale.white,
            "@media (max-width: 640px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <Typography variant="b2Medium" text={item.step} color={theme.colors.primary[400]} />
          <Box sx={{ display: "grid", gap: "4px" }}>
            <Typography variant="b1Bold" text={item.title} color={theme.colors.text.primary} />
            <Typography variant="b2Regular" text={item.description} color={theme.colors.text.secondary} />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
)

const CtaSection = ({
  onAdminClick,
  onMarketClick,
}: {
  onAdminClick: () => void
  onMarketClick: () => void
}) => (
  <Box
    as="section"
    p="24px"
    sx={{
      display: "grid",
      gap: "14px",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: theme.colors.grayscale.white,
    }}
  >
    <Typography as="h3" variant="h2" text="검증된 운영 화면에서 구조 확인하기" color={theme.colors.text.primary} />
    <Typography
      as="p"
      variant="b2Regular"
      text="Admin은 현재 품질 확보가 끝난 운영형 화면이고, Market은 다음 단계에서 사용자용 반응형 탐색 앱으로 확장할 영역입니다."
      color={theme.colors.text.secondary}
    />
    <Flex gap="8px" wrap="wrap">
      <Button text="Admin Operations" onClick={onAdminClick} />
      <Button text="Market Placeholder" variant="outlined" color="normal" onClick={onMarketClick} />
    </Flex>
  </Box>
)

const Signal = ({ label, value }: { label: string; value: string }) => (
  <Flex justify="space-between" align="center" gap="12px" wrap="wrap">
    <Typography variant="b3Medium" text={label} color={theme.colors.text.tertiary} />
    <Typography variant="b2Medium" text={value} color={theme.colors.text.primary} />
  </Flex>
)

export default HomePage
