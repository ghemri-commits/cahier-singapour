// ═══════════════════════════════════════════════════════════════
// CAHIER DE MATHÉMATIQUES — MÉTHODE SINGAPOUR
// Programme québécois 1re, 2e et 3e année — version intégrale
// ═══════════════════════════════════════════════════════════════
// Partage les profils enfants avec l'app Kumon (clé 'cahier:config')
// Lecture vocale Web Speech API (priorité voix fr-CA)
// Manipulables interactifs : Number Bonds, Make Ten, Base 10,
//   Bar Models, Number Line, Money QC, Multiplication, Fractions
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';


// ═══ FROM cahier-sg-build1.jsx ═══
// ============================================================
// CAHIER DE MATHÉMATIQUES — MÉTHODE SINGAPOUR
// Version multi-niveaux : 1re, 2e, 3e année (PFEQ MELS Québec)
// Build 1 : Architecture + Curriculum + Base 10
// ============================================================

// ============================================================
// STORAGE — Profils partagés avec l'app Kumon
// ============================================================
const SHARED = false;
const KEY_CONFIG = 'cahier:config';
const KEY_SG_PROGRESS = 'singapour:progress';
const KEY_SG_SESS_PREFIX = 'singapour:sess:';

const DEFAULT_CONFIG = {
  kids: [
    { id: 'k1', name: 'Liam',   age: 7, grade: 1, color: 'sakura', inputMode: 'pencil', pin: '1111' },
    { id: 'k2', name: 'Camila', age: 9, grade: 2, color: 'sage',   inputMode: 'pencil', pin: '2222' },
    { id: 'k3', name: '',       age: 0, grade: 1, color: 'iris',   inputMode: 'pencil', pin: '3333', enabled: false },
  ],
  parentPin: '1234',
  parentEmail: '',
  deviceLockedToKid: null,
};

async function loadConfig() {
  try {
    const r = await window.storage.get(KEY_CONFIG, SHARED);
    if (r && r.value) {
      const parsed = JSON.parse(r.value);
      const kids = (parsed.kids || DEFAULT_CONFIG.kids).map((k, i) => ({
        ...DEFAULT_CONFIG.kids[i], ...k,
        grade: k.grade || (i === 1 ? 2 : 1),
      }));
      return { ...DEFAULT_CONFIG, ...parsed, kids };
    }
  } catch (e) {}
  return DEFAULT_CONFIG;
}
async function saveConfig(c) { try { await window.storage.set(KEY_CONFIG, JSON.stringify(c), SHARED); } catch (e) {} }
async function loadProgress() {
  try { const r = await window.storage.get(KEY_SG_PROGRESS, SHARED); if (r && r.value) return JSON.parse(r.value); }
  catch (e) {}
  return {};
}
async function saveProgress(p) { try { await window.storage.set(KEY_SG_PROGRESS, JSON.stringify(p), SHARED); } catch (e) {} }
async function loadAllSessions() {
  try {
    const list = await window.storage.list(KEY_SG_SESS_PREFIX, SHARED);
    if (!list?.keys) return [];
    const out = [];
    for (const k of list.keys) {
      try { const r = await window.storage.get(k, SHARED); if (r?.value) out.push(JSON.parse(r.value)); }
      catch (e) {}
    }
    return out.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) { return []; }
}
async function saveSession(s) { try { await window.storage.set(KEY_SG_SESS_PREFIX + s.id, JSON.stringify(s), SHARED); } catch (e) {} }
async function deleteSession(id) { try { await window.storage.delete(KEY_SG_SESS_PREFIX + id, SHARED); } catch (e) {} }

function getKidFromUrl() {
  try { return new URLSearchParams(window.location.search).get('kid'); }
  catch (e) { return null; }
}

// ============================================================
// PALETTE & STYLE TOKENS
// ============================================================
const KID_COLORS = {
  sakura:     { ink: '#c2185b', soft: '#fce4ec', strong: '#880e4f', accent: '#f48fb1', name: 'rose cerisier' },
  sage:       { ink: '#558b2f', soft: '#dcedc8', strong: '#33691e', accent: '#aed581', name: 'sauge' },
  iris:       { ink: '#5e35b1', soft: '#e8eaf6', strong: '#311b92', accent: '#9575cd', name: 'iris' },
  ocean:      { ink: '#0277bd', soft: '#e1f5fe', strong: '#01579b', accent: '#4fc3f7', name: 'océan' },
  terracotta: { ink: '#bf360c', soft: '#fbe9e7', strong: '#8d2906', accent: '#ff8a65', name: 'terracotta' },
  mustard:    { ink: '#f57f17', soft: '#fffde7', strong: '#bf6000', accent: '#ffd54f', name: 'moutarde' },
};

const BASE10_COLORS = {
  hundred: '#c2185b',  // rouge cerisier pour centaines
  ten:     '#0277bd',  // bleu pour dizaines
  one:     '#558b2f',  // vert pour unités
};

const INPUT_MODES = {
  keypad:  { label: 'Pavé numérique',     desc: 'Tape avec le doigt' },
  pencil:  { label: 'Crayon Apple',        desc: 'Écris avec le crayon' },
  manual:  { label: 'Crayon manuel',       desc: 'Le parent corrige' },
};

// ============================================================
// CURRICULUM COMPLET — 1re, 2e, 3e année (PFEQ-inspiré)
// ============================================================
// Types de leçons disponibles :
//   numberBonds, makeTen, partWhole, base10, base10Add, base10Sub,
//   barModel, numberLine, moneyQc, arrayMultiply, fractionBar,
//   doubles, compensation, comparison, measureLength, time, geometry
//   problemSolving, division, fractionEq

