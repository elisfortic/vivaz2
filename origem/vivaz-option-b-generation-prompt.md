# Prompt para Geração da Opção B (Design Moderno & Cinemático) - Website Vivaz

Este prompt foi desenvolvido especificamente para ser copiado e colado no seu terminal do Claude Code na pasta `C:\Users\House_Fol\Vivaz`. Ele orienta o Claude a criar uma versão conceitual moderna (Opção B) em uma pasta separada, utilizando todo o ecossistema de ponta instalado (Open Design, 21st.dev, Framer Motion e micro-interações), mantendo o respeito às diretrizes essenciais de marca do Brandbook da Vivaz.

***

### 🎬 Claude, Let's Build Vivaz: Option B (The Ultra-Modern Cinematic Experience)

Hello Claude,

We are ready to design and develop **Option B** for our client, **Vivaz**. This version is a conceptual, bold, and high-end alternative to the first classic layout we discussed. 

Our goal is to present the client with a choice: a safe, pristine execution vs. a jaw-dropping, cinematic, modern experience that positions them at the absolute top of their industry. This second option must command a premium feel, leveraging our active system tools (**Open Design MCP**, **21st.dev**, **better-icons**, **Framer Motion**, and **GSAP**).

Please execute this build inside a dedicated subdirectory: `C:\Users\House_Fol\Vivaz\option-b` (or `/experimental-b`), keeping the existing project intact.

---

#### 1. The Core Preservation Boundary (Respecting the Brandbook)
While we have total creative freedom to disrupt the layout and structure, you must strictly preserve the core DNA of the Vivaz brand identity:
*   **The Primary Palette**: Stay faithful to the official Vivaz color codes. You have freedom with gradients and backgrounds (e.g., introducing premium dark glassmorphism or deep satin/velvet tones), but the core brand colors must anchor the UI.
*   **The Brand Voice & Values**: Maintain the refined, luxurious tone of voice of Vivaz. The copy must feel expensive, quiet, and tailored. Avoid empty buzzwords.
*   **The Content Blocks**: The sections agreed upon with the client (Hero, Core Services, Portfolio/Showcase, Testimonials, Interactive Pricing/Booking) must exist, but they should be fully reimagined visually.

---

#### 2. The Creative Freedom Directive (Unleashing the Tech Stack)
You are authorized to push the boundaries of modern front-end web design. Implement the following aesthetic and interactive rules:

*   **Cinematic Above-the-Fold (Hero Section)**:
    *   Instead of a static layout, design a fully immersive, screen-filling Hero.
    *   Use the connected **Higgsfield MCP** or **FAL AI** to programmatically generate background asset transitions, or build a dark-mode ambient fluid motion graphic behind the typography.
    *   Apply a sophisticated typography pairing: **Fraunces** (for headings, utilizing its beautiful italic serifs) with **Geist** (for clean, legible monospace or sans-serif body copy).
*   **Micro-Interactions & Weight (Feeling Expensive)**:
    *   Utilize **GSAP** or **Framer Motion** for scroll-triggered reveal animations. Sections should slide and fade with organic ease, not snap aggressively.
    *   Add custom interactive elements from the **21st.dev ("21")** catalog. Search for and install:
        *   An animated interactive grid or pricing tier.
        *   A custom magnetic button hover state.
        *   Sleek horizontal infinite scroll/marquee cards for client logos or portfolio images.
    *   Implement trailing cursor effects (like a soft glowing halo or ambient embers that drift lazily) utilizing a strict **300ms transition delay** so it feels heavy and expensive.
*   **Iconography and Token Efficiency**:
    *   Invoke **better-icons** to import sleek, ultra-minimalist icons (e.g., Lucide or Heroicons) directly into the code instead of pasting raw SVG code. 
*   **Layout and Structural Sophistication**:
    *   Use **Open Design's** premium design grids (`DESIGN.md` templates like Stripe or Linear structures) to create beautiful Bento-Grid features or asymmetric column layouts.
    *   Utilize clean glassmorphism (`backdrop-filter: blur(...)`), thin borders, and subtle radial light-sweep overlays.

---

#### 3. Execution & Deployment Workflow
1.  **Read and Synthesize**: Read the current `brandbook` or guidelines you generated previously in our project folder. Extract the core values and copy pillars.
2.  **Develop Option B**: Write the clean, responsive, single-file HTML (or React/Next.js structure if requested) under `option-b/`.
3.  **Dedicated Mobile Optimization Sweep**: Perform an exhaustive responsive pass on the mobile layout (e.g., hiding bulky 3D/video elements on small screens, resizing typography dynamically, and shrinking the navigation).
4.  **Adversarial Quality Check**: Once built, run a diagnostic audit against the **$10k Website Quality Checklist** (visual restraint, perfect alignment, fast loading, organic motion, copy sensory impact).

Show me your plan for the design aesthetic of Option B before writing the code!
