import type { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"
import dayjs from "dayjs"
import Accordion from "./Accordion/Accordion"
import Box from "./Box/Box"
import Button from "./Button/Button"
import CheckBoxGroup from "./CheckBoxGroup/CheckBoxGroup"
import DatePicker from "./DatePicker/DatePicker"
import Drawer from "./Drawer/Drawer"
import Flex from "./Flex/Flex"
import Modal from "./Modal/Modal"
import Progress from "./Progress/Progress"
import RadioGroup from "./RadioGroup/RadioGroup"
import Select from "./Select/Select"
import type { SelectOptionType } from "./Select/Select"
import Skeleton from "./Skeleton/Skeleton"
import SwitchButton from "./SwitchButton/SwitchButton"
import Table from "./Table/Table"
import type { ColumnProps, ServerTableQuery } from "./Table/@Types/table"
import Tabs from "./Tabs/Tabs"
import TextField from "./TextField/TextField"
import Tooltip from "./Tooltip/Tooltip"
import { Typography } from "./Typography/Typography"

type Story = StoryObj

const meta: Meta = {
  title: "Operations/Scenarios",
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

type RoleValue = "designer" | "frontend" | "backend"
type PlanValue = "starter" | "growth" | "enterprise"

const roleOptions: SelectOptionType<RoleValue>[] = [
  { value: "designer", label: "Product Designer" },
  { value: "frontend", label: "Frontend Engineer" },
  { value: "backend", label: "Backend Engineer" },
]

const planOptions = [
  { text: "Starter", value: "starter" },
  { text: "Growth", value: "growth" },
  { text: "Enterprise", value: "enterprise" },
] satisfies { text: string; value: PlanValue }[]

type CustomerRow = {
  id: number
  company: string
  owner: string
  status: "Active" | "Trial" | "Paused"
  seats: number
}

type CustomerExportType = "csv" | "excel"

const customerRows: CustomerRow[] = [
  { id: 1001, company: "Northwind Studio", owner: "Mina", status: "Active", seats: 42 },
  { id: 1002, company: "Apex Logistics", owner: "Joon", status: "Trial", seats: 18 },
  { id: 1003, company: "Bright Health", owner: "Sora", status: "Active", seats: 86 },
  { id: 1004, company: "Orbit Finance", owner: "Leo", status: "Paused", seats: 24 },
  { id: 1005, company: "Luna Commerce", owner: "Nari", status: "Trial", seats: 12 },
  { id: 1006, company: "Cobalt Works", owner: "Ian", status: "Active", seats: 63 },
]

const filterRows = (rows: CustomerRow[], keyword: string) => {
  const nextKeyword = keyword.trim().toLowerCase()
  if (!nextKeyword) return rows

  return rows.filter((row) =>
    [row.company, row.owner, row.status, String(row.id)].some((value) =>
      value.toLowerCase().includes(nextKeyword),
    ),
  )
}

const sortRows = (rows: CustomerRow[], query: ServerTableQuery) => {
  if (!query.sort) return rows
  const direction = query.sort.direction === "DESC" ? -1 : 1
  const key = query.sort.key as keyof CustomerRow

  return [...rows].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]
    if (aValue === bValue) return 0
    return aValue > bValue ? direction : -direction
  })
}

const customerColumns: ColumnProps<CustomerRow>[] = [
  { key: "id", title: "ID", width: 100, sort: true },
  { key: "company", title: "Company", width: 220, sort: true },
  { key: "owner", title: "Owner", width: 160 },
  { key: "status", title: "Status", width: 140, sort: true },
  { key: "seats", title: "Seats", width: 120, sort: true, textAlign: "right" },
]

const hasKeywordContext = (context: unknown): context is { keyword: string } =>
  typeof context === "object" &&
  context !== null &&
  "keyword" in context &&
  typeof context.keyword === "string"

