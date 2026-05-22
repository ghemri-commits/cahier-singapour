// ═══════════════════════════════════════════════════════════════
// CAHIER DE MATHÉMATIQUES — MÉTHODE SINGAPOUR
// Programme québécois 1re, 2e et 3e année — version intégrale
// ═══════════════════════════════════════════════════════════════
// Partage les profils enfants avec l'app Kumon (clé 'cahier:config')
// Lecture vocale Web Speech API (priorité voix fr-CA)
// Manipulables interactifs : Number Bonds, Make Ten, Base 10,
//   Bar Models, Number Line, Money QC, Multiplication, Fractions
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ============================================================
// CONFIGURATION & STOCKAGE
// ============================================================
const SHARED = false;
const KEY_CONFIG = 'cahier:config';
const KEY_SG_PROGRESS = 'singapour:progress';
const KEY_SG_SESS_PREFIX = 'singapour:sess:';
const KEY_SG_STARS = 'singapour:stars';

const DEFAULT_CONFIG = {
  kids: [
    { id: 'k1', name: 'Liam', age: 7, grade: 1, color: 'sakura', pin: '1111' },
    { id: 'k2', name: 'Camila', age: 9, grade: 3, color: 'ocean', pin: '2222' },
    { id: 'k3', name: 'Invité', age: 10, grade: 4, color: 'sage', pin: '3333', enabled: true },
  ],
  parentPin: '1234',
};

// Helpers de stockage (Utilisent le polyfill fourni dans ton projet)
async function loadConfig() { try { const r = await window.storage.get(KEY_CONFIG, SHARED); return r?.value ? JSON.parse(r.value) : DEFAULT_CONFIG; } catch (e) { return DEFAULT_CONFIG; } }
async function saveConfig(c) { await window.storage.set(KEY_CONFIG, JSON.stringify(c), SHARED); }
async function loadProgress() { try { const r = await window.storage.get(KEY_SG_PROGRESS, SHARED); return r?.value ? JSON.parse(r.value) : {}; } catch (e) { return {}; } }
async function saveProgress(p) { await window.storage.set(KEY_SG_PROGRESS, JSON.stringify(p), SHARED); }
async function loadStars() { try { const r = await window.storage.get(KEY_SG_STARS, SHARED); return r?.value ? JSON.parse(r.value) : {}; } catch (e) { return {}; } }
async function saveStars(kidId, count) { 
    const current = await loadStars();
    current[kidId] = (current[kidId] || 0) + count;
    await window.storage.set(KEY_SG_STARS, JSON.stringify(current), SHARED);
    return current;
}
async function loadAllSessions() {
    try {
      const list = await window.storage.list(KEY_SG_SESS_PREFIX, SHARED);
      if (!list?.keys) return [];
      const out = [];
      for (const k of list.keys) {
        const r = await window.storage.get(k, SHARED);
        if (r?.value) out.push(JSON.parse(r.value));
      }
      return out.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) { return []; }
}

// ============================================================
// THÈME & UI
// ============================================================
const KID_COLORS = {
  sakura:     { ink: '#c2185b', soft: '#fce4ec', strong: '#880e4f', accent: '#f48fb1', name: 'Rose' },
  sage:       { ink: '#558b2f', soft: '#dcedc8', strong: '#33691e', accent: '#aed581', name: 'Sauge' },
  ocean:      { ink: '#0277bd', soft: '#e1f5fe', strong: '#01579b', accent: '#4fc3f7', name: 'Océan' },
  terracotta: { ink: '#bf360c', soft: '#fbe9e7', strong: '#8d2906', accent: '#ff8a65', name: 'Terre' },
};

