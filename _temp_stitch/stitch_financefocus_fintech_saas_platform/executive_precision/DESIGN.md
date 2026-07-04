---
name: Executive Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for high-stakes financial environments where clarity, speed, and trust are paramount. It adopts a **Modern Corporate Minimalism** style, blending the structural rigor of enterprise software with the refined aesthetics of high-end consumer fintech.

The brand personality is sophisticated and composed. It avoids visual "noise" in favor of purposeful whitespace and subtle depth. The emotional response is one of reliability and control, ensuring users feel empowered to manage complex data without cognitive overwhelm. The aesthetic is defined by razor-sharp alignment, deliberate pacing, and a premium "studio" feel.

## Colors
This design system utilizes a high-utility palette rooted in professional blues and slate neutrals. 

- **Primary Blue:** Used for high-priority actions, active states, and focus indicators.
- **Surface Strategy:** The background is a soft cool-gray (`#F8FAFC`) to reduce eye strain, while primary content lives on elevated white (`#FFFFFF`) surfaces.
- **Functional Colors:** Success, warning, and danger colors are calibrated for high legibility against white backgrounds, ensuring critical financial alerts are unmistakable but not jarring.
- **Grayscale:** We use a deep Slate scale for typography to maintain high contrast without the harshness of pure black.

## Typography
The system relies exclusively on **Inter**, a typeface designed for screen legibility. 

- **Hierarchy:** We use semi-bold weights for headlines to create a strong visual anchor. 
- **Tracking:** Headings use slight negative letter-spacing (`-0.01em` to `-0.02em`) to provide a tight, premium editorial feel. Labels and small captions use increased tracking for better readability at small sizes.
- **Scale:** The type scale is optimized for data-dense interfaces, prioritizing clear distinctions between primary metrics and secondary metadata.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid model** centered around a permanent left-fixed sidebar.

- **Sidebar Architecture:** A 280px navigation rail stays fixed to the left. It uses a slightly darker sub-surface color or a subtle border to separate navigation from the workspace.
- **Content Area:** The main stage uses a flexible grid with a max-width of 1440px to ensure line lengths remain readable on ultra-wide monitors.
- **Rhythm:** An 8px linear scale governs all spacing. Generous internal padding (24px - 32px) within cards prevents data clusters from feeling cramped.
- **Mobile:** On small screens, the sidebar collapses into a bottom sheet or a hidden drawer, and margins tighten to 16px.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows** rather than heavy gradients.

- **Levels:**
    - **Level 0 (Background):** `#F8FAFC` - The canvas.
    - **Level 1 (Cards/Surface):** `#FFFFFF` - High-contrast surfaces with a 1px border (`#E2E8F0`).
    - **Level 2 (Dropdowns/Modals):** Floating elements use a more pronounced shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)`.
- **Shadow Philosophy:** Shadows should be ultra-diffused and low-opacity. They are used to indicate interactivity and hierarchy, not decoration.
- **Borders:** All interactive containers must have a subtle 1px border to define boundaries against the light background.

## Shapes
The shape language is "Soft-Modern." 

- **Primary Radius:** We use a `rounded-xl` (1.5rem / 24px) standard for main dashboard cards and large containers to evoke a friendly yet professional feel.
- **Component Radius:** Smaller components like buttons and input fields use a consistent `0.5rem / 8px` radius to maintain a crisp, functional look.
- **Consistency:** Avoid mixing sharp corners with rounded elements. Every container, from the smallest tooltip to the largest modal, must follow the geometric rounding rules.

## Components
- **Buttons:** Primary buttons are solid `#2563EB` with white text. Secondary buttons use a white background with the border-color. Interactions should be subtle—a slight darkening of the background on hover.
- **Inputs:** Fields use a 1px border. On focus, the border transitions to Primary Blue with a 3px soft outer glow (ring).
- **Cards:** The hallmark of the system. Cards feature a 1px border and a very soft shadow. Titles within cards should be `label-sm` or `headline-sm`.
- **Data Tables:** Use a "No-Border" approach for rows, utilizing subtle hover states and light horizontal dividers only.
- **Chips/Badges:** Used for transaction statuses. They should use low-opacity backgrounds of the functional colors (e.g., Success Green at 10% opacity) with high-contrast text.
- **Sidebar Nav:** Active states in the sidebar should be marked by a subtle background shift and a 3px vertical "pill" indicator on the far left.