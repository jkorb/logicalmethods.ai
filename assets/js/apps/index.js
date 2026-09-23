import { mountSATPractice } from './sat-practice.js';
import { mountSAT } from './sat-app.js';
import { mountPseudocode } from './pseudocode-practice.js';
import { mountImageExport } from './export-image.js';
// One registry for chapter apps; each mount owns only its supplied element.
import { mountParser } from './parser-app.js';
import { mountLatexGame } from './latex-game.js';
import { mountFormulaBuilder } from './formula-builder.js';
import { mountNotationPractice } from './notation-practice.js';
import { mountShuntingYard } from './shunting-yard.js';
import { mountReasoningPractice } from './reasoning-practice.js';
import { mountBoolean } from './boolean-app.js';
const apps = { 'sat-practice': mountSATPractice, sat: mountSAT, 'pseudocode-practice': mountPseudocode, boolean: mountBoolean, parser: mountParser, 'latex-game': mountLatexGame, builder: mountFormulaBuilder, 'notation-practice': mountNotationPractice, 'shunting-yard': mountShuntingYard, 'reasoning-practice': mountReasoningPractice };
for (const root of document.querySelectorAll('[data-logic-app]')) {
  if (root.dataset.mounted) continue;
  const mount = apps[root.dataset.logicApp];
  if (mount) { mount(root); if (['boolean', 'parser', 'builder', 'shunting-yard'].includes(root.dataset.logicApp)) mountImageExport(root); root.dataset.mounted = 'true'; }
}
