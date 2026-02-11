import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

/** @type {import("@storybook/react-vite").StorybookConfig} */
const config = {
  stories: ["../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: { toolbar: false },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [
    {
      from: resolve(dirname(fileURLToPath(import.meta.url)), "../../../public"),
      to: "/",
    },
  ],
  async viteFinal(viteConfig) {
    const __dirname = dirname(fileURLToPath(import.meta.url))

    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, "../../../packages/ui/src/components/Icon/svgs")],
        symbolId: "icon-[name]",
      }),
    ]

    return viteConfig
  },
}

export default config