const CURRICULUM = [
  // ═══════════════════════════════════════════════════════════
  // 1RE ANNÉE — Pour Liam (mais déjà à l'aise jusqu'à 1000)
  // ═══════════════════════════════════════════════════════════
  {
    grade: 1,
    units: [
      {
        id: 'g1-u1', name: 'Décompositions jusqu\'à 10', icon: '①',
        lessons: [
          { id: 'g1-u1-l1', name: 'Décomposer 5',  type: 'numberBonds', focusOn: 5,  description: 'Toutes les façons de faire 5' },
          { id: 'g1-u1-l2', name: 'Décomposer 6 et 7', type: 'numberBonds', focusOn: [6, 7], description: 'Décompositions de 6 et 7' },
          { id: 'g1-u1-l3', name: 'Décomposer 8 et 9', type: 'numberBonds', focusOn: [8, 9], description: 'Décompositions de 8 et 9' },
          { id: 'g1-u1-l4', name: 'Décomposer 10', type: 'numberBonds', focusOn: 10, description: 'Toutes les façons de faire 10 — base essentielle' },
        ],
      },
      {
        id: 'g1-u2', name: 'Addition jusqu\'à 20', icon: '②',
        lessons: [
          { id: 'g1-u2-l1', name: 'Doubles', type: 'doubles', max: 10, description: '2+2, 3+3, 4+4... à mémoriser' },
          { id: 'g1-u2-l2', name: 'Quasi-doubles', type: 'doubles', mode: 'near', max: 10, description: '6+7 = double de 6 + 1' },
          { id: 'g1-u2-l3', name: 'Stratégie faire dix', type: 'makeTen', max: 20, description: 'Ajouter en passant par 10' },
          { id: 'g1-u2-l4', name: 'Pratique faire dix', type: 'makeTen', max: 20, mode: 'practice', description: 'Maîtriser la stratégie' },
        ],
      },
      {
        id: 'g1-u3', name: 'Soustraction jusqu\'à 20', icon: '③',
        lessons: [
          { id: 'g1-u3-l1', name: 'Partie manquante', type: 'partWhole', max: 10, op: '-', description: 'Trouver la partie qui manque' },
          { id: 'g1-u3-l2', name: 'Soustraire avec ligne', type: 'numberLine', max: 20, op: '-', description: 'Sauter en arrière' },
          { id: 'g1-u3-l3', name: 'Lien add/sous', type: 'partWhole', max: 20, mode: 'family', description: 'Familles de nombres' },
        ],
      },
      {
        id: 'g1-u4', name: 'Nombres jusqu\'à 100', icon: '④',
        lessons: [
          { id: 'g1-u4-l1', name: 'Dizaines et unités', type: 'base10', max: 100, description: 'Comprendre 23 = 2 dizaines + 3 unités' },
          { id: 'g1-u4-l2', name: 'Compter par 2, 5, 10', type: 'numberLine', max: 100, mode: 'skip', description: 'Comptage par bonds' },
          { id: 'g1-u4-l3', name: 'Comparer les nombres', type: 'comparison', max: 100, description: 'Plus grand, plus petit, égal' },
        ],
      },
      {
        id: 'g1-u5', name: 'Monnaie québécoise', icon: '⑤',
        lessons: [
          { id: 'g1-u5-l1', name: 'Les pièces',   type: 'moneyQc', max: 25,  mode: 'identify', description: 'Reconnaître 1¢, 5¢, 10¢, 25¢, 1$, 2$' },
          { id: 'g1-u5-l2', name: 'Combien j\'ai ?', type: 'moneyQc', max: 100, mode: 'count',    description: 'Compter les pièces' },
        ],
      },
      {
        id: 'g1-u6', name: 'Mesure et temps', icon: '⑥',
        lessons: [
          { id: 'g1-u6-l1', name: 'Mesurer en cm', type: 'measureLength', max: 30, description: 'Utiliser une règle' },
          { id: 'g1-u6-l2', name: 'Lire l\'heure',  type: 'time', mode: 'hour', description: 'Heure pile et demie' },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // 2E ANNÉE — Pour Camila
  // ═══════════════════════════════════════════════════════════
  {
    grade: 2,
    units: [
      {
        id: 'g2-u1', name: 'Nombres jusqu\'à 1000', icon: '①',
        lessons: [
          { id: 'g2-u1-l1', name: 'Centaines, dizaines, unités', type: 'base10', max: 1000, description: 'Décomposer un nombre à 3 chiffres' },
          { id: 'g2-u1-l2', name: 'Comparer jusqu\'à 1000', type: 'comparison', max: 1000, description: 'Ranger des nombres' },
          { id: 'g2-u1-l3', name: 'Compter par 10, 100', type: 'numberLine', max: 1000, mode: 'skip', description: 'Bonds de 10 et 100' },
        ],
      },
      {
        id: 'g2-u2', name: 'Addition jusqu\'à 1000', icon: '②',
        lessons: [
          { id: 'g2-u2-l1', name: 'Sans regroupement', type: 'base10Add', max: 1000, mode: 'no-regroup', description: 'Additionner sans retenue' },
          { id: 'g2-u2-l2', name: 'Avec regroupement (unités → dizaines)', type: 'base10Add', max: 100, mode: 'regroup-u', description: 'Première retenue' },
          { id: 'g2-u2-l3', name: 'Avec regroupement (dizaines → centaines)', type: 'base10Add', max: 1000, mode: 'regroup-d', description: 'Deuxième retenue' },
          { id: 'g2-u2-l4', name: 'Compensation', type: 'compensation', max: 100, op: '+', description: '47+9 = 47+10-1 = 56' },
          { id: 'g2-u2-l5', name: 'Modèle en barres : addition', type: 'barModel', max: 100, op: '+', description: 'Visualiser avec des barres' },
        ],
      },
      {
        id: 'g2-u3', name: 'Soustraction jusqu\'à 1000', icon: '③',
        lessons: [
          { id: 'g2-u3-l1', name: 'Sans emprunt', type: 'base10Sub', max: 1000, mode: 'no-regroup', description: 'Soustraire sans emprunt' },
          { id: 'g2-u3-l2', name: 'Avec emprunt (dizaines → unités)', type: 'base10Sub', max: 100, mode: 'regroup-u', description: 'Premier emprunt' },
          { id: 'g2-u3-l3', name: 'Avec emprunt (centaines → dizaines)', type: 'base10Sub', max: 1000, mode: 'regroup-d', description: 'Deuxième emprunt' },
          { id: 'g2-u3-l4', name: 'Compensation', type: 'compensation', max: 100, op: '-', description: '52-9 = 52-10+1 = 43' },
          { id: 'g2-u3-l5', name: 'Modèle en barres : soustraction', type: 'barModel', max: 100, op: '-', description: 'Comparer avec des barres' },
        ],
      },
      {
        id: 'g2-u4', name: 'Multiplication — sens', icon: '④',
        lessons: [
          { id: 'g2-u4-l1', name: 'Groupes égaux', type: 'arrayMultiply', max: 5, mode: 'groups', description: 'Comprendre la multiplication' },
          { id: 'g2-u4-l2', name: 'Rangées et colonnes', type: 'arrayMultiply', max: 10, mode: 'array', description: 'Disposition en tableau' },
          { id: 'g2-u4-l3', name: 'Table de 2', type: 'arrayMultiply', tables: [2], description: 'Multiplier par 2 = doubler' },
          { id: 'g2-u4-l4', name: 'Table de 5', type: 'arrayMultiply', tables: [5], description: 'Compter par 5' },
          { id: 'g2-u4-l5', name: 'Table de 10', type: 'arrayMultiply', tables: [10], description: 'Ajouter un zéro' },
        ],
      },
      {
        id: 'g2-u5', name: 'Fractions simples', icon: '⑤',
        lessons: [
          { id: 'g2-u5-l1', name: 'La moitié (1/2)', type: 'fractionBar', fraction: '1/2', description: 'Partager en deux parts égales' },
          { id: 'g2-u5-l2', name: 'Le quart (1/4)',  type: 'fractionBar', fraction: '1/4', description: 'Partager en quatre' },
          { id: 'g2-u5-l3', name: 'Le tiers (1/3)',  type: 'fractionBar', fraction: '1/3', description: 'Partager en trois' },
        ],
      },
      {
        id: 'g2-u6', name: 'Monnaie québécoise', icon: '⑥',
        lessons: [
          { id: 'g2-u6-l1', name: 'Combiner des pièces',  type: 'moneyQc', max: 500, mode: 'combine', description: 'Faire un montant donné' },
          { id: 'g2-u6-l2', name: 'Rendre la monnaie',    type: 'moneyQc', max: 500, mode: 'change',  description: 'Calculer ce qu\'on rend' },
        ],
      },
      {
        id: 'g2-u7', name: 'Problèmes écrits', icon: '⑦',
        lessons: [
          { id: 'g2-u7-l1', name: 'Problèmes d\'addition', type: 'problemSolving', op: '+', max: 100, description: 'Résoudre avec un modèle en barres' },
          { id: 'g2-u7-l2', name: 'Problèmes de soustraction', type: 'problemSolving', op: '-', max: 100, description: 'Comparer ou retirer' },
        ],
      },
      {
        id: 'g2-u8', name: 'Mesure et temps', icon: '⑧',
        lessons: [
          { id: 'g2-u8-l1', name: 'cm et m',     type: 'measureLength', max: 200, mode: 'cm-m', description: 'Convertir et comparer' },
          { id: 'g2-u8-l2', name: 'L\'heure au quart', type: 'time', mode: 'quarter', description: 'Quart d\'heure, demie' },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // 3E ANNÉE — Programme préparatoire pour l'été
  // ═══════════════════════════════════════════════════════════
  {
    grade: 3,
    units: [
      {
        id: 'g3-u1', name: 'Nombres jusqu\'à 10 000', icon: '①',
        lessons: [
          { id: 'g3-u1-l1', name: 'Unités de mille', type: 'base10', max: 10000, description: 'Comprendre les milliers' },
          { id: 'g3-u1-l2', name: 'Comparer et ordonner', type: 'comparison', max: 10000, description: 'Ordre croissant et décroissant' },
          { id: 'g3-u1-l3', name: 'Arrondir', type: 'comparison', max: 1000, mode: 'round', description: 'À la dizaine ou centaine près' },
        ],
      },
      {
        id: 'g3-u2', name: 'Addition et soustraction jusqu\'à 10 000', icon: '②',
        lessons: [
          { id: 'g3-u2-l1', name: 'Addition à 4 chiffres', type: 'base10Add', max: 10000, mode: 'regroup-d', description: 'Avec regroupements' },
          { id: 'g3-u2-l2', name: 'Soustraction à 4 chiffres', type: 'base10Sub', max: 10000, mode: 'regroup-d', description: 'Avec emprunts' },
          { id: 'g3-u2-l3', name: 'Estimation', type: 'compensation', max: 1000, mode: 'estimate', description: 'Estimer pour vérifier' },
        ],
      },
      {
        id: 'g3-u3', name: 'Multiplication — tables', icon: '③',
        lessons: [
          { id: 'g3-u3-l1', name: 'Table de 3', type: 'arrayMultiply', tables: [3], description: 'Multiplier par 3' },
          { id: 'g3-u3-l2', name: 'Table de 4', type: 'arrayMultiply', tables: [4], description: 'Doubler + doubler' },
          { id: 'g3-u3-l3', name: 'Table de 6', type: 'arrayMultiply', tables: [6], description: 'Multiplier par 6' },
          { id: 'g3-u3-l4', name: 'Table de 7', type: 'arrayMultiply', tables: [7], description: 'Table difficile' },
          { id: 'g3-u3-l5', name: 'Table de 8', type: 'arrayMultiply', tables: [8], description: 'Doubler 3 fois' },
          { id: 'g3-u3-l6', name: 'Table de 9', type: 'arrayMultiply', tables: [9], description: 'Astuce des doigts' },
        ],
      },
      {
        id: 'g3-u4', name: 'Multiplication — calcul', icon: '④',
        lessons: [
          { id: 'g3-u4-l1', name: '2 chiffres × 1', type: 'arrayMultiply', mode: '2x1', description: '24 × 3 avec décomposition' },
          { id: 'g3-u4-l2', name: '3 chiffres × 1', type: 'arrayMultiply', mode: '3x1', description: '124 × 4 avec retenues' },
        ],
      },
      {
        id: 'g3-u5', name: 'Division — sens', icon: '⑤',
        lessons: [
          { id: 'g3-u5-l1', name: 'Partager également', type: 'division', mode: 'share', description: 'Distribuer en parts égales' },
          { id: 'g3-u5-l2', name: 'Faire des groupes', type: 'division', mode: 'group', description: 'Combien de groupes ?' },
          { id: 'g3-u5-l3', name: 'Division par 2, 5, 10', type: 'division', mode: 'easy', description: 'Diviseurs faciles' },
        ],
      },
      {
        id: 'g3-u6', name: 'Fractions', icon: '⑥',
        lessons: [
          { id: 'g3-u6-l1', name: 'Comparer des fractions', type: 'fractionBar', mode: 'compare', description: 'Quelle fraction est plus grande ?' },
          { id: 'g3-u6-l2', name: 'Fractions équivalentes', type: 'fractionEq', description: '1/2 = 2/4 = 3/6' },
          { id: 'g3-u6-l3', name: 'Additionner des fractions', type: 'fractionBar', mode: 'add', description: 'Même dénominateur' },
        ],
      },
      {
        id: 'g3-u7', name: 'Problèmes complexes', icon: '⑦',
        lessons: [
          { id: 'g3-u7-l1', name: 'Comparaison', type: 'problemSolving', mode: 'compare', description: 'Camila a X de plus que Liam' },
          { id: 'g3-u7-l2', name: 'Deux étapes', type: 'problemSolving', mode: 'two-step', description: 'Problèmes en deux temps' },
          { id: 'g3-u7-l3', name: 'Multiplication', type: 'problemSolving', mode: 'mul', description: 'Problèmes avec ×' },
        ],
      },
      {
        id: 'g3-u8', name: 'Mesure', icon: '⑧',
        lessons: [
          { id: 'g3-u8-l1', name: 'mm, cm, dm, m', type: 'measureLength', max: 1000, mode: 'units', description: 'Convertir les unités' },
          { id: 'g3-u8-l2', name: 'Périmètre', type: 'geometry', mode: 'perimeter', description: 'Calculer le pourtour' },
          { id: 'g3-u8-l3', name: 'Heure et minutes', type: 'time', mode: 'minute', description: 'Lecture précise' },
        ],
      },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
const fmtDate = ts => {
  const d = new Date(ts);
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
};
const fmtDur = sec => sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`;
const fmtDurLong = sec => {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60), s = sec % 60;
  if (m < 60) return `${m}m ${s.toString().padStart(2, '0')}s`;
  const h = Math.floor(m / 60), mm = m % 60;
  return `${h}h ${mm.toString().padStart(2, '0')}m`;
};

function rng(seed) {
  let s = seed % 233280 || 1;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
const rndInt = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;
const pick = (rng, a) => a[Math.floor(rng() * a.length)];
const shuffle = (rng, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ============================================================
// PRACTICE BATCH GENERATION
// ============================================================
// 50 exercises per lesson, randomized at each new session.
// Difficulty progression: 30% easy / 40% medium / 30% hard.
// A lesson is never "completed" — it's always practicable.
const PRACTICE_COUNT = 50;

// Builds a difficulty-graded batch from a generator function.
// makeProblem(rng, difficulty) where difficulty is 'easy' | 'medium' | 'hard'
function generatePracticeBatch(seed, makeProblem) {
  const r = rng(seed);
  const easyCount = 15;
  const mediumCount = 20;
  const hardCount = 15;
  const probs = [];
  for (let i = 0; i < easyCount; i++) probs.push(makeProblem(r, 'easy'));
  for (let i = 0; i < mediumCount; i++) probs.push(makeProblem(r, 'medium'));
  for (let i = 0; i < hardCount; i++) probs.push(makeProblem(r, 'hard'));
  return probs;
}

// Returns a session seed that changes when the kid starts a new practice
// (so they don't see the same 50 every time). Combines lesson id and
// session counter from progress.
function getPracticeSeed(lessonId, sessionCount) {
  let h = 0;
  const s = lessonId + '_s' + (sessionCount || 0);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function findLesson(lessonId) {
  for (const grade of CURRICULUM) {
    for (const unit of grade.units) {
      const l = unit.lessons.find(x => x.id === lessonId);
      if (l) return { lesson: l, unit, grade };
    }
  }
  return null;
}
function getLessonsForGrade(grade) {
  const g = CURRICULUM.find(x => x.grade === grade);
  if (!g) return [];
  return g.units.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id, unitName: u.name })));
}

// Currency formatting (Quebec)
function fmtMoney(cents) {
  if (cents < 100) return `${cents}¢`;
  const dollars = Math.floor(cents / 100);
  const rest = cents % 100;
  if (rest === 0) return `${dollars}$`;
  return `${dollars}$ ${rest}¢`;
}

// ============================================================
// SHARED UI PRIMITIVES
// ============================================================
const Paper = ({ children, className = '' }) => (
  <div className={`min-h-screen w-full relative ${className}`} style={{ background: 'var(--paper)' }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = 'primary', className = '', disabled, accent, size = 'normal' }) => {
  const styles = {
    primary: 'text-white shadow-sm hover:shadow-md',
    soft:    'bg-white text-stone-900 border border-stone-300 hover:bg-stone-50',
    ghost:   'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
    danger:  'bg-rose-700 text-white hover:bg-rose-800',
  };
  const sizes = {
    small: 'px-3 py-1.5 text-sm rounded-xl',
    normal: 'px-5 py-3 rounded-2xl',
    large: 'px-7 py-4 text-lg rounded-2xl',
  };
  const inlineStyle = variant === 'primary' && accent ? { background: accent } : {};
  return (
    <button onClick={onClick} disabled={disabled} style={inlineStyle}
      className={`font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${sizes[size]} ${variant === 'primary' && !accent ? 'bg-stone-900 hover:bg-stone-800' : ''} ${className}`}>
      {children}
    </button>
  );
};

function PinPad({ value, onChange, length = 4, accent = '#1c1917' }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex gap-3 justify-center mb-6">
        {Array.from({ length }, (_, i) => (
          <div key={i} className="w-12 h-14 rounded-2xl border-2 flex items-center justify-center font-display text-2xl"
            style={{ borderColor: value[i] ? accent : '#d6d3d1' }}>
            {value[i] ? '•' : ''}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['1','2','3','4','5','6','7','8','9'].map(k => (
          <button key={k} onClick={() => onChange((value + k).slice(0, length))}
            className="h-14 rounded-2xl font-display text-2xl bg-white border-2 border-stone-300 hover:bg-stone-50 active:scale-95 transition-all">{k}</button>
        ))}
        <div></div>
        <button onClick={() => onChange((value + '0').slice(0, length))}
          className="h-14 rounded-2xl font-display text-2xl bg-white border-2 border-stone-300 hover:bg-stone-50 active:scale-95 transition-all">0</button>
        <button onClick={() => onChange(value.slice(0, -1))}
          className="h-14 rounded-2xl text-lg bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all">⌫</button>
      </div>
    </div>
  );
}

function NumPad({ onDigit, onClear, onSubmit, submitLabel = 'Vérifier', accent, allowNegative, onNegative }) {
  const btn = "h-14 rounded-2xl text-2xl font-display bg-white border-2 border-stone-300 hover:bg-stone-50 active:bg-stone-100 active:scale-95 transition-all shadow-sm";
  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto select-none">
      {['1','2','3','4','5','6','7','8','9'].map(k => (
        <button key={k} onClick={() => onDigit(k)} className={btn}>{k}</button>
      ))}
      <button onClick={onClear} className={btn + " text-lg text-stone-600"}>⌫</button>
      <button onClick={() => onDigit('0')} className={btn}>0</button>
      <button onClick={onSubmit} style={{ background: accent || '#1c1917' }}
        className="h-14 rounded-2xl text-sm font-medium text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">{submitLabel}</button>
    </div>
  );
}

// ============================================================
// CELEBRATION (confetti rain)
// ============================================================
function Celebration({ onDone, palette }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const colors = palette || ['#f48fb1', '#aed581', '#9575cd', '#4fc3f7', '#ffd54f', '#ff8a65'];
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * w, y: -20 - Math.random() * h * 0.5,
        vx: (Math.random() - 0.5) * 1.5, vy: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        shape: Math.random() < 0.5 ? 'rect' : 'circle', life: 1,
      });
    }
    let animId, done = false;
    const startTime = Date.now();
    function animate() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.vr;
        if (p.y > h + 30) p.life = 0;
        if (p.life <= 0) continue;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      const elapsed = Date.now() - startTime;
      if (elapsed < 4000 && particles.some(p => p.life > 0)) animId = requestAnimationFrame(animate);
      else if (!done) { done = true; if (onDone) onDone(); }
    }
    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [onDone, palette]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />;
}

// ============================================================
// MANIPULABLE : BASE 10 BLOCKS
// Cubes unité (•), barres dizaine (|), carrés centaine (▦), grand cube millier (▦³)
// Le manipulable affiche un nombre OU permet de le construire en glissant
// ============================================================
function Base10Display({ value, maxThousands = 9, size = 'normal', highlightRegroup = null, animateValue = false }) {
  // Decompose value into thousands, hundreds, tens, ones
  const thousands = Math.floor(value / 1000);
  const hundreds  = Math.floor((value % 1000) / 100);
  const tens      = Math.floor((value % 100) / 10);
  const ones      = value % 10;

  const cubeSize = size === 'small' ? 8 : size === 'large' ? 14 : 11;
  const gap = 1;

  const renderOnes = (count) => (
    <div className="flex flex-wrap gap-0.5 max-w-[80px]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-sm transition-all"
          style={{
            width: cubeSize, height: cubeSize,
            background: BASE10_COLORS.one,
            border: `1px solid ${BASE10_COLORS.one}cc`,
            animation: animateValue ? `popIn 0.3s ease-out ${i * 30}ms backwards` : undefined,
          }} />
      ))}
    </div>
  );

  const renderTen = (key) => (
    <div key={key} className="flex flex-col gap-0.5"
      style={{ animation: animateValue ? `popIn 0.3s ease-out backwards` : undefined }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="rounded-sm"
          style={{
            width: cubeSize, height: cubeSize,
            background: BASE10_COLORS.ten,
            border: `1px solid ${BASE10_COLORS.ten}cc`,
          }} />
      ))}
    </div>
  );

  const renderHundred = (key) => (
    <div key={key} className="grid grid-cols-10 gap-0.5"
      style={{ animation: animateValue ? `popIn 0.3s ease-out backwards` : undefined }}>
      {Array.from({ length: 100 }, (_, i) => (
        <div key={i} className="rounded-[1px]"
          style={{
            width: cubeSize, height: cubeSize,
            background: BASE10_COLORS.hundred,
            border: `0.5px solid ${BASE10_COLORS.hundred}aa`,
          }} />
      ))}
    </div>
  );

  const renderThousand = (key) => (
    <div key={key} className="relative"
      style={{
        width: cubeSize * 11 + 4,
        height: cubeSize * 11 + 4,
        background: '#5d4037',
        borderRadius: 4,
        animation: animateValue ? `popIn 0.3s ease-out backwards` : undefined,
      }}>
      <div className="absolute inset-1 grid grid-cols-10 gap-0.5">
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className="rounded-[1px]"
            style={{
              background: '#8d6e63',
              border: '0.5px solid #6d4c41',
            }} />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center font-display text-white text-xs font-bold opacity-90">
        1000
      </div>
    </div>
  );

  return (
    <div className="flex items-start gap-4 flex-wrap">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {thousands > 0 && (
        <div>
          <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1 text-center">
            {thousands} millier{thousands > 1 ? 's' : ''}
          </div>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: Math.min(thousands, maxThousands) }, (_, i) => renderThousand(i))}
          </div>
        </div>
      )}
      {(hundreds > 0 || thousands > 0) && (
        <div className={highlightRegroup === 'h' ? 'animate-pulse ring-2 ring-amber-400 rounded-md p-1' : ''}>
          <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1 text-center">
            {hundreds} centaine{hundreds > 1 ? 's' : ''}
          </div>
          <div className="flex gap-1.5 flex-wrap items-start">
            {Array.from({ length: hundreds }, (_, i) => renderHundred(i))}
          </div>
        </div>
      )}
      {(tens > 0 || hundreds > 0 || thousands > 0) && (
        <div className={highlightRegroup === 't' ? 'animate-pulse ring-2 ring-amber-400 rounded-md p-1' : ''}>
          <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1 text-center">
            {tens} dizaine{tens > 1 ? 's' : ''}
          </div>
          <div className="flex gap-1 items-end">
            {Array.from({ length: tens }, (_, i) => renderTen(i))}
          </div>
        </div>
      )}
      <div className={highlightRegroup === 'u' ? 'animate-pulse ring-2 ring-amber-400 rounded-md p-1' : ''}>
        <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1 text-center">
          {ones} unité{ones > 1 ? 's' : ''}
        </div>
        {renderOnes(ones)}
      </div>
    </div>
  );
}

// ============================================================
// MANIPULABLE : BASE 10 BUILDER (constructeur interactif)
// L'enfant clique pour AJOUTER/RETIRER des blocs base 10
// ============================================================
function Base10Builder({ value, onChange, maxValue = 999, accent = '#0277bd', readOnly = false }) {
  const thousands = Math.floor(value / 1000);
  const hundreds  = Math.floor((value % 1000) / 100);
  const tens      = Math.floor((value % 100) / 10);
  const ones      = value % 10;

  const canAddHundreds = maxValue >= 100;
  const canAddThousands = maxValue >= 1000;

  const add = (place, count = 1) => {
    if (readOnly) return;
    const delta = place === 'u' ? count : place === 't' ? count * 10 : place === 'h' ? count * 100 : count * 1000;
    const newVal = Math.max(0, Math.min(maxValue, value + delta));
    onChange(newVal);
  };

  const PlaceCol = ({ place, label, color, count, max }) => (
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 text-center">{label}</div>
      <div className="rounded-2xl border-2 border-dashed bg-white p-3 min-h-[180px] flex flex-col items-center justify-end relative"
        style={{ borderColor: color + '60' }}>
        <div className="absolute top-2 right-2 font-display text-2xl tabular-nums font-bold" style={{ color }}>
          {count}
        </div>
        {/* Blocks display */}
        <div className="flex-1 flex items-end justify-center pt-6 pb-2">
          {place === 'u' && (
            <div className="flex flex-wrap gap-1 max-w-[100px] justify-center">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-sm"
                  style={{ background: color, animation: 'popIn 0.2s ease-out backwards' }} />
              ))}
            </div>
          )}
          {place === 't' && (
            <div className="flex gap-1 items-end">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  {Array.from({ length: 10 }, (_, j) => (
                    <div key={j} className="w-3 h-3 rounded-sm" style={{ background: color }} />
                  ))}
                </div>
              ))}
            </div>
          )}
          {place === 'h' && (
            <div className="flex gap-2 flex-wrap justify-center max-w-[150px]">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="grid grid-cols-10 gap-0.5">
                  {Array.from({ length: 100 }, (_, j) => (
                    <div key={j} className="w-1.5 h-1.5" style={{ background: color }} />
                  ))}
                </div>
              ))}
            </div>
          )}
          {place === 'k' && (
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="w-12 h-12 rounded-md flex items-center justify-center font-display text-white text-[10px] font-bold"
                  style={{ background: '#5d4037' }}>1000</div>
              ))}
            </div>
          )}
        </div>
        {/* Controls */}
        {!readOnly && (
          <div className="flex gap-1.5 w-full">
            <button onClick={() => add(place, -1)}
              disabled={count === 0}
              className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 active:scale-95 disabled:opacity-30 transition-all text-stone-700">
              −
            </button>
            <button onClick={() => add(place, +1)}
              disabled={count >= 19}
              className="flex-1 py-1.5 rounded-lg text-white active:scale-95 hover:opacity-90 disabled:opacity-30 transition-all"
              style={{ background: color }}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="select-none">
      {/* Value display */}
      <div className="text-center mb-4">
        <div className="text-[10px] uppercase tracking-widest text-stone-500">Valeur</div>
        <div className="font-display text-5xl sm:text-6xl tabular-nums font-bold" style={{ color: accent }}>
          {value}
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-2 sm:gap-3">
        {canAddThousands && <PlaceCol place="k" label="Milliers" color="#5d4037" count={thousands} />}
        {canAddHundreds && <PlaceCol place="h" label="Centaines" color={BASE10_COLORS.hundred} count={hundreds} />}
        <PlaceCol place="t" label="Dizaines" color={BASE10_COLORS.ten} count={tens} />
        <PlaceCol place="u" label="Unités" color={BASE10_COLORS.one} count={ones} />
      </div>

      {/* Equation */}
      <div className="mt-4 text-center font-display text-stone-700 text-base">
        {canAddThousands && thousands > 0 && <><span style={{ color: '#5d4037' }}>{thousands * 1000}</span> + </>}
        {canAddHundreds && hundreds > 0 && <><span style={{ color: BASE10_COLORS.hundred }}>{hundreds * 100}</span> + </>}
        <span style={{ color: BASE10_COLORS.ten }}>{tens * 10}</span> +{' '}
        <span style={{ color: BASE10_COLORS.one }}>{ones}</span>{' '}
        <span className="text-stone-400">=</span>{' '}
        <b style={{ color: accent }}>{value}</b>
      </div>
    </div>
  );
}

// ============================================================
// MANIPULABLE : BASE 10 ADDITION (avec animation de regroupement)
// Visualise A + B en utilisant les blocs base 10
// ============================================================
function Base10AdditionDemo({ a, b, onComplete, accent, soft }) {
  // Phases: setup → combine → checkRegroupOnes → regroupOnes →
  //   checkRegroupTens → regroupTens → checkRegroupHundreds → regroupHundreds → done
  const [phase, setPhase] = useState('setup');
  const [combinedOnes, setCombinedOnes] = useState(0);
  const [combinedTens, setCombinedTens] = useState(0);
  const [combinedHundreds, setCombinedHundreds] = useState(0);
  const [combinedThousands, setCombinedThousands] = useState(0);

  // Decompose A and B
  const decomp = (n) => ({
    u: n % 10, t: Math.floor((n % 100) / 10),
    h: Math.floor((n % 1000) / 100), k: Math.floor(n / 1000),
  });
  const dA = decomp(a), dB = decomp(b);

  const combine = () => {
    setCombinedOnes(dA.u + dB.u);
    setCombinedTens(dA.t + dB.t);
    setCombinedHundreds(dA.h + dB.h);
    setCombinedThousands(dA.k + dB.k);
    setPhase('combined');
  };

  // Regroup ones → tens if combinedOnes >= 10
  const needsRegroupU = combinedOnes >= 10;
  const needsRegroupT = combinedTens >= 10 || (needsRegroupU && (combinedTens + 1) >= 10);
  const needsRegroupH = combinedHundreds >= 10;

  const doRegroupOnes = () => {
    setCombinedOnes(c => c - 10);
    setCombinedTens(c => c + 1);
    setPhase('regroupedU');
  };
  const doRegroupTens = () => {
    setCombinedTens(c => c - 10);
    setCombinedHundreds(c => c + 1);
    setPhase('regroupedT');
  };
  const doRegroupHundreds = () => {
    setCombinedHundreds(c => c - 10);
    setCombinedThousands(c => c + 1);
    setPhase('regroupedH');
  };

  const totalValue = combinedThousands * 1000 + combinedHundreds * 100 + combinedTens * 10 + combinedOnes;
  const isDone = phase === 'done' || (phase !== 'setup' && totalValue === a + b && combinedOnes < 10 && combinedTens < 10 && combinedHundreds < 10);

  useEffect(() => {
    if (isDone && phase !== 'done') {
      setPhase('done');
    }
  }, [isDone, phase]);

  return (
    <div className="select-none space-y-4">
      {/* Equation header */}
      <div className="text-center">
        <div className="font-display text-3xl text-stone-900 tabular-nums">
          {a} <span className="text-stone-400 mx-2">+</span> {b} <span className="text-stone-400 mx-2">=</span>
          <span style={{ color: phase === 'done' ? accent : '#9ca3af' }}>
            {phase === 'setup' ? '?' : totalValue}
          </span>
        </div>
      </div>

      {phase === 'setup' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-stone-200 p-4">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3 text-center">Représentation des deux nombres</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-display text-2xl tabular-nums mb-2" style={{ color: accent }}>{a}</div>
                <Base10Display value={a} size="small" />
              </div>
              <div className="text-center">
                <div className="font-display text-2xl tabular-nums mb-2" style={{ color: '#f97316' }}>{b}</div>
                <Base10Display value={b} size="small" />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent={accent} onClick={combine}>
              ↓ Rassembler les blocs
            </Btn>
          </div>
        </div>
      )}

      {phase !== 'setup' && (
        <div className="bg-white rounded-2xl border-2 p-4" style={{ borderColor: accent + '40' }}>
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-3 text-center">Blocs rassemblés</div>
          <div className="flex justify-center">
            <BlockCountDisplay
              ones={combinedOnes} tens={combinedTens}
              hundreds={combinedHundreds} thousands={combinedThousands}
              highlight={
                phase === 'combined' && needsRegroupU ? 'u' :
                phase === 'regroupedU' && needsRegroupT ? 't' :
                phase === 'regroupedT' && needsRegroupH ? 'h' :
                null
              } />
          </div>
        </div>
      )}

      {/* Regroup actions */}
      {phase === 'combined' && needsRegroupU && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
          <div className="text-sm text-amber-900 mb-3 text-center">
            Il y a <b>{combinedOnes} unités</b>. C'est plus que 9 !<br/>
            On peut <b>regrouper 10 unités en 1 dizaine</b>.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent="#d97706" onClick={doRegroupOnes}>
              ↑ Regrouper 10 unités → 1 dizaine
            </Btn>
          </div>
        </div>
      )}

      {(phase === 'regroupedU' || phase === 'combined') && !needsRegroupU && needsRegroupT && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
          <div className="text-sm text-amber-900 mb-3 text-center">
            Il y a <b>{combinedTens} dizaines</b>. C'est plus que 9 !<br/>
            On peut <b>regrouper 10 dizaines en 1 centaine</b>.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent="#d97706" onClick={doRegroupTens}>
              ↑ Regrouper 10 dizaines → 1 centaine
            </Btn>
          </div>
        </div>
      )}

      {phase === 'regroupedT' && needsRegroupH && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
          <div className="text-sm text-amber-900 mb-3 text-center">
            Il y a <b>{combinedHundreds} centaines</b>. On peut <b>regrouper 10 centaines en 1 millier</b>.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent="#d97706" onClick={doRegroupHundreds}>
              ↑ Regrouper 10 centaines → 1 millier
            </Btn>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: '#10b981', background: '#d1fae5' }}>
          <div className="text-emerald-900 mb-2">Bravo, tu as additionné en regroupant !</div>
          <div className="font-display text-3xl tabular-nums text-emerald-800">
            {a} + {b} = {a + b}
          </div>
          {onComplete && (
            <Btn variant="primary" accent="#059669" className="mt-3" onClick={() => onComplete({ a, b, answer: a + b })}>
              Continuer →
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

// Helper: show counts with mini blocks
function BlockCountDisplay({ ones, tens, hundreds, thousands, highlight }) {
  const cubeSize = 9;
  return (
    <div className="flex items-end gap-3 flex-wrap justify-center">
      {thousands > 0 && (
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">{thousands} mille</div>
          <div className="flex gap-1">
            {Array.from({ length: thousands }, (_, i) => (
              <div key={i} className="w-10 h-10 rounded-md flex items-center justify-center font-display text-white text-[9px] font-bold"
                style={{ background: '#5d4037' }}>1k</div>
            ))}
          </div>
        </div>
      )}
      <div className={`text-center ${highlight === 'h' ? 'animate-pulse ring-2 ring-amber-400 rounded-lg p-1' : ''}`}>
        <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">{hundreds} centaines</div>
        <div className="flex gap-1.5 flex-wrap justify-center max-w-[180px]">
          {Array.from({ length: hundreds }, (_, i) => (
            <div key={i} className="grid grid-cols-10 gap-0.5">
              {Array.from({ length: 100 }, (_, j) => (
                <div key={j} className="w-1.5 h-1.5" style={{ background: BASE10_COLORS.hundred }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={`text-center ${highlight === 't' ? 'animate-pulse ring-2 ring-amber-400 rounded-lg p-1' : ''}`}>
        <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">{tens} dizaines</div>
        <div className="flex gap-1 items-end justify-center max-w-[200px] flex-wrap">
          {Array.from({ length: tens }, (_, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              {Array.from({ length: 10 }, (_, j) => (
                <div key={j} style={{ width: cubeSize, height: cubeSize, background: BASE10_COLORS.ten }} className="rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={`text-center ${highlight === 'u' ? 'animate-pulse ring-2 ring-amber-400 rounded-lg p-1' : ''}`}>
        <div className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">{ones} unités</div>
        <div className="flex flex-wrap gap-0.5 max-w-[120px] justify-center">
          {Array.from({ length: ones }, (_, i) => (
            <div key={i} style={{ width: cubeSize, height: cubeSize, background: BASE10_COLORS.one }} className="rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MANIPULABLE : BASE 10 SUBTRACTION (avec animation d'emprunt)
// ============================================================
function Base10SubtractionDemo({ a, b, onComplete, accent }) {
  // a - b. On commence avec les blocs de a, on retire ceux de b.
  // Si on n'a pas assez d'unités (par exemple), on "casse" une dizaine en 10 unités.
  const [phase, setPhase] = useState('setup');
  const [ones, setOnes] = useState(0);
  const [tens, setTens] = useState(0);
  const [hundreds, setHundreds] = useState(0);
  const [thousands, setThousands] = useState(0);
  const [removed, setRemoved] = useState({ u: 0, t: 0, h: 0, k: 0 });

  const decomp = (n) => ({
    u: n % 10, t: Math.floor((n % 100) / 10),
    h: Math.floor((n % 1000) / 100), k: Math.floor(n / 1000),
  });
  const dA = decomp(a), dB = decomp(b);

  const start = () => {
    setOnes(dA.u); setTens(dA.t); setHundreds(dA.h); setThousands(dA.k);
    setRemoved({ u: 0, t: 0, h: 0, k: 0 });
    setPhase('showing');
  };

  // Need to borrow for ones?
  const needToBorrowU = dB.u > ones && tens > 0;
  const needToBorrowT = dB.t > tens && hundreds > 0;
  const needToBorrowH = dB.h > hundreds && thousands > 0;

  const borrowFromT = () => {
    setTens(t => t - 1); setOnes(o => o + 10);
    setPhase('borrowed-u');
  };
  const borrowFromH = () => {
    setHundreds(h => h - 1); setTens(t => t + 10);
    setPhase('borrowed-t');
  };
  const borrowFromK = () => {
    setThousands(k => k - 1); setHundreds(h => h + 10);
    setPhase('borrowed-h');
  };
  const subtractAll = () => {
    setOnes(o => o - dB.u);
    setTens(t => t - dB.t);
    setHundreds(h => h - dB.h);
    setThousands(k => k - dB.k);
    setRemoved(dB);
    setPhase('done');
  };

  const currentValue = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
  const canSubtractDirectly = dB.u <= ones && dB.t <= tens && dB.h <= hundreds && dB.k <= thousands;

  return (
    <div className="select-none space-y-4">
      <div className="text-center">
        <div className="font-display text-3xl text-stone-900 tabular-nums">
          {a} <span className="text-stone-400 mx-2">−</span> {b} <span className="text-stone-400 mx-2">=</span>
          <span style={{ color: phase === 'done' ? accent : '#9ca3af' }}>
            {phase === 'setup' ? '?' : phase === 'done' ? a - b : '?'}
          </span>
        </div>
      </div>

      {phase === 'setup' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-stone-200 p-4">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3 text-center">
              On commence avec {a}
            </div>
            <div className="flex justify-center">
              <Base10Display value={a} size="small" />
            </div>
          </div>
          <div className="rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-900">
            On veut retirer <b>{b}</b> :
            {dB.k > 0 && <> {dB.k} millier{dB.k > 1 ? 's' : ''},</>}
            {dB.h > 0 && <> {dB.h} centaine{dB.h > 1 ? 's' : ''},</>}
            {dB.t > 0 && <> {dB.t} dizaine{dB.t > 1 ? 's' : ''},</>}
            {dB.u > 0 && <> {dB.u} unité{dB.u > 1 ? 's' : ''}</>}.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent={accent} onClick={start}>Commencer →</Btn>
          </div>
        </div>
      )}

      {phase !== 'setup' && (
        <div className="bg-white rounded-2xl border-2 p-4" style={{ borderColor: accent + '40' }}>
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-3 text-center">État actuel</div>
          <div className="flex justify-center">
            <BlockCountDisplay ones={ones} tens={tens} hundreds={hundreds} thousands={thousands}
              highlight={needToBorrowU ? 'u' : needToBorrowT ? 't' : needToBorrowH ? 'h' : null} />
          </div>
        </div>
      )}

      {/* Borrow actions */}
      {needToBorrowU && phase !== 'done' && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
          <div className="text-sm text-amber-900 mb-3 text-center">
            Il faut retirer <b>{dB.u} unités</b> mais on n'en a que <b>{ones}</b>.<br/>
            On <b>échange 1 dizaine contre 10 unités</b>.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent="#d97706" onClick={borrowFromT}>
              ↓ Échanger 1 dizaine → 10 unités
            </Btn>
          </div>
        </div>
      )}
      {!needToBorrowU && needToBorrowT && phase !== 'done' && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
          <div className="text-sm text-amber-900 mb-3 text-center">
            Il faut retirer <b>{dB.t} dizaines</b> mais on n'en a que <b>{tens}</b>.<br/>
            On <b>échange 1 centaine contre 10 dizaines</b>.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent="#d97706" onClick={borrowFromH}>
              ↓ Échanger 1 centaine → 10 dizaines
            </Btn>
          </div>
        </div>
      )}
      {!needToBorrowU && !needToBorrowT && needToBorrowH && phase !== 'done' && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
          <div className="text-sm text-amber-900 mb-3 text-center">
            Il faut retirer <b>{dB.h} centaines</b> mais on n'en a que <b>{hundreds}</b>.<br/>
            On <b>échange 1 millier contre 10 centaines</b>.
          </div>
          <div className="flex justify-center">
            <Btn variant="primary" accent="#d97706" onClick={borrowFromK}>
              ↓ Échanger 1 millier → 10 centaines
            </Btn>
          </div>
        </div>
      )}
      {canSubtractDirectly && phase !== 'setup' && phase !== 'done' && (
        <div className="rounded-2xl border-2 border-dashed p-4 text-center" style={{ borderColor: accent, background: accent + '15' }}>
          <div className="text-sm mb-3">Maintenant on peut retirer <b>{b}</b> directement.</div>
          <Btn variant="primary" accent={accent} onClick={subtractAll}>
            − Retirer {b}
          </Btn>
        </div>
      )}

      {phase === 'done' && (
        <div className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: '#10b981', background: '#d1fae5' }}>
          <div className="text-emerald-900 mb-2">Bravo, tu as soustrait en empruntant !</div>
          <div className="font-display text-3xl tabular-nums text-emerald-800">
            {a} − {b} = {a - b}
          </div>
          {onComplete && (
            <Btn variant="primary" accent="#059669" className="mt-3" onClick={() => onComplete({ a, b, answer: a - b })}>
              Continuer →
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

// ⏸ FIN BUILD 1 — Suite dans la réponse 2
// (Bar Models + Number Line + Money + animations)


// ═══ FROM cahier-sg-speech.jsx ═══
// ============================================================
// LECTURE VOCALE (Web Speech API)
// Fonctionne hors-ligne sur iPad/Mac/Windows modernes.
// Priorité : voix fr-CA, puis fr-FR, puis fr.
// ============================================================

// Singleton pour gérer la synthèse vocale
const speechManager = (() => {
  let currentUtterance = null;
  let voicesCache = null;
  let isSpeaking = false;
  const listeners = new Set();

  const notifyListeners = () => listeners.forEach(fn => fn(isSpeaking));

  const loadVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    if (voicesCache) return voicesCache;
    voicesCache = window.speechSynthesis.getVoices();
    return voicesCache;
  };

  // Some browsers (Chrome) load voices async
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      voicesCache = window.speechSynthesis.getVoices();
    };
  }

  const pickBestFrenchVoice = () => {
    const voices = loadVoices();
    if (voices.length === 0) return null;
    // Priority: fr-CA → fr-FR → any fr
    const fcCa = voices.find(v => v.lang === 'fr-CA');
    if (fcCa) return fcCa;
    const frFr = voices.find(v => v.lang === 'fr-FR');
    if (frFr) return frFr;
    const anyFr = voices.find(v => v.lang.startsWith('fr'));
    return anyFr || null;
  };

  const isSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = (text, opts = {}) => {
    if (!isSupported() || !text) return;
    // Stop any current speech first
    stop();

    const utt = new SpeechSynthesisUtterance(text);
    const voice = pickBestFrenchVoice();
    if (voice) utt.voice = voice;
    utt.lang = voice?.lang || 'fr-CA';
    utt.rate = opts.rate || 1.0;
    utt.pitch = opts.pitch || 1.0;
    utt.volume = opts.volume ?? 1.0;
    utt.onstart = () => { isSpeaking = true; notifyListeners(); };
    utt.onend = () => { isSpeaking = false; currentUtterance = null; notifyListeners(); };
    utt.onerror = () => { isSpeaking = false; currentUtterance = null; notifyListeners(); };

    currentUtterance = utt;
    window.speechSynthesis.speak(utt);
  };

  const stop = () => {
    if (!isSupported()) return;
    window.speechSynthesis.cancel();
    isSpeaking = false;
    currentUtterance = null;
    notifyListeners();
  };

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  // Test that speech works (returns voice info)
  const getVoiceInfo = () => {
    const v = pickBestFrenchVoice();
    if (!v) return null;
    return { name: v.name, lang: v.lang, default: v.default };
  };

  return { speak, stop, isSupported, subscribe, getVoiceInfo, isSpeaking: () => isSpeaking };
})();

// ============================================================
// HOOK : useSpeech
// ============================================================
function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => speechManager.subscribe(setSpeaking), []);
  return {
    speak: speechManager.speak,
    stop: speechManager.stop,
    speaking,
    isSupported: speechManager.isSupported(),
    voiceInfo: speechManager.getVoiceInfo(),
  };
}

// ============================================================
// COMPONENT : ReadableText
// Wraps any text with a speaker button. Optional auto-read.
// ============================================================
function ReadableText({
  children,
  text,           // Optional: override text to speak (default = children if string)
  autoRead,       // boolean — auto-read on mount
  rate = 1.0,
  className = '',
  accent = '#1c1917',
  buttonPosition = 'inline', // 'inline' (after text) or 'before' (before text)
  buttonSize = 'normal',     // 'small' | 'normal' | 'large'
}) {
  const { speak, stop, speaking, isSupported } = useSpeech();
  const [readingThis, setReadingThis] = useState(false);
  const speakText = text || (typeof children === 'string' ? children : '');

  useEffect(() => {
    if (autoRead && speakText && isSupported) {
      // Small delay so multiple components don't all try at once
      const t = setTimeout(() => {
        speak(speakText, { rate });
        setReadingThis(true);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [autoRead, speakText, rate, isSupported]);

  // When speech globally stops, reset readingThis
  useEffect(() => {
    if (!speaking) setReadingThis(false);
  }, [speaking]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (readingThis && speaking) {
      stop();
      setReadingThis(false);
    } else {
      speak(speakText, { rate });
      setReadingThis(true);
    }
  };

  if (!isSupported) {
    // Fall through: just render children, no button
    return <span className={className}>{children}</span>;
  }

  const sizes = {
    small:  { btn: 'w-6 h-6 text-xs', icon: 12 },
    normal: { btn: 'w-8 h-8 text-sm', icon: 14 },
    large:  { btn: 'w-10 h-10 text-base', icon: 18 },
  };
  const sz = sizes[buttonSize];

  const speakerBtn = (
    <button onClick={handleClick}
      aria-label={readingThis ? 'Arrêter la lecture' : 'Écouter'}
      className={`inline-flex items-center justify-center rounded-full transition-all active:scale-90 hover:opacity-80 ${sz.btn}`}
      style={{
        background: readingThis && speaking ? accent : accent + '15',
        color: readingThis && speaking ? 'white' : accent,
      }}>
      {readingThis && speaking ? (
        // Pause icon (animated bars)
        <span className="inline-flex gap-0.5 items-center" style={{ height: sz.icon }}>
          <span className="w-1 h-full rounded-full bg-current animate-pulse" />
          <span className="w-1 h-full rounded-full bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-full rounded-full bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
        </span>
      ) : (
        // Speaker icon
        <svg width={sz.icon} height={sz.icon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
            opacity="0.7" />
        </svg>
      )}
    </button>
  );

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {buttonPosition === 'before' && speakerBtn}
      <span>{children}</span>
      {buttonPosition === 'inline' && speakerBtn}
    </span>
  );
}

// ============================================================
// COMPONENT : ReadAloudBlock
// For longer texts / instructions blocks. Big speaker button.
// ============================================================
function ReadAloudBlock({ text, autoRead, rate = 0.95, accent = '#1c1917', className = '' }) {
  const { speak, stop, speaking, isSupported } = useSpeech();
  const [readingThis, setReadingThis] = useState(false);

  useEffect(() => {
    if (autoRead && text && isSupported) {
      const t = setTimeout(() => {
        speak(text, { rate });
        setReadingThis(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [autoRead, text, rate, isSupported]);

  useEffect(() => {
    if (!speaking) setReadingThis(false);
  }, [speaking]);

  if (!isSupported || !text) return null;

  return (
    <button onClick={() => {
      if (readingThis && speaking) { stop(); setReadingThis(false); }
      else { speak(text, { rate }); setReadingThis(true); }
    }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all active:scale-95 ${className}`}
      style={{
        background: readingThis && speaking ? accent : accent + '15',
        color: readingThis && speaking ? 'white' : accent,
      }}>
      {readingThis && speaking ? (
        <>
          <span className="inline-flex gap-0.5 items-center h-3">
            <span className="w-0.5 h-full rounded-full bg-current animate-pulse" />
            <span className="w-0.5 h-full rounded-full bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-full rounded-full bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
          <span>Lecture · Arrêter</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" opacity="0.7" />
          </svg>
          <span>Écouter</span>
        </>
      )}
    </button>
  );
}

// ============================================================
// PER-KID SPEECH PREFERENCES (stored alongside config)
// Each kid has: autoRead (bool), rate (number)
// Defaults: grade 1 → autoRead ON, rate 0.85; grade 2+ → autoRead OFF, rate 1.0
// ============================================================
function getKidSpeechPrefs(kid) {
  return {
    autoRead: kid.speechAutoRead ?? (kid.grade === 1),
    rate:     kid.speechRate     ?? (kid.grade === 1 ? 0.85 : 1.0),
  };
}

// ============================================================
// AJOUT POUR LE CONFIG : champs sur chaque enfant
// (déjà compatible avec DEFAULT_CONFIG existant; just adds optional fields)
// Example dans Réglages :
//   speechAutoRead: true/false
//   speechRate: 0.7 (lent) | 0.85 (calme) | 1.0 (normal) | 1.2 (rapide)
// ============================================================

// ⏸ FIN module lecture vocale — à intégrer dans le fichier principal


// ═══ FROM cahier-sg-build2.jsx ═══
// ============================================================
// BUILD 2 — Bar Models, Number Line, Money
// ============================================================

// ============================================================
// MANIPULABLE : BAR MODEL (Modèle en barres)
// LA signature de la méthode Singapour. Représente un problème
// par des rectangles proportionnels.
// ============================================================

// ─── 1. Bar Model "Part-Whole" (Partie-tout) ───
// Une grande barre = tout. Deux ou plus petites barres alignées = parties.
function PartWholeBar({ whole, parts, unknown, accent = '#0277bd', label, showLabels = true, autoRead, scale = 'auto' }) {
  // parts: array of { value, color?, label? }
  // unknown: which slot is unknown? 'whole' | 0 | 1 | ...
  // The bar is sized proportionally to the WHOLE value
  const totalParts = parts.reduce((a, p) => a + (p.value || 0), 0);
  const target = whole || totalParts;
  const widthScale = scale === 'auto' ? Math.min(400, target * 4) : scale;
  const barHeight = 56;

  return (
    <div className="select-none my-3">
      {label && (
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-2 text-center">{label}</div>
      )}

      {/* Whole bar */}
      <div className="relative mx-auto" style={{ width: widthScale, maxWidth: '100%' }}>
        <div className="rounded-xl border-2 flex items-center justify-center text-white font-display text-xl tabular-nums shadow-sm"
          style={{
            background: unknown === 'whole' ? 'transparent' : accent,
            borderColor: accent,
            color: unknown === 'whole' ? accent : 'white',
            height: barHeight,
            background: unknown === 'whole'
              ? `repeating-linear-gradient(45deg, ${accent}15, ${accent}15 8px, transparent 8px, transparent 16px)`
              : accent,
          }}>
          {unknown === 'whole' ? '?' : whole ?? totalParts}
        </div>
        {showLabels && (
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1 text-center">le tout</div>
        )}

        {/* Bracket between whole and parts */}
        <div className="flex justify-center my-1">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]"
            style={{ borderTopColor: accent }} />
        </div>

        {/* Parts bars */}
        <div className="flex gap-1">
          {parts.map((p, i) => {
            const partWidth = ((p.value || 0) / target) * widthScale;
            const isUnknown = unknown === i;
            const partColor = p.color || (i % 2 === 0 ? accent : '#f97316');
            return (
              <div key={i} className="flex flex-col" style={{ width: partWidth }}>
                <div className="rounded-xl border-2 flex items-center justify-center font-display text-xl tabular-nums shadow-sm"
                  style={{
                    background: isUnknown
                      ? `repeating-linear-gradient(45deg, ${partColor}15, ${partColor}15 8px, transparent 8px, transparent 16px)`
                      : partColor,
                    borderColor: partColor,
                    color: isUnknown ? partColor : 'white',
                    height: barHeight,
                  }}>
                  {isUnknown ? '?' : p.value}
                </div>
                {showLabels && p.label && (
                  <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1 text-center truncate">{p.label}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 2. Bar Model "Comparison" (Comparaison) ───
// Two parallel bars, one labeled "bigger" and one "smaller",
// with a "difference" gap visualized.
function ComparisonBar({ a, b, aLabel, bLabel, unknown, accent = '#0277bd', diffColor = '#f97316' }) {
  // a should be the larger one ; b smaller. If b > a, swap visually.
  const larger = Math.max(a || 0, b || 0);
  const smaller = Math.min(a || 0, b || 0);
  const diff = larger - smaller;
  const widthScale = Math.min(400, larger * 4);
  const barHeight = 44;

  return (
    <div className="select-none my-3 mx-auto" style={{ width: widthScale + 10, maxWidth: '100%' }}>
      {/* Top bar (larger) */}
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs uppercase tracking-widest text-stone-500 w-16 truncate">{aLabel || 'A'}</div>
        <div className="rounded-xl border-2 flex items-center justify-center text-white font-display text-lg tabular-nums shadow-sm"
          style={{
            width: widthScale,
            height: barHeight,
            background: unknown === 'a' ? `repeating-linear-gradient(45deg, ${accent}15, ${accent}15 8px, transparent 8px, transparent 16px)` : accent,
            borderColor: accent,
            color: unknown === 'a' ? accent : 'white',
          }}>
          {unknown === 'a' ? '?' : larger}
        </div>
      </div>

      {/* Bottom bar (smaller) + difference highlight */}
      <div className="flex items-center gap-2">
        <div className="text-xs uppercase tracking-widest text-stone-500 w-16 truncate">{bLabel || 'B'}</div>
        <div className="flex relative">
          <div className="rounded-xl border-2 flex items-center justify-center text-white font-display text-lg tabular-nums shadow-sm"
            style={{
              width: (smaller / larger) * widthScale,
              height: barHeight,
              background: unknown === 'b' ? `repeating-linear-gradient(45deg, ${accent}15, ${accent}15 8px, transparent 8px, transparent 16px)` : accent,
              borderColor: accent,
              color: unknown === 'b' ? accent : 'white',
            }}>
            {unknown === 'b' ? '?' : smaller}
          </div>
          {diff > 0 && (
            <div className="rounded-xl border-2 border-dashed flex items-center justify-center font-display text-sm tabular-nums ml-1"
              style={{
                width: (diff / larger) * widthScale - 4,
                height: barHeight,
                borderColor: diffColor,
                color: diffColor,
                background: unknown === 'diff'
                  ? `repeating-linear-gradient(45deg, ${diffColor}15, ${diffColor}15 8px, transparent 8px, transparent 16px)`
                  : diffColor + '15',
              }}>
              {unknown === 'diff' ? '?' : `diff: ${diff}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 3. Bar Model BUILDER (interactif) ───
// L'enfant construit son propre modèle pour un problème donné.
// Mode : "partWhole" — drag pour ajuster la taille de chaque partie
function BarModelBuilder({ targetWhole, numParts = 2, accent = '#0277bd', onComplete }) {
  // User can drag dividers between parts to set their proportions.
  // Or: simply input each part's value via number input.
  const [partValues, setPartValues] = useState(() =>
    Array.from({ length: numParts }, () => Math.floor(targetWhole / numParts))
  );

  const total = partValues.reduce((a, v) => a + v, 0);
  const isValid = total === targetWhole && partValues.every(v => v > 0);

  const updatePart = (i, v) => {
    const newVal = Math.max(0, Math.min(targetWhole, parseInt(v, 10) || 0));
    const updated = [...partValues];
    updated[i] = newVal;
    setPartValues(updated);
  };

  return (
    <div className="select-none">
      <div className="rounded-2xl border-2 border-stone-200 bg-white p-4">
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-3 text-center">
          Le tout vaut <b style={{ color: accent }}>{targetWhole}</b>. Construis le modèle en barres.
        </div>

        {/* Live preview of the bar */}
        <PartWholeBar
          whole={targetWhole}
          parts={partValues.map((v, i) => ({ value: v, color: i % 2 === 0 ? accent : '#f97316' }))}
          accent={accent}
          showLabels={false}
        />

        {/* Inputs for each part */}
        <div className={`mt-4 grid gap-3`} style={{ gridTemplateColumns: `repeat(${numParts}, 1fr)` }}>
          {partValues.map((v, i) => (
            <div key={i}>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Partie {i + 1}</div>
              <input
                type="number" min="0" max={targetWhole}
                value={v}
                onChange={e => updatePart(i, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-stone-300 text-center font-display text-lg tabular-nums focus:outline-none"
                style={{ borderColor: v > 0 ? accent : '#d6d3d1' }}
              />
            </div>
          ))}
        </div>

        {/* Sum indicator */}
        <div className="mt-3 text-center text-sm">
          {partValues.join(' + ')} = <b style={{ color: isValid ? '#10b981' : '#dc2626' }}>{total}</b>
          {total !== targetWhole && (
            <span className="ml-2 text-xs text-rose-600">
              (il faut {targetWhole})
            </span>
          )}
        </div>
      </div>

      {onComplete && (
        <div className="mt-3 flex justify-center">
          <Btn variant="primary" accent={accent} disabled={!isValid}
            onClick={() => onComplete({ parts: partValues, whole: targetWhole })}>
            Vérifier →
          </Btn>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MANIPULABLE : NUMBER LINE (Ligne numérique)
// Avec sauts visualisés pour add/sub/multiplication
// ============================================================
function NumberLine({
  min = 0, max = 20, value,           // current position (optional, for static display)
  jumps,                              // array of { from, to, label?, color? }
  marks,                              // array of numbers to show prominently
  highlight,                          // single number to highlight
  showAllNumbers = false,             // if true, show every integer; else only marks
  height = 100,
  accent = '#0277bd',
}) {
  const range = max - min;
  if (range <= 0) return null;

  // Compute viewBox-like coordinates: total width = 100% of container
  // We render as SVG for precision
  const width = 600;
  const lineY = height / 2;
  const padding = 30;

  const xPos = (n) => padding + ((n - min) / range) * (width - 2 * padding);

  // Decide which numbers to show as ticks
  let tickNumbers;
  if (marks && marks.length > 0) {
    tickNumbers = marks;
  } else if (showAllNumbers || range <= 20) {
    tickNumbers = Array.from({ length: range + 1 }, (_, i) => min + i);
  } else if (range <= 100) {
    // Every 10
    tickNumbers = [];
    for (let n = min; n <= max; n += 10) tickNumbers.push(n);
  } else {
    // Every 100
    tickNumbers = [];
    for (let n = min; n <= max; n += 100) tickNumbers.push(n);
  }

  return (
    <div className="select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: height + 20 }}>
        {/* Main line */}
        <line x1={padding} y1={lineY} x2={width - padding} y2={lineY}
          stroke="#78716c" strokeWidth="2" />
        {/* Arrow ends */}
        <polygon points={`${padding - 8},${lineY} ${padding - 2},${lineY - 5} ${padding - 2},${lineY + 5}`} fill="#78716c" />
        <polygon points={`${width - padding + 8},${lineY} ${width - padding + 2},${lineY - 5} ${width - padding + 2},${lineY + 5}`} fill="#78716c" />

        {/* Ticks and labels */}
        {tickNumbers.map(n => {
          const x = xPos(n);
          const isHighlight = highlight === n;
          return (
            <g key={n}>
              <line x1={x} y1={lineY - 6} x2={x} y2={lineY + 6}
                stroke={isHighlight ? accent : '#78716c'}
                strokeWidth={isHighlight ? 3 : 1.5} />
              <text x={x} y={lineY + 22} textAnchor="middle"
                fontSize={isHighlight ? 16 : 13}
                fontWeight={isHighlight ? 'bold' : 'normal'}
                fill={isHighlight ? accent : '#57534e'}
                className="tabular-nums">
                {n}
              </text>
              {isHighlight && (
                <circle cx={x} cy={lineY} r={6} fill={accent} />
              )}
            </g>
          );
        })}

        {/* Jumps (arcs) */}
        {jumps && jumps.map((jump, i) => {
          const x1 = xPos(jump.from);
          const x2 = xPos(jump.to);
          const midX = (x1 + x2) / 2;
          const arcHeight = jump.from < jump.to ? -28 : 28; // forward = above, backward = below
          const peakY = lineY + arcHeight;
          const color = jump.color || (jump.from < jump.to ? '#10b981' : '#dc2626');

          return (
            <g key={i}>
              {/* Arc */}
              <path d={`M ${x1} ${lineY} Q ${midX} ${peakY} ${x2} ${lineY}`}
                stroke={color} strokeWidth="2.5" fill="none"
                strokeDasharray={jump.from < jump.to ? "0" : "4 3"} />
              {/* Arrow head at destination */}
              <polygon
                points={
                  jump.from < jump.to
                    ? `${x2},${lineY - 1} ${x2 - 6},${lineY - 8} ${x2 - 6},${lineY + 6}`
                    : `${x2},${lineY - 1} ${x2 + 6},${lineY - 8} ${x2 + 6},${lineY + 6}`
                }
                fill={color}
                transform={jump.from > jump.to ? `rotate(180 ${x2} ${lineY})` : ''}
              />
              {/* Label */}
              {jump.label && (
                <text x={midX} y={peakY + (arcHeight < 0 ? -4 : 16)} textAnchor="middle"
                  fontSize="13" fontWeight="600" fill={color} className="tabular-nums">
                  {jump.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Current position dot */}
        {value !== undefined && (
          <circle cx={xPos(value)} cy={lineY} r={8} fill={accent}
            stroke="white" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}

// ─── Number Line — animated jumping (for demos) ───
function AnimatedJumpLine({ from, to, jumpSize, min, max, accent = '#0277bd', onDone }) {
  // Animates a series of jumps of `jumpSize` from `from` toward `to`.
  const [currentPos, setCurrentPos] = useState(from);
  const [completedJumps, setCompletedJumps] = useState([]);
  const direction = to > from ? 1 : -1;
  const numJumps = Math.abs(to - from) / Math.abs(jumpSize);

  useEffect(() => {
    setCurrentPos(from);
    setCompletedJumps([]);
  }, [from, to, jumpSize]);

  const doNextJump = () => {
    const newPos = currentPos + jumpSize * direction;
    if ((direction > 0 && newPos > to) || (direction < 0 && newPos < to)) return;
    setCompletedJumps(prev => [...prev, { from: currentPos, to: newPos, label: `${direction > 0 ? '+' : ''}${jumpSize * direction}` }]);
    setCurrentPos(newPos);
    if (newPos === to && onDone) onDone();
  };

  const isDone = currentPos === to;

  return (
    <div className="select-none">
      <NumberLine min={min} max={max}
        jumps={completedJumps}
        highlight={currentPos}
        accent={accent}
        marks={[min, to, max, ...Array.from({ length: numJumps + 1 }, (_, i) => from + i * jumpSize * direction)].filter((v, i, a) => a.indexOf(v) === i && v >= min && v <= max)}
      />
      {!isDone && (
        <div className="text-center mt-2">
          <Btn variant="primary" accent={accent} onClick={doNextJump} size="small">
            → Sauter de {Math.abs(jumpSize)}
          </Btn>
        </div>
      )}
      {isDone && (
        <div className="text-center mt-2 text-sm text-emerald-700 font-medium">
          ✓ Arrivé à {to}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MANIPULABLE : MONNAIE QUÉBÉCOISE
// Pièces : 1¢, 5¢, 10¢, 25¢, 1$, 2$
// Billets : 5$, 10$, 20$ (pour 2e/3e année)
// ============================================================

const COINS = [
  { id: '1c',  value: 1,    label: '1¢',   color: '#b87333', name: 'sou' },
  { id: '5c',  value: 5,    label: '5¢',   color: '#9ca3af', name: 'cinq sous' },      // Note: 5¢ piece retired in Canada in 2013 — keeping for math practice
  { id: '10c', value: 10,   label: '10¢',  color: '#9ca3af', name: 'dix sous' },
  { id: '25c', value: 25,   label: '25¢',  color: '#9ca3af', name: 'vingt-cinq sous' },
  { id: '1d',  value: 100,  label: '1$',   color: '#d4af37', name: 'huard' },
  { id: '2d',  value: 200,  label: '2$',   color: '#d4af37', name: 'toonie', dual: true },
];
const BILLS = [
  { id: '5b',  value: 500,  label: '5$',  color: '#3b82f6',  bill: true, name: 'cinq dollars' },
  { id: '10b', value: 1000, label: '10$', color: '#7c3aed',  bill: true, name: 'dix dollars' },
  { id: '20b', value: 2000, label: '20$', color: '#dc2626',  bill: true, name: 'vingt dollars' },
];

// ─── Coin display (single piece, visual) ───
function CoinPiece({ coin, size = 'normal', onClick, count, faded }) {
  const sizes = {
    small:  { w: 36, h: 36, font: 9 },
    normal: { w: 52, h: 52, font: 12 },
    large:  { w: 68, h: 68, font: 14 },
  };
  const sz = sizes[size];

  if (coin.bill) {
    // Render bill as rectangle
    return (
      <button onClick={onClick}
        className="relative rounded-md shadow-sm border-2 transition-all active:scale-95 hover:shadow-md"
        style={{
          width: sz.w * 1.6,
          height: sz.h * 0.75,
          background: `linear-gradient(135deg, ${coin.color}22, ${coin.color}44)`,
          borderColor: coin.color,
          opacity: faded ? 0.35 : 1,
        }}>
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold"
          style={{ color: coin.color, fontSize: sz.font + 4 }}>
          {coin.label}
        </div>
        {count !== undefined && count > 1 && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
            {count}
          </div>
        )}
      </button>
    );
  }

  // Render coin as circle (gold-ish or silver)
  const isGold = coin.color === '#d4af37';
  const isCopper = coin.color === '#b87333';

  return (
    <button onClick={onClick}
      className="relative rounded-full shadow-sm border-2 transition-all active:scale-95 hover:shadow-md flex items-center justify-center"
      style={{
        width: sz.w, height: sz.h,
        background: isGold
          ? `radial-gradient(circle at 35% 30%, #ffd700, #d4af37 50%, #b8941f 100%)`
          : isCopper
          ? `radial-gradient(circle at 35% 30%, #c89568, #b87333 50%, #8b5a2b 100%)`
          : `radial-gradient(circle at 35% 30%, #d1d5db, #9ca3af 50%, #6b7280 100%)`,
        borderColor: isGold ? '#a8881a' : isCopper ? '#8b5a2b' : '#6b7280',
        opacity: faded ? 0.35 : 1,
      }}>
      {/* Toonie (2$) has inner ring */}
      {coin.dual && (
        <div className="absolute inset-2 rounded-full border-2"
          style={{
            background: `radial-gradient(circle at 35% 30%, #f0f0f0, #b8b8b8)`,
            borderColor: '#a8881a',
          }} />
      )}
      <span className="relative font-display font-bold drop-shadow-sm"
        style={{ fontSize: sz.font, color: isGold || isCopper ? '#3d2c10' : '#1f2937' }}>
        {coin.label}
      </span>
      {count !== undefined && count > 1 && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
          {count}
        </div>
      )}
    </button>
  );
}

// ─── Money Selector (à utiliser pour faire un montant) ───
function MoneySelector({ targetCents, onChange, accent = '#0277bd', maxValue, showBills = false }) {
  // selection: object { [coinId]: count }
  const [selection, setSelection] = useState({});

  const availableCoins = [...COINS, ...(showBills ? BILLS : [])];

  const total = Object.entries(selection).reduce((sum, [coinId, count]) => {
    const c = availableCoins.find(x => x.id === coinId);
    return sum + (c ? c.value * count : 0);
  }, 0);

  const addCoin = (coinId) => {
    setSelection(s => ({ ...s, [coinId]: (s[coinId] || 0) + 1 }));
  };
  const removeCoin = (coinId) => {
    setSelection(s => {
      const newCount = Math.max(0, (s[coinId] || 0) - 1);
      const updated = { ...s, [coinId]: newCount };
      if (newCount === 0) delete updated[coinId];
      return updated;
    });
  };

  useEffect(() => {
    onChange && onChange({ selection, total });
  }, [selection, total, onChange]);

  const isExact = total === targetCents;
  const isOver = total > targetCents;

  return (
    <div className="select-none space-y-3">
      {/* Target & current */}
      {targetCents !== undefined && (
        <div className="bg-white rounded-2xl border-2 p-3 flex items-center justify-around"
          style={{ borderColor: isExact ? '#10b981' : isOver ? '#dc2626' : accent + '40' }}>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest text-stone-500">Objectif</div>
            <div className="font-display text-xl tabular-nums" style={{ color: accent }}>{fmtMoney(targetCents)}</div>
          </div>
          <div className="text-2xl text-stone-300">→</div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest text-stone-500">Sélectionné</div>
            <div className="font-display text-xl tabular-nums"
              style={{ color: isExact ? '#10b981' : isOver ? '#dc2626' : '#1c1917' }}>
              {fmtMoney(total)}
            </div>
          </div>
        </div>
      )}

      {/* Coin palette */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-3">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 text-center">
          Touche une pièce pour l'ajouter
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {availableCoins.map(coin => (
            <CoinPiece key={coin.id} coin={coin} size="normal" onClick={() => addCoin(coin.id)} />
          ))}
        </div>
      </div>

      {/* Current selection */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-3 min-h-[80px]">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 text-center">
          Tes pièces ({Object.values(selection).reduce((a, c) => a + c, 0)})
        </div>
        {Object.keys(selection).length === 0 ? (
          <div className="text-center text-xs text-stone-400 py-4">Aucune pièce</div>
        ) : (
          <div className="flex gap-2 flex-wrap justify-center">
            {Object.entries(selection).map(([coinId, count]) => {
              const coin = availableCoins.find(c => c.id === coinId);
              return coin ? (
                <CoinPiece key={coinId} coin={coin} count={count} size="small"
                  onClick={() => removeCoin(coinId)} />
              ) : null;
            })}
          </div>
        )}
        {Object.keys(selection).length > 0 && (
          <div className="mt-2 text-center text-[10px] text-stone-500">
            Touche une pièce sélectionnée pour la retirer
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Money Display (affichage figé de pièces) ───
function MoneyDisplay({ cents, accent }) {
  // Greedy decomposition: largest pieces first
  const allUnits = [...BILLS, ...COINS].sort((a, b) => b.value - a.value);
  const breakdown = [];
  let remaining = cents;
  for (const unit of allUnits) {
    const count = Math.floor(remaining / unit.value);
    if (count > 0) {
      breakdown.push({ ...unit, count });
      remaining -= count * unit.value;
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 text-center">
        Total : {fmtMoney(cents)}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {breakdown.map((unit, i) => (
          <CoinPiece key={unit.id + '-' + i} coin={unit} count={unit.count} size="normal" />
        ))}
      </div>
    </div>
  );
}

// ⏸ FIN BUILD 2 — Suite dans la réponse 3 (Multiplication arrays + Fractions)


// ═══ FROM cahier-sg-build3.jsx ═══
// ============================================================
// BUILD 3 — Multiplication & Fractions
// ============================================================

// ============================================================
// MANIPULABLE : MULTIPLICATION — GROUPES ÉGAUX
// "3 groupes de 4 cookies = 12 cookies"
// L'enfant voit des groupes physiquement séparés.
// ============================================================
function EqualGroupsDisplay({ groups, perGroup, accent = '#558b2f', itemEmoji = '●', showCount = true }) {
  // Render `groups` clusters of `perGroup` items each.
  return (
    <div className="select-none">
      <div className="flex flex-wrap gap-3 justify-center">
        {Array.from({ length: groups }, (_, g) => (
          <div key={g} className="rounded-2xl border-2 border-dashed p-3 transition-all"
            style={{
              borderColor: accent + '60',
              background: accent + '08',
              animation: `popIn 0.4s ease-out ${g * 100}ms backwards`,
            }}>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 text-center">
              Groupe {g + 1}
            </div>
            <div className="flex flex-wrap gap-1 max-w-[140px] justify-center">
              {Array.from({ length: perGroup }, (_, i) => (
                <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-base"
                  style={{
                    background: accent,
                    color: 'white',
                    animation: `popIn 0.3s ease-out ${(g * perGroup + i) * 50}ms backwards`,
                  }}>
                  {itemEmoji}
                </div>
              ))}
            </div>
            {showCount && (
              <div className="text-center mt-1.5 font-display text-sm font-bold" style={{ color: accent }}>
                {perGroup}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Equation summary */}
      <div className="mt-4 text-center font-display text-xl tabular-nums text-stone-800">
        {groups} groupes × {perGroup} = <b style={{ color: accent }}>{groups * perGroup}</b>
      </div>
    </div>
  );
}

// ============================================================
// MANIPULABLE : ARRAY (Disposition en rangées × colonnes)
// La représentation rectangulaire fait voir mult comme une aire
// ============================================================
function ArrayDisplay({ rows, cols, accent = '#558b2f', interactive = false, onChange, showLabels = true, cellSize = 'normal' }) {
  const sizes = {
    small:  { cell: 18, gap: 2 },
    normal: { cell: 26, gap: 3 },
    large:  { cell: 36, gap: 4 },
  };
  const sz = sizes[cellSize];

  return (
    <div className="select-none inline-block">
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-4">
        <div className="flex">
          {/* Rows label column (left) */}
          {showLabels && (
            <div className="flex flex-col items-center justify-around mr-3" style={{ gap: sz.gap }}>
              <div className="text-[9px] uppercase tracking-widest text-stone-500 whitespace-nowrap mb-1"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {rows} rangées
              </div>
            </div>
          )}

          <div>
            {/* Cols label row (top) */}
            {showLabels && (
              <div className="text-[10px] uppercase tracking-widest text-stone-500 text-center mb-1.5">
                {cols} colonnes
              </div>
            )}

            {/* The actual grid */}
            <div className="grid" style={{
              gridTemplateColumns: `repeat(${cols}, ${sz.cell}px)`,
              gap: sz.gap,
            }}>
              {Array.from({ length: rows * cols }, (_, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                return (
                  <div key={i} className="rounded-md transition-all"
                    style={{
                      width: sz.cell, height: sz.cell,
                      background: `radial-gradient(circle at 35% 30%, ${accent}, ${accent}cc)`,
                      animation: `popIn 0.2s ease-out ${(row + col) * 30}ms backwards`,
                      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.4), 0 1px 2px ${accent}33`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Equation */}
        <div className="mt-3 text-center font-display text-lg tabular-nums">
          {rows} <span className="text-stone-400">×</span> {cols}{' '}
          <span className="text-stone-400">=</span>{' '}
          <b style={{ color: accent }}>{rows * cols}</b>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MANIPULABLE : ARRAY BUILDER (interactif)
// L'enfant choisit rows × cols pour construire et voir le total
// ============================================================
function ArrayBuilder({ maxRows = 10, maxCols = 10, targetProduct, accent = '#558b2f', onChange, onComplete }) {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const product = rows * cols;
  const isTarget = targetProduct !== undefined && product === targetProduct;

  useEffect(() => {
    if (onChange) onChange({ rows, cols, product });
  }, [rows, cols, product, onChange]);

  return (
    <div className="select-none space-y-3">
      {/* Target indicator */}
      {targetProduct !== undefined && (
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-stone-500">Construis une multiplication qui fait</div>
          <div className="font-display text-3xl font-bold tabular-nums" style={{ color: accent }}>
            {targetProduct}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 text-center">Rangées</div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setRows(r => Math.max(1, r - 1))}
                className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all">−</button>
              <div className="font-display text-2xl font-bold tabular-nums w-8 text-center" style={{ color: accent }}>
                {rows}
              </div>
              <button onClick={() => setRows(r => Math.min(maxRows, r + 1))}
                className="w-10 h-10 rounded-xl text-white active:scale-95 transition-all"
                style={{ background: accent }}>+</button>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 text-center">Colonnes</div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setCols(c => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all">−</button>
              <div className="font-display text-2xl font-bold tabular-nums w-8 text-center" style={{ color: accent }}>
                {cols}
              </div>
              <button onClick={() => setCols(c => Math.min(maxCols, c + 1))}
                className="w-10 h-10 rounded-xl text-white active:scale-95 transition-all"
                style={{ background: accent }}>+</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <ArrayDisplay rows={rows} cols={cols} accent={accent} cellSize="small" showLabels={false} />
        </div>
      </div>

      {/* Result */}
      <div className="text-center font-display text-2xl tabular-nums">
        {rows} <span className="text-stone-400">×</span> {cols}{' '}
        <span className="text-stone-400">=</span>{' '}
        <b style={{ color: isTarget ? '#10b981' : accent }}>
          {product}
        </b>
        {isTarget && <span className="ml-2 text-emerald-600">✓</span>}
      </div>

      {targetProduct !== undefined && onComplete && (
        <div className="flex justify-center">
          <Btn variant="primary" accent={accent} disabled={!isTarget} onClick={() => onComplete({ rows, cols })}>
            Vérifier →
          </Btn>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MANIPULABLE : SKIP COUNTING ON ARRAY
// Pour les tables de mult, on montre l'array progressif :
// 1×N = N (une rangée allumée)
// 2×N = 2N (deux rangées allumées)
// etc.
// ============================================================
function SkipCountArray({ table, currentMultiplier, onIncrement, onDecrement, accent = '#558b2f', maxMultiplier = 10 }) {
  // The array is always `maxMultiplier` rows × `table` cols.
  // Rows 1..currentMultiplier are "active", rest are dimmed.
  const cellSize = table > 7 ? 16 : 22;
  const gap = 2;

  return (
    <div className="select-none">
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-4">
        <div className="text-center text-xs uppercase tracking-widest text-stone-500 mb-3">
          Table de {table}
        </div>
        <div className="flex justify-center mb-4">
          <div className="grid" style={{
            gridTemplateColumns: `repeat(${table}, ${cellSize}px)`,
            gap: gap,
          }}>
            {Array.from({ length: maxMultiplier * table }, (_, i) => {
              const row = Math.floor(i / table);
              const active = row < currentMultiplier;
              return (
                <div key={i} className="rounded-md transition-all"
                  style={{
                    width: cellSize, height: cellSize,
                    background: active
                      ? `radial-gradient(circle at 35% 30%, ${accent}, ${accent}cc)`
                      : '#f5f5f4',
                    border: `1px solid ${active ? accent + '80' : '#e7e5e4'}`,
                    transform: active ? 'scale(1)' : 'scale(0.9)',
                    transition: 'all 0.25s',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Skip counting sequence */}
        <div className="flex justify-center gap-1 flex-wrap mb-3">
          {Array.from({ length: maxMultiplier }, (_, i) => {
            const n = i + 1;
            const active = n <= currentMultiplier;
            return (
              <div key={n} className="px-2 py-1 rounded-lg font-display text-sm tabular-nums transition-all"
                style={{
                  background: active ? accent : '#f5f5f4',
                  color: active ? 'white' : '#a8a29e',
                  fontWeight: n === currentMultiplier ? 'bold' : 'normal',
                  transform: n === currentMultiplier ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: n === currentMultiplier ? `0 2px 6px ${accent}66` : 'none',
                }}>
                {n * table}
              </div>
            );
          })}
        </div>

        {/* Equation */}
        <div className="text-center font-display text-2xl tabular-nums mb-3">
          {currentMultiplier} <span className="text-stone-400">×</span> {table}{' '}
          <span className="text-stone-400">=</span>{' '}
          <b style={{ color: accent }}>{currentMultiplier * table}</b>
        </div>

        {/* Controls */}
        {(onIncrement || onDecrement) && (
          <div className="flex justify-center gap-2">
            {onDecrement && (
              <Btn variant="soft" size="small" onClick={onDecrement} disabled={currentMultiplier <= 1}>
                − Rangée
              </Btn>
            )}
            {onIncrement && (
              <Btn variant="primary" accent={accent} size="small" onClick={onIncrement}
                disabled={currentMultiplier >= maxMultiplier}>
                + Rangée
              </Btn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MANIPULABLE : MULTIPLICATION 2x1 with decomposition
// "24 × 3" = "(20 × 3) + (4 × 3)" = "60 + 12 = 72"
// ============================================================
function DistributiveMultDemo({ a, b, accent = '#558b2f', onComplete }) {
  // Decompose `a` into tens + ones; show (tens × b) and (ones × b) separately
  const tens = Math.floor(a / 10) * 10;
  const ones = a - tens;
  const tensProduct = tens * b;
  const onesProduct = ones * b;

  const [phase, setPhase] = useState('intro'); // intro → decompose → tensMult → onesMult → combine → done

  return (
    <div className="select-none space-y-4">
      {/* Equation header */}
      <div className="text-center font-display text-3xl tabular-nums">
        {a} <span className="text-stone-400 mx-2">×</span> {b} <span className="text-stone-400 mx-2">=</span>
        <span style={{ color: phase === 'done' ? accent : '#9ca3af' }}>
          {phase === 'done' ? a * b : '?'}
        </span>
      </div>

      {phase === 'intro' && (
        <div className="rounded-2xl border-2 border-dashed p-4" style={{ borderColor: accent + '60', background: accent + '08' }}>
          <div className="text-sm text-stone-700 leading-relaxed text-center">
            Pour multiplier <b>{a} × {b}</b>, on peut <b>décomposer {a}</b> en dizaines et unités.<br/>
            <span className="font-display text-lg tabular-nums">
              {a} = {tens} + {ones}
            </span>
          </div>
          <div className="flex justify-center mt-3">
            <Btn variant="primary" accent={accent} onClick={() => setPhase('tensMult')}>
              Décomposer →
            </Btn>
          </div>
        </div>
      )}

      {phase !== 'intro' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tens × b */}
          <div className="bg-white rounded-2xl border-2 p-4 text-center"
            style={{ borderColor: phase === 'tensMult' ? accent : accent + '40' }}>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Dizaines</div>
            <div className="font-display text-2xl tabular-nums" style={{ color: accent }}>
              {tens} × {b} = {tensProduct}
            </div>
            <div className="mt-2 flex justify-center">
              <ArrayDisplay rows={b} cols={tens / 10}
                accent={accent} cellSize="small" showLabels={false} />
            </div>
            <div className="text-[10px] text-stone-500 mt-1">{b} rangées de {tens/10} dizaines</div>
          </div>

          {/* Ones × b */}
          {phase !== 'tensMult' && ones > 0 && (
            <div className="bg-white rounded-2xl border-2 p-4 text-center"
              style={{ borderColor: phase === 'onesMult' ? accent : accent + '40' }}>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Unités</div>
              <div className="font-display text-2xl tabular-nums" style={{ color: '#f97316' }}>
                {ones} × {b} = {onesProduct}
              </div>
              <div className="mt-2 flex justify-center">
                <ArrayDisplay rows={b} cols={ones} accent="#f97316" cellSize="small" showLabels={false} />
              </div>
              <div className="text-[10px] text-stone-500 mt-1">{b} rangées de {ones} unités</div>
            </div>
          )}
        </div>
      )}

      {phase === 'tensMult' && (
        <div className="flex justify-center">
          <Btn variant="primary" accent={accent} onClick={() => setPhase(ones > 0 ? 'onesMult' : 'combine')}>
            {ones > 0 ? '→ Maintenant les unités' : '→ On a fini'}
          </Btn>
        </div>
      )}
      {phase === 'onesMult' && (
        <div className="flex justify-center">
          <Btn variant="primary" accent={accent} onClick={() => setPhase('combine')}>
            → Additionner les deux résultats
          </Btn>
        </div>
      )}

      {(phase === 'combine' || phase === 'done') && (
        <div className="rounded-2xl border-2 p-4 text-center"
          style={{ borderColor: '#10b981', background: '#d1fae5' }}>
          <div className="text-emerald-900 mb-2 text-sm">On additionne les deux parties :</div>
          <div className="font-display text-2xl tabular-nums text-emerald-800">
            {tensProduct} + {onesProduct} = {tensProduct + onesProduct}
          </div>
          <div className="mt-2 text-sm text-emerald-700">
            Donc <b>{a} × {b} = {a * b}</b>
          </div>
          {phase === 'combine' && (
            <Btn variant="primary" accent="#059669" className="mt-3" onClick={() => setPhase('done')}>
              Compris ✓
            </Btn>
          )}
        </div>
      )}

      {phase === 'done' && onComplete && (
        <div className="flex justify-center">
          <Btn variant="primary" accent={accent} onClick={() => onComplete({ a, b, answer: a * b })}>
            Continuer →
          </Btn>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MANIPULABLE : FRACTION BAR
// Une barre divisée en parts égales, avec parts colorées
// ============================================================
function FractionBar({ numerator, denominator, color = '#5e35b1', width = 320, height = 56, label, showFraction = true, interactive = false, onToggle, animate = true }) {
  // Render a horizontal bar split into `denominator` equal parts.
  // The first `numerator` parts are filled.

  const cellWidth = (width - (denominator + 1) * 2) / denominator;

  return (
    <div className="select-none inline-block">
      {label && (
        <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 text-center">{label}</div>
      )}
      <div className="relative rounded-xl bg-white border-2 border-stone-300 p-0.5"
        style={{ width: width + 4 }}>
        <div className="flex gap-0.5" style={{ height }}>
          {Array.from({ length: denominator }, (_, i) => {
            const filled = i < numerator;
            return (
              <button key={i}
                onClick={interactive && onToggle ? () => onToggle(i) : undefined}
                disabled={!interactive}
                className="rounded-md transition-all"
                style={{
                  width: cellWidth,
                  background: filled ? color : '#f5f5f4',
                  border: `2px solid ${filled ? color : '#e7e5e4'}`,
                  cursor: interactive ? 'pointer' : 'default',
                  animation: animate && filled ? `popIn 0.3s ease-out ${i * 60}ms backwards` : undefined,
                }}>
                {filled && (
                  <div className="w-full h-full rounded-sm" style={{
                    background: `linear-gradient(135deg, ${color}ee, ${color})`,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {showFraction && (
        <div className="mt-2 text-center font-display tabular-nums">
          <div className="inline-flex flex-col items-center leading-none">
            <span className="text-2xl font-bold" style={{ color }}>{numerator}</span>
            <span className="w-6 h-0.5 my-0.5" style={{ background: color }} />
            <span className="text-2xl font-bold" style={{ color }}>{denominator}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FRACTION BAR BUILDER (interactif)
// Clique sur les segments pour les remplir/vider
// ============================================================
function FractionBarBuilder({ denominator, targetNumerator, accent = '#5e35b1', onComplete }) {
  const [numerator, setNumerator] = useState(0);
  const isTarget = targetNumerator !== undefined && numerator === targetNumerator;

  const toggleSegment = (i) => {
    // Click on segment i: if not yet filled, fill up to i+1; if filled, empty from i
    if (i < numerator) setNumerator(i);
    else setNumerator(i + 1);
  };

  return (
    <div className="select-none space-y-3 text-center">
      {targetNumerator !== undefined && (
        <div className="text-sm text-stone-700">
          Colorie <b style={{ color: accent }}>{targetNumerator}/{denominator}</b> de la barre.
        </div>
      )}

      <div className="flex justify-center">
        <FractionBar
          numerator={numerator}
          denominator={denominator}
          color={accent}
          interactive={true}
          onToggle={toggleSegment}
          width={Math.min(360, denominator * 50)}
          height={64}
        />
      </div>

      {targetNumerator !== undefined && (
        <div className="text-xs text-stone-600">
          {isTarget ? (
            <span className="text-emerald-700 font-medium">✓ Parfait !</span>
          ) : (
            <span>
              Tu as colorié {numerator}/{denominator}
            </span>
          )}
        </div>
      )}

      {targetNumerator !== undefined && onComplete && (
        <div className="flex justify-center">
          <Btn variant="primary" accent={accent} disabled={!isTarget}
            onClick={() => onComplete({ numerator, denominator })}>
            Vérifier →
          </Btn>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FRACTION COMPARISON (côte à côte, même largeur)
// Pour 3e année — quelle est plus grande, 2/3 ou 3/4 ?
// ============================================================
function FractionCompare({ a, b, color1 = '#5e35b1', color2 = '#f97316', width = 280, height = 50 }) {
  return (
    <div className="select-none space-y-2">
      <FractionBar numerator={a.num} denominator={a.den} color={color1}
        width={width} height={height} label={`${a.label || 'Fraction A'}`} />
      <FractionBar numerator={b.num} denominator={b.den} color={color2}
        width={width} height={height} label={`${b.label || 'Fraction B'}`} />
    </div>
  );
}

// ============================================================
// EQUIVALENT FRACTIONS DEMO
// 1/2 = 2/4 = 3/6 = 4/8 ...
// Stacked bars showing the same shaded portion at different divisions
// ============================================================
function EquivalentFractionsDemo({ baseNum, baseDen, multipliers = [1, 2, 3, 4], color = '#5e35b1', width = 320, height = 36 }) {
  return (
    <div className="select-none space-y-2">
      {multipliers.map(m => {
        const num = baseNum * m;
        const den = baseDen * m;
        return (
          <div key={m} className="flex items-center gap-3">
            <div className="font-display text-lg tabular-nums w-12 text-right" style={{ color }}>
              <span className="inline-flex flex-col items-center leading-none">
                <span className="text-sm font-bold">{num}</span>
                <span className="w-4 h-0.5 my-0.5" style={{ background: color }} />
                <span className="text-sm font-bold">{den}</span>
              </span>
            </div>
            <FractionBar numerator={num} denominator={den} color={color}
              width={width} height={height} showFraction={false} animate={false} />
            <div className="text-xs text-stone-500 w-20">
              {m === 1 ? '(de base)' : `× ${m} en haut et en bas`}
            </div>
          </div>
        );
      })}
      <div className="mt-3 text-center text-sm text-stone-700">
        Toutes ces fractions représentent <b style={{ color }}>la même quantité</b>.<br/>
        On dit qu'elles sont <b>équivalentes</b>.
      </div>
    </div>
  );
}

// ============================================================
// FRACTION ADDITION (same denominator)
// 1/4 + 2/4 = 3/4 — montre la fusion visuelle des barres
// ============================================================
function FractionAdditionDemo({ a, b, denominator, accent = '#5e35b1', onComplete }) {
  const [phase, setPhase] = useState('show'); // show → combine → done
  const sum = a + b;
  const valid = sum <= denominator; // Don't go beyond 1 for simplicity

  return (
    <div className="select-none space-y-4">
      <div className="text-center font-display text-2xl tabular-nums">
        <span className="inline-flex flex-col items-center leading-none mx-1">
          <span className="text-sm font-bold" style={{ color: accent }}>{a}</span>
          <span className="w-5 h-0.5 my-0.5" style={{ background: accent }} />
          <span className="text-sm font-bold" style={{ color: accent }}>{denominator}</span>
        </span>
        <span className="text-stone-400 mx-2">+</span>
        <span className="inline-flex flex-col items-center leading-none mx-1">
          <span className="text-sm font-bold" style={{ color: '#f97316' }}>{b}</span>
          <span className="w-5 h-0.5 my-0.5" style={{ background: '#f97316' }} />
          <span className="text-sm font-bold" style={{ color: '#f97316' }}>{denominator}</span>
        </span>
        <span className="text-stone-400 mx-2">=</span>
        {phase === 'done' ? (
          <span className="inline-flex flex-col items-center leading-none mx-1">
            <span className="text-sm font-bold text-emerald-700">{sum}</span>
            <span className="w-5 h-0.5 my-0.5 bg-emerald-700" />
            <span className="text-sm font-bold text-emerald-700">{denominator}</span>
          </span>
        ) : <span className="text-stone-400">?</span>}
      </div>

      {phase === 'show' && (
        <div className="space-y-3">
          <div className="flex justify-center">
            <FractionBar numerator={a} denominator={denominator} color={accent} width={300} height={48} showFraction={false} />
          </div>
          <div className="text-center text-stone-400">+</div>
          <div className="flex justify-center">
            <FractionBar numerator={b} denominator={denominator} color="#f97316" width={300} height={48} showFraction={false} />
          </div>
          <div className="flex justify-center mt-3">
            <Btn variant="primary" accent={accent} onClick={() => setPhase('combine')}>
              ↓ Fusionner
            </Btn>
          </div>
        </div>
      )}

      {(phase === 'combine' || phase === 'done') && (
        <div className="space-y-3">
          <div className="text-center text-sm text-stone-600">
            On a {a} part{a > 1 ? 's' : ''} colorées + {b} part{b > 1 ? 's' : ''} colorées = {sum} part{sum > 1 ? 's' : ''} colorées
          </div>
          {/* Combined bar with two colors */}
          <div className="flex justify-center">
            <div className="relative">
              <FractionBar numerator={sum} denominator={denominator} color={accent} width={300} height={48} showFraction={false} animate={false} />
              {/* Overlay the second portion in orange */}
              <div className="absolute top-0.5 left-0.5 flex gap-0.5 pointer-events-none" style={{ height: 48 }}>
                {Array.from({ length: denominator }, (_, i) => {
                  if (i < a) return <div key={i} style={{ width: (300 - (denominator + 1) * 2) / denominator }} />;
                  if (i < sum) return (
                    <div key={i} className="rounded-md"
                      style={{
                        width: (300 - (denominator + 1) * 2) / denominator,
                        background: `linear-gradient(135deg, #f97316ee, #f97316)`,
                      }}/>
                  );
                  return <div key={i} style={{ width: (300 - (denominator + 1) * 2) / denominator }} />;
                })}
              </div>
            </div>
          </div>
          <div className="text-center font-display text-2xl tabular-nums" style={{ color: phase === 'done' ? '#10b981' : '#1c1917' }}>
            = {sum}/{denominator}
          </div>
          {phase === 'combine' && (
            <div className="flex justify-center">
              <Btn variant="primary" accent="#059669" onClick={() => setPhase('done')}>
                Compris ✓
              </Btn>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && onComplete && (
        <div className="flex justify-center">
          <Btn variant="primary" accent={accent}
            onClick={() => onComplete({ a, b, denominator, sum })}>
            Continuer →
          </Btn>
        </div>
      )}
    </div>
  );
}

// ⏸ FIN BUILD 3 — Suite dans la réponse 4 (toutes les leçons 1re année)


// ═══ FROM cahier-sg-build4.jsx ═══
// ============================================================
// BUILD 4 — Leçons de 1re année (CPA + lecture vocale)
// ============================================================

// ============================================================
// SHARED LESSON FRAMEWORK
// Tous les composants Lesson* partagent cette structure :
// - Header avec timer et bouton quitter
// - Barre de progression des phases
// - Phases (intro, concret, pictural, abstrait, pratique, bilan)
// - Lecture vocale intégrée (auto + manuelle)
// - Sauvegarde du résultat à la fin
// ============================================================

// Helper : header de leçon partagé
function LessonHeader({ lessonName, accent, onExit, phaseIdx, phases, timer }) {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-5 pb-3">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-stone-500 hover:text-stone-900">← Quitter</button>
        <div className="text-xs uppercase tracking-widest text-stone-500 truncate max-w-[60%] text-center">
          {lessonName}
        </div>
        <div className="font-mono text-xs text-stone-500 tabular-nums w-12 text-right">
          {timer !== undefined ? fmtDur(timer) : ''}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {phases.map((p, i) => (
          <div key={p} className="h-1.5 rounded-full transition-all"
            style={{
              width: i === phaseIdx ? 36 : 12,
              background: i <= phaseIdx ? accent : '#d6d3d1',
              opacity: i < phaseIdx ? 0.6 : 1,
            }} />
        ))}
      </div>
    </div>
  );
}

// Helper : instruction banner with auto-read support
function LessonBanner({ stepLabel, instruction, accent, soft, kidPrefs, autoReadKey }) {
  return (
    <div className="rounded-3xl p-4 mb-5" style={{ background: soft }}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-xs uppercase tracking-widest" style={{ color: accent }}>{stepLabel}</div>
        <ReadAloudBlock text={instruction} accent={accent} autoRead={kidPrefs.autoRead}
          rate={kidPrefs.rate} key={autoReadKey} />
      </div>
      <div className="text-sm text-stone-800 leading-relaxed">{instruction}</div>
    </div>
  );
}

// Helper : finalize hook (returns timer + finalize function)
function useLessonTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [isPaused]);
  return { seconds, isPaused, setIsPaused };
}

// ============================================================
// LESSON: NUMBER BONDS (Décompositions)
// Used for: g1-u1-l1..l4
// ============================================================
function NumberBondsLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'concret', 'pictural', 'abstrait', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const focusNumbers = Array.isArray(lesson.focusOn) ? lesson.focusOn
    : lesson.focusOn ? [lesson.focusOn] : [10];
  const activeNumber = focusNumbers[0]; // For interactive parts, use first focus

  const [findings, setFindings] = useState([]);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // Reset cubes manipulable signal
  const [resetCubes, setResetCubes] = useState(0);

  const practiceProblems = useMemo(() => {
    // Session seed: new exercises each time the kid starts practicing.
    // Math.floor(Date.now()/1000) changes every second, but useMemo caches it
    // for the entire lifecycle of the lesson — so 50 stable exercises per session.
    const seed = Math.floor(Date.now() / 1000) + (lesson.id?.charCodeAt(0) || 1) + activeNumber;
    return generatePracticeBatch(seed, (r, difficulty) => {
      // Difficulty controls which numbers we draw from
      let pool;
      if (difficulty === 'easy') {
        pool = focusNumbers.filter(n => n <= 5);
        if (pool.length === 0) pool = focusNumbers.slice(0, Math.max(1, Math.ceil(focusNumbers.length / 2)));
      } else if (difficulty === 'medium') {
        pool = focusNumbers;
      } else {
        pool = focusNumbers.filter(n => n >= 5);
        if (pool.length === 0) pool = focusNumbers;
      }
      const n = pick(r, pool);
      const part = difficulty === 'hard'
        ? (r() > 0.5 ? 1 : n - 1)
        : rndInt(r, 1, n - 1);
      const showLeft = r() > 0.5;
      return {
        total: n,
        shown: showLeft ? 'left' : 'right',
        shownValue: showLeft ? part : n - part,
        answer: showLeft ? n - part : part,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNumbers, activeNumber, lesson.id]);

  const checkPracticeAnswer = () => {
    const prob = practiceProblems[practiceIdx];
    // Defensive: skip if no problem or empty input
    if (!prob || !currentInput) return;
    const ans = parseInt(currentInput, 10);
    if (isNaN(ans)) return;
    // Use Number() to ensure clean numeric comparison
    const expectedAnswer = Number(prob.answer);
    if (ans === expectedAnswer) {
      setFeedback('correct');
      setWrongAttempts(0);
      setPracticeResults(r => [...r, { ...prob, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null);
        setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(5);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setWrongAttempts(w => w + 1);
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1000);
    }
  };

  // Reset wrongAttempts when moving to next problem
  useEffect(() => { setWrongAttempts(0); }, [practiceIdx]);

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;

  const finalize = () => {
    onComplete({
      lessonId: lesson.id,
      durationSec: timer,
      findingsCount: findings.length,
      practiceCorrect: correctCount,
      practiceTotal: practiceProblems.length,
      isPerfect,
    });
  };

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">⊕</div>
            <ReadableText text={lesson.name} accent={c.ink} buttonPosition="inline" buttonSize="normal">
              <h1 className="font-display text-3xl sm:text-4xl text-stone-900">{lesson.name}</h1>
            </ReadableText>
            <ReadableText text={lesson.description} accent={c.ink} buttonPosition="inline" buttonSize="small"
              className="block mt-3 text-stone-600 max-w-md mx-auto leading-relaxed">
              <p>{lesson.description}</p>
            </ReadableText>
            <div className="mt-8 rounded-3xl p-6 max-w-md mx-auto"
              style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Ce que tu vas faire</div>
              <ol className="text-sm text-stone-700 space-y-1.5 text-left list-decimal list-inside">
                <li>Explorer avec des cubes</li>
                <li>Voir les décompositions en images</li>
                <li>Lire les équations</li>
                <li>Pratiquer</li>
              </ol>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-8" onClick={() => setPhaseIdx(1)}>
              Commencer →
            </Btn>
          </div>
        )}

        {phase === 'concret' && (
          <div>
            <LessonBanner stepLabel="Étape 1 · Concret"
              instruction={`Tu as ${activeNumber} cubes. Sépare-les en deux parties en les glissant à gauche ou à droite. Combien de façons différentes peux-tu trouver ?`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="concret" />
            <NumberBondsCubeSplitter total={activeNumber} accent={c.ink} soft={c.soft}
              resetSignal={resetCubes}
              onFinding={(bond) => setFindings(prev => {
                const exists = prev.find(p => p.left === bond.left && p.right === bond.right);
                if (exists) return prev;
                return [...prev, bond];
              })} />
            {findings.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {findings.map((f, i) => (
                  <div key={i} className="px-2 py-1 rounded-full text-xs font-display tabular-nums"
                    style={{ background: c.ink, color: 'white' }}>
                    {f.left} + {f.right}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} disabled={findings.length === 0}
                onClick={() => setPhaseIdx(2)}>
                Continuer · {findings.length} façon{findings.length > 1 ? 's' : ''} →
              </Btn>
            </div>
          </div>
        )}

        {phase === 'pictural' && (
          <div>
            <LessonBanner stepLabel="Étape 2 · Pictural"
              instruction={`Voici toutes les décompositions de ${activeNumber}. Observe comment chaque paire forme le tout.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="pict" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: activeNumber - 1 }, (_, i) => i + 1).map(left => {
                const right = activeNumber - left;
                return (
                  <div key={left} className="bg-white rounded-2xl border-2 border-stone-200 p-4 flex items-center gap-4">
                    <div className="flex gap-0.5">
                      <div className="flex flex-col-reverse gap-0.5">
                        {Array.from({ length: left }, (_, i) => (
                          <div key={i} className="w-4 h-4 rounded-sm" style={{ background: c.ink }} />
                        ))}
                      </div>
                      <div className="flex flex-col-reverse gap-0.5 ml-2">
                        {Array.from({ length: right }, (_, i) => (
                          <div key={i} className="w-4 h-4 rounded-sm" style={{ background: c.accent }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold text-white"
                        style={{ background: c.ink }}>{activeNumber}</div>
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M 18 4 L 12 10 L 18 16" stroke={c.ink} strokeWidth="1.5" fill="none" opacity="0.5" />
                      </svg>
                      <div className="flex flex-col gap-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold border-2"
                          style={{ borderColor: c.ink, color: c.ink, background: c.soft }}>{left}</div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold border-2"
                          style={{ borderColor: c.accent, color: c.strong, background: c.soft }}>{right}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(1)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(3)}>Continuer →</Btn>
            </div>
          </div>
        )}

        {phase === 'abstrait' && (
          <div>
            <LessonBanner stepLabel="Étape 3 · Abstrait"
              instruction="Les mêmes décompositions, mais en équations."
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="abs" />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-display text-xl sm:text-2xl tabular-nums text-stone-900">
                {Array.from({ length: activeNumber - 1 }, (_, i) => i + 1).map(left => {
                  const right = activeNumber - left;
                  return (
                    <div key={left} className="flex items-center justify-center gap-2">
                      <span style={{ color: c.ink }}>{activeNumber}</span>
                      <span className="text-stone-400">=</span>
                      <span style={{ color: c.ink }}>{left}</span>
                      <span className="text-stone-400">+</span>
                      <span style={{ color: c.strong }}>{right}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(2)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(4)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (
          <div>
            <LessonBanner stepLabel="Étape 4 · Pratique"
              instruction={`Trouve le nombre qui va dans le cercle vide. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />

            <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
              {(() => {
                const p = practiceProblems[practiceIdx];
                // Defensive: ensure we have a valid problem
                if (!p) return <div className="text-stone-500">Chargement…</div>;
                const userNum = parseInt(currentInput, 10);
                const hasInput = currentInput.length > 0;
                const isUnknownLeft = p.shown === 'right';   // Si le donné est à droite, l'inconnu est à gauche
                const isUnknownRight = p.shown === 'left';   // Si le donné est à gauche, l'inconnu est à droite
                const knownValue = p.shownValue;
                const expectedAnswer = p.answer;

                return (
                  <div>
                    {/* Number bond visual */}
                    <div className="flex items-center justify-center gap-4">
                      {/* Big total circle on left */}
                      <div className="w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl font-bold text-white"
                        style={{ background: c.ink }}>{p.total}</div>
                      <svg width="40" height="60" viewBox="0 0 40 60">
                        <path d={`M 5 30 Q 20 30 35 10`} stroke={c.ink} strokeWidth="2" fill="none" opacity="0.4" />
                        <path d={`M 5 30 Q 20 30 35 50`} stroke={c.ink} strokeWidth="2" fill="none" opacity="0.4" />
                      </svg>
                      <div className="flex flex-col gap-3">
                        {/* TOP circle: shown when shown='left', else unknown */}
                        <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-bold relative"
                          style={
                            p.shown === 'left'
                              ? { background: c.ink, color: 'white', border: `3px solid ${c.ink}` }
                              : {
                                  background: hasInput ? c.soft : 'white',
                                  color: feedback === 'wrong' ? '#dc2626' : (hasInput ? c.ink : '#9ca3af'),
                                  border: `3px dashed ${feedback === 'wrong' ? '#dc2626' : c.ink}`,
                                  animation: !hasInput ? 'pulseRing 1.6s ease-in-out infinite' : 'none',
                                }
                          }>
                          {p.shown === 'left' ? p.shownValue : (currentInput || '?')}
                          {p.shown === 'left' && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">✓</span>
                          )}
                        </div>
                        {/* BOTTOM circle: shown when shown='right', else unknown */}
                        <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-bold relative"
                          style={
                            p.shown === 'right'
                              ? { background: c.ink, color: 'white', border: `3px solid ${c.ink}` }
                              : {
                                  background: hasInput ? c.soft : 'white',
                                  color: feedback === 'wrong' ? '#dc2626' : (hasInput ? c.ink : '#9ca3af'),
                                  border: `3px dashed ${feedback === 'wrong' ? '#dc2626' : c.ink}`,
                                  animation: !hasInput ? 'pulseRing 1.6s ease-in-out infinite' : 'none',
                                }
                          }>
                          {p.shown === 'right' ? p.shownValue : (currentInput || '?')}
                          {p.shown === 'right' && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">✓</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrow + clear hint */}
                    <div className="mt-4 text-sm text-stone-600">
                      <span style={{ color: c.strong }}>
                        ↑ Tape le nombre qui complète : <b>{p.total} = {knownValue} + ?</b>
                      </span>
                    </div>

                    {/* Hint after 2 wrong attempts */}
                    {wrongAttempts >= 2 && wrongAttempts < 4 && (
                      <div className="mt-3 rounded-xl p-3 text-sm" style={{ background: '#fef3c7', color: '#78350f' }}>
                        💡 Astuce : combien faut-il ajouter à <b>{knownValue}</b> pour faire <b>{p.total}</b> ?<br/>
                        Réponse : <b>{p.total} − {knownValue} = ?</b>
                      </div>
                    )}

                    {/* Show answer after 4 wrong attempts */}
                    {wrongAttempts >= 4 && (
                      <div className="mt-3 rounded-xl p-3 text-sm" style={{ background: '#dbeafe', color: '#1e40af' }}>
                        La bonne réponse est <b>{expectedAnswer}</b>. Tape ce nombre pour continuer.
                      </div>
                    )}

                    {feedback && (
                      <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                        feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <style>{`
              @keyframes pulseRing {
                0%, 100% { box-shadow: 0 0 0 0 ${c.ink}40; }
                50% { box-shadow: 0 0 0 10px ${c.ink}00; }
              }
            `}</style>

            <div className="mt-6">
              <NumPad
                onDigit={(d) => {
                  // If feedback is showing, clear and start fresh
                  if (feedback) { setFeedback(null); setCurrentInput(d); return; }
                  setCurrentInput(s => (s + d).slice(0, 2));
                }}
                onClear={() => { setFeedback(null); setCurrentInput(s => s.slice(0, -1)); }}
                onSubmit={checkPracticeAnswer}
                accent={c.ink} />
            </div>
          </div>
        )}

        {phase === 'bilan' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-3">{isPerfect ? '🎉' : '⭐'}</div>
            <h2 className="font-display text-3xl text-stone-900 mb-2">
              {isPerfect ? 'Parfait !' : 'Bien joué !'}
            </h2>
            <div className="rounded-3xl p-6 max-w-md mx-auto mt-4"
              style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="font-display text-5xl tabular-nums" style={{ color: c.strong }}>
                {correctCount}<span className="text-2xl opacity-50">/{practiceProblems.length}</span>
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">Réponses correctes</div>
              <div className="mt-3 text-sm text-stone-700">
                Tu as découvert <b>{findings.length}</b> façon{findings.length > 1 ? 's' : ''} de décomposer {activeNumber}.
              </div>
              <div className="mt-1 text-xs text-stone-600">Temps : {fmtDurLong(timer)}</div>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={finalize}>
              Continuer →
            </Btn>
          </div>
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// Cube splitter — interactive manipulative for number bonds
// (Moved here from previous build to be co-located with its lesson)
// ============================================================
function NumberBondsCubeSplitter({ total, accent, soft, resetSignal, onFinding }) {
  const [cubes, setCubes] = useState(() => Array.from({ length: total }, (_, i) => ({ id: i, zone: 'top' })));
  const [dragging, setDragging] = useState(null);
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  useEffect(() => {
    setCubes(Array.from({ length: total }, (_, i) => ({ id: i, zone: 'top' })));
  }, [total, resetSignal]);

  useEffect(() => {
    const update = () => containerRef.current && setContainerRect(containerRef.current.getBoundingClientRect());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const leftCount = cubes.filter(c => c.zone === 'left').length;
  const rightCount = cubes.filter(c => c.zone === 'right').length;
  const topCount = cubes.filter(c => c.zone === 'top').length;
  const isComplete = topCount === 0 && leftCount > 0 && rightCount > 0;

  // When complete, report finding
  useEffect(() => {
    if (isComplete && onFinding) {
      onFinding({ left: leftCount, right: rightCount, total });
    }
  }, [isComplete, leftCount, rightCount, total, onFinding]);

  const cubeSize = 44;

  const getZonePosition = (zone, idxInZone, totalInZone, rect) => {
    if (!rect) return { x: 0, y: 0 };
    const W = rect.width;
    if (zone === 'top') {
      const spacing = Math.min(cubeSize + 6, (W - 40) / Math.max(total, 1));
      const totalWidth = spacing * totalInZone;
      const startX = (W - totalWidth) / 2 + spacing / 2;
      return { x: startX + idxInZone * spacing - cubeSize / 2, y: 30 };
    }
    const bowlW = W / 2 - 30;
    const bowlCenterX = zone === 'left' ? bowlW / 2 + 15 : W - bowlW / 2 - 15;
    const perRow = Math.min(5, Math.floor((bowlW - 16) / (cubeSize + 4)));
    const row = Math.floor(idxInZone / perRow);
    const col = idxInZone % perRow;
    const rowItems = Math.min(perRow, totalInZone - row * perRow);
    const rowWidth = rowItems * (cubeSize + 4) - 4;
    const startX = bowlCenterX - rowWidth / 2;
    return { x: startX + col * (cubeSize + 4), y: 230 - row * (cubeSize + 4) };
  };

  const cubesByZone = useMemo(() => ({
    top: cubes.filter(c => c.zone === 'top'),
    left: cubes.filter(c => c.zone === 'left'),
    right: cubes.filter(c => c.zone === 'right'),
  }), [cubes]);

  const handlePointerDown = (e, cubeId) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setDragging({ id: cubeId, x: e.clientX - rect.left - cubeSize / 2, y: e.clientY - rect.top - cubeSize / 2 });
  };
  const handlePointerMove = (e) => {
    if (!dragging || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setDragging({ ...dragging, x: e.clientX - rect.left - cubeSize / 2, y: e.clientY - rect.top - cubeSize / 2 });
  };
  const handlePointerUp = (e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left, dropY = e.clientY - rect.top;
    const midX = rect.width / 2;
    const inBowl = dropY > 100;
    const newZone = !inBowl ? 'top' : (dropX < midX ? 'left' : 'right');
    setCubes(prev => prev.map(c => c.id === dragging.id ? { ...c, zone: newZone } : c));
    setDragging(null);
  };

  const resetAll = () => setCubes(Array.from({ length: total }, (_, i) => ({ id: i, zone: 'top' })));

  return (
    <div className="select-none">
      <div ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative rounded-3xl bg-white/60 border-2 border-stone-200"
        style={{ height: 340, touchAction: 'none' }}>

        <div className="absolute top-1 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-stone-400">
          {topCount > 0 ? `${topCount} ${topCount > 1 ? 'cubes' : 'cube'} à placer` : 'Tous les cubes sont placés ✓'}
        </div>
        <div className="absolute" style={{ left: 12, top: 100, width: 'calc(50% - 18px)', height: 220 }}>
          <div className="w-full h-full rounded-2xl border-2 border-dashed flex items-end justify-center pb-2"
            style={{ borderColor: accent + '40', background: leftCount > 0 ? soft : 'transparent' }}>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: accent }}>Partie gauche</div>
          </div>
        </div>
        <div className="absolute" style={{ right: 12, top: 100, width: 'calc(50% - 18px)', height: 220 }}>
          <div className="w-full h-full rounded-2xl border-2 border-dashed flex items-end justify-center pb-2"
            style={{ borderColor: accent + '40', background: rightCount > 0 ? soft : 'transparent' }}>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: accent }}>Partie droite</div>
          </div>
        </div>

        {cubes.map(c => {
          const isDragging = dragging?.id === c.id;
          let pos;
          if (isDragging) pos = { x: dragging.x, y: dragging.y };
          else {
            const zoneList = cubesByZone[c.zone];
            pos = getZonePosition(c.zone, zoneList.findIndex(x => x.id === c.id), zoneList.length, containerRect);
          }
          return (
            <div key={c.id} onPointerDown={(e) => handlePointerDown(e, c.id)}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: pos.x, top: pos.y, width: cubeSize, height: cubeSize,
                transition: isDragging ? 'none' : 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isDragging ? 50 : 1, touchAction: 'none',
              }}>
              <div className="w-full h-full rounded-xl shadow-md flex items-center justify-center font-display text-white text-lg"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                  transform: isDragging ? 'scale(1.15) rotate(-5deg)' : 'scale(1)',
                  transition: 'transform 0.15s',
                  boxShadow: isDragging ? `0 12px 24px ${accent}66` : `0 3px 6px ${accent}44`,
                }}>
                <span className="opacity-70 text-sm">●</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 font-display">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: accent, color: 'white' }}>{total}</div>
        <div className="text-stone-400 text-xl">=</div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2"
          style={{ borderColor: accent, color: accent, background: leftCount > 0 ? soft : 'white' }}>{leftCount}</div>
        <div className="text-stone-400 text-xl">+</div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2"
          style={{ borderColor: accent, color: accent, background: rightCount > 0 ? soft : 'white' }}>{rightCount}</div>
      </div>

      <div className="mt-4 flex justify-center">
        <Btn variant="soft" size="small" onClick={resetAll}>↻ Recommencer</Btn>
      </div>
    </div>
  );
}

// ============================================================
// LESSON: DOUBLES (et quasi-doubles)
// g1-u2-l1, g1-u2-l2
// ============================================================
function DoublesLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isNear = lesson.mode === 'near';
  const phases = ['intro', 'pictural', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0);
    const maxN = lesson.max || 10;
    return generatePracticeBatch(seed, (r, difficulty) => {
      const range = difficulty === 'easy'
        ? [2, Math.min(5, maxN)]
        : difficulty === 'medium'
        ? [2, maxN]
        : [Math.max(3, Math.floor(maxN / 2)), maxN];
      const n = rndInt(r, range[0], range[1]);
      if (isNear) {
        return { a: n, b: n + 1, answer: n + n + 1, type: 'near' };
      }
      return { a: n, b: n, answer: n * 2, type: 'double' };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isNear]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;

  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">{isNear ? '↗' : '◐'}</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-5 max-w-md mx-auto"
              style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              {!isNear ? (
                <>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Exemple</div>
                  <div className="font-display text-2xl tabular-nums">4 + 4 = 8</div>
                  <div className="text-xs text-stone-600 mt-2">
                    Le double de 4, c'est 4 + 4. Les doubles sont faciles à retenir.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Exemple</div>
                  <div className="font-display text-2xl tabular-nums">6 + 7 = ?</div>
                  <div className="text-xs text-stone-600 mt-2">
                    6 + 7 = (6 + 6) + 1 = 12 + 1 = <b>13</b>.<br/>
                    Si tu connais le double de 6, tu trouves vite 6 + 7 !
                  </div>
                </>
              )}
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>
              Voir les doubles →
            </Btn>
          </div>
        )}

        {phase === 'pictural' && (
          <div>
            <LessonBanner stepLabel="Pictural"
              instruction="Voici les doubles à connaître. Regarde les deux groupes de cubes égaux."
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="pict" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(n => {
                const otherN = isNear ? n + 1 : n;
                if (isNear && otherN > 10) return null;
                return (
                  <div key={n} className="bg-white rounded-2xl border-2 border-stone-200 p-3 flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: n }, (_, i) => (
                        <div key={i} className="w-4 h-4 rounded-sm" style={{ background: c.ink }} />
                      ))}
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: otherN }, (_, i) => (
                        <div key={i} className="w-4 h-4 rounded-sm" style={{ background: c.accent }} />
                      ))}
                    </div>
                    <div className="ml-auto font-display tabular-nums text-base">
                      {n} + {otherN} = <b style={{ color: c.ink }}>{n + otherN}</b>
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (
          <div>
            <LessonBanner stepLabel="Pratique"
              instruction={`Calcule. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
              {(() => {
                const p = practiceProblems[practiceIdx];
                return (
                  <>
                    <div className="font-display text-5xl tabular-nums" style={{ color: c.ink }}>
                      {p.a} + {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                    </div>
                    {feedback && (
                      <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                        feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="mt-6">
              <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 2))}
                onClear={() => setCurrentInput(s => s.slice(0, -1))}
                onSubmit={checkAnswer} accent={c.ink} />
            </div>
          </div>
        )}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: MAKE TEN (Faire dix)
// ============================================================
function MakeTenLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) * 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      // a is the larger addend (closer to 10), b makes the bridge
      let a, b;
      if (difficulty === 'easy') {
        a = rndInt(r, 8, 9);  // close to 10, easy bridge
        b = rndInt(r, 11 - a, 5);
      } else if (difficulty === 'medium') {
        a = rndInt(r, 6, 9);
        b = rndInt(r, 11 - a, 7);
      } else {
        a = rndInt(r, 6, 9);
        b = rndInt(r, 11 - a, 9);
      }
      return { a, b, answer: a + b };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  // Demo state
  const demoExample = { a: 8, b: 5 };
  const needed = 10 - demoExample.a;
  const [movedSoFar, setMovedSoFar] = useState(0);
  const [demoDone, setDemoDone] = useState(false);

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">◐</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">Faire dix</h1>
            <ReadableText text="Une stratégie puissante pour additionner rapidement : transformer un nombre en 10 d'abord."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                Une stratégie puissante pour additionner rapidement : transformer un nombre en 10 d'abord.
              </p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-6 max-w-md mx-auto" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Exemple</div>
              <div className="font-display text-2xl tabular-nums text-stone-900">8 + 5 = ?</div>
              <div className="text-xs text-stone-600 mt-2">
                On fait : 8 + 2 = 10, puis 10 + 3 = 13.
              </div>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-8" onClick={() => setPhaseIdx(1)}>
              Voir →
            </Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={`Regardons ${demoExample.a} + ${demoExample.b}. Il manque ${needed} cube${needed > 1 ? 's' : ''} dans le cadre de gauche pour faire dix.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-5">
              <div className="text-center mb-4 font-display text-3xl tabular-nums">
                <span style={{ color: demoExample.a + movedSoFar === 10 ? '#10b981' : c.ink }}>{demoExample.a + movedSoFar}</span>
                <span className="text-stone-400 mx-2">+</span>
                <span style={{ color: '#f97316' }}>{demoExample.b - movedSoFar}</span>
                <span className="text-stone-400 mx-2">=</span>
                <span className="text-stone-400">?</span>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <TenFrameInLesson count={demoExample.a + movedSoFar} color={c.ink} />
                <div className="font-display text-2xl text-stone-400">+</div>
                <TenFrameInLesson count={demoExample.b - movedSoFar} color="#f97316" />
              </div>
            </div>
            {movedSoFar < needed && (
              <div className="mt-4 flex justify-center">
                <Btn variant="primary" accent={c.ink} onClick={() => {
                  const newMoved = movedSoFar + 1;
                  setMovedSoFar(newMoved);
                  if (newMoved === needed) setDemoDone(true);
                }}>
                  → Déplacer 1 cube
                </Btn>
              </div>
            )}
            {demoDone && (
              <div className="mt-4 rounded-2xl border-2 p-4 text-center" style={{ borderColor: '#10b981', background: '#d1fae5' }}>
                <div className="text-emerald-900 text-sm">Le cadre est plein ! 10 + {demoExample.b - needed} = <b>{demoExample.a + demoExample.b}</b></div>
              </div>
            )}
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => { setMovedSoFar(0); setDemoDone(false); }}>↻ Recommencer</Btn>
              <Btn variant="primary" accent={c.ink} disabled={!demoDone}
                onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (
          <div>
            <LessonBanner stepLabel="Pratique"
              instruction={`Utilise la stratégie « faire dix » dans ta tête. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
              {(() => {
                const p = practiceProblems[practiceIdx];
                return (
                  <>
                    <div className="font-display text-5xl tabular-nums" style={{ color: c.ink }}>
                      {p.a} + {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <TenFrameInLesson count={p.a} color={c.ink} />
                      <span className="font-display text-2xl text-stone-400">+</span>
                      <TenFrameInLesson count={p.b} color="#f97316" />
                    </div>
                    <div className="mt-3 text-xs text-stone-500">
                      Astuce : {p.a} + <b style={{ color: c.ink }}>{10 - p.a}</b> = 10, puis 10 + <b>{p.b - (10 - p.a)}</b> = ?
                    </div>
                    {feedback && (
                      <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                        feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="mt-6">
              <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 2))}
                onClear={() => setCurrentInput(s => s.slice(0, -1))}
                onSubmit={checkAnswer} accent={c.ink} />
            </div>
          </div>
        )}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// Ten Frame component (inline, simpler)
function TenFrameInLesson({ count, color }) {
  const cells = Array.from({ length: 10 }, (_, i) => i < count);
  return (
    <div className="inline-grid grid-cols-5 gap-0.5 p-1.5 rounded-xl bg-white border-2 border-stone-300">
      {cells.map((filled, i) => (
        <div key={i} className="w-6 h-6 rounded-md transition-all"
          style={{
            background: filled ? color : '#f5f5f4',
            border: filled ? `2px solid ${color}` : '2px solid #e7e5e4',
            transform: filled ? 'scale(1)' : 'scale(0.94)',
          }}>
          {filled && <span className="block w-full h-full rounded-sm"
            style={{ background: `radial-gradient(circle at 30% 30%, ${color}, ${color}cc)` }} />}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// LESSON: PART-WHOLE (partie manquante / familles)
// g1-u3-l1, g1-u3-l3
// ============================================================
function PartWholeLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isFamily = lesson.mode === 'family';
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 50;
    const max = lesson.max || 10;
    return generatePracticeBatch(seed, (r, difficulty) => {
      // Difficulty adjusts the size of the whole
      let wholeMin, wholeMax;
      if (difficulty === 'easy') {
        wholeMin = 3;
        wholeMax = Math.min(7, max);
      } else if (difficulty === 'medium') {
        wholeMin = 5;
        wholeMax = max;
      } else {
        wholeMin = Math.max(7, Math.floor(max / 2));
        wholeMax = max;
      }
      const whole = rndInt(r, wholeMin, wholeMax);
      const part1 = rndInt(r, 1, whole - 1);
      const part2 = whole - part1;
      const unknownChoice = isFamily ? rndInt(r, 0, 2) : 0;
      return { whole, part1, part2, unknown: unknownChoice === 2 ? 'whole' : unknownChoice };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isFamily]);

  const getAnswer = (p) => p.unknown === 'whole' ? p.whole : p.unknown === 0 ? p.part1 : p.part2;

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === getAnswer(p)) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">◑</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-5 max-w-md mx-auto" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Astuce</div>
              <div className="text-sm text-stone-700">
                {isFamily ? (
                  <>Quand tu connais deux nombres dans une famille, tu peux toujours trouver le troisième.<br/>
                  <span className="font-display tabular-nums">3 + 4 = 7, 4 + 3 = 7, 7 − 3 = 4, 7 − 4 = 3</span></>
                ) : (
                  <>Si tu connais le tout et une partie, tu peux trouver la partie qui manque en faisant <b>tout − partie</b>.</>
                )}
              </div>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          const parts = [
            { value: p.part1, label: 'partie 1' },
            { value: p.part2, label: 'partie 2' },
          ];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Trouve le nombre qui manque. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
                <PartWholeBar
                  whole={p.whole} parts={parts}
                  unknown={p.unknown}
                  accent={c.ink} />
                <div className="mt-4 text-center font-display text-2xl tabular-nums">
                  {p.unknown === 'whole' ? (
                    <><span className="text-stone-400">{currentInput || '?'}</span> = {p.part1} + {p.part2}</>
                  ) : p.unknown === 0 ? (
                    <>{p.whole} = <span className="text-stone-400">{currentInput || '?'}</span> + {p.part2}</>
                  ) : (
                    <>{p.whole} = {p.part1} + <span className="text-stone-400">{currentInput || '?'}</span></>
                  )}
                </div>
                {feedback && (
                  <div className={`mt-3 flex justify-center`}>
                    <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 3))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: NUMBER LINE (add/sub/skip)
// g1-u3-l2, g1-u4-l2
// ============================================================
function NumberLineLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isSkip = lesson.mode === 'skip';
  const isSub = lesson.op === '-';
  const phases = isSkip ? ['intro', 'demo', 'pratique', 'bilan'] : ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 30;
    const max = lesson.max || 20;
    if (isSkip) {
      return generatePracticeBatch(seed, (r, difficulty) => {
        const stepOptions = max <= 100 ? [2, 5, 10] : [10, 100];
        let step;
        if (difficulty === 'easy') step = stepOptions[0];
        else if (difficulty === 'medium') step = pick(r, stepOptions);
        else step = stepOptions[stepOptions.length - 1];
        const maxStart = Math.max(1, Math.floor(max / step) - 4);
        const startMultiple = rndInt(r, 1, maxStart);
        const seq = Array.from({ length: 4 }, (_, i) => (startMultiple + i) * step);
        return { seq, step, answer: (startMultiple + 4) * step };
      });
    } else if (isSub) {
      return generatePracticeBatch(seed, (r, difficulty) => {
        let aMin, aMax;
        if (difficulty === 'easy') { aMin = 5; aMax = Math.min(15, max); }
        else if (difficulty === 'medium') { aMin = 8; aMax = max; }
        else { aMin = Math.max(10, Math.floor(max / 2)); aMax = max; }
        const a = rndInt(r, aMin, aMax);
        const b = rndInt(r, 1, a - 1);
        return { a, b, answer: a - b };
      });
    } else {
      return generatePracticeBatch(seed, (r, difficulty) => {
        let aMin, aMax;
        if (difficulty === 'easy') { aMin = 2; aMax = Math.min(8, max - 5); }
        else if (difficulty === 'medium') { aMin = 2; aMax = max - 5; }
        else { aMin = Math.max(5, Math.floor(max / 2)); aMax = max - 2; }
        const a = rndInt(r, aMin, aMax);
        const b = rndInt(r, 1, Math.min(9, max - a));
        return { a, b, answer: a + b };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isSkip, isSub]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  // Demo state
  const [demoStart, setDemoStart] = useState(isSub ? 12 : 5);
  const [demoStep, setDemoStep] = useState(isSub ? -3 : 4);
  const demoEnd = demoStart + demoStep;

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">—</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Démonstration →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={isSkip
                ? `On compte par bonds de ${Math.abs(demoStep)} sur la ligne numérique.`
                : isSub
                ? `Pour calculer ${demoStart} − ${Math.abs(demoStep)}, on saute de ${Math.abs(demoStep)} vers la gauche sur la ligne.`
                : `Pour calculer ${demoStart} + ${demoStep}, on saute de ${demoStep} vers la droite sur la ligne.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-4">
              <NumberLine min={0} max={20}
                jumps={[{ from: demoStart, to: demoEnd, label: `${demoStep > 0 ? '+' : ''}${demoStep}` }]}
                highlight={demoEnd}
                accent={c.ink} />
              <div className="text-center mt-2 font-display text-xl tabular-nums">
                {demoStart} {demoStep > 0 ? '+' : '−'} {Math.abs(demoStep)} = <b style={{ color: c.ink }}>{demoEnd}</b>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={isSkip
                  ? `Quel est le prochain nombre dans la suite ?`
                  : `Calcule en utilisant la ligne numérique.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
                {isSkip ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 flex-wrap font-display text-2xl tabular-nums mb-3">
                      {p.seq.map((n, i) => (
                        <span key={i} style={{ color: c.ink }}>{n}</span>
                      )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`s${i}`} className="text-stone-400">,</span>, el], [])}
                      <span className="text-stone-400">,</span>
                      <span className="text-stone-400">{currentInput || '?'}</span>
                    </div>
                    <div className="text-center text-xs text-stone-500">Bond de {p.step}</div>
                  </div>
                ) : (
                  <div>
                    <NumberLine min={0} max={Math.max(20, p.a + 5)}
                      highlight={isSub ? p.a : null}
                      marks={[0, p.a, isSub ? p.a - p.b : p.a + p.b, Math.max(20, p.a + 5)].filter((v, i, a) => a.indexOf(v) === i)}
                      accent={c.ink} />
                    <div className="text-center mt-2 font-display text-2xl tabular-nums">
                      {p.a} {isSub ? '−' : '+'} {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                    </div>
                  </div>
                )}
                {feedback && (
                  <div className={`mt-3 flex justify-center`}>
                    <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 4))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: BASE 10 (dizaines et unités, intro)
// g1-u4-l1
// ============================================================
function Base10IntroLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'concret', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [exploreValue, setExploreValue] = useState(23);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [practiceValue, setPracticeValue] = useState(0);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 70;
    const max = lesson.max || 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let min, top;
      if (difficulty === 'easy') { min = 11; top = Math.min(30, max - 1); }
      else if (difficulty === 'medium') { min = 11; top = max - 1; }
      else { min = Math.max(40, Math.floor(max / 2)); top = max - 1; }
      return { target: rndInt(r, min, top) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    if (practiceValue === p.target) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setPracticeValue(0);
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">☷</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text="Une dizaine, c'est 10 unités regroupées en une barre. Avec des dizaines et des unités, on peut représenter tous les nombres jusqu'à 99."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                Une dizaine, c'est 10 unités regroupées en une barre.
              </p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Explorer →</Btn>
          </div>
        )}

        {phase === 'concret' && (
          <div>
            <LessonBanner stepLabel="Explore"
              instruction="Ajoute et retire des dizaines et des unités. Regarde comment le nombre change."
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="concret" />
            <Base10Builder value={exploreValue} onChange={setExploreValue}
              maxValue={lesson.max || 100} accent={c.ink} />
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Construis le nombre ${p.target} avec les blocs.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <Base10Builder value={practiceValue} onChange={setPracticeValue}
                maxValue={lesson.max || 100} accent={c.ink} />
              <div className="mt-3 text-center">
                {practiceValue === p.target ? (
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                    ✓ Tu y es ! Touche Vérifier
                  </div>
                ) : (
                  <div className="text-xs text-stone-500">
                    Cible : <b style={{ color: c.ink }}>{p.target}</b>{' '}
                    {practiceValue > 0 && <>· tu as <b>{practiceValue}</b></>}
                  </div>
                )}
              </div>
              {feedback && (
                <div className={`mt-3 flex justify-center`}>
                  <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : '✗ Pas encore'}
                  </div>
                </div>
              )}
              <div className="mt-4 flex justify-center">
                <Btn variant="primary" accent={c.ink} onClick={checkAnswer}>Vérifier ✓</Btn>
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: COMPARISON (plus grand, plus petit, égal)
// g1-u4-l3, g2-u1-l2, g3-u1-l2
// ============================================================
function ComparisonLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 110;
    const max = lesson.max || 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let aMax;
      if (difficulty === 'easy') aMax = Math.min(20, max);
      else if (difficulty === 'medium') aMax = Math.min(50, max);
      else aMax = max;
      const a = rndInt(r, 1, aMax);
      let b;
      // ~15% chance of equality case
      if (r() < 0.15) b = a;
      else {
        b = rndInt(r, 1, aMax);
        while (b === a) b = rndInt(r, 1, aMax);
      }
      return { a, b, answer: a > b ? '>' : a < b ? '<' : '=' };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max]);

  const checkAnswer = (choice) => {
    setSelectedAnswer(choice);
    const p = practiceProblems[practiceIdx];
    const isCorrect = choice === p.answer;
    if (isCorrect) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: choice, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setSelectedAnswer(null);
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setSelectedAnswer(null); }, 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">⚖</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text="On utilise trois symboles pour comparer des nombres : plus grand que, plus petit que, et égal."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                On utilise trois symboles pour comparer des nombres.
              </p>
            </ReadableText>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="rounded-2xl p-4 text-center" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
                <div className="font-display text-4xl" style={{ color: c.ink }}>&gt;</div>
                <div className="text-xs text-stone-600 mt-1">plus grand</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
                <div className="font-display text-4xl" style={{ color: c.ink }}>&lt;</div>
                <div className="text-xs text-stone-600 mt-1">plus petit</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
                <div className="font-display text-4xl" style={{ color: c.ink }}>=</div>
                <div className="text-xs text-stone-600 mt-1">égal</div>
              </div>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Compare les deux nombres. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
                <div className="flex items-center justify-center gap-4 font-display text-4xl sm:text-5xl tabular-nums">
                  <span style={{ color: c.ink }}>{p.a}</span>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-dashed"
                    style={{ borderColor: c.ink + '60', background: selectedAnswer ? c.soft : 'transparent' }}>
                    <span style={{ color: c.ink }}>{selectedAnswer || '?'}</span>
                  </div>
                  <span style={{ color: c.ink }}>{p.b}</span>
                </div>
                {feedback && (
                  <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                  </div>
                )}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
                {['<', '=', '>'].map(symbol => (
                  <button key={symbol} onClick={() => checkAnswer(symbol)}
                    disabled={feedback === 'correct'}
                    className="h-20 rounded-2xl border-2 border-stone-300 bg-white hover:bg-stone-50 active:scale-95 transition-all font-display text-4xl shadow-sm">
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: MONEY QC (1re année — reconnaître et compter)
// g1-u5-l1, g1-u5-l2
// ============================================================
function MoneyLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isIdentify = lesson.mode === 'identify';
  const isCount = lesson.mode === 'count';
  const isCombine = lesson.mode === 'combine';
  const isChange = lesson.mode === 'change';
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [currentInput, setCurrentInput] = useState('');
  const [moneySelection, setMoneySelection] = useState({ selection: {}, total: 0 });

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 130;
    const maxV = lesson.max || 100;
    if (isIdentify) {
      const coins = lesson.max <= 25 ? COINS.slice(0, 4) : COINS;
      return generatePracticeBatch(seed, (r) => {
        const coin = pick(r, coins);
        return { coin, type: 'identify', answer: coin.value };
      });
    } else if (isCount || isCombine) {
      return generatePracticeBatch(seed, (r, difficulty) => {
        let min, top;
        if (difficulty === 'easy') { min = 5; top = Math.min(25, maxV); }
        else if (difficulty === 'medium') { min = 10; top = Math.min(50, maxV); }
        else { min = 20; top = maxV; }
        const target = rndInt(r, min, top);
        return { target, type: isCount ? 'count' : 'combine' };
      });
    } else if (isChange) {
      return generatePracticeBatch(seed, (r, difficulty) => {
        let priceMin, priceMax;
        if (difficulty === 'easy') { priceMin = 10; priceMax = Math.min(30, maxV - 20); }
        else if (difficulty === 'medium') { priceMin = 10; priceMax = maxV - 50; }
        else { priceMin = Math.max(20, Math.floor(maxV / 3)); priceMax = maxV - 50; }
        const price = rndInt(r, priceMin, priceMax);
        const given = price + rndInt(r, 5, Math.min(100, maxV - price));
        return { price, given, answer: given - price, type: 'change' };
      });
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isIdentify, isCount, isCombine, isChange]);

  const checkAnswer = (val) => {
    const p = practiceProblems[practiceIdx];
    let isCorrect = false;
    if (isIdentify || isChange) {
      isCorrect = parseInt(val ?? currentInput, 10) === p.answer;
    } else if (isCount || isCombine) {
      isCorrect = moneySelection.total === p.target;
    }
    if (isCorrect) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput(''); setMoneySelection({ selection: {}, total: 0 });
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">¢</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <div className="mt-6 flex justify-center flex-wrap gap-2">
              {[...COINS, ...(lesson.max >= 500 ? BILLS : [])].map(coin => (
                <div key={coin.id} className="flex flex-col items-center">
                  <CoinPiece coin={coin} size="normal" />
                  <div className="text-[10px] text-stone-500 mt-1">{coin.name}</div>
                </div>
              ))}
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={
                  isIdentify ? `Quelle est la valeur de cette pièce, en sous (¢) ?`
                  : isCount ? `Forme exactement ${fmtMoney(p.target)} avec des pièces.`
                  : isCombine ? `Fais ${fmtMoney(p.target)} avec ces pièces et billets.`
                  : isChange ? `Tu donnes ${fmtMoney(p.given)} pour un objet à ${fmtMoney(p.price)}. Combien reçois-tu en monnaie ?`
                  : ''
                }
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />

              {isIdentify && (
                <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <CoinPiece coin={p.coin} size="large" />
                  </div>
                  <div className="font-display text-3xl tabular-nums" style={{ color: c.ink }}>
                    {currentInput || '?'} ¢
                  </div>
                  {feedback && (
                    <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                    </div>
                  )}
                </div>
              )}

              {(isCount || isCombine) && (
                <MoneySelector targetCents={p.target}
                  showBills={lesson.max >= 500}
                  onChange={setMoneySelection}
                  accent={c.ink} />
              )}

              {isChange && (
                <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">Prix : <b>{fmtMoney(p.price)}</b></div>
                    <div className="text-sm">Tu donnes : <b>{fmtMoney(p.given)}</b></div>
                  </div>
                  <div className="font-display text-3xl tabular-nums" style={{ color: c.ink }}>
                    Monnaie : {currentInput || '?'} ¢
                  </div>
                  {feedback && (
                    <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                {(isIdentify || isChange) && (
                  <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 4))}
                    onClear={() => setCurrentInput(s => s.slice(0, -1))}
                    onSubmit={() => checkAnswer()} accent={c.ink} />
                )}
                {(isCount || isCombine) && (
                  <div className="flex justify-center">
                    <Btn variant="primary" accent={c.ink} onClick={() => checkAnswer()}>Vérifier ✓</Btn>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: MEASURE LENGTH
// g1-u6-l1, g2-u8-l1, g3-u8-l1
// ============================================================
function MeasureLengthLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [currentInput, setCurrentInput] = useState('');

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 150;
    const maxLen = Math.min(30, lesson.max || 30);
    return generatePracticeBatch(seed, (r, difficulty) => {
      let min, top;
      if (difficulty === 'easy') { min = 3; top = Math.min(10, maxLen); }
      else if (difficulty === 'medium') { min = 5; top = Math.min(20, maxLen); }
      else { min = 10; top = maxLen; }
      const lengthCm = rndInt(r, min, top);
      return { lengthCm, answer: lengthCm };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">📏</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text="On mesure les longueurs en centimètres. Une règle de 30 cm est ton outil principal."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                On mesure les longueurs en centimètres avec une règle.
              </p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Mesure la longueur du trait en centimètres.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
                <svg viewBox="0 0 320 100" className="w-full">
                  {/* Ruler */}
                  <rect x="10" y="50" width="300" height="35" fill="#fef3c7" stroke="#d97706" strokeWidth="1" rx="3" />
                  {/* Ticks */}
                  {Array.from({ length: 31 }, (_, i) => i).map(i => {
                    const x = 10 + i * 10;
                    const isMajor = i % 5 === 0;
                    return (
                      <g key={i}>
                        <line x1={x} y1="50" x2={x} y2={isMajor ? "65" : "60"}
                          stroke="#92400e" strokeWidth={isMajor ? 1.2 : 0.8} />
                        {isMajor && (
                          <text x={x} y="80" textAnchor="middle" fontSize="9" fill="#92400e">{i}</text>
                        )}
                      </g>
                    );
                  })}
                  {/* Object to measure */}
                  <rect x="10" y="25" width={p.lengthCm * 10} height="14"
                    fill={c.ink} rx="3" opacity="0.85" />
                  <text x={10 + (p.lengthCm * 10) / 2} y="20" textAnchor="middle" fontSize="11" fill={c.ink} fontWeight="bold">
                    Objet à mesurer
                  </text>
                </svg>
                <div className="mt-4 text-center font-display text-2xl tabular-nums">
                  Longueur : <span className="text-stone-400">{currentInput || '?'}</span> cm
                </div>
                {feedback && (
                  <div className={`mt-3 flex justify-center`}>
                    <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 3))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: TIME (lire l'heure)
// g1-u6-l2, g2-u8-l2, g3-u8-l3
// ============================================================
function TimeLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isHour = lesson.mode === 'hour';
  const isQuarter = lesson.mode === 'quarter';
  const isMinute = lesson.mode === 'minute';
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 170;
    return generatePracticeBatch(seed, (r, difficulty) => {
      const h = rndInt(r, 1, 12);
      let m;
      if (isHour) {
        // Easy: heures pleines, Medium/Hard: ajoute demi-heures
        m = difficulty === 'easy' ? 0 : pick(r, [0, 30]);
      } else if (isQuarter) {
        m = difficulty === 'easy' ? pick(r, [0, 30]) : pick(r, [0, 15, 30, 45]);
      } else {
        // Minute mode: progresser des minutes "rondes" aux plus difficiles
        if (difficulty === 'easy') m = pick(r, [0, 15, 30, 45]);
        else if (difficulty === 'medium') m = pick(r, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
        else m = pick(r, [5, 10, 20, 25, 35, 40, 50, 55]);  // les heures non-rondes
      }
      return { h, m };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, isHour, isQuarter, isMinute]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    if (selectedHour === p.h && selectedMinute === p.m) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setSelectedHour(null); setSelectedMinute(null);
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">🕐</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Lis l'heure sur l'horloge et choisis les bons nombres.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 flex flex-col items-center">
                <AnalogClock hour={p.h} minute={p.m} accent={c.ink} />
                <div className="mt-4 font-display text-2xl tabular-nums">
                  {selectedHour ?? '?'} h {(selectedMinute ?? 0).toString().padStart(2, '0')}
                </div>
                {feedback && (
                  <div className={`mt-3 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : '✗ Essaie encore'}
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 text-center">Heure</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                      <button key={h} onClick={() => setSelectedHour(h)}
                        className={`w-9 h-9 rounded-lg font-display text-sm transition-all ${
                          selectedHour === h ? 'text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`} style={selectedHour === h ? { background: c.ink } : {}}>{h}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 text-center">Minutes</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {(isHour ? [0, 30] : isQuarter ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]).map(m => (
                      <button key={m} onClick={() => setSelectedMinute(m)}
                        className={`px-3 h-9 rounded-lg font-display text-sm tabular-nums transition-all ${
                          selectedMinute === m ? 'text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`} style={selectedMinute === m ? { background: c.ink } : {}}>{m.toString().padStart(2, '0')}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <Btn variant="primary" accent={c.ink}
                  disabled={selectedHour === null || selectedMinute === null}
                  onClick={checkAnswer}>Vérifier ✓</Btn>
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// Analog clock component
function AnalogClock({ hour, minute, accent = '#0277bd', size = 200 }) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 8;
  // Hour hand angle (12 = top = -90°)
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteAngle = minute * 6 - 90;
  const hourX = cx + Math.cos(hourAngle * Math.PI / 180) * r * 0.55;
  const hourY = cy + Math.sin(hourAngle * Math.PI / 180) * r * 0.55;
  const minuteX = cx + Math.cos(minuteAngle * Math.PI / 180) * r * 0.8;
  const minuteY = cy + Math.sin(minuteAngle * Math.PI / 180) * r * 0.8;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={accent} strokeWidth="3" />
      {/* Hour marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30 - 90;
        const x1 = cx + Math.cos(angle * Math.PI / 180) * r * 0.85;
        const y1 = cy + Math.sin(angle * Math.PI / 180) * r * 0.85;
        const x2 = cx + Math.cos(angle * Math.PI / 180) * r * 0.95;
        const y2 = cy + Math.sin(angle * Math.PI / 180) * r * 0.95;
        const tx = cx + Math.cos(angle * Math.PI / 180) * r * 0.72;
        const ty = cy + Math.sin(angle * Math.PI / 180) * r * 0.72 + 4;
        const num = i === 0 ? 12 : i;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#57534e" strokeWidth="2" />
            <text x={tx} y={ty} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#57534e">{num}</text>
          </g>
        );
      })}
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={minuteX} y2={minuteY} stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hourX} y2={hourY} stroke={accent} strokeWidth="4" strokeLinecap="round" />
      {/* Center */}
      <circle cx={cx} cy={cy} r="4" fill={accent} />
    </svg>
  );
}

// ============================================================
// SHARED : Bilan Screen
// ============================================================
function BilanScreen({ kidColor, correctCount, total, timer, isPerfect, onContinue, extraInfo }) {
  return (
    <div className="text-center pt-6">
      <div className="text-6xl mb-3">{isPerfect ? '🎉' : '⭐'}</div>
      <h2 className="font-display text-3xl text-stone-900 mb-2">
        {isPerfect ? 'Parfait !' : 'Bien joué !'}
      </h2>
      <div className="rounded-3xl p-6 max-w-md mx-auto mt-4"
        style={{ background: kidColor.soft, border: `2px solid ${kidColor.ink}` }}>
        <div className="font-display text-5xl tabular-nums" style={{ color: kidColor.strong }}>
          {correctCount}<span className="text-2xl opacity-50">/{total}</span>
        </div>
        <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">Réponses correctes</div>
        {extraInfo && <div className="mt-3 text-sm text-stone-700">{extraInfo}</div>}
        <div className="mt-2 text-xs text-stone-600">Temps : {fmtDurLong(timer)}</div>
      </div>
      <Btn variant="primary" accent={kidColor.ink} className="mt-6" onClick={onContinue}>
        Continuer →
      </Btn>
    </div>
  );
}

// ⏸ FIN BUILD 4 — Suite dans la réponse 5 (leçons 2e et 3e année)


// ═══ FROM cahier-sg-build5.jsx ═══
// ============================================================
// BUILD 5 — Leçons de 2e et 3e année
// ============================================================
// Note: Plusieurs leçons réutilisent les composants de Build 4
// (Base10IntroLesson, ComparisonLesson, MoneyLesson, etc.)
// Les nouvelles leçons ci-dessous sont spécifiques à des concepts
// plus avancés : base10 add/sub, bar models, multiplication,
// fractions, compensation, problèmes écrits.
// ============================================================

// ============================================================
// LESSON: BASE 10 ADDITION (avec regroupement)
// g2-u2-l1..l3, g3-u2-l1
// ============================================================
function Base10AddLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const mode = lesson.mode || 'no-regroup'; // 'no-regroup', 'regroup-u', 'regroup-d'
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Generate problems based on mode
  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 200;
    const max = lesson.max || 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let a, b;
      // Difficulty modulates the size of the numbers within the chosen mode
      const sizeFactor = difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 0.8 : 1.0;
      if (mode === 'no-regroup') {
        if (max <= 100) {
          const aT = rndInt(r, 1, Math.max(2, Math.floor(7 * sizeFactor)));
          const aU = rndInt(r, 1, 4);
          const bT = rndInt(r, 1, 8 - aT);
          const bU = rndInt(r, 1, 4);
          a = aT * 10 + aU;
          b = bT * 10 + bU;
        } else if (max <= 1000) {
          const aH = rndInt(r, 1, Math.max(2, Math.floor(7 * sizeFactor)));
          const bH = rndInt(r, 1, 8 - aH);
          a = aH * 100 + rndInt(r, 0, 49);
          b = bH * 100 + rndInt(r, 0, 49);
        } else {
          const aK = rndInt(r, 1, Math.max(2, Math.floor(5 * sizeFactor)));
          const bK = rndInt(r, 1, 4);
          a = aK * 1000 + rndInt(r, 0, 499);
          b = bK * 1000 + rndInt(r, 0, 499);
        }
      } else if (mode === 'regroup-u') {
        const aT = rndInt(r, 1, Math.max(2, Math.floor(7 * sizeFactor)));
        const aU = rndInt(r, 5, 9);
        const bT = rndInt(r, 1, 8 - aT);
        const bU = rndInt(r, 11 - aU, 9);
        a = aT * 10 + aU;
        b = bT * 10 + bU;
      } else {
        if (max <= 1000) {
          const aH = rndInt(r, 1, Math.max(2, Math.floor(7 * sizeFactor)));
          const aT = rndInt(r, 5, 9);
          const aU = rndInt(r, 0, 9);
          const bH = rndInt(r, 1, 8 - aH);
          const bT = rndInt(r, 11 - aT, 9);
          const bU = rndInt(r, 0, 9 - aU);
          a = aH * 100 + aT * 10 + aU;
          b = bH * 100 + bT * 10 + bU;
        } else {
          const aK = rndInt(r, 1, Math.max(2, Math.floor(4 * sizeFactor)));
          const aH = rndInt(r, 5, 9);
          const bK = rndInt(r, 1, 4);
          const bH = rndInt(r, 11 - aH, 9);
          a = aK * 1000 + aH * 100 + rndInt(r, 0, 50);
          b = bK * 1000 + bH * 100 + rndInt(r, 0, 49);
        }
      }
      return { a, b, answer: a + b };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, mode]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  // Demo example
  const demoExample = mode === 'no-regroup' ? { a: 23, b: 45 }
    : mode === 'regroup-u' ? { a: 27, b: 38 }
    : { a: 156, b: 87 };

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">＋</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-5 max-w-md mx-auto" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Exemple</div>
              <div className="font-display text-2xl tabular-nums">{demoExample.a} + {demoExample.b} = ?</div>
              <div className="text-xs text-stone-600 mt-2">
                {mode === 'no-regroup' ? "On additionne les unités entre elles, puis les dizaines."
                  : mode === 'regroup-u' ? "Quand les unités font 10 ou plus, on regroupe 10 unités en 1 dizaine."
                  : "Quand les dizaines font 10 ou plus, on regroupe 10 dizaines en 1 centaine."}
              </div>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Voir →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={`Suivons les étapes pour calculer ${demoExample.a} + ${demoExample.b}.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <Base10AdditionDemo a={demoExample.a} b={demoExample.b} accent={c.ink}
              onComplete={() => setPhaseIdx(2)} />
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Calcule. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
                <div className="font-display text-5xl tabular-nums" style={{ color: c.ink }}>
                  {p.a} + {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                {feedback && (
                  <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 5))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: BASE 10 SUBTRACTION (avec emprunt)
// g2-u3-l1..l3, g3-u2-l2
// ============================================================
function Base10SubLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const mode = lesson.mode || 'no-regroup';
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 220;
    const max = lesson.max || 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let a, b, attempts = 0;
      const sizeFactor = difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 0.8 : 1.0;
      while (attempts++ < 20) {
        if (mode === 'no-regroup') {
          if (max <= 100) {
            const aT = rndInt(r, 3, Math.max(4, Math.floor(9 * sizeFactor)));
            const aU = rndInt(r, 5, 9);
            const bT = rndInt(r, 1, aT - 1);
            const bU = rndInt(r, 0, aU);
            a = aT * 10 + aU;
            b = bT * 10 + bU;
            return { a, b, answer: a - b };
          } else if (max <= 1000) {
            a = rndInt(r, 200, Math.max(300, Math.floor(999 * sizeFactor)));
            b = rndInt(r, 100, a - 50);
            if ((a % 10) >= (b % 10) && (Math.floor(a/10) % 10) >= (Math.floor(b/10) % 10)) {
              return { a, b, answer: a - b };
            }
          } else {
            a = rndInt(r, 2000, Math.max(3000, Math.floor(9999 * sizeFactor)));
            b = rndInt(r, 1000, a - 500);
            if ((a % 10) >= (b % 10) && (Math.floor(a/10) % 10) >= (Math.floor(b/10) % 10)) {
              return { a, b, answer: a - b };
            }
          }
        } else if (mode === 'regroup-u') {
          const aT = rndInt(r, 3, Math.max(4, Math.floor(9 * sizeFactor)));
          const aU = rndInt(r, 0, 4);
          const bT = rndInt(r, 1, aT - 1);
          const bU = rndInt(r, aU + 1, 9);
          a = aT * 10 + aU;
          b = bT * 10 + bU;
          return { a, b, answer: a - b };
        } else {
          if (max <= 1000) {
            a = rndInt(r, 200, Math.max(300, Math.floor(999 * sizeFactor)));
            b = rndInt(r, 100, a - 10);
            if ((Math.floor(a/10) % 10) < (Math.floor(b/10) % 10)) {
              return { a, b, answer: a - b };
            }
          } else {
            a = rndInt(r, 2000, Math.max(3000, Math.floor(9999 * sizeFactor)));
            b = rndInt(r, 1000, a - 100);
            return { a, b, answer: a - b };
          }
        }
      }
      // Fallback if no valid problem found in 20 attempts
      a = max <= 100 ? 50 : (max <= 1000 ? 500 : 5000);
      b = Math.floor(a / 2);
      return { a, b, answer: a - b };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, mode]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  const demoExample = mode === 'no-regroup' ? { a: 58, b: 23 }
    : mode === 'regroup-u' ? { a: 52, b: 27 }
    : { a: 245, b: 168 };

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">−</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-5 max-w-md mx-auto" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Exemple</div>
              <div className="font-display text-2xl tabular-nums">{demoExample.a} − {demoExample.b} = ?</div>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Voir →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={`Suivons les étapes pour calculer ${demoExample.a} − ${demoExample.b}.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <Base10SubtractionDemo a={demoExample.a} b={demoExample.b} accent={c.ink}
              onComplete={() => setPhaseIdx(2)} />
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Calcule. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
                <div className="font-display text-5xl tabular-nums" style={{ color: c.ink }}>
                  {p.a} − {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                {feedback && (
                  <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 5))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: COMPENSATION
// 47 + 9 = 47 + 10 − 1 = 56
// g2-u2-l4, g2-u3-l4, g3-u2-l3
// ============================================================
function CompensationLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isSub = lesson.op === '-';
  const isEstimate = lesson.mode === 'estimate';
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 240;
    const max = lesson.max || 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let aMin, aMax, bChoices;
      if (difficulty === 'easy') {
        aMin = 20; aMax = Math.min(50, max - 20);
        bChoices = [9, 11];
      } else if (difficulty === 'medium') {
        aMin = 20; aMax = max - 20;
        bChoices = [9, 11, 19, 21];
      } else {
        aMin = Math.max(30, Math.floor(max / 3)); aMax = max - 20;
        bChoices = [9, 11, 19, 21, 29, 31];
      }
      const a = rndInt(r, aMin, aMax);
      const b = pick(r, bChoices);
      const answer = isSub ? a - b : a + b;
      const roundedB = Math.round(b / 10) * 10;
      return { a, b, answer, roundedB };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isSub]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">↔</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">Compensation</h1>
            <ReadableText
              text="Pour ajouter ou soustraire 9, on peut faire plus 10 ou moins 10 et ajuster ensuite. C'est plus facile mentalement."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                Une stratégie mentale rapide quand un nombre est proche d'une dizaine ronde.
              </p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-5 max-w-md mx-auto" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Exemple</div>
              {!isSub ? (
                <>
                  <div className="font-display text-xl tabular-nums">47 + 9 = ?</div>
                  <div className="text-sm text-stone-700 mt-2">
                    Au lieu de + 9, je fais + 10 puis − 1 :<br/>
                    <span className="font-display">47 + 10 = 57, puis 57 − 1 = <b style={{ color: c.ink }}>56</b></span>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display text-xl tabular-nums">52 − 9 = ?</div>
                  <div className="text-sm text-stone-700 mt-2">
                    Au lieu de − 9, je fais − 10 puis + 1 :<br/>
                    <span className="font-display">52 − 10 = 42, puis 42 + 1 = <b style={{ color: c.ink }}>43</b></span>
                  </div>
                </>
              )}
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          const adjustment = p.roundedB - p.b;
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Utilise la compensation pour calculer.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 text-center">
                <div className="font-display text-4xl tabular-nums mb-4" style={{ color: c.ink }}>
                  {p.a} {isSub ? '−' : '+'} {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                <div className="rounded-2xl p-3 inline-block" style={{ background: c.soft }}>
                  <div className="text-xs text-stone-600">
                    Astuce : <b>{p.a} {isSub ? '−' : '+'} {p.roundedB}</b> = {isSub ? p.a - p.roundedB : p.a + p.roundedB},{' '}
                    puis {adjustment > 0 ? (isSub ? '+' : '−') : (isSub ? '−' : '+')} {Math.abs(adjustment)}
                  </div>
                </div>
                {feedback && (
                  <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 4))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: BAR MODEL (modèle en barres)
// g2-u2-l5, g2-u3-l5
// ============================================================
function BarModelLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isSub = lesson.op === '-';
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Word-problem templates that can be visualized with a bar model
  const templates = isSub ? [
    (a, b) => ({ text: `Liam avait ${a} cartes. Il en a donné ${b} à son ami. Combien lui en reste-t-il ?`,
      answer: a - b, whole: a, parts: [a - b, b], unknown: 0 }),
    (a, b) => ({ text: `Dans une boîte de ${a} crayons, ${b} sont cassés. Combien sont en bon état ?`,
      answer: a - b, whole: a, parts: [a - b, b], unknown: 0 }),
    (a, b) => ({ text: `Camila a ${a} bonbons et Liam ${b}. Combien Camila en a-t-elle de plus ?`,
      answer: a - b, larger: a, smaller: b, type: 'compare' }),
  ] : [
    (a, b) => ({ text: `Hier j'ai lu ${a} pages et aujourd'hui ${b} pages. Combien au total ?`,
      answer: a + b, whole: a + b, parts: [a, b], unknown: 'whole' }),
    (a, b) => ({ text: `Liam a ramassé ${a} feuilles et Camila ${b}. Combien ensemble ?`,
      answer: a + b, whole: a + b, parts: [a, b], unknown: 'whole' }),
    (a, b) => ({ text: `Une classe a ${a} filles et ${b} garçons. Combien d'élèves au total ?`,
      answer: a + b, whole: a + b, parts: [a, b], unknown: 'whole' }),
  ];

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 260;
    const max = lesson.max || 100;
    return generatePracticeBatch(seed, (r, difficulty) => {
      const tpl = pick(r, templates);
      let a, b;
      const sizeFactor = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.7 : 1.0;
      if (isSub) {
        a = rndInt(r, 20, Math.max(30, Math.floor(max * sizeFactor)));
        b = rndInt(r, 5, a - 5);
      } else {
        a = rndInt(r, 10, Math.max(15, Math.floor((max / 2) * sizeFactor)));
        b = rndInt(r, 10, max - a);
      }
      return tpl(a, b);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isSub]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">▭</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText
              text="Le modèle en barres est une signature de la méthode Singapour. On dessine des rectangles pour voir un problème avant de le calculer."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                Dessiner pour voir un problème avant de le calculer.
              </p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Démonstration →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={isSub
                ? `Liam avait 45 billes. Il en a perdu 17. Combien lui reste-t-il ? On dessine une barre pour 45, on enlève 17.`
                : `Hier j'ai lu 28 pages, aujourd'hui 35 pages. Combien au total ? On dessine deux barres et on les met côte à côte.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
              {isSub ? (
                <>
                  <PartWholeBar whole={45} parts={[{ value: 28, label: 'reste' }, { value: 17, label: 'donné' }]}
                    unknown={0} accent={c.ink} label="Le tout = 45" />
                  <div className="text-center mt-4 font-display text-xl tabular-nums text-stone-800">
                    45 − 17 = <b style={{ color: c.ink }}>28</b>
                  </div>
                </>
              ) : (
                <>
                  <PartWholeBar whole={63} parts={[{ value: 28, label: 'hier' }, { value: 35, label: 'aujourd\'hui' }]}
                    unknown="whole" accent={c.ink} />
                  <div className="text-center mt-4 font-display text-xl tabular-nums text-stone-800">
                    28 + 35 = <b style={{ color: c.ink }}>63</b>
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={p.text}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
                {p.type === 'compare' ? (
                  <ComparisonBar a={p.larger} b={p.smaller}
                    aLabel="Camila" bLabel="Liam" unknown="diff" accent={c.ink} />
                ) : (
                  <PartWholeBar whole={p.whole}
                    parts={p.parts.map((v, i) => ({ value: v, label: i === 0 ? 'partie 1' : 'partie 2' }))}
                    unknown={p.unknown} accent={c.ink} />
                )}
                <div className="mt-4 text-center font-display text-2xl tabular-nums">
                  Réponse : <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                {feedback && (
                  <div className={`mt-3 flex justify-center`}>
                    <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 5))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: ARRAY MULTIPLY
// g2-u4-l1..l5, g3-u3-l1..l6, g3-u4-l1..l2
// ============================================================
function ArrayMultiplyLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isGroups = lesson.mode === 'groups';
  const isArray = lesson.mode === 'array';
  const is2x1 = lesson.mode === '2x1';
  const is3x1 = lesson.mode === '3x1';
  const tables = lesson.tables;
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 280;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let a, b;
      if (is2x1) {
        const aMax = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 35 : 50;
        a = rndInt(r, 11, aMax);
        b = difficulty === 'easy' ? rndInt(r, 2, 5) : rndInt(r, 2, 9);
      } else if (is3x1) {
        const aMax = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 600 : 999;
        a = rndInt(r, 101, aMax);
        b = difficulty === 'easy' ? rndInt(r, 2, 5) : rndInt(r, 2, 9);
      } else if (tables) {
        a = pick(r, tables);
        b = difficulty === 'easy' ? rndInt(r, 1, 5) : rndInt(r, 1, 10);
      } else {
        const maxA = lesson.max || 5;
        if (difficulty === 'easy') {
          a = rndInt(r, 2, Math.min(3, maxA));
          b = rndInt(r, 2, 3);
        } else if (difficulty === 'medium') {
          a = rndInt(r, 2, maxA);
          b = rndInt(r, 2, 4);
        } else {
          a = rndInt(r, Math.max(2, Math.floor(maxA / 2)), maxA);
          b = rndInt(r, 3, 5);
        }
      }
      return { a, b, answer: a * b };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, isGroups, isArray, is2x1, is3x1, tables]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  // Demo
  const demoExample = is2x1 ? { a: 24, b: 3 }
    : is3x1 ? { a: 124, b: 4 }
    : tables ? { a: tables[0], b: 4 }
    : { a: 3, b: 4 };

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">⊞</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Démonstration →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={isGroups
                ? `Voici ${demoExample.a} groupes de ${demoExample.b} objets.`
                : is2x1 || is3x1
                ? `Pour calculer ${demoExample.a} × ${demoExample.b}, on décompose ${demoExample.a}.`
                : tables
                ? `Pratiquons la table de ${tables[0]} avec un tableau.`
                : `Voici ${demoExample.a} × ${demoExample.b} en tableau.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />

            {isGroups && (
              <EqualGroupsDisplay groups={demoExample.a} perGroup={demoExample.b} accent={c.ink} />
            )}
            {(isArray || tables) && !is2x1 && !is3x1 && (
              <div className="flex justify-center">
                <ArrayDisplay rows={demoExample.a} cols={demoExample.b} accent={c.ink} cellSize="normal" />
              </div>
            )}
            {(is2x1 || is3x1) && (
              <DistributiveMultDemo a={demoExample.a} b={demoExample.b} accent={c.ink}
                onComplete={() => setPhaseIdx(2)} />
            )}

            {!is2x1 && !is3x1 && (
              <div className="mt-5 flex justify-center gap-2">
                <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
                <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
              </div>
            )}
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Calcule. Question ${practiceIdx + 1} sur ${practiceProblems.length}.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 text-center">
                {!is2x1 && !is3x1 && p.a <= 10 && p.b <= 10 && (
                  <div className="flex justify-center mb-4">
                    <ArrayDisplay rows={p.a} cols={p.b} accent={c.ink} cellSize="small" showLabels={false} />
                  </div>
                )}
                <div className="font-display text-4xl tabular-nums" style={{ color: c.ink }}>
                  {p.a} × {p.b} = <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                {feedback && (
                  <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 5))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: FRACTION BAR
// g2-u5-l1..l3, g3-u6-l1..l3
// ============================================================
function FractionLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const isCompare = lesson.mode === 'compare';
  const isAdd = lesson.mode === 'add';

  // Parse fraction (e.g. "1/2") to denominator
  const denominator = lesson.fraction ? parseInt(lesson.fraction.split('/')[1], 10) : null;
  const phases = ['intro', 'concret', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [practiceNumerator, setPracticeNumerator] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 300;
    if (isCompare) {
      return generatePracticeBatch(seed, (r, difficulty) => {
        const denomPool = difficulty === 'easy' ? [2, 3, 4]
          : difficulty === 'medium' ? [2, 3, 4, 6]
          : [2, 3, 4, 6, 8];
        const d1 = pick(r, denomPool);
        const d2 = pick(r, denomPool.filter(d => d !== d1));
        const n1 = rndInt(r, 1, d1 - 1);
        const n2 = rndInt(r, 1, d2 - 1);
        const v1 = n1 / d1, v2 = n2 / d2;
        return {
          a: { num: n1, den: d1 },
          b: { num: n2, den: d2 },
          answer: v1 > v2 ? 'a' : v1 < v2 ? 'b' : 'eq',
        };
      });
    } else if (isAdd) {
      return generatePracticeBatch(seed, (r, difficulty) => {
        const denomPool = difficulty === 'easy' ? [4, 5]
          : difficulty === 'medium' ? [4, 5, 6, 8]
          : [6, 8, 10];
        const d = pick(r, denomPool);
        const n1 = rndInt(r, 1, Math.floor(d / 2));
        const n2 = rndInt(r, 1, d - n1);
        return { n1, n2, d, answer: n1 + n2 };
      });
    } else {
      return generatePracticeBatch(seed, (r, difficulty) => {
        const d = denominator || (difficulty === 'easy' ? pick(r, [2, 3])
          : difficulty === 'medium' ? pick(r, [2, 3, 4])
          : pick(r, [3, 4, 6, 8]));
        const n = rndInt(r, 1, d - 1);
        return { num: n, den: d };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, denominator, isCompare, isAdd]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    let correct = false;
    if (isCompare) {
      correct = selectedChoice === p.answer;
    } else if (isAdd) {
      const ans = parseInt(currentInput, 10);
      correct = ans === p.answer;
    } else {
      correct = practiceNumerator === p.num;
    }
    if (correct) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null);
        setCurrentInput(''); setPracticeNumerator(0); setSelectedChoice(null);
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">◔</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Voir →</Btn>
          </div>
        )}

        {phase === 'concret' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={denominator
                ? `Voici une fraction ${lesson.fraction}. Le bas (${denominator}) dit en combien de parts on divise, le haut dit combien on prend.`
                : isCompare
                ? `Pour comparer deux fractions, on les met côte à côte avec des barres de même longueur.`
                : isAdd
                ? `Quand le dénominateur est le même, on additionne juste les numérateurs.`
                : `Une fraction divise un tout en parts égales.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="concret" />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
              {denominator && !isCompare && !isAdd && (
                <div className="flex flex-col items-center gap-4">
                  <FractionBar numerator={1} denominator={denominator} color={c.ink} width={340} height={64} />
                  <div className="text-sm text-stone-700 text-center">
                    Une part sur {denominator} = <b style={{ color: c.ink }}>1/{denominator}</b>
                  </div>
                </div>
              )}
              {isCompare && (
                <div className="flex flex-col items-center gap-4">
                  <FractionCompare a={{ num: 2, den: 3, label: 'Camila a 2/3 du gâteau' }}
                    b={{ num: 3, den: 4, label: 'Liam a 3/4 du gâteau' }}
                    color1={c.ink} color2="#f97316" />
                  <div className="text-sm text-stone-700 text-center">
                    On voit que <b>3/4 &gt; 2/3</b> car la barre est plus longue.
                  </div>
                </div>
              )}
              {isAdd && (
                <FractionAdditionDemo a={1} b={2} denominator={4} accent={c.ink}
                  onComplete={() => setPhaseIdx(2)} />
              )}
            </div>
            {!isAdd && (
              <div className="mt-5 flex justify-center gap-2">
                <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
                <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
              </div>
            )}
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={
                  isCompare ? `Quelle fraction est la plus grande ?`
                  : isAdd ? `Calcule la somme des fractions.`
                  : `Colorie ${p.num}/${p.den} de la barre.`
                }
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
                {!isCompare && !isAdd && (
                  <FractionBarBuilder denominator={p.den} targetNumerator={p.num}
                    accent={c.ink} />
                )}
                {isCompare && (
                  <div>
                    <FractionCompare a={p.a} b={p.b} color1={c.ink} color2="#f97316" />
                    <div className="mt-4 grid grid-cols-3 gap-2 max-w-md mx-auto">
                      <button onClick={() => setSelectedChoice('a')}
                        className="py-3 rounded-xl border-2 font-medium transition-all active:scale-95"
                        style={{
                          borderColor: selectedChoice === 'a' ? c.ink : '#e7e5e4',
                          background: selectedChoice === 'a' ? c.soft : 'white',
                        }}>
                        A est plus grande
                      </button>
                      <button onClick={() => setSelectedChoice('eq')}
                        className="py-3 rounded-xl border-2 font-medium transition-all active:scale-95"
                        style={{
                          borderColor: selectedChoice === 'eq' ? c.ink : '#e7e5e4',
                          background: selectedChoice === 'eq' ? c.soft : 'white',
                        }}>
                        Égales
                      </button>
                      <button onClick={() => setSelectedChoice('b')}
                        className="py-3 rounded-xl border-2 font-medium transition-all active:scale-95"
                        style={{
                          borderColor: selectedChoice === 'b' ? c.ink : '#e7e5e4',
                          background: selectedChoice === 'b' ? c.soft : 'white',
                        }}>
                        B est plus grande
                      </button>
                    </div>
                  </div>
                )}
                {isAdd && (
                  <div className="text-center">
                    <FractionBar numerator={p.n1} denominator={p.d} color={c.ink} width={280} height={48} showFraction={false} />
                    <div className="my-2 text-stone-400 text-xl">+</div>
                    <FractionBar numerator={p.n2} denominator={p.d} color="#f97316" width={280} height={48} showFraction={false} />
                    <div className="mt-4 font-display text-2xl tabular-nums">
                      {p.n1}/{p.d} + {p.n2}/{p.d} = <span className="text-stone-400">{currentInput || '?'}</span>/{p.d}
                    </div>
                  </div>
                )}
                {feedback && (
                  <div className={`mt-3 flex justify-center`}>
                    <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : `✗ Réessaie`}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-center">
                {isAdd ? (
                  <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 3))}
                    onClear={() => setCurrentInput(s => s.slice(0, -1))}
                    onSubmit={checkAnswer} accent={c.ink} />
                ) : (
                  <Btn variant="primary" accent={c.ink}
                    disabled={isCompare ? !selectedChoice : false}
                    onClick={checkAnswer}>Vérifier ✓</Btn>
                )}
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: EQUIVALENT FRACTIONS
// g3-u6-l2
// ============================================================
function FractionEqLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 320;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let baseNPool, baseDPool, multMax;
      if (difficulty === 'easy') {
        baseNPool = [1];
        baseDPool = [2, 3, 4];
        multMax = 3;
      } else if (difficulty === 'medium') {
        baseNPool = [1, 2];
        baseDPool = [2, 3, 4, 5];
        multMax = 4;
      } else {
        baseNPool = [1, 2, 3];
        baseDPool = [2, 3, 4, 5, 6];
        multMax = 5;
      }
      const baseN = pick(r, baseNPool);
      const baseD = pick(r, baseDPool.filter(d => d > baseN));
      const mult = rndInt(r, 2, multMax);
      const hideNumerator = r() > 0.5;
      return {
        baseN, baseD, mult,
        targetN: baseN * mult, targetD: baseD * mult,
        hideNumerator,
        answer: hideNumerator ? baseN * mult : baseD * mult,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">≡</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text="Deux fractions sont équivalentes quand elles représentent la même quantité, même si les nombres sont différents."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                Deux fractions différentes peuvent représenter la même quantité.
              </p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Démonstration →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction="Regarde : 1/2, 2/4, 3/6 et 4/8 colorient toutes la même portion du rectangle."
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
              <EquivalentFractionsDemo baseNum={1} baseDen={2} multipliers={[1, 2, 3, 4]} color={c.ink} />
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Trouve le nombre manquant pour que les fractions soient équivalentes.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 text-center">
                <div className="flex items-center justify-center gap-4 font-display text-3xl tabular-nums">
                  <div className="inline-flex flex-col items-center leading-none">
                    <span className="text-2xl font-bold" style={{ color: c.ink }}>{p.baseN}</span>
                    <span className="w-6 h-0.5 my-0.5" style={{ background: c.ink }} />
                    <span className="text-2xl font-bold" style={{ color: c.ink }}>{p.baseD}</span>
                  </div>
                  <span className="text-stone-400">=</span>
                  <div className="inline-flex flex-col items-center leading-none">
                    <span className="text-2xl font-bold" style={{ color: p.hideNumerator ? '#9ca3af' : c.ink }}>
                      {p.hideNumerator ? (currentInput || '?') : p.targetN}
                    </span>
                    <span className="w-6 h-0.5 my-0.5" style={{ background: c.ink }} />
                    <span className="text-2xl font-bold" style={{ color: p.hideNumerator ? c.ink : '#9ca3af' }}>
                      {p.hideNumerator ? p.targetD : (currentInput || '?')}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-stone-500">
                  Astuce : on multiplie le haut ET le bas par le même nombre (× {p.mult})
                </div>
                {feedback && (
                  <div className={`mt-3 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 3))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: PROBLEM SOLVING (avec bar models)
// g2-u7-l1..l2, g3-u7-l1..l3
// ============================================================
function ProblemSolvingLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const mode = lesson.mode || (lesson.op === '+' ? 'add' : 'sub');
  const op = lesson.op;
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showBarModel, setShowBarModel] = useState(false);

  const practiceProblems = useMemo(() => {
    const max = lesson.max || 100;

    const templates = {
      add: [
        (a, b) => ({ text: `Liam a ramassé ${a} pommes et Camila ${b}. Combien en ont-ils ensemble ?`,
          answer: a + b, model: { type: 'parts', whole: a + b, parts: [a, b], unknown: 'whole', labels: ['Liam', 'Camila'] } }),
        (a, b) => ({ text: `Une école a ${a} élèves de 1re année et ${b} de 2e année. Combien d'élèves au total ?`,
          answer: a + b, model: { type: 'parts', whole: a + b, parts: [a, b], unknown: 'whole', labels: ['1re', '2e'] } }),
        (a, b) => ({ text: `Camila avait ${a} autocollants. Elle en reçoit ${b} de plus. Combien en a-t-elle maintenant ?`,
          answer: a + b, model: { type: 'parts', whole: a + b, parts: [a, b], unknown: 'whole', labels: ['avant', 'reçus'] } }),
      ],
      sub: [
        (a, b) => ({ text: `Liam avait ${a} cartes. Il en a donné ${b} à un ami. Combien lui en reste-t-il ?`,
          answer: a - b, model: { type: 'parts', whole: a, parts: [a - b, b], unknown: 0, labels: ['reste', 'donné'] } }),
        (a, b) => ({ text: `Dans une boîte de ${a} crayons, ${b} sont cassés. Combien sont en bon état ?`,
          answer: a - b, model: { type: 'parts', whole: a, parts: [a - b, b], unknown: 0, labels: ['bons', 'cassés'] } }),
      ],
      compare: [
        (a, b) => ({ text: `Camila a ${a} bonbons et Liam ${b}. Combien Camila en a-t-elle de plus que Liam ?`,
          answer: a - b, model: { type: 'compare', larger: a, smaller: b, unknown: 'diff', labels: ['Camila', 'Liam'] } }),
        (a, b) => ({ text: `Une école A a ${a} élèves et l'école B en a ${b}. Combien l'école A en a-t-elle de plus ?`,
          answer: a - b, model: { type: 'compare', larger: a, smaller: b, unknown: 'diff', labels: ['École A', 'École B'] } }),
      ],
      mul: [
        (a, b) => ({ text: `Liam achète ${a} paquets de gomme. Chaque paquet contient ${b} pièces. Combien de gommes au total ?`,
          answer: a * b, model: null }),
        (a, b) => ({ text: `Une boîte contient ${b} biscuits. Combien de biscuits dans ${a} boîtes ?`,
          answer: a * b, model: null }),
      ],
      'two-step': [
        (a, b, c) => ({ text: `Camila avait ${a}$. Elle a acheté un livre à ${b}$ et un cahier à ${c}$. Combien lui reste-t-il ?`,
          answer: a - b - c, model: { type: 'parts', whole: a, parts: [a - b - c, b, c], unknown: 0, labels: ['reste', 'livre', 'cahier'] } }),
        (a, b, c) => ({ text: `Liam a ${a} billes. Il en donne ${b} à Camila et ${c} à un ami. Combien lui reste-t-il ?`,
          answer: a - b - c, model: { type: 'parts', whole: a, parts: [a - b - c, b, c], unknown: 0, labels: ['reste', 'à Camila', 'à ami'] } }),
      ],
    };

    return generatePracticeBatch(Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 340, (r, difficulty) => {
      const set = templates[mode] || templates.add;
      const tpl = pick(r, set);
      const sizeFactor = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.7 : 1.0;
      if (mode === 'mul') {
        const a = rndInt(r, 2, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9);
        const b = rndInt(r, 2, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10);
        return tpl(a, b);
      } else if (mode === 'two-step') {
        const a = rndInt(r, 30, Math.max(40, Math.floor(max * sizeFactor)));
        const b = rndInt(r, 5, Math.floor(a / 3));
        const c = rndInt(r, 5, Math.floor(a / 3));
        return tpl(a, b, c);
      } else if (mode === 'sub' || mode === 'compare') {
        const a = rndInt(r, 20, Math.max(30, Math.floor(max * sizeFactor)));
        const b = rndInt(r, 5, a - 5);
        return tpl(a, b);
      } else {
        const a = rndInt(r, 10, Math.max(15, Math.floor((max / 2) * sizeFactor)));
        const b = rndInt(r, 10, max - a);
        return tpl(a, b);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.max, mode]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.answer) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput(''); setShowBarModel(false);
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text={lesson.description} accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <div className="mt-6 rounded-3xl p-5 max-w-md mx-auto" style={{ background: c.soft, border: `2px solid ${c.ink}` }}>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.strong }}>Stratégie</div>
              <ol className="text-sm text-stone-700 text-left list-decimal list-inside space-y-1">
                <li>Lis le problème attentivement (utilise 🔊 si besoin)</li>
                <li>Imagine ou dessine un modèle en barres</li>
                <li>Décide quelle opération utiliser</li>
                <li>Calcule</li>
              </ol>
            </div>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={p.text}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
                {!showBarModel && p.model && (
                  <div className="text-center">
                    <Btn variant="soft" size="small" onClick={() => setShowBarModel(true)}>
                      🔍 Voir le modèle en barres
                    </Btn>
                  </div>
                )}
                {showBarModel && p.model && (
                  <div>
                    {p.model.type === 'parts' && (
                      <PartWholeBar
                        whole={p.model.whole}
                        parts={p.model.parts.map((v, i) => ({ value: v, label: p.model.labels?.[i] }))}
                        unknown={p.model.unknown} accent={c.ink} />
                    )}
                    {p.model.type === 'compare' && (
                      <ComparisonBar a={p.model.larger} b={p.model.smaller}
                        aLabel={p.model.labels?.[0]} bLabel={p.model.labels?.[1]}
                        unknown={p.model.unknown} accent={c.ink} />
                    )}
                  </div>
                )}
                <div className="mt-4 text-center font-display text-3xl tabular-nums">
                  Réponse : <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                {feedback && (
                  <div className={`mt-3 flex justify-center`}>
                    <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${
                      feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.answer}`}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 5))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: DIVISION (intro 3e année)
// g3-u5-l1..l3
// ============================================================
function DivisionLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const mode = lesson.mode || 'share'; // 'share', 'group', 'easy'
  const phases = ['intro', 'demo', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 360;
    return generatePracticeBatch(seed, (r, difficulty) => {
      let divisor, quotient;
      if (mode === 'easy') {
        divisor = pick(r, [2, 5, 10]);
        quotient = difficulty === 'easy' ? rndInt(r, 2, 5)
          : difficulty === 'medium' ? rndInt(r, 2, 8)
          : rndInt(r, 5, 10);
      } else {
        divisor = difficulty === 'easy' ? rndInt(r, 2, 3)
          : difficulty === 'medium' ? rndInt(r, 2, 4)
          : rndInt(r, 3, 5);
        quotient = difficulty === 'easy' ? rndInt(r, 2, 5)
          : difficulty === 'medium' ? rndInt(r, 2, 8)
          : rndInt(r, 5, 10);
      }
      const dividend = divisor * quotient;
      return { dividend, divisor, quotient, mode };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, mode]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.quotient) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, given: ans, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(3);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  const demoDividend = 12, demoDivisor = 3;
  const demoQuotient = demoDividend / demoDivisor;

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">÷</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText
              text={mode === 'share'
                ? "Diviser, c'est partager également. Si 12 cookies sont partagés entre 3 amis, chacun reçoit 4 cookies."
                : mode === 'group'
                ? "Diviser, c'est aussi faire des groupes. Avec 12 cookies, on peut faire 3 groupes de 4."
                : "Diviser par 2, 5 ou 10 est facile quand on connaît les tables."}
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">{lesson.description}</p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Démonstration →</Btn>
          </div>
        )}

        {phase === 'demo' && (
          <div>
            <LessonBanner stepLabel="Démonstration"
              instruction={mode === 'share'
                ? `${demoDividend} cookies à partager entre ${demoDivisor} amis. Chacun en aura ${demoQuotient}.`
                : `${demoDividend} objets à grouper par ${demoDivisor}. On obtient ${demoQuotient} groupes.`}
              accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey="demo" />
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6">
              <EqualGroupsDisplay groups={demoQuotient} perGroup={demoDivisor} accent={c.ink} />
              <div className="mt-4 text-center font-display text-2xl tabular-nums">
                {demoDividend} ÷ {demoDivisor} = <b style={{ color: c.ink }}>{demoQuotient}</b>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="soft" onClick={() => setPhaseIdx(0)}>← Retour</Btn>
              <Btn variant="primary" accent={c.ink} onClick={() => setPhaseIdx(2)}>Pratiquer →</Btn>
            </div>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Calcule. Astuce : ${p.divisor} × ? = ${p.dividend}`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center">
                <div className="font-display text-5xl tabular-nums" style={{ color: c.ink }}>
                  {p.dividend} ÷ {p.divisor} = <span className="text-stone-400">{currentInput || '?'}</span>
                </div>
                {feedback && (
                  <div className={`mt-4 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.quotient}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 3))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ============================================================
// LESSON: GEOMETRY (perimeter, basic — 3e année)
// g3-u8-l2
// ============================================================
function GeometryLesson({ lesson, kid, onComplete, onExit }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const kidPrefs = getKidSpeechPrefs(kid);
  const phases = ['intro', 'pratique', 'bilan'];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const { seconds: timer } = useLessonTimer();

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const practiceProblems = useMemo(() => {
    const seed = Math.floor(Date.now() / 1000) + lesson.id.charCodeAt(0) + 380;
    return generatePracticeBatch(seed, (r, difficulty) => {
      const shapePool = difficulty === 'easy' ? ['square', 'rect']
        : difficulty === 'medium' ? ['square', 'rect', 'triangle']
        : ['rect', 'triangle'];
      const shape = pick(r, shapePool);
      let sizeMax;
      if (difficulty === 'easy') sizeMax = 6;
      else if (difficulty === 'medium') sizeMax = 12;
      else sizeMax = 20;
      let sides;
      if (shape === 'square') {
        const s = rndInt(r, 3, sizeMax);
        sides = [s, s, s, s];
      } else if (shape === 'rect') {
        const w = rndInt(r, 3, sizeMax);
        const h = rndInt(r, 3, sizeMax);
        sides = [w, h, w, h];
      } else {
        sides = [rndInt(r, 3, sizeMax), rndInt(r, 3, sizeMax), rndInt(r, 3, sizeMax)];
      }
      const perimeter = sides.reduce((s, a) => s + a, 0);
      return { shape, sides, perimeter };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const checkAnswer = () => {
    const p = practiceProblems[practiceIdx];
    const ans = parseInt(currentInput, 10);
    if (ans === p.perimeter) {
      setFeedback('correct');
      setPracticeResults(r => [...r, { ...p, correct: true }]);
      setTimeout(() => {
        setFeedback(null); setCurrentInput('');
        if (practiceIdx + 1 >= practiceProblems.length) setPhaseIdx(2);
        else setPracticeIdx(i => i + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setCurrentInput(''); }, 1200);
    }
  };

  const correctCount = practiceResults.filter(r => r.correct).length;
  const isPerfect = correctCount === practiceProblems.length;
  const finalize = () => onComplete({
    lessonId: lesson.id, durationSec: timer,
    practiceCorrect: correctCount, practiceTotal: practiceProblems.length, isPerfect,
  });

  const renderShape = (shape, sides, scale = 12) => {
    if (shape === 'square') {
      const s = sides[0] * scale;
      return (
        <svg viewBox={`0 0 ${s + 60} ${s + 40}`} width={Math.min(280, s + 60)}>
          <rect x="30" y="20" width={s} height={s} fill={c.soft} stroke={c.ink} strokeWidth="3" />
          <text x="30" y="15" fontSize="12" fill={c.ink}>{sides[0]} cm</text>
        </svg>
      );
    }
    if (shape === 'rect') {
      const w = sides[0] * scale, h = sides[1] * scale;
      return (
        <svg viewBox={`0 0 ${w + 60} ${h + 40}`} width={Math.min(320, w + 60)}>
          <rect x="30" y="20" width={w} height={h} fill={c.soft} stroke={c.ink} strokeWidth="3" />
          <text x={30 + w / 2 - 20} y="15" fontSize="12" fill={c.ink}>{sides[0]} cm</text>
          <text x={w + 35} y={20 + h / 2 + 4} fontSize="12" fill={c.ink}>{sides[1]} cm</text>
        </svg>
      );
    }
    // triangle: not to scale, just labeled
    const s = 60;
    return (
      <svg viewBox={`0 0 ${s * 3 + 60} ${s * 2 + 40}`} width={Math.min(280, s * 3)}>
        <polygon points={`30,${s * 2 + 10} ${s * 3 + 30},${s * 2 + 10} ${s + 30},10`}
          fill={c.soft} stroke={c.ink} strokeWidth="3" />
        <text x={s} y={s * 2 + 28} fontSize="12" fill={c.ink}>{sides[0]} cm</text>
        <text x={s * 2 + 30} y={s + 30} fontSize="12" fill={c.ink}>{sides[1]} cm</text>
        <text x="20" y={s + 30} fontSize="12" fill={c.ink}>{sides[2]} cm</text>
      </svg>
    );
  };

  return (
    <Paper>
      {phase === 'bilan' && isPerfect && <Celebration palette={[c.ink, c.accent, '#10b981', '#fbbf24']} />}
      <LessonHeader lessonName={lesson.name} accent={c.ink} onExit={onExit} phaseIdx={phaseIdx} phases={phases} timer={timer} />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {phase === 'intro' && (
          <div className="text-center pt-6">
            <div className="text-6xl mb-4">▢</div>
            <h1 className="font-display text-3xl text-stone-900 mb-3">{lesson.name}</h1>
            <ReadableText text="Le périmètre d'une forme, c'est la somme de tous ses côtés. Comme si tu marchais tout autour."
              accent={c.ink} buttonSize="small">
              <p className="text-stone-600 max-w-md mx-auto">
                Le périmètre = la longueur totale autour d'une forme.
              </p>
            </ReadableText>
            <Btn variant="primary" accent={c.ink} className="mt-6" onClick={() => setPhaseIdx(1)}>Pratiquer →</Btn>
          </div>
        )}

        {phase === 'pratique' && (() => {
          const p = practiceProblems[practiceIdx];
          return (
            <div>
              <LessonBanner stepLabel="Pratique"
                instruction={`Calcule le périmètre de cette forme en additionnant ses côtés.`}
                accent={c.strong} soft={c.soft} kidPrefs={kidPrefs} autoReadKey={`pract-${practiceIdx}`} />
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 text-center">
                <div className="flex justify-center">{renderShape(p.shape, p.sides)}</div>
                <div className="mt-4 font-display text-2xl tabular-nums">
                  Périmètre = <span className="text-stone-400">{currentInput || '?'}</span> cm
                </div>
                {feedback && (
                  <div className={`mt-3 inline-block px-4 py-2 rounded-full font-medium text-sm ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {feedback === 'correct' ? '✓ Bravo !' : `✗ La bonne réponse était ${p.perimeter}`}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <NumPad onDigit={(d) => setCurrentInput(s => (s + d).slice(0, 4))}
                  onClear={() => setCurrentInput(s => s.slice(0, -1))}
                  onSubmit={checkAnswer} accent={c.ink} />
              </div>
            </div>
          );
        })()}

        {phase === 'bilan' && (
          <BilanScreen kidColor={c} correctCount={correctCount} total={practiceProblems.length}
            timer={timer} isPerfect={isPerfect} onContinue={finalize} />
        )}
      </div>
    </Paper>
  );
}

// ⏸ FIN BUILD 5 — Suite dans la réponse 6 (assemblage final)


// ═══ FROM cahier-sg-build6.jsx ═══
// ============================================================
// BUILD 6 — Shell principal (router, screens, parent dashboard)
// ============================================================

// ============================================================
// LESSON ROUTER
// ============================================================
function LessonView({ lesson, kid, onComplete, onExit }) {
  switch (lesson.type) {
    case 'numberBonds':
      return <NumberBondsLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'doubles':
      return <DoublesLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'makeTen':
      return <MakeTenLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'partWhole':
      return <PartWholeLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'numberLine':
      return <NumberLineLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'base10':
      return <Base10IntroLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'base10Add':
      return <Base10AddLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'base10Sub':
      return <Base10SubLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'compensation':
      return <CompensationLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'comparison':
      return <ComparisonLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'barModel':
      return <BarModelLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'arrayMultiply':
      return <ArrayMultiplyLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'fractionBar':
      return <FractionLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'fractionEq':
      return <FractionEqLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'problemSolving':
      return <ProblemSolvingLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'division':
      return <DivisionLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'geometry':
      return <GeometryLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'moneyQc':
      return <MoneyLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'measureLength':
      return <MeasureLengthLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    case 'time':
      return <TimeLesson lesson={lesson} kid={kid} onComplete={onComplete} onExit={onExit} />;
    default:
      return (
        <Paper>
          <div className="max-w-2xl mx-auto px-6 pt-16 text-center">
            <button onClick={onExit} className="text-sm text-stone-500 mb-8">← Retour</button>
            <div className="text-6xl mb-4">🚧</div>
            <h1 className="font-display text-2xl text-stone-900 mb-3">Leçon en construction</h1>
            <p className="text-stone-600">
              Type : <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">{lesson.type}</code>
            </p>
            <Btn variant="primary" className="mt-8" onClick={onExit}>Retour au parcours</Btn>
          </div>
        </Paper>
      );
  }
}

// ============================================================
// SCREEN: KID PICKER (accueil)
// ============================================================
function KidPicker({ config, progress, onPickKid, onPickParent, lockedKidId }) {
  const today = new Date();
  const todayStr = today.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
  const visibleKids = config.kids.filter(k => {
    if (k.enabled === false) return false;
    if (!k.name?.trim()) return false;
    if (lockedKidId && k.id !== lockedKidId) return false;
    return true;
  });

  return (
    <Paper>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 pb-8">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Mathématiques · méthode Singapour</div>
            <h1 className="font-display text-4xl sm:text-5xl text-stone-900 mt-2 leading-tight">
              <span style={{ fontStyle: 'italic' }}>Comprendre</span> les nombres
            </h1>
            <div className="mt-1 text-sm text-stone-500">avant de les calculer</div>
          </div>
          <div className="text-xs text-stone-500 capitalize hidden sm:block">{todayStr}</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-5">
          {lockedKidId ? "Profil de cet appareil" : "Qui pratique aujourd'hui ?"}
        </div>
        <div className={`grid gap-5 ${visibleKids.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {visibleKids.map(kid => {
            const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
            const kp = progress[kid.id] || {};
            const completedCount = Object.values(kp).filter(l => l?.completed).length;
            const lessons = getLessonsForGrade(kid.grade);
            const totalLessons = lessons.length;
            return (
              <button key={kid.id} onClick={() => onPickKid(kid)}
                className="group text-left rounded-3xl p-6 sm:p-7 border-2 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                style={{ background: c.soft, borderColor: c.ink }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-display text-4xl sm:text-5xl text-white leading-none"
                      style={{ background: c.ink }}>
                      {kid.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-display text-2xl sm:text-3xl text-stone-900 leading-tight">{kid.name}</div>
                      <div className="text-xs sm:text-sm text-stone-600 mt-0.5">
                        {kid.age} ans · {kid.grade === 1 ? '1re année' : `${kid.grade}e année`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t flex items-center justify-between text-sm"
                  style={{ borderColor: c.ink + '33' }}>
                  <div className="text-stone-600">
                    {totalLessons > 0 ? (
                      <><b style={{ color: c.strong }}>{completedCount}</b> / {totalLessons} leçons</>
                    ) : 'Programme à venir'}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium" style={{ color: c.strong }}>
                    <span>Continuer</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {visibleKids.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-stone-300 p-12 text-center">
            <div className="text-stone-700 mb-2">Aucun enfant configuré</div>
            <div className="text-xs text-stone-500">Va dans Accès parent pour ajouter un enfant</div>
          </div>
        )}

        <div className="mt-16 flex items-center justify-center">
          <button onClick={onPickParent}
            className="text-xs uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 transition-colors py-2 px-4 rounded-lg hover:bg-stone-100">
            🔒 Accès parent
          </button>
        </div>
      </div>
    </Paper>
  );
}

// ============================================================
// SCREEN: KID PIN GATE
// ============================================================
function KidPinGate({ kid, onSuccess, onBack }) {
  const [entered, setEntered] = useState('');
  const [error, setError] = useState(false);
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;

  useEffect(() => {
    if (entered.length === 4) {
      if (entered === kid.pin) onSuccess();
      else { setError(true); setTimeout(() => { setEntered(''); setError(false); }, 600); }
    }
  }, [entered, kid.pin, onSuccess]);

  return (
    <Paper>
      <div className="max-w-md mx-auto px-6 pt-10 pb-16 min-h-screen flex flex-col">
        <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-900 self-start">← Retour</button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display text-5xl text-white mb-4"
            style={{ background: c.ink }}>{kid.name.charAt(0).toUpperCase()}</div>
          <div className="font-display text-3xl text-stone-900">Bonjour {kid.name} !</div>
          <div className="text-sm text-stone-500 mt-2">Entre ton code à 4 chiffres</div>
          <div className={`mt-6 ${error ? 'animate-shake' : ''}`}>
            <PinPad value={entered} onChange={setEntered} accent={c.ink} />
          </div>
          {error && <div className="text-xs text-rose-700 mt-3">Code incorrect</div>}
        </div>
      </div>
    </Paper>
  );
}

// ============================================================
// SCREEN: CURRICULUM PATH (parcours d'unités et leçons)
// ============================================================
function CurriculumPath({ kid, progress, onPickLesson, onBack }) {
  const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const grade = CURRICULUM.find(g => g.grade === kid.grade);
  const [openUnit, setOpenUnit] = useState(grade?.units[0]?.id);
  const kp = progress[kid.id] || {};

  if (!grade) {
    return (
      <Paper>
        <div className="max-w-2xl mx-auto px-6 pt-16 text-center">
          <button onClick={onBack} className="text-sm text-stone-500 mb-8">← Accueil</button>
          <div className="text-stone-700">Aucun programme disponible pour cette année scolaire.</div>
        </div>
      </Paper>
    );
  }

  return (
    <Paper>
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-6">
        <button onClick={onBack} className="text-sm text-stone-600 hover:text-stone-900 mb-6 flex items-center gap-1">
          <span>←</span> <span>Accueil</span>
        </button>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display text-4xl text-white"
            style={{ background: c.ink }}>{kid.name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500">Programme {grade.grade === 1 ? '1re' : `${grade.grade}e`} année</div>
            <h1 className="font-display text-3xl text-stone-900">{kid.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-16 space-y-3">
        {grade.units.map((unit, unitIdx) => {
          const isOpen = openUnit === unit.id;
          const unitCompleted = unit.lessons.every(l => kp[l.id]?.completed);
          const unitStarted = unit.lessons.some(l => kp[l.id]?.completed || kp[l.id]?.started);
          // Units are NOT locked anymore (free navigation, since Camila already advanced)
          return (
            <div key={unit.id} className="bg-white rounded-3xl border-2 overflow-hidden transition-all"
              style={{
                borderColor: unitCompleted ? '#10b981' : unitStarted ? c.ink + '60' : '#e7e5e4',
              }}>
              <button onClick={() => setOpenUnit(isOpen ? null : unit.id)}
                className="w-full p-5 flex items-center gap-4 hover:bg-stone-50 transition-colors text-left">
                <div className="font-display text-3xl w-12 text-center" style={{ color: unitCompleted ? '#10b981' : c.ink }}>
                  {unitCompleted ? '✓' : unit.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-stone-500">Unité {unitIdx + 1}</div>
                  <div className="font-display text-lg text-stone-900">{unit.name}</div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {unit.lessons.filter(l => kp[l.id]?.completed).length} / {unit.lessons.length} leçons
                  </div>
                </div>
                <div className="text-stone-400 text-xs">{isOpen ? '▲' : '▼'}</div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-stone-200 pt-3 space-y-2">
                  {unit.lessons.map((lesson, lIdx) => {
                    const lp = kp[lesson.id] || {};
                    const done = lp.completed;
                    const inProgress = lp.started && !done;
                    return (
                      <button key={lesson.id}
                        onClick={() => onPickLesson(lesson)}
                        className="w-full text-left rounded-2xl p-4 flex items-center gap-3 hover:bg-stone-50 active:scale-[0.99] transition-all"
                        style={{
                          background: done ? '#ecfdf5' : inProgress ? c.soft : 'transparent',
                          border: `2px solid ${done ? '#a7f3d0' : inProgress ? c.ink + '60' : '#e7e5e4'}`,
                        }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold shrink-0"
                          style={{
                            background: done ? '#10b981' : c.ink,
                            color: 'white',
                          }}>
                          {done ? '✓' : lIdx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-stone-900 truncate">{lesson.name}</div>
                          <div className="text-xs text-stone-500 mt-0.5 truncate">{lesson.description}</div>
                        </div>
                        <div className="shrink-0 text-xs uppercase tracking-widest" style={{ color: c.strong }}>
                          {done ? 'Refaire' : inProgress ? 'Continuer' : 'Commencer'} →
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

// ============================================================
// PARENT GATE
// ============================================================
function ParentGate({ pin, onSuccess, onBack }) {
  const [entered, setEntered] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    if (entered.length === 4) {
      if (entered === pin) onSuccess();
      else { setError(true); setTimeout(() => { setEntered(''); setError(false); }, 600); }
    }
  }, [entered, pin, onSuccess]);
  return (
    <Paper>
      <div className="max-w-md mx-auto px-6 pt-16 pb-16 min-h-screen flex flex-col">
        <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-900 self-start">← Retour</button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">🔒</div>
          <div className="font-display text-3xl text-stone-900">Accès parent</div>
          <div className="text-sm text-stone-500 mt-2">NIP à 4 chiffres</div>
          <div className={`mt-6 ${error ? 'animate-shake' : ''}`}>
            <PinPad value={entered} onChange={setEntered} />
          </div>
          {error && <div className="text-xs text-rose-700 mt-3">NIP incorrect</div>}
          <div className="mt-6 text-xs text-stone-400">NIP par défaut : 1234</div>
        </div>
      </div>
    </Paper>
  );
}

// ============================================================
// PARENT DASHBOARD
// ============================================================
function ParentDashboard({ config, sessions, progress, onUpdateConfig, onResetProgress, onBack }) {
  const [tab, setTab] = useState('overview');
  return (
    <Paper>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-10 pb-6">
        <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-900 mb-4">← Accueil</button>
        <h1 className="font-display text-3xl sm:text-4xl text-stone-900">Tableau parent</h1>
        <div className="text-xs text-stone-500 mt-1">Méthode Singapour</div>
        <div className="mt-6 flex gap-1 border-b border-stone-300 overflow-x-auto">
          {[
            { id: 'overview', label: "Vue d'ensemble" },
            { id: 'progression', label: 'Progression' },
            { id: 'sessions', label: 'Sessions' },
            { id: 'settings', label: 'Réglages' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${tab === t.id ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}>
              <span>{t.label}</span>
              {tab === t.id && <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-stone-900"></div>}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
        {tab === 'overview' && <OverviewTab config={config} sessions={sessions} progress={progress} />}
        {tab === 'progression' && <ProgressionTab config={config} progress={progress} onResetProgress={onResetProgress} />}
        {tab === 'sessions' && <SessionsTab config={config} sessions={sessions} />}
        {tab === 'settings' && <SettingsTab config={config} onUpdate={onUpdateConfig} />}
      </div>
    </Paper>
  );
}

function OverviewTab({ config, sessions, progress }) {
  const visibleKids = config.kids.filter(k => k.enabled !== false && k.name?.trim());
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleKids.map(kid => {
          const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
          const kSessions = sessions.filter(s => s.kidId === kid.id);
          const kp = progress[kid.id] || {};
          const completed = Object.values(kp).filter(l => l?.completed).length;
          const totalTime = kSessions.reduce((a, s) => a + (s.durationSec || 0), 0);
          const lessons = getLessonsForGrade(kid.grade);
          return (
            <div key={kid.id} className="rounded-3xl p-6 border-2" style={{ background: c.soft, borderColor: c.ink }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-2xl text-white"
                  style={{ background: c.ink }}>{kid.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="font-display text-xl text-stone-900">{kid.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500">
                    {kid.grade === 1 ? '1re' : `${kid.grade}e`} année
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500">Leçons</div>
                  <div className="font-display text-2xl mt-0.5" style={{ color: c.strong }}>{completed}<span className="text-sm opacity-50">/{lessons.length}</span></div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500">Sessions</div>
                  <div className="font-display text-2xl mt-0.5" style={{ color: c.strong }}>{kSessions.length}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500">Temps</div>
                  <div className="font-display text-lg mt-0.5" style={{ color: c.strong }}>{fmtDurLong(totalTime)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressionTab({ config, progress, onResetProgress }) {
  const visibleKids = config.kids.filter(k => k.enabled !== false && k.name?.trim());
  const [selectedKidId, setSelectedKidId] = useState(visibleKids[0]?.id);
  const kid = config.kids.find(k => k.id === selectedKidId);
  if (!kid) return <div className="mt-4 text-stone-500">Aucun enfant configuré</div>;
  const kidColor = KID_COLORS[kid.color] || KID_COLORS.sakura;
  const grade = CURRICULUM.find(g => g.grade === kid.grade);
  const kp = progress[kid.id] || {};

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl border-2 p-4" style={{ background: kidColor.soft, borderColor: kidColor.ink }}>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ color: kidColor.strong }}>
          Choisis l'enfant à consulter
        </div>
        <div className="flex gap-2 flex-wrap">
          {visibleKids.map(k => {
            const c = KID_COLORS[k.color] || KID_COLORS.sakura;
            const isActive = k.id === selectedKidId;
            return (
              <button key={k.id} onClick={() => setSelectedKidId(k.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${isActive ? 'text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'}`}
                style={isActive ? { background: c.ink } : {}}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-display text-base text-white"
                  style={{ background: isActive ? 'rgba(255,255,255,0.25)' : c.ink }}>
                  {k.name.charAt(0).toUpperCase()}
                </div>
                <span>{k.name} · {k.grade === 1 ? '1re' : `${k.grade}e`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {grade ? (
        <div className="space-y-3">
          {grade.units.map(unit => (
            <div key={unit.id} className="bg-white rounded-2xl border-2 border-stone-200 p-4">
              <div className="font-display text-base text-stone-900 mb-2">{unit.icon} {unit.name}</div>
              <div className="space-y-1.5">
                {unit.lessons.map(lesson => {
                  const lp = kp[lesson.id] || {};
                  return (
                    <div key={lesson.id} className="flex items-center gap-3 py-1.5 text-sm">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{
                          background: lp.completed ? '#10b981' : lp.started ? kidColor.ink : '#e7e5e4',
                          color: lp.completed || lp.started ? 'white' : '#78716c',
                        }}>
                        {lp.completed ? '✓' : lp.started ? '·' : ''}
                      </div>
                      <div className="flex-1 text-stone-800">{lesson.name}</div>
                      {lp.bestScore !== undefined && (
                        <div className="text-xs font-mono tabular-nums text-stone-500">
                          {lp.bestScore}/{lp.totalQuestions}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-stone-500 text-sm">Aucun programme disponible.</div>
      )}

      <div className="pt-2">
        <button onClick={() => {
          if (confirm(`Réinitialiser TOUTE la progression de ${kid.name} en Singapour ?`)) {
            onResetProgress(kid.id);
          }
        }}
          className="text-xs text-rose-700 hover:text-rose-900 px-3 py-2 rounded-lg hover:bg-rose-50">
          ↻ Réinitialiser la progression de {kid.name}
        </button>
      </div>
    </div>
  );
}

function SessionsTab({ config, sessions }) {
  if (sessions.length === 0) {
    return <div className="mt-4 rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center text-stone-500 text-sm">Aucune session pour l'instant</div>;
  }
  return (
    <div className="mt-4 space-y-2">
      {sessions.map(s => {
        const kid = config.kids.find(k => k.id === s.kidId);
        const c = kid ? (KID_COLORS[kid.color] || KID_COLORS.sakura) : KID_COLORS.sakura;
        const lesson = findLesson(s.lessonId)?.lesson;
        return (
          <div key={s.id} className="bg-white rounded-2xl border-2 border-stone-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-lg text-white shrink-0"
              style={{ background: c.ink }}>{kid?.name.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-900">{kid?.name} · {lesson?.name || s.lessonId}</div>
              <div className="text-xs text-stone-500 mt-0.5">{fmtDate(s.timestamp)} · {fmtDurLong(s.durationSec)}</div>
            </div>
            {s.practiceTotal !== undefined && (
              <div className="text-right">
                <div className="font-display text-xl tabular-nums" style={{ color: s.isPerfect ? '#10b981' : '#1c1917' }}>
                  {s.practiceCorrect}<span className="text-xs opacity-50">/{s.practiceTotal}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SettingsTab({ config, onUpdate }) {
  const [draft, setDraft] = useState(config);
  const [saved, setSaved] = useState(false);
  const { isSupported: speechSupported, voiceInfo, speak } = useSpeech();

  const save = () => {
    onUpdate(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const updateKid = (idx, field, value) => {
    const kids = [...draft.kids];
    kids[idx] = { ...kids[idx], [field]: value };
    setDraft({ ...draft, kids });
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 p-4 text-sm text-blue-900">
        <b>Profils partagés avec l'app Kumon.</b> Les modifications faites ici (noms, NIP, couleurs) seront visibles dans les deux apps si elles partagent le même domaine.
      </div>

      {/* Speech test */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6">
        <div className="font-display text-lg text-stone-900 mb-3">Lecture vocale</div>
        {speechSupported ? (
          <div>
            <div className="text-sm text-stone-700 mb-3">
              Voix utilisée : <b>{voiceInfo?.name || 'aucune française détectée'}</b>
              {voiceInfo && <span className="text-xs text-stone-500 ml-2">({voiceInfo.lang})</span>}
            </div>
            <Btn variant="soft" size="small" onClick={() => speak("Bonjour ! Je suis prêt à lire les leçons pour toi.", { rate: 0.95 })}>
              🔊 Tester la voix
            </Btn>
          </div>
        ) : (
          <div className="text-sm text-rose-700">
            La lecture vocale n'est pas supportée par ce navigateur.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6">
        <div className="font-display text-lg text-stone-900 mb-4">Enfants</div>
        <div className="space-y-4">
          {draft.kids.map((kid, idx) => {
            const c = KID_COLORS[kid.color] || KID_COLORS.sakura;
            const isGuest = idx === 2;
            const isEnabled = kid.enabled !== false;
            return (
              <div key={kid.id} className="border-2 rounded-xl p-4" style={{ borderColor: c.ink + '40', opacity: !isEnabled && isGuest ? 0.6 : 1 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-widest text-stone-500">
                    {idx === 0 ? 'Enfant 1' : idx === 1 ? 'Enfant 2' : 'Invité'}
                  </div>
                  {isGuest && (
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={isEnabled} onChange={e => updateKid(idx, 'enabled', e.target.checked)} />
                      <span>Actif</span>
                    </label>
                  )}
                </div>
                {(!isGuest || isEnabled) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Prénom</div>
                      <input type="text" value={kid.name} onChange={e => updateKid(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
                    </label>
                    <label className="block">
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Âge</div>
                      <input type="number" min="3" max="18" value={kid.age || ''} onChange={e => updateKid(idx, 'age', parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
                    </label>
                    <label className="block">
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Année scolaire</div>
                      <select value={kid.grade} onChange={e => updateKid(idx, 'grade', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
                        <option value="1">1re année</option>
                        <option value="2">2e année</option>
                        <option value="3">3e année</option>
                      </select>
                    </label>
                    <label className="block">
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Couleur</div>
                      <select value={kid.color} onChange={e => updateKid(idx, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
                        {Object.entries(KID_COLORS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Code enfant (4 chiffres)</div>
                      <input type="text" maxLength="4" value={kid.pin || ''} onChange={e => updateKid(idx, 'pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono" />
                    </label>
                    {/* Speech preferences */}
                    <label className="block sm:col-span-2 pt-3 border-t border-stone-200 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] uppercase tracking-widest text-stone-500">Lecture automatique des consignes</div>
                        <input type="checkbox"
                          checked={kid.speechAutoRead ?? (kid.grade === 1)}
                          onChange={e => updateKid(idx, 'speechAutoRead', e.target.checked)} />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Vitesse de lecture</div>
                      <select value={kid.speechRate ?? (kid.grade === 1 ? 0.85 : 1.0)}
                        onChange={e => updateKid(idx, 'speechRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
                        <option value="0.7">Lente</option>
                        <option value="0.85">Calme</option>
                        <option value="1.0">Normale</option>
                        <option value="1.2">Rapide</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6">
        <div className="font-display text-lg text-stone-900 mb-4">Parent</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Courriel</div>
            <input type="email" value={draft.parentEmail || ''} onChange={e => setDraft({ ...draft, parentEmail: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          </label>
          <label className="block">
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">NIP parent</div>
            <input type="text" maxLength="4" value={draft.parentPin} onChange={e => setDraft({ ...draft, parentPin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono" />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Btn variant="primary" onClick={save}>Enregistrer</Btn>
        {saved && <span className="text-sm text-emerald-700">✓ Enregistré</span>}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT (entry point)
// ============================================================
export default function App() {
  const [screen, setScreen] = useState('home');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeKid, setActiveKid] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [urlKidId] = useState(getKidFromUrl());

  useEffect(() => {
    (async () => {
      const c = await loadConfig();
      const s = await loadAllSessions();
      const p = await loadProgress();
      setConfig(c); setSessions(s); setProgress(p);
      setLoading(false);
    })();
  }, []);

  const handleLessonComplete = async (result) => {
    const session = {
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      kidId: activeKid.id,
      lessonId: result.lessonId,
      durationSec: result.durationSec,
      practiceCorrect: result.practiceCorrect,
      practiceTotal: result.practiceTotal,
      isPerfect: result.isPerfect,
      findingsCount: result.findingsCount,
      timestamp: Date.now(),
    };
    await saveSession(session);
    const newProgress = { ...progress };
    if (!newProgress[activeKid.id]) newProgress[activeKid.id] = {};
    const prev = newProgress[activeKid.id][result.lessonId] || {};
    newProgress[activeKid.id][result.lessonId] = {
      ...prev,
      started: true,
      completed: true,
      lastDuration: result.durationSec,
      bestScore: Math.max(prev.bestScore || 0, result.practiceCorrect || 0),
      totalQuestions: result.practiceTotal,
      completedAt: Date.now(),
    };
    await saveProgress(newProgress);
    setProgress(newProgress);
    const fresh = await loadAllSessions();
    setSessions(fresh);
    setScreen('curriculum');
  };

  const handleUpdateConfig = async (newConfig) => {
    await saveConfig(newConfig);
    setConfig(newConfig);
  };

  const handleResetProgress = async (kidId) => {
    const newProgress = { ...progress };
    delete newProgress[kidId];
    await saveProgress(newProgress);
    setProgress(newProgress);
  };

  if (loading) {
    return (
      <Paper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-display text-2xl text-stone-500 animate-pulse">Chargement…</div>
        </div>
      </Paper>
    );
  }

  const lockedKidId = urlKidId || config.deviceLockedToKid;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Caveat:wght@400;600&display=swap');
        :root {
          --paper: #faf7f2;
          --ink: #1c1917;
        }
        body { background: var(--paper); }
        .font-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; font-feature-settings: 'ss01'; }
        .font-hand { font-family: 'Caveat', cursive; }
        body, button, input, select { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        body::before {
          content: ''; position: fixed; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.018) 1px, transparent 0);
          background-size: 22px 22px; pointer-events: none; z-index: 0;
        }
      `}</style>

      {screen === 'home' && (
        <KidPicker config={config} progress={progress} lockedKidId={lockedKidId}
          onPickKid={k => { setActiveKid(k); setScreen('kidpin'); }}
          onPickParent={() => setScreen('parentgate')} />
      )}
      {screen === 'kidpin' && activeKid && (
        <KidPinGate kid={activeKid}
          onSuccess={() => setScreen('curriculum')}
          onBack={() => { setActiveKid(null); setScreen('home'); }} />
      )}
      {screen === 'curriculum' && activeKid && (
        <CurriculumPath kid={activeKid} progress={progress}
          onPickLesson={(l) => { setActiveLesson(l); setScreen('lesson'); }}
          onBack={() => setScreen('home')} />
      )}
      {screen === 'lesson' && activeKid && activeLesson && (
        <LessonView lesson={activeLesson} kid={activeKid}
          onComplete={handleLessonComplete}
          onExit={() => setScreen('curriculum')} />
      )}
      {screen === 'parentgate' && (
        <ParentGate pin={config.parentPin}
          onSuccess={() => setScreen('parentdash')}
          onBack={() => setScreen('home')} />
      )}
      {screen === 'parentdash' && (
        <ParentDashboard config={config} sessions={sessions} progress={progress}
          onUpdateConfig={handleUpdateConfig}
          onResetProgress={handleResetProgress}
          onBack={() => setScreen('home')} />
      )}
    </>
  );
}

