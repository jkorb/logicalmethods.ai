// One registry for chapter apps; each mount owns only its supplied element.
import { mountParser } from './parser-app.js';
import { mountLatexGame } from './latex-game.js';
import { mountFormulaBuilder } from './formula-builder.js';
import { mountNotationPractice } from './notation-practice.js';
import { mountShuntingYard } from './shunting-yard.js';
import { mountReasoningPractice } from './reasoning-practice.js';
const apps = { parser: mountParser, 'latex-game': mountLatexGame, builder: mountFormulaBuilder, 'notation-practice': mountNotationPractice, 'shunting-yard': mountShuntingYard, 'reasoning-practice': mountReasoningPractice };
for (const root of document.querySelectorAll('[data-logic-app]')) {
  if (root.dataset.mounted) continue;
  const mount = apps[root.dataset.logicApp];
  if (mount) { mount(root); root.dataset.mounted = 'true'; }
}
