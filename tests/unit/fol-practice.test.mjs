import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { parseFOL } from '../../assets/js/logic/fol-parser.js';
import { evaluateFOL, queryFOL, folToSQL } from '../../assets/js/logic/fol-model.js';
import { databaseSQL, databaseModel } from '../../assets/js/logic/fol-database-export.js';
import { executeSQL } from '../../assets/js/logic/sql-execution.js';
import { assessSQL } from '../../assets/js/logic/sql-assessment.js';
import { scopeLevels, builderLevels, modelLevels, queryLevels } from '../../assets/js/apps/fol-practice-levels.js';
const require=createRequire(import.meta.url);
// The unmodified browser artifact is UMD; provide its CommonJS wrapper in this ESM suite.
const vendor={exports:{}};
const init=new Function('module','exports','require','__dirname',readFileSync(new URL('../../assets/vendor/sql.js/sql-wasm.js',import.meta.url),'utf8')+'; return module.exports;')(vendor,vendor.exports,require,new URL('../../assets/vendor/sql.js/',import.meta.url).pathname);
const SQL=await init({wasmBinary:readFileSync(new URL('../../assets/vendor/sql.js/sql-wasm.wasm',import.meta.url))});
const world=JSON.parse(readFileSync(new URL('../../data/fol/world.json',import.meta.url)));
test('exercise syntax and SQL answers agree with finite-model evaluation',()=>{
 scopeLevels.forEach(f=>parseFOL(f));builderLevels.forEach((f,i)=>parseFOL(f,{kind:i===0?'term':'formula'}));
 const db=new SQL.Database();db.run(databaseSQL(world.language,world.model,world.columns));
 try { for(const {formula} of queryLevels) {
   const ast=parseFOL(formula,{language:world.language});const expected=queryFOL(ast,world.language,world.model);
   const result=executeSQL(db,folToSQL(ast,world.language,world.model,world.columns));
   assert.equal(assessSQL(db,result.results,{kind:'query',columns:expected.variables.length,rows:expected.rows}).correct,true,formula);
 } } finally {db.close();}
});
test('model levels have finite witnesses except explicitly impossible targets',()=>{
 const language={constants:['Socrates','MrSir','LittleJimmy'],functions:{},predicates:{Human:1,Mortal:1,BiggerThan:2}};
 const domain=['a','b'];const pairs=domain.flatMap(a=>domain.map(b=>[a,b]));
 for(const level of modelLevels) {
  const ast=parseFOL(level.formula,{language});let found=false;
  for(let mask=0;mask<256&&!found;mask++) {
   const model={domain,constants:{Socrates:'a',MrSir:'b',LittleJimmy:'a'},functions:{},predicates:{Human:domain.flatMap((x,i)=>mask&(1<<i)?[[x]]:[]),Mortal:domain.flatMap((x,i)=>mask&(1<<(i+2))?[[x]]:[]),BiggerThan:pairs.filter((_,i)=>mask&(1<<(i+4)))}};
   found=evaluateFOL(ast,language,model,{}, {trace:false}).value===level.value;
  }
  assert.equal(found,!level.impossible,level.formula);
 }
});
test('SQL assessment rejects duplicate, truncated, wrong-schema, and extra-table answers',()=>{
 const db=new SQL.Database();
 try {
  const task={kind:'query',columns:1,rows:[['a']]};
  assert.equal(assessSQL(db,[{columns:['x'],values:[['a'],['a']]}],task).correct,false);
  assert.equal(assessSQL(db,[{columns:['x'],values:[['a']],truncated:true}],task).correct,false);
  const initTask={kind:'initialize',tables:[{name:'R',columns:['x'],rows:[['a']]}]};
  db.run("CREATE TABLE R(x TEXT);INSERT INTO R VALUES('a');");
  assert.equal(assessSQL(db,[],initTask).correct,true);
  db.run('CREATE TABLE extra(x TEXT)');assert.equal(assessSQL(db,[],initTask).correct,false);db.run('DROP TABLE extra');
  db.run("INSERT INTO R VALUES('a')");assert.equal(assessSQL(db,[],initTask).correct,false);
  db.run('DROP TABLE R;CREATE TABLE R(y TEXT)');assert.equal(assessSQL(db,[],initTask).correct,false);
 } finally {db.close();}
});

