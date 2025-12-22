# OpenSCI 语义化 Design Tokens

> **设计哲学：** "Scientific Editorial" - 数字实验室笔记本与高端时尚杂志的融合  
> **核心特质：** "Structured Fluidity" - 刚性网格与锐利边框包裹流动动画

---

## 目录

1. [颜色系统](#颜色系统)
2. [排版系统](#排版系统)
3. [间距与圆角](#间距与圆角)
4. [组件模式](#组件模式)
5. [动效系统](#动效系统)
6. [工具类](#工具类)

---

## 颜色系统

### 核心语义 Tokens

| Token | 用途 | Light Mode | Dark Mode |
|-------|------|------------|-----------|
| `--background` | 页面背景 | `hsl(0 0% 96.1%)` #F5F5F5 | `hsl(0 0% 0%)` #000000 |
| `--foreground` | 主要文本 | `hsl(222.2 47.4% 11.2%)` | `hsl(0 0% 90%)` #E6E6E6 |
| `--card` | 卡片/容器背景 | `hsl(0 0% 100%)` #FFFFFF | `hsl(0 0% 4.7%)` #0C0C0C |
| `--card-foreground` | 卡片内文本 | `hsl(222.2 47.4% 11.2%)` | `hsl(0 0% 80%)` #CDCDCD |

### 交互语义 Tokens

| Token | 用途 | Light Mode | Dark Mode |
|-------|------|------------|-----------|
| `--primary` | 主要操作/强调 | `hsl(222.2 47.4% 11.2%)` | `hsl(0 0% 100%)` #FFFFFF |
| `--primary-foreground` | 主要操作上的文本 | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` |
| `--secondary` | 次要操作背景 | `hsl(0 0% 97.3%)` | `hsl(0 0% 8%)` |
| `--secondary-foreground` | 次要操作文本 | `hsl(222.2 47.4% 11.2%)` | `hsl(0 0% 80%)` |
| `--accent` | 悬停/激活状态 | `hsl(0 0% 95%)` | `hsl(0 0% 10%)` |
| `--accent-foreground` | 激活状态文本 | `hsl(222.2 47.4% 11.2%)` | `hsl(0 0% 80%)` |
| `--muted` | 禁用/弱化背景 | `hsl(0 0% 95%)` | `hsl(0 0% 10%)` |
| `--muted-foreground` | 弱化文本/元数据 | `hsl(222.2 10% 40%)` | `hsl(0 0% 60%)` |

### 边界与输入 Tokens

| Token | 用途 | Light Mode | Dark Mode |
|-------|------|------------|-----------|
| `--border` | 边框/分隔线 | `hsl(240 2% 90.4%)` | `hsl(0 0% 15.3%)` #272727 |
| `--input` | 输入框边框 | `hsl(240 2% 90.4%)` | `hsl(0 0% 24%)` |
| `--ring` | 焦点环 | `hsl(222.2 47.4% 11.2%)` | `hsl(0 0% 80%)` |

### 状态语义 Tokens

| Token | 用途 | Light Mode | Dark Mode |
|-------|------|------------|-----------|
| `--destructive` | 危险/删除操作 | `hsl(0 84.2% 60.2%)` | `hsl(0 62.8% 30.6%)` |
| `--destructive-foreground` | 危险操作文本 | `hsl(0 0% 98%)` | `hsl(0 0% 98%)` |
| `--success` | 成功状态 | `hsl(142 71% 45%)` | `hsl(142 71% 50%)` |
| `--success-foreground` | 成功状态文本 | `hsl(0 0% 98%)` | `hsl(0 0% 10%)` |
| `--warning` | 警告状态 | `hsl(35 92% 50%)` | `hsl(35 92% 58%)` |
| `--warning-foreground` | 警告状态文本 | `hsl(24 100% 10%)` | `hsl(0 0% 10%)` |
| `--info` | 信息提示 | `hsl(221 83% 53%)` | `hsl(221 83% 60%)` |
| `--info-foreground` | 信息提示文本 | `hsl(0 0% 98%)` | `hsl(0 0% 10%)` |

### 品牌与特殊 Tokens

| Token | 用途 | Light Mode | Dark Mode |
|-------|------|------------|-----------|
| `--brand` | 品牌色 | `hsl(271 81% 56%)` | `hsl(271 81% 65%)` |
| `--brand-foreground` | 品牌色上的文本 | `hsl(0 0% 98%)` | `hsl(0 0% 10%)` |
| `--scrim` | 遮罩层 | `hsl(0 0% 0%)` | `hsl(0 0% 0%)` |
| `--ink-tertiary` | 三级文本（自定义） | `hsl(222.2 10% 60%)` | `hsl(0 0% 40%)` |

---

## 排版系统

### 字体家族

| Token | 字体栈 | 用途 |
|-------|--------|------|
| `font-sans` | `'MiSans', 'Inter', sans-serif` | 标题、正文、所有文本内容 |
| `font-mono` | `'JetBrains Mono', monospace` | 标签、元数据、按钮 |

> **注意：** 本设计系统不使用衬线体（serif），所有文本统一使用无衬线字体，以保持科学文档的现代感和一致性。

### 字重规范

| 元素 | 字重 | 类名 |
|------|------|------|
| 主标题 | Bold (700) | `font-bold` |
| 副标题 | Semibold (600) | `font-semibold` |
| 正文 | Regular (400) | `font-normal` |
| 标签/元数据 | Bold (700) | `font-bold` |

### 字间距规范

| 类名 | 值 | 用途 |
|------|-----|------|
| `tracking-headline` | `-0.02em` | 大标题 |
| `tracking-tight` | `-0.025em` | 中等标题 |
| `tracking-normal` | `0` | 正文 |
| `tracking-widest` | `0.1em` | 按钮、标签（大写） |
| `tracking-technical` | `0.1em` | 技术标签 |

### 行高规范

| 类名 | 值 | 用途 |
|------|-----|------|
| `leading-headline` | `0.9` | 大标题 |
| `leading-tight` | `1.25` | 副标题 |
| `leading-relaxed` | `1.625` | 正文 |

### 文本透明度层级

| 语义 | Tailwind 类 | 用途 |
|------|-------------|------|
| 主要文本 | `text-foreground` | 标题、重要内容 |
| 次要文本 | `text-foreground/70` | 描述、说明 |
| 弱化文本 | `text-muted-foreground` | 元数据、标签 |
| 禁用文本 | `text-foreground/40` | 占位符、禁用状态 |

---

## 间距与圆角

### 圆角规范

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius` | `0.125rem` (2px) | 默认圆角（近乎直角） |
| `rounded-sm` | `calc(var(--radius))` | 卡片、容器 |
| `rounded-full` | `9999px` | 按钮、徽章、标签 |

### 间距规范

| 元素 | 内边距 | 外边距 |
|------|--------|--------|
| 卡片 | `p-8` / `p-10` | - |
| 按钮 (默认) | `px-6 py-2` | - |
| 按钮 (大) | `px-8 py-5` | - |
| 容器最大宽度 | `max-w-[1512px]` | `mx-auto` |
| 页面内边距 | `p-8 md:p-16` | - |

### 布局规则

| 场景 | 规则 |
|------|------|
| 详情页左右模块 | 左右内容模块之间必须有垂直分割线 `border-l border-border` |
| 模块间距 | 左右模块使用 `gap-12` 间距 |
| 详情页内容区块 | 除右侧边栏顶部操作卡片外，其余内容不使用卡片样式（bg-card + border），统一用分割线 `border-t border-border pt-8 mt-8` 区分各区块 |
| 右侧操作卡片 | 仅边栏顶部的核心操作卡片（如资助/购买按钮区）保留 `bg-card border border-border` 样式 |
| 首页卡片列表 | 卡片之间无间距 `gap-0`，卡片边框自然贴合形成网格线效果 |
| 首页模块分隔 | 以垂直留白（如 `py-24`）区分内容板块，不再使用分割线 |
| 页面背景 | 整体背景统一使用 `bg-background`，不使用分区背景色差异，通过边框和分割线区分内容 |

```tsx
// 详情页左右布局示例
<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
  {/* 左侧主内容 - 各区块用分割线区分 */}
  <div className="lg:col-span-2 space-y-12">
    <div className="pb-10 border-b border-border">区块1</div>
    <div className="pt-10 pb-10 border-b border-border">区块2</div>
    <div className="pt-10">区块3（最后一个无底边框）</div>
  </div>
  
  {/* 右侧边栏 - 带左边框分割线 */}
  <div className="lg:col-span-1 lg:border-l lg:border-border lg:pl-12">
    {/* 仅操作卡片保留卡片样式 */}
    <div className="bg-card border border-border p-8 rounded-sm">操作按钮区</div>
    {/* 其他内容用分割线 */}
    <div className="pt-8 border-t border-border">其他信息区块</div>
  </div>
</div>
```

---

## 组件模式

### 按钮 (Buttons)

#### Primary Button
```tsx
<button className="bg-primary text-primary-foreground rounded-full font-mono text-base font-bold uppercase tracking-widest py-5 px-8 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
  Back this Project
</button>
```

#### Secondary Button
```tsx
<button className="bg-transparent border border-border text-foreground rounded-full font-mono text-sm font-bold uppercase tracking-widest py-4 px-6 hover:bg-accent transition-colors">
  View All
</button>
```

#### Ghost Button
```tsx
<button className="text-foreground/60 hover:text-accent font-mono text-xs font-bold uppercase tracking-widest transition-colors border-b border-transparent hover:border-accent">
  View All
</button>
```

#### Disabled Button
```tsx
<button className="bg-muted/5 text-foreground/40 rounded-full font-mono text-base font-bold uppercase tracking-widest py-5 px-8 cursor-not-allowed border border-border" disabled>
  Coming Soon
</button>
```

### 卡片 (Cards)

#### 基础卡片
```tsx
<div className="bg-card border border-border p-10 shadow-sm rounded-none">
  {/* 内容 */}
</div>
```

#### 交互式卡片
```tsx
<div className="border border-border bg-card rounded-sm hover:bg-accent transition-colors group">
  <img className="card-image" /> {/* grayscale → color on hover */}
</div>
```

### 玻璃面板 (Glass Panel)

```tsx
// 标准玻璃面板
<header className="glass-panel">
  {/* bg-background/90 backdrop-blur-md border-b border-border */}
</header>

// 实心玻璃面板（用于需要更高不透明度的场景）
<header className="glass-panel-solid">
  {/* 98% opacity with blur */}
</header>
```

### 徽章 & 标签 (Badges)

#### 分类徽章
```tsx
<span className="bg-muted border border-border rounded-full text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1">
  Category
</span>
```

#### 状态徽章
```tsx
// 成功状态
<span className="bg-success/10 text-success px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
  Completed
</span>

// 主要状态
<span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
  Research Phase
</span>
```

### 输入框 (Inputs)

```tsx
<input 
  type="text"
  className="w-full bg-transparent border-b border-border text-foreground font-mono text-lg py-3 focus:outline-none focus:border-ring transition-colors placeholder:text-muted-foreground"
  placeholder="Enter value..."
/>
```

### 分隔线 (Dividers)

```tsx
// 细线分隔
<div className="border-t border-border" />

// 粗线分隔（用于区块划分）
<div className="border-t-2 border-border" />
```

### 进度条 (Progress Bar)

```tsx
<div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
  <div 
    className="h-full bg-primary transition-all" 
    style={{ width: `${percent}%` }}
  />
</div>
```

### 里程碑进度条 (Milestone Progress)

```tsx
<div className="flex items-center space-x-1 h-2 rounded-full overflow-hidden">
  {milestones.map((m, idx) => (
    <div 
      key={idx} 
      className={`h-full flex-1 ${
        m.status === 'COMPLETED' ? 'bg-success' :
        m.status === 'IN_PROGRESS' ? 'bg-success/50' :
        'bg-primary/10'
      }`}
    />
  ))}
</div>
```

---

## 动效系统

### 入场动画

```css
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-entry {
  animation: slide-up-fade 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```

### 图片悬停效果

```css
.card-image {
  filter: grayscale(100%);
  transition: all 0.3s ease-out;
}

.card-image:hover,
.group:hover .card-image {
  filter: grayscale(0%);
  transform: scale(1.05);
}
```

### 按钮交互

```tsx
// 缩放效果
className="hover:scale-[1.02] active:scale-[0.98] transition-all"

// 背景渐变
className="hover:bg-primary/90 transition-colors"
```

### 过渡时长规范

| 元素 | 时长 | 缓动函数 |
|------|------|----------|
| 颜色变化 | `300ms` | `ease` |
| 缩放变化 | `200ms` | `ease-out` |
| 入场动画 | `500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| 图片悬停 | `300ms` | `ease-out` |
| 背景图缩放 | `2000ms` | `ease` |

---

## 工具类

### 自定义工具类

| 类名 | 描述 |
|------|------|
| `.glass-panel` | 玻璃面板效果（90% 不透明度 + 模糊） |
| `.glass-panel-solid` | 实心玻璃面板（98% 不透明度） |
| `.card-image` | 卡片图片悬停效果（灰度 → 彩色） |
| `.animate-entry` | 入场动画 |
| `.tracking-headline` | 标题字间距 |
| `.tracking-technical` | 技术标签字间距 |
| `.leading-headline` | 标题行高 |
| `.force-border-white` | 强制白色边框（覆盖暗色模式） |

### 图标规范 (Lucide React)

```tsx
import { ArrowRight, ExternalLink, Clock } from "lucide-react"

// 标准图标
<ArrowRight size={14} className="mr-2" />

// 细描边图标
<Share2 size={18} strokeWidth={1.5} />

// 小尺寸图标
<Clock size={12} className="mr-2" />
```

---

## 快速参考表

| 元素 | Tailwind 类模式 |
|------|----------------|
| **大标题** | `font-sans text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[0.95]` |
| **小标题** | `font-sans text-xl font-bold text-foreground` |
| **正文** | `font-sans text-base text-foreground/70 leading-relaxed` |
| **元数据标签** | `font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest` |
| **主按钮** | `bg-primary text-primary-foreground rounded-full font-mono font-bold uppercase tracking-widest hover:scale-[1.02]` |
| **次按钮** | `bg-transparent border border-border text-foreground rounded-full font-mono font-bold uppercase hover:bg-accent` |
| **卡片容器** | `bg-card border border-border p-8 shadow-sm rounded-none` |
| **玻璃面板** | `bg-background/90 backdrop-blur-md border-b border-border` |
| **分隔线** | `border-t border-border` |
| **徽章** | `bg-muted border border-border rounded-full text-[10px] font-mono uppercase tracking-widest px-3 py-1` |
| **进度条** | `w-full h-2 bg-primary/10 rounded-full overflow-hidden` |

---

## CSS 变量速查

```css
/* 在 Tailwind 中使用 */
.custom-element {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}

/* 带透明度 */
.custom-element {
  background-color: hsl(var(--primary) / 0.1);
  border-color: hsl(var(--border) / 0.5);
}
```

---

*文档生成日期: 2025-12-12*  
*基于: opensci-theme.css v1.0*
