# Design language

The site combines a restrained reading layout with a hand-drawn teaching
style: white content panels, dark navigation, sketch-like logic symbols, and the
course mascot. Use these conventions when adding or changing pages.

## Layout and navigation

The [shared shell](../layouts/_default/baseof.html) uses a black page background,
dark header and footer, and a white main panel. Shared containers are capped at
1140px; body text scales with `clamp()`. Bootstrap spacing and responsive flex
utilities provide most layout, with site rules in
[`layout.css`](../assets/css/layout.css).

The [home page](../layouts/index.html) presents title artwork and section links
with emoji and short teasers. The header opens an offcanvas navigation panel with
expandable sections. Section pages use lists ordered by weight; lesson pages have
section-return navigation and, where their templates include it, bottom controls.
Maintain these familiar routes between overview and lesson when adding pages.

## Typography, color, and artwork

 | Element                           | Existing treatment                                                |
 | ---                               | ---                                                               |
 | Body                              | Bootstrap's default sans-serif typography.                        |
 | Handwritten notation              | `Excalifont`, via `.excalifont`.                                  |
 | Code and formal-language notation | `Comic Shanns`, via `code`, `.shanns`, and notation classes.      |
 | Accent tokens                     | Green `#2f9e44`, blue `#1971c2`, red `#e03131`, orange `#f08c00`. |
 | Boolean / Kleene notation         | `.Boolean` uses blue; `.Kleene` uses red.                         |
 | Icons and identity                | Bootstrap Icons, emoji, and graphics in `assets/img/`.            |

Reuse the shared color variables and existing artwork. Keep formal notation
legible and consistent with neighboring lessons. Distinguish language-specific
notation in text as well as color. Provide meaningful alternative text for new
instructional images; use empty alt text for purely decorative artwork.

## Content and interactions

Textbook headings are numbered by CSS using the page weight divided by ten as
the chapter number. Exercise render hooks turn top-level Markdown headings into
numbered exercise headings and use heading attributes to create solution blocks.
Changing heading levels can therefore change structure and behavior.

Bootstrap supplies collapses, modals, and navigation. Exercise solutions use a
lightbulb button and password modal; see the disclosure limitation in
[technical setup](technical.md#validation-and-known-caveats). LaTeX answer
templates have collapsible copy controls. Slides can use embedded Excalidraw or
the separate Reveal.js presentation template.

When extending the design, prefer Bootstrap utilities and shared partials; put
section-specific rules in the corresponding file under `assets/css/`. Verify
keyboard operation, visible focus, readable contrast, accessible control labels,
and small-screen overflow for new or changed interactions. Check the separate
`tutoraat` and `verdiepingspakketten` shells when a change should affect them.