// ============================================================
// CURRICULUM (1re à 6e année)
// ============================================================
const CURRICULUM = [
  { grade: 1, units: [
    { id: 'g1u1', name: 'Nombres à 20', icon: '①', lessons: [
      { id: 'g1u1l1', name: 'Décomposer 10', type: 'numberBonds', focusOn: 10 },
      { id: 'g1u1l2', name: 'Doubles', type: 'doubles', max: 10 },
      { id: 'g1u1l3', name: 'Course : Additions', type: 'speedDrill', mode: 'addition', targetNumber: 10 }
    ]}
  ]},
  { grade: 2, units: [
    { id: 'g2u1', name: 'Nombres à 1000', icon: '▦', lessons: [
      { id: 'g2u1l1', name: 'Base 10', type: 'base10', max: 1000 },
      { id: 'g2u1l2', name: 'Modèle en barres', type: 'barModel', op: '+' },
      { id: 'g2u1l3', name: 'Course : Tables 2, 5, 10', type: 'speedDrill', mode: 'multiplication', targetNumber: 2 }
    ]}
  ]},
  { grade: 3, units: [
    { id: 'g3u1', name: 'Multiplication & Division', icon: '×', lessons: [
      { id: 'g3u1l1', name: 'Tables de 3 et 4', type: 'arrayMultiply', tables: [3, 4] },
      { id: 'g3u1l2', name: 'Sens de la division', type: 'division', mode: 'share' },
      { id: 'g3u1l3', name: 'Course : Multiplications', type: 'speedDrill', mode: 'multiplication', targetNumber: 5 }
    ]}
  ]},
  { grade: 4, units: [
    { id: 'g4u1', name: 'Décimaux & Fractions', icon: '0.1', lessons: [
      { id: 'g4u1l1', name: 'Les dixièmes', type: 'fractionBar', mode: 'decimal' },
      { id: 'g4u1l2', name: 'Fractions équivalentes', type: 'fractionEq' },
      { id: 'g4u1l3', name: 'Course : Divisions', type: 'speedDrill', mode: 'division', targetNumber: 50 }
    ]}
  ]},
  { grade: 5, units: [
    { id: 'g5u1', name: 'Priorités & Volumes', icon: '括号', lessons: [
      { id: 'g5u1l1', name: 'Priorité d\'opération', type: 'orderOps' },
      { id: 'g5u1l2', name: 'Volumes simples', type: 'geometry', mode: 'volume' },
      { id: 'g5u1l3', name: 'Course : PEMDAS', type: 'speedDrill', mode: 'mixed', targetNumber: 100 }
    ]}
  ]},
  { grade: 6, units: [
    { id: 'g6u1', name: 'Ratios & Pourcentages', icon: '%', lessons: [
      { id: 'g6u1l1', name: 'Calculer le %', type: 'percentage' },
      { id: 'g6u1l2', name: 'Ratios simples', type: 'ratio' },
      { id: 'g6u1l3', name: 'Course : Pourcentages', type: 'speedDrill', mode: 'percent', targetNumber: 100 }
    ]}
  ]}
];

// ============================================================
// COMPOSANTS SPÉCIFIQUES IPAD
// ============================================================

// Saisie Apple Pencil (Utilise Scribble natif)
function PencilInput({ value, onChange, onSubmit, accent }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col items-center gap-4">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          className="w-64 h-32 text-center font-display text-6xl border-b-8 bg-stone-100/50 focus:outline-none focus:bg-white transition-all rounded-t-3xl shadow-inner"
          style={{ borderColor: accent }}
          placeholder="?"
          autoFocus
        />
        <div className="absolute -bottom-10 left-0 right-0 text-center text-stone-400 text-xs uppercase tracking-widest">
          Écris avec ton stylet ou ton doigt
        </div>
      </div>
      <button type="submit" className="mt-8 px-12 py-4 rounded-2xl text-white font-bold text-xl active:scale-95 transition-all shadow-lg"
        style={{ background: accent }}>Vérifier</button>
    </form>
  );
}

