import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import TreeView, { type TreeNodeType } from "./TreeView"
import Flex from "../Flex/Flex"

const sampleItems: TreeNodeType[] = [
  {
    id: "1",
    label: "Root",
    icon: "Folder",
    children: [
      {
        id: "1-1",
        label: "Child 1",
        icon: "File",
      },
      {
        id: "1-2",
        label: "Child 2",
        icon: "File",
      },
    ],
  },
]

const deepItems: TreeNodeType[] = [
  {
    id: "1",
    label: "Level 1",
    icon: "Folder",
    children: [
      {
        id: "1-1",
        label: "Level 2",
        icon: "Folder",
        children: [
          {
            id: "1-1-1",
            label: "Level 3",
            icon: "File",
          },
        ],
      },
    ],
  },
]

const meta: Meta<typeof TreeView> = {
  title: "Navigation/TreeView",
  component: TreeView,
  argTypes: {
    expandOnLabelClick: { control: "boolean" },
    showHeaderControls: { control: "boolean" },
    showFooterButtons: { control: "boolean" },
    size: {
      control: "select",
      options: ["S", "M", "L"],
    },
    onSelect: { action: "select" },
  },
}

export default meta

type Story = StoryObj<typeof TreeView>

export const Playground: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null)
    const [expanded, setExpanded] = useState<string[]>([])

    return (
      <TreeView
        {...args}
        items={sampleItems}
        selectedId={selected}
        expandedIds={expanded}
        onSelect={(id, node) => {
          setSelected(id)
          args.onSelect?.(id, node)
        }}
        onExpandedChange={setExpanded}
      />
    )
  },
}

export const Basic: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null)

    return <TreeView items={sampleItems} selectedId={selected} onSelect={(id) => setSelected(id)} />
  },
}

export const DeepTree: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null)

    return <TreeView items={deepItems} selectedId={selected} onSelect={(id) => setSelected(id)} />
  },
}

export const ExpandOnLabel: Story = {
  render: () => {
    return <TreeView items={sampleItems} expandOnLabelClick />
  },
}

export const DisabledNodes: Story = {
  render: () => {
    return (
      <TreeView
        items={[
          {
            id: "1",
            label: "Disabled Root",
            disabled: true,
            children: [{ id: "1-1", label: "Child", disabled: true }],
          },
        ]}
      />
    )
  },
}

export const WithoutControls: Story = {
  render: () => {
    return <TreeView items={sampleItems} showHeaderControls={false} showFooterButtons={false} />
  },
}

export const Sizes: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={20}>
        <TreeView items={sampleItems} size="S" />
        <TreeView items={sampleItems} size="M" />
        <TreeView items={sampleItems} size="L" />
      </Flex>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null)

    return (
      <Flex direction="column" gap={24}>
        <TreeView items={sampleItems} selectedId={selected} onSelect={(id) => setSelected(id)} />

        <TreeView items={deepItems} expandOnLabelClick />

        <TreeView items={sampleItems} showHeaderControls showFooterButtons />
      </Flex>
    )
  },
}
