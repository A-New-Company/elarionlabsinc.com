# Elarion Labs — 设计与实施文档

> 智能健康与健身系统 · 高端落地页 (Landing Page) + 邮箱预注册
> 域名：`elarionlabsinc.com`
> 文档版本：v1.0 · 2026-06-05

---

## 目录

1. [项目概述与品牌定位](#1-项目概述与品牌定位)
2. [技术栈与架构](#2-技术栈与架构)
3. [设计系统 (Design System)](#3-设计系统-design-system)
4. [页面结构与信息架构](#4-页面结构与信息架构)
5. [区块逐一设计规格](#5-区块逐一设计规格)
6. [动画系统 (Motion System)](#6-动画系统-motion-system)
7. [滚动与页面过渡](#7-滚动与页面过渡)
8. [响应式与自适应策略](#8-响应式与自适应策略)
9. [预注册系统 (Pre-registration)](#9-预注册系统-pre-registration)
10. [组件库规格](#10-组件库规格)
11. [性能预算与优化](#11-性能预算与优化)
12. [无障碍 (A11y) 与 SEO](#12-无障碍-a11y-与-seo)
13. [目录结构与工程约定](#13-目录结构与工程约定)
14. [实施路线图](#14-实施路线图)

---

## 1. 项目概述与品牌定位

### 1.1 一句话定位
**Elarion Labs** 是一套由 AI 驱动的个人健康与健身系统——它不只是记录数据，而是像一位懂你的私人教练，持续观察、激励并陪伴你进化。

### 1.2 设计目标
本站是一个 **pre-launch 预注册落地页**，核心目标按优先级：

1. **建立高端感知**：在 3 秒内让访客感到"这是一个有质感、有未来感的科技品牌"。
2. **转化预注册**：引导访客留下姓名 + 邮箱，进入早期访问名单 (Early Access Waitlist)。
3. **传达产品价值**：用最少的文字 + 最强的视觉，讲清"AI 教练 + 身体扫描 + 个性化营养"。

### 1.3 参考与差异化
参考 [tea-ai.co](https://tea-ai.co/) 的叙事节奏（aspirational headline → 能力展开 → 重复 CTA），但在以下维度做到**更高级**：

| 维度 | tea-ai 风格 | Elarion 升级方向 |
|------|------------|-----------------|
| 视觉基调 | 明亮、活泼 | 深色 + 玻璃拟态 + 极光光晕，电影级质感 |
| 排版 | 大号粗体 | 超大 Display 字 + 精细字距，瑞士网格 |
| 动效 | 标准滚动出现 | 滚动驱动叙事、3D 视差、流体光效 |
| 交互 | 表单提交 | 多步丝滑表单 + 微交互反馈 + 成功态动画 |

### 1.4 关键词 / 情绪板 (Mood)
`未来感 (Futuristic)` · `冷静专业 (Clinical-calm)` · `生命力 (Vital)` · `精密 (Precision)` · `信任 (Trust)`

视觉锚点：极光渐变、生物律动波形、玻璃质感卡片、柔和体积光、有机流体形状。

---

## 2. 技术栈与架构

### 2.1 推荐技术栈

| 层 | 选型 | 理由 |
|----|------|------|
| 框架 | **Next.js 15 (App Router)** + React 19 | SSR/SSG、内置图像优化、API Routes 处理预注册、SEO 友好 |
| 语言 | **TypeScript** | 类型安全，组件契约清晰 |
| 样式 | **Tailwind CSS v4** + CSS Variables | 原子化、设计 token 驱动、易做响应式 |
| 动画 | **Framer Motion** (主) + **GSAP + ScrollTrigger** (滚动叙事) | Framer 做组件级微交互，GSAP 做时间线/滚动驱动 |
| 3D / 光效 | **React Three Fiber + drei** (可选，按需懒加载) | Hero 的 3D 流体/粒子 |
| 平滑滚动 | **Lenis** | 惯性平滑滚动，是高端质感的关键 |
| 表单 | **React Hook Form** + **Zod** 校验 | 体验流畅、校验健壮 |
| 数据存储 | **Resend** (邮件) + **Supabase / Postgres** 或 **Airtable** | 存名单 + 发送欢迎邮件 |
| 部署 | **Vercel** | 与 Next.js 原生集成、边缘网络、自动 HTTPS |
| 分析 | **Vercel Analytics** + **Plausible** | 隐私友好的转化追踪 |

### 2.2 渲染策略
- 落地页本体：**SSG (静态生成)**，CDN 边缘缓存，首屏极快。
- 预注册接口：**Edge API Route** (`/api/waitlist`)，低延迟。
- 重资源 (3D / 视频)：**懒加载 + 占位**，不阻塞首屏。

### 2.3 渐进增强 (Progressive Enhancement)
- 无 JS 时：表单仍可通过原生 `<form action>` 提交（fallback）。
- 弱设备 / `prefers-reduced-motion`：自动降级为淡入，关闭视差与 3D。

---

## 3. 设计系统 (Design System)

> 所有数值以 CSS Custom Properties 形式集中在 `:root`，便于主题切换与维护。

### 3.1 色彩 (Color Tokens)

深色为主基调，辅以极光强调色。

```css
:root {
  /* —— 背景层 —— */
  --bg-base:        #05060A;   /* 近黑，主背景 */
  --bg-elevated:    #0B0E17;   /* 卡片/抬升面 */
  --bg-glass:       rgba(255,255,255,0.04); /* 玻璃面 */
  --bg-glass-brd:   rgba(255,255,255,0.08); /* 玻璃描边 */

  /* —— 文本 —— */
  --text-primary:   #F4F6FB;   /* 主文本 */
  --text-secondary: #A6AEC2;   /* 次要 */
  --text-muted:     #5A6178;   /* 弱化/标签 */

  /* —— 品牌强调 (极光) —— */
  --accent-aurora:  #6EE7F9;   /* 青电光，主强调 */
  --accent-mint:    #4ADE9E;   /* 生命力绿（健康/成功） */
  --accent-violet:  #A78BFA;   /* 紫，未来感 */
  --accent-coral:   #FB7185;   /* 珊瑚，能量/警示点缀 */

  /* —— 功能色 —— */
  --success:        #4ADE9E;
  --error:          #FB7185;
  --warning:        #FBBF24;

  /* —— 渐变 —— */
  --grad-aurora: linear-gradient(135deg, #6EE7F9 0%, #A78BFA 50%, #4ADE9E 100%);
  --grad-halo:   radial-gradient(60% 60% at 50% 40%,
                  rgba(110,231,249,0.25) 0%, rgba(167,139,250,0.12) 40%,
                  transparent 70%);
  --grad-text:   linear-gradient(120deg, #F4F6FB 0%, #A6AEC2 100%);
}
```

**对比度规范**：主文本对背景 ≥ 7:1 (AAA)；次要文本 ≥ 4.5:1 (AA)。

### 3.2 字体 (Typography)

```css
:root {
  /* 字族 */
  --font-display: 'Clash Display', 'Satoshi', system-ui, sans-serif; /* 标题 */
  --font-body:    'Inter', 'Satoshi', system-ui, sans-serif;         /* 正文 */
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;          /* 数据/标签 */
}
```

**字阶 (Type Scale)** — 采用流式排版 `clamp()`，跨断点平滑缩放：

| 级别 | 用途 | clamp 值 | 字重 | 字距 |
|------|------|----------|------|------|
| Display XL | Hero 主标题 | `clamp(2.75rem, 7vw, 6.5rem)` | 600 | -0.03em |
| Display L | 区块大标题 | `clamp(2rem, 4.5vw, 4rem)` | 600 | -0.02em |
| Heading | 卡片/子标题 | `clamp(1.25rem, 2vw, 1.75rem)` | 500 | -0.01em |
| Body L | 引导段落 | `clamp(1.05rem, 1.4vw, 1.3rem)` | 400 | 0 |
| Body | 正文 | `1rem` | 400 | 0 |
| Caption | 标签/脚注 | `0.8125rem` | 500 | 0.04em (大写时) |

行高：标题 1.05–1.1，正文 1.6。

### 3.3 间距与栅格 (Spacing & Grid)

- **基础单位**：4px。间距 token：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160`。
- **栅格**：12 列流式栅格，gutter `clamp(16px, 2vw, 32px)`。
- **内容最大宽度**：`--container: 1280px`；窄文本块 `--measure: 68ch`。
- **区块垂直节奏**：每个 section 上下 padding `clamp(96px, 14vh, 200px)`。

### 3.4 圆角、阴影、模糊

```css
:root {
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  --shadow-soft:  0 8px 30px rgba(0,0,0,0.35);
  --shadow-glow:  0 0 60px rgba(110,231,249,0.25);
  --blur-glass:   blur(20px) saturate(140%);
}
```

### 3.5 设计原则
1. **留白即奢华**：宁可少而精，大量负空间。
2. **一个画面一个焦点**：每屏只讲一件事。
3. **光是主角**：用体积光、光晕、渐变营造氛围，而非堆叠装饰。
4. **动效有意义**：每个动画服务于引导注意力或反馈，不为动而动。

---

## 4. 页面结构与信息架构

单页 (one-page) 纵向叙事，锚点导航。区块顺序：

```
┌─────────────────────────────────────────┐
│ 00 · 顶部导航 (Sticky Nav)                │  ← 透明→玻璃，滚动收缩
├─────────────────────────────────────────┤
│ 01 · Hero 英雄区                          │  ← 3D/流体光 + 主标题 + 预注册入口
├─────────────────────────────────────────┤
│ 02 · 信任条 (Trust Bar / 滚动 Logo)       │  ← "被信任" 媒体/数据条
├─────────────────────────────────────────┤
│ 03 · 价值主张 (The Promise)               │  ← Coach · Cheer · Evolve 三支柱
├─────────────────────────────────────────┤
│ 04 · 能力展示 (Capabilities)              │  ← 粘性滚动 (sticky) 横向叙事卡片
│      · Visual Body Scan                   │
│      · Personalized Nutrition             │
│      · Adaptive Training                   │
│      · Emotional Support                   │
├─────────────────────────────────────────┤
│ 05 · 产品预览 (Product Showcase)          │  ← 设备 Mockup + 视差 + 数据可视化      │
├─────────────────────────────────────────┤
│ 06 · 工作原理 (How It Works · 3 步)       │  ← 时间线连线动画                       │
├─────────────────────────────────────────┤
│ 07 · 社会证明 (Testimonials / Metrics)    │  ← 数字滚动计数 + 引用卡片              │
├─────────────────────────────────────────┤
│ 08 · 最终 CTA (预注册主表单区)            │  ← 大号光晕 + 多步表单 + 成功态          │
├─────────────────────────────────────────┤
│ 09 · 页脚 (Footer)                        │  ← 极简、社交、法务、邮件                │
└─────────────────────────────────────────┘
```

导航锚点：`Vision` · `Capabilities` · `How it works` · `Join` (CTA 高亮)。

---

## 5. 区块逐一设计规格

### 00 · 顶部导航 (Sticky Nav)
- **初始**：完全透明，仅 Logo (左) + 导航链接 (中) + "Get Early Access" 胶囊按钮 (右)。
- **滚动 > 80px**：背景渐变为玻璃 (`backdrop-filter: var(--blur-glass)`)，高度从 88px 收缩到 64px，加 1px 底部分隔线，整体平滑过渡 `300ms ease`。
- **移动端**：汉堡图标 → 全屏玻璃覆盖菜单，链接逐条 stagger 滑入。
- 按钮 hover：光晕扩散 + 轻微放大 (`scale 1.03`)。

### 01 · Hero 英雄区
- **布局**：全视口高 (`100svh`)。文本居中或左对齐（A/B 可测）。
- **背景**：
  - 底层：深色基底 `--bg-base`。
  - 中层：缓慢漂移的极光光晕 (`--grad-halo`)，CSS `@keyframes` 20s 循环位移 + 呼吸缩放。
  - 上层（可选，懒加载）：R3F 粒子流 / 流体波形，代表"生命律动"。`prefers-reduced-motion` 时不加载。
- **内容**：
  - Eyebrow 小标签：`◇ AI-POWERED HEALTH SYSTEM`（mono 字、字距加大、渐变描边胶囊）。
  - 主标题：超大 Display，关键词渐变高亮，例：
    > Unlock your **fullest** self with an AI that **evolves with you**.
  - 副标题：一句话价值，`--text-secondary`，max-width 56ch。
  - 双 CTA：主按钮 "Get Early Access"（实心渐变）+ 次按钮 "Watch the film"（玻璃描边，带播放图标）。
  - 内联快速邮箱输入（可选）：单行 `email + →` 即时预注册。
- **入场动画**：标题按词 (word) mask-reveal 上移，stagger 60ms；副标题与按钮随后淡入；光晕从暗到亮 fade-in。
- **滚动提示**：底部 "scroll" + 竖向流动光点，滚动后淡出。

### 02 · 信任条 (Trust Bar)
- 一行无缝循环滚动的合作/媒体 logo 或关键数据（"12,000+ on the waitlist"）。
- 灰度 + 低透明，hover 单个变亮。Marquee 用 CSS 动画，鼠标悬停暂停。

### 03 · 价值主张 (The Promise)
- 三列支柱卡片：**Coach（教练）· Cheer（激励）· Evolve（进化）**。
- 每卡：动态图标（Lottie 或 SVG 描边自绘动画）+ 标题 + 一句话。
- 卡片玻璃质感，hover 时：3D 倾斜 (tilt)、光晕跟随鼠标、描边高亮。
- 入场：三卡 stagger 上移淡入。

### 04 · 能力展示 (Capabilities · Sticky Scroll)
**核心叙事区**，采用 **pin/sticky 滚动**：
- 左侧文字区 sticky 钉住；右侧视觉随滚动切换 4 个能力面板（Body Scan / Nutrition / Training / Emotional Support）。
- 滚动进度驱动：当前能力的标题/描述切换（crossfade + 上移），右侧对应可视化（环形进度、3D 身体网格、营养雷达图、波形）切入。
- 左侧竖向进度指示（4 个节点逐个点亮）。
- 移动端：降级为纵向堆叠卡片，逐个滚动出现（不做 pin）。

### 05 · 产品预览 (Product Showcase)
- 设备 Mockup（手机 + 手表）悬浮于光晕中，多层 **视差**：背景光晕慢、设备中速、前景 UI 卡片快。
- 设备屏内 UI 可做循环微动（数据跳动、环形进度填充）。
- 周围漂浮"数据气泡"卡片（心率、卡路里、睡眠分），轻微浮动 (float) 动画。

### 06 · 工作原理 (How It Works · 3 步)
- 横向（桌面）/ 纵向（移动）3 步：**Scan → Personalize → Evolve**。
- 步骤间连线随滚动 **逐段绘制** (SVG `stroke-dashoffset` 动画)。
- 每步编号大字 + 图标 + 简述，进入视口时弹入。

### 07 · 社会证明 (Testimonials / Metrics)
- 顶部一排关键指标：数字 **滚动计数** (count-up) 进入视口触发（如 "94% 坚持率"、"2.3× 更快见效"）。
- 下方引用卡片轮播 / 瀑布，玻璃卡 + 头像 + 引用 + 姓名。

### 08 · 最终 CTA / 预注册主区
- 整屏聚焦：居中超大标题 "Be among the first."，下方主表单。
- 背景：最强光晕 + 缓慢流动渐变，营造"门槛/邀请"感。
- 表单见 [第 9 节](#9-预注册系统-pre-registration)。
- 提交成功：表单坍缩 → 成功态展开（对勾描绘动画 + 彩带/光粒子 + "You're #1,248 in line" 排位反馈）。

### 09 · 页脚 (Footer)
- 极简：Logo + 一句 slogan + 导航 + 社交图标 + 版权/隐私/条款。
- 顶部细渐变分隔线。社交图标 hover 微跳动。

---

## 6. 动画系统 (Motion System)

### 6.1 动效原则
1. **物理感**：用弹簧 (spring) 而非线性，贴近真实惯性。
2. **层次**：背景慢、内容中、交互快，制造景深。
3. **克制**：单次入场总时长 < 1s；过度时长会显廉价。
4. **连续性**：元素从"哪来到哪去"要合理，避免突兀闪现。

### 6.2 缓动与时长 Token

```css
:root {
  --ease-out-soft:   cubic-bezier(0.22, 1, 0.36, 1);   /* 入场，减速 */
  --ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1);   /* 过渡 */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);/* 轻微回弹 */

  --dur-fast:   180ms;   /* 微交互 hover/press */
  --dur-base:   320ms;   /* 一般过渡 */
  --dur-slow:   600ms;   /* 入场 */
  --dur-cine:   900ms;   /* 电影级揭示 */
}
```

Framer Motion 弹簧参考：`{ type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }`。

### 6.3 动画清单 (Animation Inventory)

| # | 名称 | 触发 | 描述 | 实现 |
|---|------|------|------|------|
| A1 | Hero 标题揭示 | 加载 | 词级 mask 上移 + 模糊→清晰，stagger 60ms | Framer `staggerChildren` |
| A2 | 光晕呼吸 | 持续 | 极光 radial 缩放+位移循环 20s | CSS keyframes |
| A3 | 滚动渐入 | 进入视口 | `opacity 0→1`, `y 24→0`, blur 8→0 | Framer `whileInView` / IntersectionObserver |
| A4 | 卡片 3D 倾斜 | hover | 跟随指针 tilt ±8°，光斑跟随 | Framer `useMotionValue` + `rotateX/Y` |
| A5 | 数字计数 | 进入视口 | 0→目标值缓动滚动 | GSAP / 自定义 hook |
| A6 | SVG 连线绘制 | 滚动 | `stroke-dashoffset` 1→0 | GSAP ScrollTrigger |
| A7 | 能力 Sticky 切换 | 滚动 | 面板 crossfade + 文本切换 | GSAP pin + scrub |
| A8 | 视差层 | 滚动 | 多层不同 `y` 速率 | Lenis + `useTransform(scrollY)` |
| A9 | 按钮光晕 | hover/press | 光晕扩散 + scale，press 回弹 | Framer `whileHover/whileTap` |
| A10 | Marquee | 持续 | 无缝横向滚动，hover 暂停 | CSS `@keyframes translateX` |
| A11 | 成功态 | 提交成功 | 对勾描绘 + 粒子迸发 | Framer + canvas-confetti |
| A12 | 磁吸光标 (可选) | 桌面 | 自定义光标靠近按钮被吸附 | Framer + 指针事件 |
| A13 | 噪点/颗粒 | 持续 | 全局极轻 film grain 覆盖层 | CSS `mix-blend` + SVG noise |

### 6.4 微交互 (Micro-interactions)
- 输入框 focus：边框渐变流动 (conic gradient 旋转)，label 上浮。
- 按钮 press：`scale 0.97` 触感回弹。
- 链接 hover：下划线从中心展开。
- 复选/开关：弹簧滑块。
- 表单校验：错误抖动 (shake 1 次) + 红色描边渐显。

### 6.5 全局质感层
- **Film grain**：`opacity 0.03` 噪点覆盖，增加电影胶片质感。
- **Vignette**：四角极轻暗角，聚焦中心。
- **Glow blend**：强调色元素用 `mix-blend-mode: screen` 让光更通透。

---

## 7. 滚动与页面过渡

### 7.1 平滑滚动 (Smooth Scroll)
- 使用 **Lenis** 实现惯性平滑滚动（`lerp ≈ 0.1`），是"高级感"的关键。
- 与 GSAP ScrollTrigger 同步（`lenis.on('scroll', ScrollTrigger.update)`）。
- 锚点跳转：Lenis `scrollTo` 带缓动，导航点击平滑定位。
- `prefers-reduced-motion` 或触屏：可选关闭 Lenis，回退原生滚动。

### 7.2 滚动驱动叙事 (Scroll-driven)
- **Pin / Sticky 段**（能力展示区）：区块钉住，内部内容随 `scrub` 进度切换。
- **Scrub 视差**：背景/前景按 `scrollProgress` 反向位移。
- **进度感知**：右侧细长滚动进度条（渐变填充），或顶部 1px 进度线。

### 7.3 区块间过渡 (Section Transitions)
- 相邻区块用 **渐变重叠 + 光晕过渡** 衔接，避免硬切。
- 背景色在区块间用 `scroll-linked` 渐变插值（如从 `#05060A` 微变 `#070A12` 再回归），制造"光在流动"的连续感。
- 可选 **形状遮罩过渡**：上一区块以有机曲线 (blob clip-path) 收口，下一区块从中浮现。

### 7.4 入场编排 (Reveal Choreography)
- 每个区块进入视口 (`threshold 0.15`) 触发内部元素 **stagger** 揭示。
- 顺序：标题 → 副文 → 主视觉 → 辅助元素，间隔 80–120ms。
- 只播一次（`once: true`），避免反复触发分散注意。

### 7.5 加载过渡 (Page Load / Preloader)
- 极简 preloader：居中 Logo + 进度（资源/字体加载），完成后 **幕布上拉揭示** Hero（`clip-path` 或 `translateY` 幕帘）。
- 首屏资源就绪即揭幕，目标 < 1.2s 进入可交互。

---

## 8. 响应式与自适应策略

### 8.1 断点 (Breakpoints)

| 名称 | 范围 | 目标设备 |
|------|------|---------|
| `xs` | < 480px | 小手机 |
| `sm` | 480–767px | 手机 |
| `md` | 768–1023px | 平板 / 折叠 |
| `lg` | 1024–1439px | 笔记本 |
| `xl` | 1440–1919px | 桌面 |
| `2xl` | ≥ 1920px | 大屏 / 4K |

### 8.2 流式优先 (Fluid-first)
- 字号、间距、圆角全部用 `clamp()`，**在断点之间也平滑缩放**，而非阶梯跳变。
- 容器用 `min(100% - 2 * gutter, var(--container))` 自动居中并留边。
- 大屏 (`2xl`)：限制内容最大宽度 + 增加负空间，避免文本行过长（守住 `--measure`）。

### 8.3 视口单位策略
- 高度用 `svh/dvh/lvh` 而非 `vh`，解决移动端浏览器地址栏伸缩导致的跳动。
- Hero：`min-height: 100svh`。

### 8.4 布局自适应规则
| 区块 | 桌面 | 平板 | 移动 |
|------|------|------|------|
| Nav | 横向链接 | 横向/汉堡 | 汉堡全屏菜单 |
| Hero | 文本+3D 并置或居中 | 居中，3D 简化 | 居中，纯渐变背景 |
| 价值三支柱 | 3 列 | 2 列 | 1 列堆叠 |
| 能力区 | Sticky 双栏 | Sticky 简化 | 纵向卡片，无 pin |
| 产品预览 | 多层视差 | 双层视差 | 单图静态 |
| 工作原理 | 横向 3 步 | 横向/纵向 | 纵向时间线 |
| CTA 表单 | 横向内联 | 居中 | 全宽堆叠 |

### 8.5 容器查询 (Container Queries)
- 卡片类组件使用 `@container`，根据其容器宽度（而非视口）调整内部布局，便于复用到不同栏位。

### 8.6 触摸与指针适配
- `@media (hover: hover)` 才启用 tilt / 磁吸光标 / hover 光晕。
- 触摸目标 ≥ 44×44px。
- 表单在移动端用合适 `inputmode` / `autocomplete`（`email`, `name`）唤起正确键盘。

### 8.7 性能自适应降级
- `prefers-reduced-motion: reduce` → 关闭视差、pin、3D、grain，仅保留淡入。
- 低端设备检测（`navigator.hardwareConcurrency`、`deviceMemory`）→ 不加载 R3F，使用静态渐变。
- `prefers-reduced-data` / 慢网 → 视频换静态海报。

---

## 9. 预注册系统 (Pre-registration)

### 9.1 表单设计
**字段**：`Name`（必填）+ `Email`（必填，校验）+ 可选 `goal`（下拉：减脂/增肌/耐力/健康管理，用于个性化与数据）。

**两种入口**：
1. **Hero 内联**：单行 `email →`（极速，降低门槛）。
2. **底部主表单**：完整字段 + 隐私声明 + 提交按钮。

### 9.2 多步丝滑流程（主表单）
```
Step 1: 输入 Name + Email  ──►  Step 2: 选择目标 (goal)  ──►  成功态
```
- 步骤间用横向滑动过渡 (`x` 位移 + crossfade)，进度点指示。
- 每步只问最少信息，"一次一个问题"降低心理负担。

### 9.3 校验 (Validation)
- 实时校验（onBlur）：邮箱格式 (Zod `z.string().email()`)、姓名非空。
- 错误反馈：输入框 shake + 红描边 + 行内提示文案。
- 防重复：提交时查重，已存在则提示"You're already on the list ✓"。
- 防滥用：蜜罐字段 (honeypot) + 速率限制 (rate limit) + 可选 Cloudflare Turnstile。

### 9.4 提交流程 (Data Flow)
```
Client (RHF + Zod)
  └─ POST /api/waitlist  (Edge Route)
       ├─ 校验 (服务端再次 Zod)
       ├─ 查重 + 写入数据库 (Supabase/Postgres or Airtable)
       ├─ 计算排位序号 (waitlist position)
       ├─ 触发欢迎邮件 (Resend)
       └─ 返回 { success, position }
  └─ 成功态动画 + 显示排位
```

### 9.5 成功态 (Success State)
- 表单坍缩 → 对勾 SVG 描绘 (stroke draw) + 轻粒子迸发 (canvas-confetti，克制)。
- 文案："You're in. **#1,248** in line." + "Check your inbox ✉️"。
- 提供分享卡（"邀请好友提升排位" 引荐机制，可选增长杠杆）。

### 9.6 邮件 (Transactional Email)
- 即时发送品牌化欢迎邮件（深色模板、Logo、排位、预期上线时间）。
- 通过 **Resend** + React Email 模板。

### 9.7 数据模型 (示意)
```ts
// waitlist 表
{
  id: uuid,
  name: string,
  email: string,        // unique
  goal: string | null,
  position: number,     // 自增排位
  referrer: string | null,
  utm: jsonb | null,    // 来源追踪
  created_at: timestamptz,
}
```

### 9.8 API 契约
```http
POST /api/waitlist
Content-Type: application/json

{ "name": "Jane", "email": "jane@x.com", "goal": "fatloss", "hp": "" }

→ 200 { "success": true, "position": 1248 }
→ 409 { "success": false, "error": "already_registered", "position": 312 }
→ 422 { "success": false, "error": "invalid_email" }
→ 429 { "success": false, "error": "rate_limited" }
```

### 9.9 隐私与合规
- 表单下方明示："We'll only email you about early access. No spam."
- 链接隐私政策；GDPR：明确同意 + 可退订 + 可删除数据。

---

## 10. 组件库规格

> 原子化、可复用、props 驱动。建议放在 `components/` 下，按 `ui/`（基础）与 `sections/`（区块）分层。

### 10.1 基础组件 (`ui/`)
| 组件 | Props (关键) | 说明 |
|------|-------------|------|
| `Button` | `variant: primary\|ghost\|pill`, `size`, `icon` | 含光晕 hover、press 回弹 |
| `GlassCard` | `tilt?`, `glow?`, `padding` | 玻璃面 + 可选 3D tilt |
| `GradientText` | `as`, `gradient` | 渐变文字 |
| `Eyebrow` | `children` | 标签胶囊（mono、字距） |
| `Input` | `type`, `error`, `icon` | 渐变 focus、错误态 |
| `SectionHeader` | `eyebrow`, `title`, `subtitle`, `align` | 统一区块标题 |
| `Reveal` | `delay`, `y`, `blur` | 包裹任意子元素的入场封装 |
| `Marquee` | `speed`, `pauseOnHover` | 无缝跑马灯 |
| `Counter` | `to`, `suffix`, `duration` | 数字计数 |
| `AuroraBackground` | `intensity` | 极光光晕背景层 |

### 10.2 区块组件 (`sections/`)
`Nav` · `Hero` · `TrustBar` · `Promise` · `Capabilities` · `Showcase` · `HowItWorks` · `SocialProof` · `WaitlistCTA` · `Footer`。

### 10.3 状态与上下文
- `MotionProvider`：统一提供 reduced-motion 判定与 Lenis 实例。
- `WaitlistContext`：跨 Hero 内联表单与底部主表单共享提交状态/排位。

---

## 11. 性能预算与优化

### 11.1 性能预算 (Budget)
| 指标 | 目标 |
|------|------|
| LCP | < 2.0s (4G) |
| CLS | < 0.05 |
| INP | < 200ms |
| 首屏 JS (gzip) | < 170KB |
| 字体 | ≤ 2 字族，子集化，`font-display: swap` |
| Lighthouse | Perf ≥ 90, A11y ≥ 95 |

### 11.2 优化手段
- **图像**：`next/image`，AVIF/WebP，响应式 `sizes`，模糊占位 (LQIP)。
- **代码分割**：3D / confetti / 重区块 `dynamic(import, { ssr: false })` 懒加载。
- **字体**：自托管 + `next/font`，子集化，预加载关键字重。
- **动画**：仅动 `transform` / `opacity`（GPU 合成），避免 layout 抖动；`will-change` 谨慎使用。
- **滚动**：Lenis + rAF 单循环，避免多处监听 scroll。
- **预连接**：对 Resend/分析域名 `preconnect`。

---

## 12. 无障碍 (A11y) 与 SEO

### 12.1 无障碍
- 语义化标签 (`header/nav/main/section/footer`)，标题层级正确 (单一 h1)。
- 所有交互可键盘操作，清晰 `:focus-visible` 焦点环（渐变描边）。
- 表单 `label` 关联、`aria-invalid`、`aria-describedby` 指向错误信息。
- 颜色对比达 AA/AAA；不仅靠颜色传达状态（配图标/文案）。
- 尊重 `prefers-reduced-motion`，提供等效静态体验。
- 装饰性动画/背景 `aria-hidden`。

### 12.2 SEO
- `metadata`：title、description、Open Graph、Twitter Card、`og:image`（品牌大图）。
- 结构化数据 `Organization` / `Product` (JSON-LD)。
- `sitemap.xml` + `robots.txt`。
- 语义化文案含关键词（AI fitness coach、personalized health、body scan）。
- 规范域名 canonical：`https://elarionlabsinc.com`。

---

## 13. 目录结构与工程约定

```
elarionlabsinc.com/
├─ doc/
│  └─ DESIGN.md                 # 本文档
├─ app/
│  ├─ layout.tsx                # 根布局、字体、MotionProvider
│  ├─ page.tsx                  # 落地页组装
│  ├─ globals.css               # tokens + base
│  └─ api/
│     └─ waitlist/route.ts      # 预注册 Edge API
├─ components/
│  ├─ ui/                       # 基础组件
│  └─ sections/                 # 区块组件
├─ lib/
│  ├─ motion.ts                 # 缓动/variants 预设
│  ├─ lenis.ts                  # 平滑滚动初始化
│  ├─ validation.ts             # Zod schemas
│  └─ db.ts                     # 数据库客户端
├─ emails/
│  └─ Welcome.tsx               # React Email 模板
├─ public/                      # 静态资源、og 图、字体
├─ tailwind.config.ts
├─ next.config.ts
└─ package.json
```

**约定**：
- 组件 PascalCase，hooks `useXxx`，工具函数 camelCase。
- 动画 variants 集中在 `lib/motion.ts`，避免散落。
- 所有设计 token 仅在 `globals.css` `:root` 定义，组件引用变量，禁止硬编码色值。

---

## 14. 实施路线图

| 阶段 | 内容 | 产出 |
|------|------|------|
| **P0 · 脚手架** | Next.js + TS + Tailwind + Lenis/Framer/GSAP 接入；token 落地 | 可运行骨架、设计系统 |
| **P1 · 静态结构** | 所有区块的静态布局 + 响应式（无动画） | 可读完整页面 |
| **P2 · 动效层** | 入场、视差、sticky、微交互、光晕 | 流畅高端体验 |
| **P3 · 预注册** | 表单 + API + DB + 邮件 + 成功态 | 可转化闭环 |
| **P4 · 打磨** | 性能预算达标、A11y、SEO、跨设备 QA | 上线候选 |
| **P5 · 上线** | Vercel 部署、域名解析、分析接入、A/B | 正式发布 |

---

## 附录 A · 文案基调建议
- 简短、自信、以"你"为中心；动词驱动（Unlock / Evolve / Thrive）。
- 避免技术堆砌；用人话讲价值（"像一个永远懂你的教练"）。
- CTA 统一："Get Early Access" / "Join the waitlist"。

## 附录 B · 待确认项 (Open Questions)
1. 是否需要中英双语 (i18n)？
2. 数据后端偏好：Supabase / Airtable / 其他？
3. 是否要引荐排位机制（增长杠杆）？
4. Hero 是否上 3D（R3F）还是纯 CSS 光晕（更轻）？
5. 邮件服务：Resend 是否可用，或用其他？

---

*文档结束 · 任何区块均可在实现阶段细化为独立子文档。*