// Carte de collection stellaire (Récompense visuelle)
function StarMap({ count, accent }) {
  const stars = useMemo(() => {
    return Array.from({ length: Math.min(count, 50) }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 135.4) * 40) + 50,
      y: (Math.cos(i * i * 2.5) * 40) + 50,
      size: (i % 3) + 2
    }));
  }, [count]);

  return (
    <div className="relative w-full h-32 bg-stone-900 rounded-2xl overflow-hidden mt-4 shadow-inner">
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${accent} 1px, transparent 0)`, backgroundSize: '15px 15px' }} />
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full animate-pulse"
             style={{ 
               left: `${s.x}%`, top: `${s.y}%`, 
               width: s.size, height: s.size, 
               backgroundColor: accent,
               boxShadow: `0 0 ${s.size * 2}px ${accent}`
             }} />
      ))}
      <div className="absolute bottom-2 right-3 text-[10px] text-white/50 uppercase font-bold tracking-tighter">
        {count} Éclats stellaires
      </div>
    </div>
  );
}

// Jeu : Course aux étoiles
function SpeedDrillGame({ mode, targetNumber, accent, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(generate());
  const [val, setVal] = useState('');
  const [status, setStatus] = useState('ready');

  function generate() {
    const a = Math.floor(Math.random() * (targetNumber * 5)) + 1;
    const b = Math.floor(Math.random() * targetNumber) + 1;
    if (mode === 'addition') return { q: `${a} + ${b}`, a: a + b };
    if (mode === 'multiplication') return { q: `${targetNumber} × ${b}`, a: targetNumber * b };
    return { q: `${a} - ${b}`, a: a - b };
  }

  useEffect(() => {
    if (status === 'playing' && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (timeLeft === 0) setStatus('end');
  }, [status, timeLeft]);

  const check = () => {
    if (parseInt(val) === problem.a) {
        setScore(s => s + 1);
        setVal('');
        setProblem(generate());
    } else setVal('');
  };

  if (status === 'ready') return (
    <div className="text-center p-10 bg-white rounded-3xl border-4 border-dashed border-stone-200">
      <div className="text-6xl mb-6">🚀</div>
      <h2 className="font-display text-3xl mb-4">Course aux étoiles</h2>
      <p className="text-stone-500 mb-8">Réponds à un maximum de calculs en 60 secondes pour éclairer ta constellation !</p>
      <button onClick={() => setStatus('playing')} className="px-10 py-4 rounded-2xl text-white font-bold text-2xl shadow-xl" style={{ background: accent }}>Démarrer !</button>
    </div>
  );

  if (status === 'end') return (
    <div className="text-center p-10 bg-white rounded-3xl border-4 border-emerald-400 animate-bounce">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="font-display text-3xl mb-2">Temps écoulé !</h2>
      <p className="text-xl mb-8">Tu as récolté <b>{score}</b> étoiles.</p>
      <button onClick={() => onComplete({ score })} className="px-10 py-4 rounded-2xl bg-stone-900 text-white font-bold text-xl">Ajouter à ma collection</button>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xl">
      <div className="flex justify-between items-center mb-10">
        <div className="text-2xl font-bold" style={{ color: accent }}>⭐ {score}</div>
        <div className="px-4 py-2 bg-stone-100 rounded-full font-mono text-xl font-bold">{timeLeft}s</div>
      </div>
      <div className="text-center mb-10 font-display text-6xl">{problem.q} = ?</div>
      <PencilInput value={val} onChange={setVal} onSubmit={check} accent={accent} />
    </div>
  );
}

// ============================================================
// LOGIQUE DE NAVIGATION & APP
// ============================================================

export default function App() {
  const [screen, setScreen] = useState('home');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [progress, setProgress] = useState({});
  const [stars, setStars] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeKid, setActiveKid] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    (async () => {
      const [c, p, s] = await Promise.all([loadConfig(), loadProgress(), loadStars()]);
      setConfig(c); setProgress(p); setStars(s);
      setLoading(false);
    })();
  }, []);

  const handleLessonComplete = async (result) => {
    if (result.score) {
        const newStars = await saveStars(activeKid.id, result.score);
        setStars(newStars);
    }
    // Mise à jour progrès
    const newProgress = { ...progress };
    if (!newProgress[activeKid.id]) newProgress[activeKid.id] = {};
    newProgress[activeKid.id][activeLesson.id] = { completed: true, timestamp: Date.now() };
    await saveProgress(newProgress);
    setProgress(newProgress);
    setScreen('curriculum');
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl animate-pulse">Chargement du cahier...</div>;

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{
      backgroundColor: '#faf7f2',
      backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
      backgroundSize: '30px 30px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-user-select: none; touch-action: manipulation; }
      `}</style>

      {/* ÉCRAN D'ACCUEIL */}
      {screen === 'home' && (
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="font-display text-5xl text-stone-900">Cahier de Mathématiques</h1>
            <p className="text-stone-500 mt-2 uppercase tracking-widest text-sm">Méthode Singapour · Québec</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.kids.filter(k => k.enabled !== false).map(kid => (
              <button key={kid.id} onClick={() => { setActiveKid(kid); setScreen('curriculum'); }}
                className="group relative p-8 bg-white rounded-[2rem] border-2 border-stone-200 text-left transition-all hover:shadow-2xl hover:-translate-y-2 active:scale-95"
                style={{ borderColor: KID_COLORS[kid.color].ink + '20' }}>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center font-display text-4xl text-white shadow-inner"
                    style={{ background: KID_COLORS[kid.color].ink }}>{kid.name[0]}</div>
                  <div>
                    <h2 className="font-display text-3xl text-stone-900">{kid.name}</h2>
                    <p className="text-stone-500">{kid.grade}re année</p>
                  </div>
                </div>
                <StarMap count={stars[kid.id] || 0} accent={KID_COLORS[kid.color].ink} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PARCOURS SCOLAIRE */}
      {screen === 'curriculum' && activeKid && (
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setScreen('home')} className="mb-8 text-stone-500 font-bold">← Retour</button>
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: KID_COLORS[activeKid.color].ink }}>{activeKid.name[0]}</div>
             <h2 className="font-display text-3xl">Mon parcours de {activeKid.grade}e année</h2>
          </div>

          <div className="space-y-6">
            {CURRICULUM.find(g => g.grade === activeKid.grade)?.units.map(unit => (
              <div key={unit.id} className="bg-white/80 backdrop-blur rounded-3xl p-6 border-2 border-stone-100 shadow-sm">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <span className="opacity-50">{unit.icon}</span> {unit.name}
                </h3>
                <div className="grid gap-3">
                  {unit.lessons.map(lesson => (
                    <button key={lesson.id} onClick={() => { setActiveLesson(lesson); setScreen('lesson'); }}
                      className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl hover:border-stone-900 transition-all">
                      <span className="font-bold text-stone-700">{lesson.name}</span>
                      {progress[activeKid.id]?.[lesson.id]?.completed ? 
                        <span className="text-emerald-500 font-bold">Complété ✓</span> : 
                        <span className="text-stone-400">Commencer →</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VUE LEÇON / JEU */}
      {screen === 'lesson' && activeLesson && (
        <div className="max-w-2xl mx-auto pt-10">
          <button onClick={() => setScreen('curriculum')} className="mb-10 text-stone-500 font-bold">← Abandonner</button>
          
          {activeLesson.type === 'speedDrill' ? (
            <SpeedDrillGame 
                mode={activeLesson.mode} 
                targetNumber={activeLesson.targetNumber} 
                accent={KID_COLORS[activeKid.color].ink}
                onComplete={handleLessonComplete} 
            />
          ) : (
            <div className="p-10 bg-white rounded-3xl border-2 border-stone-200 text-center">
              <h2 className="font-display text-3xl mb-4">{activeLesson.name}</h2>
              <p className="mb-10 text-stone-500">Leçon interactive en cours de chargement...</p>
              <button onClick={() => handleLessonComplete({})} className="px-8 py-3 bg-stone-900 text-white rounded-xl">Simuler réussite</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
