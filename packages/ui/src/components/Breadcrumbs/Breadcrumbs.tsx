import type { ReactNode } from "react"
import { useMemo } from "react"
import { useTheme } from "styled-components"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import Flex from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Link from "../Link/Link"
import { Typography } from "../Typography/Typography"

export type BreadcrumbItem = {
  label: string
  href?: string
  onClick?: () => void
}

export type BreadcrumbsProps = BaseMixinProps & {
  items: BreadcrumbItem[]
  separator?: ReactNode
  maxItems?: number
}

const ELLIPSIS_KEY = "__ellipsis__"
/**---------------------------------------------------------------------------/
 *
 * ! Breadcrumbs
 *
 * * 현재 위치 경로를 순차적으로 표현하는 브레드크럼 네비게이션 컴포넌트입니다.
 * * items 배열을 기반으로 각 경로를 렌더링하며, maxItems 조건에 따라 중간 경로를 생략 형태로 축약합니다.
 * * 별도의 상태 없이 props와 theme를 기반으로 파생 데이터를 계산하는 stateless 구조입니다.
 * * href 또는 onClick이 있는 항목만 상호작용이 가능하며, 마지막 항목은 항상 현재 페이지로 처리됩니다.
 *
 * * 주요 로직
 *   * Breadcrumbs():
 *     * separator가 없으면 theme 색상을 기반으로 ArrowRight 아이콘을 기본 구분자로 생성합니다.
 *     * maxItems 조건에 따라 items를 재구성하여 [첫 항목 + 생략(...) + 마지막 N개] 형태로 축약합니다.
 *     * 각 항목을 순회하며 마지막 여부, 생략 여부, 클릭 가능 여부를 기준으로 렌더링 타입을 분기합니다.
 *     * 클릭 가능한 항목은 Link, 마지막 항목은 aria-current="page"가 적용된 CurrentPage, 그 외는 Typography로 렌더링합니다.
 *     * 각 항목 뒤에는 마지막이 아닌 경우에만 separator를 삽입합니다.
 *   * Separator:
 *     * inline-flex 정렬과 좌우 margin을 가지는 구분자 래퍼입니다.
 *   * CurrentPage:
 *     * 현재 페이지 표시를 위한 wrapper로 aria-current 속성 적용을 위한 span입니다.
 *
 * @module Breadcrumbs
 * 경로 데이터를 기반으로 링크/현재 위치/생략 상태를 구분하여 표시하는 브레드크럼 컴포넌트입니다.
 *
 * @usage
 * <Breadcrumbs
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Category", href: "/category" },
 *     { label: "Detail" }
 *   ]}
 *   maxItems={3}
 * />
 *
/---------------------------------------------------------------------------**/
const Breadcrumbs = ({ items, separator, maxItems, ...others }: BreadcrumbsProps) => {
  const theme = useTheme()

  // * separator가 없을 경우 기본 ArrowRight 아이콘을 사용
  const resolvedSeparator = useMemo(() => {
    if (separator) return separator

    return <Icon name="ArrowRight" size={12} color={theme.colors.grayscale[600] as `#${string}`} />
  }, [separator, theme])

  // * maxItems가 설정된 경우 시작 아이템 + 생략("...") + 마지막 N개 아이템으로 축약
  const resolvedItems = useMemo(() => {
    const m = maxItems ?? 0

    if (!m || m < 2) return items
    if (items.length <= m) return items

    const tailCount = m - 1

    return [items[0], { label: ELLIPSIS_KEY }, ...items.slice(items.length - tailCount)]
  }, [items, maxItems])

  return (
    <Flex width="fit-content" justify="center" align="center" {...others}>
      {resolvedItems.map((item, index) => {
        const isLast = index === resolvedItems.length - 1
        const isEllipsis = item.label === ELLIPSIS_KEY

        // * 생략 아이템("...") 렌더링
        if (isEllipsis) {
          return (
            <Flex key={ELLIPSIS_KEY} align="center">
              <Typography
                as="span"
                variant="b3Regular"
                text="..."
                color={theme.colors.text.tertiary}
              />
              {!isLast && <Separator>{resolvedSeparator}</Separator>}
            </Flex>
          )
        }

        // * 마지막 아이템이 아니면서 href 또는 onClick이 존재하면 클릭 가능
        const clickable = !isLast && (!!item.onClick || !!item.href)

        return (
          <Flex key={`${item.label}-${index}`} align="center">
            {clickable ? (
              // * 클릭 가능한 경우 Link 컴포넌트로 렌더링
              <Link
                href={item.href}
                onClick={item.onClick}
                color={theme.colors.text.secondary}
                underline="hover"
              >
                {item.label}
              </Link>
            ) : isLast ? (
              // * 마지막 아이템은 현재 페이지로 간주하고 aria-current 적용
              <CurrentPage aria-current="page">
                <Typography
                  as="span"
                  text={item.label}
                  variant="b3Regular"
                  color={theme.colors.text.secondary}
                  sx={{ userSelect: "none" }}
                />
              </CurrentPage>
            ) : (
              // * 클릭 불가능한 중간 아이템
              <Typography
                as="span"
                text={item.label}
                variant="b3Regular"
                color={theme.colors.text.tertiary}
                sx={{ userSelect: "none" }}
              />
            )}

            {!isLast && <Separator>{resolvedSeparator}</Separator>}
          </Flex>
        )
      })}
    </Flex>
  )
}

// * separator 스타일 정의
const Separator = styled.span`
  display: inline-flex;
  align-items: center;
  margin: 0 4px;
`

// * 현재 페이지 wrapper (aria-current 적용용)
const CurrentPage = styled.span`
  display: inline-flex;
  align-items: center;
`

export default Breadcrumbs
