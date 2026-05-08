# Antd 6 Select 字体异常复现报告

## 结论

当前 demo 已稳定复现：

- `Antd Select` 收起态已选值字体跟随外层继承，当前为 `Times`
- `Antd Typography` / `Antd Input` / `Antd TextArea` / `Antd Button` 仍使用 Antd 默认 `--ant-font-family`
- `Antd Select` 展开后的下拉面板也仍使用 Antd 默认 `--ant-font-family`

结果：同一个 `Select` 组件，收起态与展开态字体不一致；`Select` 与其它 Antd 输入类组件也不一致。

## 环境

- `antd`: `6.3.7`
- `react`: `18.2.0`
- `vite`: `8.0.11`
- 浏览器：本地实测 Chrome

## 复现步骤

```bash
pnpm install
pnpm dev
```

打开页面后，不做任何额外操作，默认页态即可复现。

## 实测结果

默认页态：`html lang` 未设置。

| 类型 | 文本 | computed font-family |
| --- | --- | --- |
| 纯文本 | `Ag 字体 ABC 中文 123` | `Times` |
| Antd Typography | `Ag 字体 ABC 中文 123` | `-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| 原生 select | `Ag 字体 ABC 中文 123` | `Arial` |
| Antd Select | `Ag 字体 ABC 中文 123` | `Times` |
| 原生 input | `Ag 字体 ABC 中文 123` | `Arial` |
| Antd Input | `Ag 字体 ABC 中文 123` | `-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| 原生 textarea | `Ag 字体 ABC 中文 123` | `monospace` |
| Antd TextArea | `Ag 字体 ABC 中文 123` | `-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| 原生 button | `Ag 字体 ABC 中文 123` | `Arial` |
| Antd Button | `Ag 字体 ABC 中文 123` | `-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |

补充实测：

- `Antd Select` 收起态已选值：`Times`
- `Antd Select` 下拉面板：`-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`

## 预期行为

至少应满足其一：

1. `Antd Select` 与其它 Antd 组件一致，默认使用 `--ant-font-family`
2. `Antd Select` 收起态与展开态保持同一套字体策略

当前实现两者都未满足。

## 根因分析

DevTools 实测样式可见两套规则：

```css
:where(.css-dev-only-do-not-override-xxx).ant-select {
  font-family: var(--ant-font-family);
}

:where(.css-dev-only-do-not-override-xxx).ant-select {
  font-family: inherit;
}

:where(.css-dev-only-do-not-override-xxx).ant-select-dropdown {
  font-family: var(--ant-font-family);
}
```

关键点：

- 收起态根节点 `.ant-select` 最终命中 `font-family: inherit`
- 已选值容器 `.ant-select-content` 未重新指定字体，因此继续继承外层
- 下拉面板 `.ant-select-dropdown` 明确使用 `var(--ant-font-family)`

所以最终表现为：

- 收起态已选值跟随页面外层字体
- 展开态选项列表跟随 Antd 主题字体

这不是 demo 自己给 `Select` 单独设字造成的，而是组件默认样式策略不一致。

## 影响

- 同页内 `Select` 与 `Input` / `Button` / `Typography` 视觉不统一
- 中英文混排时，收起态可能落到浏览器默认 serif 字体，观感更明显
- 页面外层若依赖 `lang`、UA 默认字体、文章排版字体，`Select` 更容易出现意外回退

## 临时规避

业务侧可先强制把 `Select` 拉回 Antd 默认字体：

```tsx
<Select style={{ fontFamily: "var(--ant-font-family)" }} />
```

或：

```css
.ant-select {
  font-family: var(--ant-font-family);
}
```

## 建议给 Antd 的问题描述

`antd@6.3.7` 中，`Select` 收起态根节点最终为 `font-family: inherit`，但下拉面板仍为 `font-family: var(--ant-font-family)`。这会导致：

- 收起态已选值字体跟随外层继承
- 展开态选项字体跟随 Antd 主题
- 与 `Input` / `Button` / `Typography` 等组件默认字体策略不一致

建议统一 `Select` 收起态与展开态的默认字体来源。
