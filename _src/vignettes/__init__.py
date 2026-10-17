# -*- coding: utf-8 -*-
"""Workflow vignettes for the industry worlds: one animated SVG per workflow step, 520 x 320 user units.
Each module vignettes/<industry>.py exposes SCENES (six SVG strings, in industries.IND[key]["flow"] order) and CHIPS
(six (odoo_icon_key, sample record line) pairs). Colours, type and motion come from CSS classes in
assets/css/industry-world.css (fills f-*, strokes s-*, text t-*, motion v-*); the wall/floor behind every scene is themed
per world by the body class (body.ixw--<key>). Every element's resting state is its FINAL state: animations run from a
start state (fill-mode backwards), so reduced motion shows the finished scene."""

BG = ('<rect class="v-wall" width="520" height="236"/><rect class="v-wains" y="178" width="520" height="58"/>'
      '<rect class="v-rail" y="174" width="520" height="6"/><rect class="v-floor" y="236" width="520" height="84"/>'
      '<rect class="v-base" y="228" width="520" height="8"/>')


def svg(body: str, label: str) -> str:
    return f'<svg class="ixw-vg" viewBox="0 0 520 320" focusable="false" aria-hidden="true" data-label="{label}">{BG}{body}</svg>'