export const FormValidationScenario: Story = {
  render: () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<RoleValue | undefined>()
    const [plan, setPlan] = useState<PlanValue>("growth")
    const [agreements, setAgreements] = useState<string[]>([])
    const [enabled, setEnabled] = useState(true)
    const [submitted, setSubmitted] = useState(false)

    const emailInvalid = email.length > 0 && !email.includes("@")
    const submitDisabled =
      !name.trim() || !email.trim() || emailInvalid || !role || agreements.length === 0 || !enabled

    return (
      <Box p="24px" width="720px">
        <Typography variant="h3" text="Form validation scenario" mb="16px" />

        <Flex direction="column" gap={16}>
          <TextField
            label="Requester"
            value={name}
            placeholder="Jane Doe"
            error={submitted && !name.trim()}
            helperText={submitted && !name.trim() ? "Requester name is required." : undefined}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Work email"
            value={email}
            placeholder="jane@company.com"
            error={submitted && (!email.trim() || emailInvalid)}
            helperText={
              submitted && !email.trim()
                ? "Email is required."
                : submitted && emailInvalid
                  ? "Use a work email address."
                  : undefined
            }
            onChange={(event) => setEmail(event.target.value)}
          />
          <Select<RoleValue>
            multiple={false}
            label="Role"
            options={roleOptions}
            value={role}
            placeholder="Select a role"
            error={submitted && !role}
            helperText={submitted && !role ? "Role is required." : undefined}
            onChange={setRole}
          />
          <RadioGroup<PlanValue>
            label="Plan"
            value={plan}
            data={planOptions}
            onChange={setPlan}
          />
          <CheckBoxGroup
            label="Compliance"
            value={agreements}
            data={[
              { text: "Security review completed", value: "security" },
              { text: "Data processing agreement accepted", value: "dpa" },
            ]}
            error={submitted && agreements.length === 0}
            helperText={submitted && agreements.length === 0 ? "Select at least one item." : undefined}
            onChange={setAgreements}
          />
          <SwitchButton checked={enabled} label="Enable workspace after approval" onChange={setEnabled} />
          <Flex gap={8} align="center">
            <Button
              text="Submit request"
              disabled={submitDisabled}
              onClick={() => setSubmitted(true)}
            />
            <Button
              text="Validate"
              variant="outlined"
              color="normal"
              onClick={() => setSubmitted(true)}
            />
          </Flex>
        </Flex>
      </Box>
    )
  },
}

export const SearchAndFilterScenario: Story = {
  render: () => {
    const [keyword, setKeyword] = useState("")
    const [status, setStatus] = useState<"all" | CustomerRow["status"]>("all")

    const filteredRows = customerRows.filter((row) => {
      const keywordMatched = filterRows([row], keyword).length > 0
      const statusMatched = status === "all" || row.status === status
      return keywordMatched && statusMatched
    })

    return (
      <Box p="24px" width="860px">
        <Typography variant="h3" text="Search and filter scenario" mb="16px" />
        <Flex gap={12} align="flex-end" mb="16px">
          <TextField
            label="Search customers"
            type="search"
            value={keyword}
            placeholder="Company, owner, status"
            onChange={(event) => setKeyword(event.target.value)}
            onSearch={setKeyword}
          />
          <Box width="240px">
            <Select<"all" | CustomerRow["status"]>
              multiple={false}
              label="Status"
              value={status}
              options={[
                { value: "all", label: "All" },
                { value: "Active", label: "Active" },
                { value: "Trial", label: "Trial" },
                { value: "Paused", label: "Paused" },
              ]}
              onChange={(next) => setStatus(next ?? "all")}
            />
          </Box>
          <Button text="Reset" variant="outlined" color="normal" onClick={() => {
            setKeyword("")
            setStatus("all")
          }} />
        </Flex>
        <Typography
          variant="b2Regular"
          text={`${filteredRows.length} matching customers`}
          color="text.secondary"
        />
      </Box>
    )
  },
}

export const ModalConfirmScenario: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [confirmed, setConfirmed] = useState(false)

    return (
      <Box p="24px">
        <Flex direction="column" gap={12} align="flex-start">
          <Button text="Archive project" color="secondary" onClick={() => setOpen(true)} />
          <Typography
            variant="b2Regular"
            text={confirmed ? "Project archived." : "No archive action has run."}
            color="text.secondary"
          />
        </Flex>
        <Modal
          open={open}
          title="Archive project"
          confirmText="Archive"
          closeText="Keep project"
          onClose={() => setOpen(false)}
          onConfirm={() => {
            setConfirmed(true)
            setOpen(false)
          }}
        >
          <Typography text="This operation is shown as a confirm flow with focus return and ESC close." />
        </Modal>
      </Box>
    )
  },
}

