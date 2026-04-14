import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Pagination from "./Pagination"

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  args: {
    type: "Basic",
    page: 3,
    pageCount: 12,
    disabled: false,
  },
  argTypes: {
    type: { control: "radio", options: ["Table", "Basic"] },
    page: { control: "number" },
    count: { control: "number" },
    pageCount: { control: "number" },
    siblingCount: { control: "number" },
    boundaryCount: { control: "number" },
    disabled: { control: "boolean" },
    hidePrevNextButtons: { control: "boolean" },
    hideFirstLastButtons: { control: "boolean" },
    showPrevNextButtons: { control: "boolean" },
    showFirstLastButtons: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Pagination>

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(typeof args.page === "number" ? args.page : 1)

    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}

export const AllCases: Story = {
  render: () => {
    const [tablePage, setTablePage] = useState(1)
    const [basicPage, setBasicPage] = useState(5)

    return (
      <Flex direction="column" gap={20}>
        <Box>
          <Pagination type="Table" count={126} page={tablePage} onPageChange={setTablePage} />
        </Box>

        <Box>
          <Pagination type="Basic" page={basicPage} pageCount={15} onPageChange={setBasicPage} />
        </Box>

        <Box>
          <Pagination
            type="Basic"
            page={basicPage}
            pageCount={15}
            onPageChange={setBasicPage}
            showFirstLastButtons
          />
        </Box>

        <Box>
          <Pagination type="Basic" page={3} pageCount={20} siblingCount={2} boundaryCount={2} />
        </Box>

        <Box>
          <Pagination type="Basic" page={1} pageCount={8} disabled showFirstLastButtons />
        </Box>
      </Flex>
    )
  },
}
