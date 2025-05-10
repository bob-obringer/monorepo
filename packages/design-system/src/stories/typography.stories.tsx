import type { Meta, StoryObj } from "@storybook/react";
import { Typography, H1, H2, H3, P, Span, Div, H4 } from "../components/typography";

const child1 = "Fantasy sports bring a fun twist to traditional sports viewing.";
const child2 = `Strategy plays a huge role in fantasy sports. Managers must analyze player stats, injuries, and matchups to make informed decisions. The thrill of making the right call can lead to big wins, while poor choices can quickly derail a season.
  Fantasy sports have evolved significantly with technology. Real-time updates and mobile apps make it easy to manage teams on the go. The integration of advanced statistics and analytics tools has made the game more sophisticated. Players can now access detailed performance metrics and historical data to make better decisions.
  `;
const child3 = `Leagues can be casual or highly competitive. The social aspect is a big draw, as trash talk and camaraderie enhance the experience. Many platforms offer tools and resources to help players improve their game.`;

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  argTypes: {
    as: {
      table: { disable: true },
    },
    variant: {
      control: "select",
      options: [
        "",
        "display",
        "heading-1",
        "heading-2",
        "heading-3",
        "heading-4",
        "heading-5",
        "title",
        "subhead",
        "menu",
        "button-xlarge",
        "button-large",
        "button-small",
        "cta-large",
        "cta-small",
        "body-marketing",
        "body-large",
        "body-medium",
        "body-small",
        "body-xsmall",
        "caption",
        "overline",
        "footnote",
        "score-medium",
      ],
      description: "The typographic fontStyle",
      table: { category: "Style" },
    },
    color: {
      control: "select",
      options: ["", "bright", "neutral-200", "neutral-300", "neutral-400"],
      description: "Text color variant",
      table: { category: "Style" },
    },
    // -- Font Weight --
    medium: {
      control: "boolean",
      description: "Use font-medium",
      table: { category: "Style" },
    },
    semibold: {
      control: "boolean",
      description: "Use font-semibold",
      table: { category: "Style" },
    },
    bold: {
      control: "boolean",
      description: "Use font-bold",
      table: { category: "Style" },
    },
    // -- Font Style --
    italic: {
      control: "boolean",
      description: "Use italic style",
      table: { category: "Style" },
    },
    // -- Decoration --
    underline: {
      control: "boolean",
      description: "Add underline decoration",
      table: { category: "Style" },
    },
    lineThrough: {
      control: "boolean",
      description: "Add line-through decoration",
      table: { category: "Style" },
    },
    // -- Transform --
    uppercase: {
      control: "boolean",
      description: "Transform text to uppercase",
      table: { category: "Style" },
    },
    lowercase: {
      control: "boolean",
      description: "Transform text to lowercase",
      table: { category: "Style" },
    },
    capitalize: {
      control: "boolean",
      description: "Capitalize text",
      table: { category: "Style" },
    },
    // -- Alignment --
    left: {
      control: "boolean",
      description: "Align text to the left",
      table: { category: "Layout" },
    },
    center: {
      control: "boolean",
      description: "Align text to the center",
      table: { category: "Layout" },
    },
    right: {
      control: "boolean",
      description: "Align text to the right",
      table: { category: "Layout" },
    },
    // -- Wrapping & Layout --
    balance: {
      control: "boolean",
      description: "Use text-wrap: balance",
      table: { category: "Layout" },
    },
    pretty: {
      control: "boolean",
      description: "Use text-wrap: pretty",
      table: { category: "Layout" },
    },
    nowrap: {
      control: "boolean",
      description: "Prevent text wrapping",
      table: { category: "Layout" },
    },
    // -- Overflow --
    overflowHidden: {
      control: "boolean",
      description: "Hide overflowing text",
      table: { category: "Overflow" },
    },
    clip: {
      control: "boolean",
      description: "Clip overflowing text",
      table: { category: "Overflow" },
    },
    ellipsis: {
      control: "boolean",
      description: "Show ellipsis for overflowing text",
      table: { category: "Overflow" },
    },
    clamp: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "Clamp text to a number of lines (0 to disable)",
      table: { category: "Overflow" },
    },
    // -- Margin --
    margin: {
      control: "boolean",
      description: "Top margin applied if not the first child",
      table: { category: "Layout" },
    },
    className: {
      control: "text",
      description: "Optional additional CSS classes",
      table: { category: "Style" },
    },
    asChild: {
      table: { disable: true },
    },
    ref: {
      table: { disable: true },
    },
    children: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Component Specific Stories ---

const storyArgs = { child1, child2, child3 };
const storyArgTypes = {
  child1: { control: "text", description: "First child text", table: { category: "Content" } },
  child2: { control: "text", description: "Second child text", table: { category: "Content" } },
  child3: { control: "text", description: "Third child text", table: { category: "Content" } },
} as const;

export const H1Story: Story = {
  name: "H1 Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <H1 {...args}>{child1}</H1>
      <H1 {...args}>{child2}</H1>
      <H1 {...args}>{child3}</H1>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};

export const H2Story: Story = {
  name: "H2 Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <H2 {...args}>{child1}</H2>
      <H2 {...args}>{child2}</H2>
      <H2 {...args}>{child3}</H2>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};

export const H3Story: Story = {
  name: "H3 Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <H3 {...args}>{child1}</H3>
      <H3 {...args}>{child2}</H3>
      <H3 {...args}>{child3}</H3>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};

export const H4Story: Story = {
  name: "H4 Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <H4 {...args}>{child1}</H4>
      <H4 {...args}>{child2}</H4>
      <H4 {...args}>{child3}</H4>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};

export const PStory: Story = {
  name: "P Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <P {...args}>{child1}</P>
      <P {...args}>{child2}</P>
      <P {...args}>{child3}</P>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};

export const SpanStory: Story = {
  name: "Span Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <Span {...args}>{child1}</Span>
      <Span {...args}>{child2}</Span>
      <Span {...args}>{child3}</Span>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};

export const DivStory: Story = {
  name: "Div Component",
  render: ({ child1, child2, child3, ...args }) => (
    <>
      <Div {...args}>{child1}</Div>
      <Div {...args}>{child2}</Div>
      <Div {...args}>{child3}</Div>
    </>
  ),
  args: storyArgs,
  argTypes: storyArgTypes,
};