export const DrawerNavigationScenario: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState("Overview")

    return (
      <Box p="24px">
        <Button text="Open navigation" onClick={() => setOpen(true)} />
        <Typography variant="b2Regular" text={`Current section: ${selected}`} mt="12px" />
        <Drawer open={open} placement="left" onClose={() => setOpen(false)}>
          <Box p="16px" width="280px">
            <Typography variant="h3" text="Workspace" mb="16px" />
            <Flex direction="column" gap={8}>
              {["Overview", "Members", "Billing", "Audit log"].map((item) => (
                <Button
                  key={item}
                  text={item}
                  variant={selected === item ? "contained" : "text"}
                  color={selected === item ? "primary" : "normal"}
                  onClick={() => {
                    setSelected(item)
                    setOpen(false)
                  }}
                />
              ))}
            </Flex>
          </Box>
        </Drawer>
      </Box>
    )
  },
}

export const DataTableScenario: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 3,
      keyword: "",
      sort: { key: "id", direction: "ASC" },
    })
    const [exportMessage, setExportMessage] = useState("No export requested.")

    const columns = useMemo<ColumnProps<CustomerRow>[]>(() => {
      return customerColumns.map((column) => ({
        ...column,
        sortDirection: query.sort?.key === column.key ? query.sort.direction : undefined,
        onSortChange: (key, direction) => {
          setQuery((prev) => ({ ...prev, page: 1, sort: { key: String(key), direction } }))
        },
      }))
    }, [query.sort])

    const visible = useMemo(() => {
      const filtered = filterRows(customerRows, query.keyword)
      const sorted = sortRows(filtered, query)
      const start = (query.page - 1) * query.rowsPerPage
      return { total: sorted.length, rows: sorted.slice(start, start + query.rowsPerPage) }
    }, [query])

    return (
      <Box p="24px" width="960px">
        <Typography variant="h3" text="Data table scenario" mb="16px" />
        <Table<CustomerRow, CustomerExportType>
          tableKey="customer-operations"
          columnConfig={columns}
          data={visible.rows}
          getRowKey={(row) => row.id}
          query={query}
          totalCount={visible.total}
          rowsPerPageOptions={[3, 5, 10]}
          pagination="Table"
          totalRows
          rowsPer
          toolbar={{
            title: "Customers",
            searchEnabled: true,
            columnVisibilityEnabled: true,
            columns: columns.map((column) => ({
              key: String(column.key),
              title: String(column.title),
              hideable: column.key !== "id",
            })),
          }}
          exportEnabled
          exportItems={[
            { type: "csv", label: "CSV" },
            { type: "excel", label: "Excel" },
          ]}
          onExport={(type, context) => {
            const keyword = hasKeywordContext(context) ? context.keyword : ""
            setExportMessage(`Requested ${type} export for keyword "${keyword}".`)
          }}
          onQueryChange={setQuery}
        />
        <Typography variant="b3Regular" text={exportMessage} color="text.secondary" mt="12px" />
      </Box>
    )
  },
}

export const LoadingAndEmptyStateScenario: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)

    return (
      <Box p="24px" width="720px">
        <Flex justify="space-between" align="center" mb="16px">
          <Typography variant="h3" text="Loading and empty states" />
          <SwitchButton checked={loading} label="Loading" onChange={setLoading} />
        </Flex>

        {loading ? (
          <Flex direction="column" gap={12}>
            <Progress type="bar" variant="indeterminate" label="Loading data" />
            <Skeleton variant="rounded" width="100%" height="72px" />
            <Skeleton variant="rounded" width="100%" height="72px" />
          </Flex>
        ) : (
          <Flex direction="column" gap={12}>
            <Typography variant="b1Bold" text="No results" />
            <Typography
              variant="b2Regular"
              text="There is no data for the current filters. This state is useful after a completed request."
              color="text.secondary"
            />
          </Flex>
        )}
      </Box>
    )
  },
}

export const WorkflowTabsAndAccordionScenario: Story = {
  render: () => {
    const [tab, setTab] = useState<string | null>("request")
    const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(dayjs())

    return (
      <Box p="24px" width="760px">
        <Tabs
          value={tab}
          size="M"
          onSelect={(value) => setTab(value)}
          options={[
            { label: "Request", value: "request" },
            { label: "Review", value: "review" },
            { label: "Approval", value: "approval" },
          ]}
        />
        <Box mt="16px">
          <Accordion summary="Request details" defaultExpanded>
            <Flex direction="column" gap={12}>
              <DatePicker label="Due date" value={dueDate} onChange={setDueDate} clearable />
              <Tooltip content="Operational reviewers can inspect this date before approval.">
                <Button text="Hover for reviewer note" variant="outlined" color="normal" />
              </Tooltip>
            </Flex>
          </Accordion>
        </Box>
      </Box>
    )
  },
}