test('database initialization reconstructs models and rejects malformed interpretations', () => {
 const options = { language: world.language, constants: world.model.constants, columns: world.columns };
 const db = new SQL.Database();
 try {
  db.run(databaseSQL(world.language, world.model, world.columns));
  assert.deepEqual(databaseModel(db, options), world.model);
  db.run("DELETE FROM CapitalOf WHERE country = 'France'");
  assert.equal(databaseModel(db, options).predicates.CapitalOf.length, 4);
  db.run("INSERT INTO CapitalOf VALUES ('France', 'unknown')");
  assert.throws(() => databaseModel(db, options), /domain/i);
  db.run("DELETE FROM CapitalOf WHERE capital = 'unknown'; DELETE FROM Domain WHERE value = 'Paris'");
  assert.throws(() => databaseModel(db, options), /domain/i);
 } finally { db.close(); }
 const language = { constants: [], functions: {}, predicates: { R: 1 } };
 const small = { language, constants: {}, columns: { R: ['x'] } };
 for (const [script, message] of [
  ["CREATE TABLE Domain(value); CREATE TABLE R(x);", /domain is empty/],
  ["CREATE TABLE Domain(value); INSERT INTO Domain VALUES ('a'); CREATE TABLE R(x); INSERT INTO R VALUES (NULL);", /NULL/],
  ["CREATE TABLE Domain(value); INSERT INTO Domain VALUES ('a'); CREATE TABLE R(x); INSERT INTO R VALUES ('a'),('a');", /duplicate/],
  ["CREATE TABLE Domain(value); CREATE TABLE R(wrong);", /columns/],
  ["CREATE TABLE Domain(value);", /Keep these tables/],
 ]) { const invalid = new SQL.Database(); try { invalid.run(script); assert.throws(() => databaseModel(invalid, small), message); } finally { invalid.close(); } }
});

test('database imports use the active domain when Domain is absent', () => {
 const db = new SQL.Database();
 const options = { language: { constants: [], functions: {}, predicates: { R: 2 } }, constants: {}, columns: { R: ['x','y'] } };
 try {
  db.run("CREATE TABLE R(x TEXT,y TEXT); INSERT INTO R VALUES ('a','b'),('b','c');");
  assert.deepEqual(databaseModel(db, options).domain, ['a','b','c']);
  db.run("CREATE TABLE Domain(value TEXT); INSERT INTO Domain VALUES ('a'),('b'),('c'),('unused');");
  assert.deepEqual(databaseModel(db, options).domain, ['a','b','c','unused']);
  db.run('DROP TABLE Domain; DELETE FROM R;');
  assert.throws(() => databaseModel(db, options), /domain is empty/);
 } finally { db.close(); }
});

test('extension levels distinguish empty answers, tuple order, and shared parents', async () => {
 const {extensionLevels}=await import('../../assets/js/apps/fol-semantics-practice.js');
 const family=JSON.parse(readFileSync(new URL('../../data/fol/family.json',import.meta.url)));
 const answers=[[],[['gran','london']],[['jimmy'],['linus']],[['lady','ny'],['gran','london']],[['lady'],['gran'],['ny'],['london'],['soccer']],[['jimmy','linus'],['linus','jimmy']]];
 for (const [i,formula] of extensionLevels.entries()) {
  assert.deepEqual(queryFOL(parseFOL(formula,{language:family.language,mode:'conventional'}),family.language,family.model).rows,answers[i],formula);
 }
});
