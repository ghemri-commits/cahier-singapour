// ═══════════════════════════════════════════════════════════════
// CAHIER DE MATHÉMATIQUES ÉMILE · MÉTHODE SINGAPOUR (PFEQ Québec)
// v3.0 · 6 niveaux · 4 leçons par niveau · IA Émile · ElevenLabs
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CURRICULUM_1_3 } from './curriculum-1-3.js';
import { CURRICULUM_4_6 } from './curriculum-4-6.js';

const CURRICULUM = { ...CURRICULUM_1_3, ...CURRICULUM_4_6 };

const KEY_CONFIG   = 'cahier:config';
const KEY_PROGRESS = 'singapour:progress';

const KID_COLORS = {
  emerald: { dot: 'bg-emerald-500', soft: 'bg-emerald-100', border: 'border-emerald-200' },
  blue:    { dot: 'bg-blue-500',    soft: 'bg-blue-100',    border: 'border-blue-200'    },
  purple:  { dot: 'bg-purple-500',  soft: 'bg-purple-100',  border: 'border-purple-200'  },
  amber:   { dot: 'bg-amber-500',   soft: 'bg-amber-100',   border: 'border-amber-200'   },
  cyan:    { dot: 'bg-cyan-500',    soft: 'bg-cyan-100',    border: 'border-cyan-200'    },
  rose:    { dot: 'bg-rose-500',    soft: 'bg-rose-100',    border: 'border-rose-200'    },
  indigo:  { dot: 'bg-indigo-500',  soft: 'bg-indigo-100',  border: 'border-indigo-200'  },
  orange:  { dot: 'bg-orange-500',  soft: 'bg-orange-100',  border: 'border-orange-200'  },
};

export const AVATARS = ['🦁','🦄','🦊','🐼','🐯','🦋','🐬','🦅','🐉','🦉','🐸','🦒'];

const DEFAULT_CONFIG = {
  kids: [
    { id: 'k1', name: 'Liam',   grade: 1, pin: '1111', color: 'emerald', avatar: '🦁', active: true },
    { id: 'k2', name: 'Camila', grade: 2, pin: '2222', color: 'blue',    avatar: '🦄', active: true },
    { id: 'k3', name: 'Alex',   grade: 1, pin: '3333', color: 'purple',  avatar: '🦊', active: true },
  ],
  parentPin: '1234',
  elevenLabsApiKey: '',
  elevenLabsVoiceId: 'NW7MRm1Ibz4gwivTc7oV',
  geminiApiKey: '',
  geminiModel: 'gemini-3.5-flash',
};

const SYSTEM_PROMPT_EMILE = `Tu es "Émile", un tuteur bienveillant expert en mathématiques pour le primaire au Québec.
Tu utilises la méthode Singapour (Concret-Pictural-Abstrait) et le PFEQ.
Règles strictes :
1. NE DONNE JAMAIS LA RÉPONSE NUMÉRIQUE DIRECTEMENT.
2. Guide étape par étape avec des questions de relance.
3. Adapte ton langage à l'âge de l'enfant.
4. Utilise le lexique mathématique officiel du Québec.
5. Encourage en français québécois chaleureux ("Lâche pas !", "T'es capable !").`;

// ─── Feedback sonore ──────────────────────────────────────────
function playSound(type) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.25);
    }
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-white shadow-xl animate-pop ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {message}
    </div>
  );
}

// ─── Horloge SVG ─────────────────────────────────────────────
function ClockFace({ hours, minutes }) {
  const cx = 90, cy = 90, r = 78;
  const toXY = (angleDeg, len) => ({
    x: cx + len * Math.cos((angleDeg * Math.PI) / 180),
    y: cy + len * Math.sin((angleDeg * Math.PI) / 180),
  });
  const hAngle = ((hours % 12) * 60 + minutes) / 720 * 360 - 90;
  const mAngle = minutes / 60 * 360 - 90;
  const hPt    = toXY(hAngle, 44);
  const mPt    = toXY(mAngle, 62);
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto drop-shadow-md">
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#CBD5E1" strokeWidth="4"/>
      {[...Array(12)].map((_, i) => {
        const a = i / 12 * 360 - 90;
        const p1 = toXY(a, 66); const p2 = toXY(a, r - 2);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94A3B8" strokeWidth={i % 3 === 0 ? 3 : 1.5}/>;
      })}
      {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
        const p = toXY(i / 12 * 360 - 90, 54);
        return <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#475569">{n}</text>;
      })}
      <line x1={cx} y1={cy} x2={hPt.x} y2={hPt.y} stroke="#1E293B" strokeWidth="6" strokeLinecap="round"/>
      <line x1={cx} y1={cy} x2={mPt.x} y2={mPt.y} stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="6" fill="#1E293B"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP — composant racine
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen,        setScreen]        = useState('home');
  const [config,        setConfig]        = useState(DEFAULT_CONFIG);
  const [activeKid,     setActiveKid]     = useState(null);
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [progress,      setProgress]      = useState({});
  const [stars,         setStars]         = useState(0);
  const [toast,         setToast]         = useState(null);
  const [scratchpadOpen,  setScratchpadOpen]  = useState(false);
  const [assistantOpen,   setAssistantOpen]   = useState(false);

  useEffect(() => {
    const c = localStorage.getItem(KEY_CONFIG);
    if (c) { try { setConfig(p => ({ ...DEFAULT_CONFIG, ...JSON.parse(c) })); } catch(e) {} }
    const p = localStorage.getItem(KEY_PROGRESS);
    if (p) {
      try {
        const parsed = JSON.parse(p);
        setProgress(parsed);
        setStars(Object.values(parsed).filter(v => v.completed).length * 10);
      } catch(e) {}
    }
  }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type, key: Date.now() });

  const saveConfig = (newConf) => {
    setConfig(newConf);
    localStorage.setItem(KEY_CONFIG, JSON.stringify(newConf));
    showToast('Paramètres sauvegardés !');
  };

  const speakVoice = async (text) => {
    if (config.elevenLabsApiKey && config.elevenLabsVoiceId) {
      try {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.elevenLabsVoiceId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': config.elevenLabsApiKey },
          body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
        });
        if (!res.ok) throw new Error();
        new Audio(URL.createObjectURL(await res.blob())).play();
        return;
      } catch(e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-CA';
      const v = window.speechSynthesis.getVoices().find(v => v.lang.includes('fr'));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    }
  };

  const handleLessonComplete = (lessonId) => {
    const newProg = { ...progress, [lessonId]: { completed: true, date: new Date().toLocaleDateString('fr-CA') } };
    setProgress(newProg);
    localStorage.setItem(KEY_PROGRESS, JSON.stringify(newProg));
    setStars(s => s + 10);
    setScreen('curriculum');
    playSound('correct');
    speakVoice('Félicitations ! Tu as gagné dix nouvelles étoiles ! Émile est très fier de toi !');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none text-slate-800">
      <style>{`
        .bg-grid-notebook {
          background-image: linear-gradient(to right,rgba(0,100,255,.05) 1px,transparent 1px),
                            linear-gradient(to bottom,rgba(0,100,255,.05) 1px,transparent 1px);
          background-size: 20px 20px;
        }
        .touch-target { min-height:48px; min-width:48px; }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes popIn   { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-70px) scale(.3);opacity:0} }
        .animate-shake { animation:shake .4s ease-in-out; }
        .animate-pop   { animation:popIn .35s cubic-bezier(.34,1.56,.64,1); }
        .star-0 { position:absolute; animation:floatUp 1s .0s ease-out forwards; }
        .star-1 { position:absolute; animation:floatUp 1s .1s ease-out forwards; }
        .star-2 { position:absolute; animation:floatUp 1s .2s ease-out forwards; }
        .star-3 { position:absolute; animation:floatUp 1s .3s ease-out forwards; }
        .star-4 { position:absolute; animation:floatUp 1s .4s ease-out forwards; }
      `}</style>

      {toast && <Toast key={toast.key} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 text-white p-2.5 rounded-2xl shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 to-sky-600 bg-clip-text text-transparent">Cahier de Mathématiques</h1>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Méthode de Singapour · Québec</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {activeKid && (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className={`w-3.5 h-3.5 rounded-full ${KID_COLORS[activeKid.color]?.dot || 'bg-indigo-500'}`}></span>
              <span className="font-bold text-sm text-slate-700">{activeKid.avatar} {activeKid.name} ({activeKid.grade}e)</span>
            </div>
          )}
          <div className="flex items-center bg-amber-100 text-amber-800 font-extrabold px-3.5 py-1.5 rounded-full shadow-sm text-sm border border-amber-200">
            ⭐ <span className="ml-1.5">{stars}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative flex">
        {screen === 'home' && (
          <KidPicker config={config} onPickKid={(kid) => { setActiveKid(kid); setScreen('curriculum'); speakVoice(`Bonjour ${kid.name} ! Prêt pour les maths ?`); }} onPickParent={() => setScreen('parentgate')} />
        )}
        {screen === 'curriculum' && activeKid && (
          <CurriculumPath kid={activeKid} progress={progress} onPickLesson={(lesson) => { setActiveLesson(lesson); setScreen('lesson'); speakVoice(`Commençons : ${lesson.title}`); }} onBack={() => { setActiveKid(null); setScreen('home'); }} />
        )}
        {screen === 'lesson' && activeKid && activeLesson && (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 flex flex-col items-center">
              <LessonView lesson={activeLesson} kid={activeKid} onComplete={() => handleLessonComplete(activeLesson.id)} onExit={() => setScreen('curriculum')} speakVoice={speakVoice} setAssistantOpen={setAssistantOpen} config={config} />
            </div>
            <div className="flex border-l border-slate-200 bg-white">
              <div className="flex flex-col space-y-4 px-2 py-4 border-r border-slate-100 shrink-0 bg-slate-50">
                <button onClick={() => setScratchpadOpen(!scratchpadOpen)} className={`p-3 rounded-2xl flex flex-col items-center transition-all shadow-sm touch-target ${scratchpadOpen ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  <span className="text-[10px] font-bold mt-1">Ardoise</span>
                </button>
                <button onClick={() => setAssistantOpen(!assistantOpen)} className={`p-3 rounded-2xl flex flex-col items-center transition-all shadow-sm touch-target ${assistantOpen ? 'bg-sky-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-600'}`}>
                  <span className="text-xl">🦉</span>
                  <span className="text-[10px] font-bold mt-1">Émile IA</span>
                </button>
              </div>
              {scratchpadOpen && (
                <div className="w-80 md:w-96 flex flex-col bg-white border-r border-slate-200">
                  <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                    <h3 className="font-bold text-indigo-900">📝 Ardoise de calculs</h3>
                    <button onClick={() => setScratchpadOpen(false)} className="text-indigo-900 font-bold p-1 rounded-full text-sm touch-target">✕</button>
                  </div>
                  <div className="flex-1 bg-slate-900 relative"><Scratchpad /></div>
                </div>
              )}
              {assistantOpen && (
                <div className="w-80 md:w-96 flex flex-col bg-white">
                  <div className="p-4 bg-sky-50 border-b border-sky-100 flex justify-between items-center">
                    <h3 className="font-bold text-sky-900">🦉 Ton tuteur Émile</h3>
                    <button onClick={() => setAssistantOpen(false)} className="text-sky-900 font-bold p-1 rounded-full text-sm touch-target">✕</button>
                  </div>
                  <AssistantPanel activeKid={activeKid} activeLesson={activeLesson} speakVoice={speakVoice} config={config} />
                </div>
              )}
            </div>
          </div>
        )}
        {screen === 'parentgate' && <ParentGate pin={config.parentPin || '1234'} onSuccess={() => setScreen('parentdash')} onBack={() => setScreen('home')} />}
        {screen === 'parentdash' && <ParentDashboard config={config} progress={progress} onSave={saveConfig} onBack={() => setScreen('home')} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// KID PICKER
// ═══════════════════════════════════════════════════════════════
function KidPicker({ config, onPickKid, onPickParent }) {
  const [pinMode,      setPinMode]      = useState(false);
  const [selectedKid,  setSelectedKid]  = useState(null);
  const [pinInput,     setPinInput]     = useState('');
  const [error,        setError]        = useState(false);

  const activeKids = useMemo(() => config.kids.filter(k => k.active !== false), [config]);

  const handleKidClick = (kid) => { setSelectedKid(kid); setPinInput(''); setError(false); setPinMode(true); };

  const handlePinDigit = (d) => {
    setError(false);
    const val = pinInput + d;
    if (val.length > 4) return;
    setPinInput(val);
    if (val === selectedKid.pin)    { setTimeout(() => { onPickKid(selectedKid); setPinMode(false); }, 200); }
    else if (val.length === 4)      { setTimeout(() => { setError(true); setPinInput(''); }, 250); }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-grid-notebook">
      {!pinMode ? (
        <div className="max-w-4xl w-full text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Cahier de Mathématiques</h2>
            <p className="text-lg text-slate-600 font-medium">Sélectionne ton profil pour ouvrir ton cahier d'exercices !</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
            {activeKids.map(k => {
              const col = KID_COLORS[k.color] || KID_COLORS.emerald;
              return (
                <button key={k.id} onClick={() => handleKidClick(k)}
                  className="bg-white rounded-3xl p-6 shadow-md border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center space-y-4">
                  <div className={`w-20 h-20 rounded-full ${col.soft} flex items-center justify-center text-4xl shadow-inner border ${col.border}`}>
                    {k.avatar || '🦊'}
                  </div>
                  <div className="text-center">
                    <h3 className="font-extrabold text-xl text-slate-800">{k.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{k.grade}e Année du Primaire</p>
                  </div>
                  <div className="bg-slate-50 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500 border border-slate-100">🔐 NIP Requis</div>
                </button>
              );
            })}
          </div>
          <div className="pt-8 border-t border-slate-200 flex justify-between items-center max-w-xl mx-auto w-full">
            <button onClick={onPickParent} className="px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-sm text-sm touch-target">⚙️ Accès Parent / Réglages</button>
            <p className="text-slate-500 text-sm font-semibold">Méthode Singapour CPA · MEQ</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center border border-slate-100">
          <button onClick={() => setPinMode(false)} className="text-slate-400 hover:text-slate-600 font-bold mb-4 inline-block touch-target text-sm">← Retourner</button>
          <div className={`w-16 h-16 rounded-full ${KID_COLORS[selectedKid?.color]?.soft || 'bg-emerald-100'} flex items-center justify-center text-3xl mx-auto mb-4 border ${KID_COLORS[selectedKid?.color]?.border || 'border-emerald-200'}`}>
            {selectedKid?.avatar || '🦊'}
          </div>
          <h3 className="font-extrabold text-xl text-slate-800 mb-1">Entre ton NIP, {selectedKid?.name}</h3>
          <p className="text-xs font-semibold text-slate-500 mb-6 uppercase tracking-wider">4 chiffres sécurisés</p>
          <div className="flex justify-center space-x-3 mb-6">
            {[0,1,2,3].map(i => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${error ? 'bg-red-500 border-red-500 animate-bounce' : pinInput.length > i ? 'bg-indigo-600 border-indigo-600 scale-110' : 'border-slate-300'}`}></div>
            ))}
          </div>
          {error && <p className="text-red-500 font-bold text-xs mb-4">NIP incorrect, réessaye !</p>}
          <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => handlePinDigit(n.toString())} className="w-16 h-16 bg-slate-50 rounded-2xl font-extrabold text-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200 shadow-sm touch-target">{n}</button>
            ))}
            <button onClick={() => setPinInput('')} className="w-16 h-16 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-xs flex items-center justify-center border border-red-100 shadow-sm touch-target">EFFACER</button>
            <button onClick={() => handlePinDigit('0')} className="w-16 h-16 bg-slate-50 rounded-2xl font-extrabold text-xl hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200 shadow-sm touch-target">0</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CURRICULUM PATH
// ═══════════════════════════════════════════════════════════════
function CurriculumPath({ kid, progress, onPickLesson, onBack }) {
  const gradeData      = CURRICULUM[kid.grade] || CURRICULUM[1];
  const completedCount = gradeData.lessons.filter(l => progress[l.id]?.completed).length;
  const pct            = Math.round((completedCount / gradeData.lessons.length) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-grid-notebook flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <button onClick={onBack} className="mb-6 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center transition-all touch-target">← Changer de profil</button>

        <div className={`p-8 rounded-3xl bg-gradient-to-r ${gradeData.color} text-white shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <div className="space-y-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Programme du MEQ</span>
            <h2 className="text-3xl font-extrabold">{gradeData.title}</h2>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-white/20 h-2.5 rounded-full overflow-hidden max-w-[200px]">
                <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
              </div>
              <span className="text-white/90 text-sm font-bold">{completedCount}/{gradeData.lessons.length} leçons</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-black/10 px-5 py-3 rounded-2xl">
            <span className="text-3xl">🦉</span>
            <div>
              <p className="text-xs font-bold text-white/85 uppercase">Assistant IA</p>
              <p className="text-sm font-extrabold">Émile est actif !</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradeData.lessons.map((lesson, idx) => {
            const done = progress[lesson.id]?.completed || false;
            const isNew = idx >= 2;
            return (
              <div key={lesson.id} className={`bg-white rounded-3xl p-5 border shadow-md hover:shadow-lg transition-all flex flex-col justify-between ${done ? 'bg-emerald-50/50 border-emerald-200' : 'border-slate-200/80'}`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase">Leçon {idx + 1}</span>
                      {isNew && <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">MEQ</span>}
                    </div>
                    {done && <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">✓ Complété</span>}
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-800">{lesson.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{lesson.desc}</p>
                </div>
                <div className="pt-5 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Gain : ⭐ 10 étoiles</span>
                  <button onClick={() => onPickLesson(lesson)} className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all touch-target ${done ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
                    {done ? 'Recommencer' : "C'est parti !"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ARDOISE MAGIQUE (canvas tactile)
// ═══════════════════════════════════════════════════════════════
function Scratchpad() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color,   setColor]   = useState('#10B981');
  const [tool,    setTool]    = useState('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas.parentNode.getBoundingClientRect();
      canvas.width = width; canvas.height = height;
      ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30)  { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  const getXY = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };
  const start = (e) => {
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getXY(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#0F172A' : color;
    setDrawing(true); e.preventDefault();
  };
  const move = (e) => {
    if (!drawing) return;
    const { x, y } = getXY(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y); ctx.stroke(); e.preventDefault();
  };
  const stop = () => setDrawing(false);
  const reset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30)  { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
  };

  const COLORS = [['#10B981','Vert'],['#F59E0B','Jaune'],['#3B82F6','Bleu'],['#F43F5E','Rose']];
  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950">
      <div className="p-3 bg-slate-800 flex justify-between items-center flex-wrap gap-2 shrink-0">
        <div className="flex space-x-1.5">
          {COLORS.map(([c, label]) => (
            <button key={c} onClick={() => { setTool('pencil'); setColor(c); }}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all"
              style={{ background: tool === 'pencil' && color === c ? c : '#334155', color: 'white' }}>
              ✏️ {label}
            </button>
          ))}
          <button onClick={() => setTool('eraser')} className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${tool === 'eraser' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'}`}>🧽 Efface</button>
        </div>
        <button onClick={reset} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-lg touch-target">RESET</button>
      </div>
      <canvas ref={canvasRef} onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={move} onTouchEnd={stop} className="flex-1 cursor-crosshair touch-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ASSISTANT IA ÉMILE
// ═══════════════════════════════════════════════════════════════
function AssistantPanel({ activeKid, activeLesson, speakVoice, config }) {
  const [query,   setQuery]   = useState('');
  const GREETING = "Bonjour ! Je suis Émile, ton guide de maths du Québec. Comment puis-je t'aider aujourd'hui ?";
  const [history, setHistory] = useState([
    { role: 'assistant', text: GREETING }
  ]);
  const [loading, setLoading] = useState(false);

  const speakEmile = (text) => speakVoice(stripMd(text).slice(0, 350));

  useEffect(() => { speakEmile(GREETING); }, []);

  const askEmile = async (prompt) => {
    const text = prompt || query;
    if (!text.trim()) return;
    setHistory(h => [...h, { role: 'user', text }]);
    setQuery('');
    setLoading(true);

    if (!config.geminiApiKey) {
      const msg = "⚠️ Configure ta clé API Gemini dans le panneau Parent pour activer mon IA !";
      setHistory(h => [...h, { role: 'assistant', text: msg }]);
      speakEmile(msg);
      setLoading(false);
      return;
    }

    const model      = config.geminiModel || 'gemini-3.5-flash';
    const kidProfile = `Élève : ${activeKid.name}, ${activeKid.grade + 5} ans, ${activeKid.grade}e année au Québec.`;
    const lessonCtx  = activeLesson ? `Leçon : ${activeLesson.title} — ${activeLesson.desc}` : "Aucune leçon active.";
    const fullPrompt = `${kidProfile}\n${lessonCtx}\nQuestion : "${text}"`;

    try {
      let delay = 1000;
      let replied = false;
      for (let i = 0; i < 5; i++) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }], systemInstruction: { parts: [{ text: SYSTEM_PROMPT_EMILE }] } })
        });
        if (res.status === 429) { await new Promise(r => setTimeout(r, delay)); delay *= 2; continue; }
        if (!res.ok) {
          let googleMsg = '';
          try { googleMsg = (await res.json())?.error?.message || ''; } catch(_) {}
          const label = googleMsg || `HTTP ${res.status}`;
          if (res.status === 403 || res.status === 401) throw new Error(`🔑 Clé API invalide : ${label}`);
          if (res.status === 404) throw new Error(`⚠️ Modèle introuvable : ${label}`);
          throw new Error(`❌ Erreur Gemini : ${label}`);
        }
        const data  = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas compris, peux-tu répéter ?";
        setHistory(h => [...h, { role: 'assistant', text: reply }]);
        speakEmile(reply);
        replied = true;
        break;
      }
      if (!replied) {
        const msg = "Émile est très occupé en ce moment (trop de requêtes). Réessaie dans 30 secondes !";
        setHistory(h => [...h, { role: 'assistant', text: msg }]);
      }
    } catch(e) {
      console.error('Émile error:', e);
      const msg = e.message.startsWith('🔑') || e.message.startsWith('⚠️') || e.message.startsWith('❌')
        ? e.message
        : `🌐 Erreur de connexion : vérifie ton internet ou ta clé Gemini dans le panneau Parent.`;
      setHistory(h => [...h, { role: 'assistant', text: msg }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-sky-600">🦉 ÉMILE</span>
                  <button onClick={() => speakEmile(msg.text)} className="text-sky-400 hover:text-sky-600 text-xs ml-2" title="Écouter">🔊</button>
                </div>
              )}
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 rounded-bl-none shadow-sm flex items-center space-x-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
        <button onClick={() => askEmile("Explique-moi cette leçon avec la méthode Singapour")} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">💡 Explique la méthode</button>
        <button onClick={() => askEmile("Donne-moi un exemple concret sans donner la réponse")} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">🧩 Indice concret</button>
      </div>
      <div className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askEmile()} placeholder="Pose une question à Émile..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-500"/>
        <button onClick={() => askEmile()} className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all touch-target">➤</button>
      </div>
    </div>
  );
}

const SUCCESS_MSGS = [
  'Wow ! Bonne réponse ! Quel talent !',
  'Bravo ! Tu es vraiment fort en maths !',
  'Excellent ! Continue comme ça !',
  'Super ! Tu as tout compris !',
  'Parfait ! Émile est fier de toi !',
  'Incroyable ! Tu es une étoile des maths !',
  'Génial ! Quelle belle réponse !',
  'Magnifique ! Tu progresses très bien !',
  'Ouah ! C\'est exactement ça !',
  'Félicitations ! Tu es imbattable !',
  'C\'est ça ! Tu es un champion des maths !',
  'Époustouflant ! Tu y es arrivé !',
];
const ERROR_MSGS = [
  "Ce n'est pas tout à fait ça. Essaie encore ou demande un indice !",
  "Presque ! Regarde bien l'indice et réessaie.",
  "Oups ! Pas encore, mais tu vas y arriver !",
  "Hmm, ce n'est pas ça. Réfléchis bien et réessaie !",
  "Courage ! La bonne réponse est juste là.",
  "Continue d'essayer ! Tu te rapproches !",
  "Essaie encore ! Chaque erreur t'aide à apprendre.",
  "Pas encore, mais tu peux demander un indice à Émile !",
];
const stripMd = t => t.replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/#+\s/g, '').replace(/`[^`]*`/g, '').trim();
const rndMsg = arr => arr[Math.floor(Math.random() * arr.length)];

// ═══════════════════════════════════════════════════════════════
// LESSON VIEW
// ═══════════════════════════════════════════════════════════════
function LessonView({ lesson, onComplete, onExit, speakVoice, setAssistantOpen }) {
  const [qIndex,     setQIndex]     = useState(0);
  const [bondsInput, setBondsInput] = useState('');
  const [moneyItems, setMoneyItems] = useState([]);
  const [base10,     setBase10]     = useState({ tens: 0, ones: 0 });
  const [cartPt,     setCartPt]     = useState({ x: 0, y: 0 });
  const [textInput,  setTextInput]  = useState('');
  const [result,     setResult]     = useState(null);
  const [showHint,   setShowHint]   = useState(false);
  const [shakeKey,   setShakeKey]   = useState(0);

  const q = lesson.questions[qIndex];

  useEffect(() => {
    setBondsInput(''); setMoneyItems([]); setBase10({ tens: 0, ones: 0 });
    setCartPt({ x: 0, y: 0 }); setTextInput('');
    setResult(null); setShowHint(false);
  }, [qIndex]);

  const moneyTotal = moneyItems.reduce((s, v) => s + v, 0);

  const normTime = (s) => {
    s = s.trim().toLowerCase().replace(/\s/g, '').replace(/h/g, ':');
    const parts = s.split(':');
    if (parts.length !== 2) return s;
    return `${parseInt(parts[0], 10)}:${parts[1].padStart(2, '0')}`;
  };

  const verify = () => {
    let ok = false;
    const t = lesson.type;
    const num = parseFloat(textInput.replace(',', '.'));

    if      (t === 'number-bond') ok = parseInt(bondsInput, 10) === q.answer;
    else if (t === 'money')       ok = Math.abs(moneyTotal - q.answer) < 0.005;
    else if (t === 'base10')      ok = base10.tens === q.answer.tens && base10.ones === q.answer.ones;
    else if (t === 'cartesian')   ok = `${cartPt.x},${cartPt.y}` === q.answer;
    else if (t === 'fraction')    ok = textInput.trim() === q.answer;
    else if (t === 'mcq')         ok = textInput === q.answer;
    else if (t === 'time-clock')  ok = normTime(textInput) === normTime(q.answer);
    else                          ok = Math.abs(num - q.answer) < 0.05;

    if (ok) {
      setResult('success'); playSound('correct');
      speakVoice(rndMsg(SUCCESS_MSGS));
    } else {
      setResult('error'); setShakeKey(k => k + 1); playSound('wrong');
      speakVoice(rndMsg(ERROR_MSGS));
    }
  };

  const next = () => {
    if (qIndex + 1 < lesson.questions.length) setQIndex(i => i + 1);
    else onComplete();
  };

  const pct = Math.round(((qIndex + (result === 'success' ? 1 : 0)) / lesson.questions.length) * 100);

  const TEXT_INPUT_TYPES = ['fraction','barmodel','multiplication','geometry','equiv-fraction',
    'pemdas','situation-problem','statistics','word-problem','time-clock',
    'division','perimeter','area','decimals','percentage','ratios'];

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onExit} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 text-sm touch-target">✕ Quitter</button>
        <div className="flex-1 mx-4">
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
          </div>
          <p className="text-center text-xs text-slate-500 font-semibold mt-1">{qIndex + 1} / {lesson.questions.length}</p>
        </div>
      </div>

      <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl mb-5 border border-slate-100">
        <button onClick={() => speakVoice(q.q)} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md touch-target shrink-0">🔊</button>
        <p className="flex-1 text-slate-800 font-extrabold text-lg leading-snug">{q.q}</p>
      </div>

      {/* ── Zone CPA manipulable ── */}
      <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Manipulables CPA</p>

        {lesson.type === 'number-bond' && (
          <div className="flex justify-center items-center py-4">
            <div className="relative w-64 h-40 flex items-center justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center font-extrabold text-2xl text-indigo-900">{q.target}</div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="128" y1="64" x2="68"  y2="120" stroke="#4F46E5" strokeWidth="3"/>
                <line x1="128" y1="64" x2="188" y2="120" stroke="#4F46E5" strokeWidth="3"/>
              </svg>
              <div className="absolute bottom-0 left-4 w-16 h-16 rounded-full bg-indigo-50 border border-slate-300 flex items-center justify-center font-extrabold text-xl text-slate-700">
                {q.part1 != null ? q.part1 : '?'}
              </div>
              <div className="absolute bottom-0 right-4 w-16 h-16 rounded-full bg-indigo-50 border border-slate-300 flex items-center justify-center font-extrabold text-xl text-slate-700">
                {q.part2 != null ? q.part2 : '?'}
              </div>
            </div>
          </div>
        )}

        {lesson.type === 'money' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {[[2,'2 $'],[1,'1 $'],[0.25,'25 ¢'],[0.10,'10 ¢'],[0.05,'5 ¢']].map(([val, label]) => (
                <button key={val} onClick={() => { setMoneyItems(m => [...m, val]); setResult(null); }}
                  className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center font-bold text-xs text-slate-800 shadow hover:scale-105 transition-all touch-target">
                  {label}
                </button>
              ))}
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl min-h-[64px] flex flex-wrap gap-2 items-center justify-center">
              {moneyItems.length === 0 ? <span className="text-xs text-slate-400">Appuie sur une pièce pour l'ajouter ici</span> : null}
              {moneyItems.map((v, i) => (
                <button key={i}
                  onClick={() => { setMoneyItems(m => m.filter((_,j) => j !== i)); setResult(null); }}
                  className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-3 py-2 text-sm font-bold flex items-center space-x-1 touch-target hover:bg-rose-50 hover:border-rose-400 active:scale-95 transition-all">
                  <span>💵 {v < 1 ? `${Math.round(v * 100)} ¢` : `${v} $`}</span>
                  <span className="text-rose-500 font-extrabold text-base leading-none">✕</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => { setMoneyItems([]); setResult(null); }}
                className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold touch-target">
                🗑️ Tout effacer
              </button>
              <div className="text-center">
                <span className="text-sm font-extrabold text-slate-700">Total : </span>
                <span className={`text-lg font-extrabold ${Math.abs(moneyTotal - q.answer) < 0.005 ? 'text-emerald-600' : 'text-indigo-700'}`}>{moneyTotal.toFixed(2)} $</span>
              </div>
            </div>
          </div>
        )}

        {lesson.type === 'fraction' && (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="flex space-x-2">
              {Array.from({ length: q.denominator }).map((_, i) => (
                <div key={i} className={`w-14 h-14 border-2 border-indigo-600 rounded transition-all ${i < q.numerator ? 'bg-indigo-400' : 'bg-white'}`}/>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400">Écris la fraction au format A/B (ex : 1/4)</p>
          </div>
        )}

        {lesson.type === 'base10' && (
          <div className="space-y-4">
            <div className="flex justify-around items-center bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-center space-y-2">
                <button onClick={() => setBase10(b => ({ ...b, tens: b.tens + 1 }))} className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg font-bold text-xs block w-full touch-target">+ Dizaine</button>
                <button onClick={() => setBase10(b => ({ ...b, tens: Math.max(0, b.tens - 1) }))} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs block w-full touch-target">− Dizaine</button>
              </div>
              <div className="text-center font-extrabold text-3xl text-slate-700">{base10.tens * 10 + base10.ones}</div>
              <div className="text-center space-y-2">
                <button onClick={() => setBase10(b => ({ ...b, ones: b.ones + 1 }))} className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg font-bold text-xs block w-full touch-target">+ Unité</button>
                <button onClick={() => setBase10(b => ({ ...b, ones: Math.max(0, b.ones - 1) }))} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs block w-full touch-target">− Unité</button>
              </div>
            </div>
            <div className="p-4 bg-slate-100 border border-dashed border-slate-300 rounded-xl min-h-[100px] flex flex-wrap gap-3 items-center justify-center">
              {Array.from({ length: base10.tens }).map((_, i) => (
                <div key={`t${i}`} className="w-4 h-20 bg-orange-400 border border-orange-600 rounded flex flex-col justify-between p-0.5">
                  {[...Array(10)].map((_, k) => <div key={k} className="h-1.5 bg-orange-300 border-b border-orange-500"/>)}
                </div>
              ))}
              {Array.from({ length: base10.ones }).map((_, i) => (
                <div key={`o${i}`} className="w-5 h-5 bg-yellow-300 border border-yellow-500 rounded"/>
              ))}
            </div>
          </div>
        )}

        {lesson.type === 'cartesian' && (
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 bg-white border-2 border-slate-300 rounded-lg">
              <div className="absolute inset-0 flex flex-col justify-between p-3">
                {[4,3,2,1,0].map(y => (
                  <div key={y} className="flex justify-between w-full">
                    {[0,1,2,3,4].map(x => (
                      <button key={x} onClick={() => setCartPt({ x, y })}
                        className={`w-8 h-8 rounded-full transition-all flex items-center justify-center font-bold text-sm touch-target ${cartPt.x === x && cartPt.y === y ? 'bg-indigo-600 text-white scale-125 shadow-md' : x === q.targetX && y === q.targetY ? 'bg-amber-100 text-amber-600 text-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-400 text-xs'}`}>
                        {x === q.targetX && y === q.targetY ? '💎' : '·'}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-64 px-3 mt-1">
              {[0,1,2,3,4].map(x => <span key={x} className="text-xs font-bold text-slate-400 w-8 text-center">{x}</span>)}
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2">Sélection : ({cartPt.x}, {cartPt.y})</p>
          </div>
        )}

        {lesson.type === 'multiplication' && q.groups && (
          <div className="flex flex-wrap gap-4 justify-center py-4">
            {Array.from({ length: q.groups }).map((_, g) => (
              <div key={g} className="border-2 border-indigo-200 rounded-xl p-2 flex flex-wrap gap-1">
                {Array.from({ length: q.size }).map((_, s) => <span key={s} className="text-lg">⭐</span>)}
              </div>
            ))}
          </div>
        )}

        {lesson.type === 'situation-problem' && q.steps && (
          <div className="space-y-2">
            {q.steps.map((step, i) => (
              <div key={i} className="flex items-start space-x-3 bg-white p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center shrink-0">{i+1}</span>
                <p className="text-sm text-slate-600 font-medium">{step}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Nouveaux types MEQ ── */}

        {lesson.type === 'word-problem' && (
          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="text-2xl text-center leading-loose bg-white p-4 rounded-2xl border border-slate-200 w-full min-h-[64px] flex items-center justify-center">
              {q.visual}
            </div>
            <p className="text-xs font-bold text-slate-400">Écris ta réponse en chiffre</p>
          </div>
        )}

        {lesson.type === 'mcq' && q.options && (
          <div className="grid grid-cols-2 gap-3 py-2">
            {q.options.map(opt => (
              <button key={opt.id} onClick={() => setTextInput(opt.id)}
                className={`p-3 rounded-2xl text-sm font-bold border-2 transition-all touch-target text-left ${textInput === opt.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`}>
                <span className={`font-extrabold mr-2 ${textInput === opt.id ? 'text-white/70' : 'text-indigo-400'}`}>{opt.id.toUpperCase()}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {lesson.type === 'time-clock' && (
          <div className="flex flex-col items-center space-y-3 py-2">
            <ClockFace hours={q.hours} minutes={q.minutes} />
            <p className="text-xs font-bold text-slate-400">Écris l'heure au format H:MM (ex : 3:00 ou 7:30)</p>
          </div>
        )}

        {lesson.type === 'division' && (
          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="flex flex-wrap gap-1.5 justify-center p-3 bg-white rounded-xl border border-slate-200 max-w-sm">
              {Array.from({ length: q.total }).map((_, i) => <span key={i} className="text-xl">{q.emoji}</span>)}
            </div>
            <p className="text-xs font-bold text-slate-500">À partager équitablement en {q.groups} groupes</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {Array.from({ length: q.groups }).map((_, g) => (
                <div key={g} className="border-2 border-dashed border-indigo-300 bg-indigo-50/50 rounded-xl p-3 min-w-[60px] min-h-[60px] flex items-center justify-center">
                  <span className="text-slate-300 text-xs font-bold">Gr {g+1}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400">Combien {q.emoji} dans chaque groupe ?</p>
          </div>
        )}

        {lesson.type === 'perimeter' && q.sides && (
          <div className="flex flex-col items-center space-y-4 py-2">
            {q.sides.length === 4 ? (
              <div className="relative w-44 h-28 bg-indigo-50 border-4 border-indigo-500 rounded mx-auto mt-8">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-extrabold text-slate-700 bg-white px-1 rounded">{q.sides[0]} cm</span>
                <span className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs font-extrabold text-slate-700 bg-white px-1 rounded">{q.sides[1]} cm</span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-extrabold text-slate-700 bg-white px-1 rounded">{q.sides[2] || q.sides[0]} cm</span>
                <span className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs font-extrabold text-slate-700 bg-white px-1 rounded">{q.sides[3] || q.sides[1]} cm</span>
              </div>
            ) : (
              <div className="space-y-2 w-full max-w-xs">
                {q.sides.map((s, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="flex-1 h-2 bg-indigo-400 rounded"></div>
                    <span className="text-sm font-extrabold text-slate-700 w-16">{s} cm</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs font-bold text-slate-400">Calcule la somme de tous les côtés (réponse en cm)</p>
          </div>
        )}

        {lesson.type === 'area' && (
          <div className="flex flex-col items-center space-y-4 py-2 mt-6">
            <div className="relative inline-block">
              {q.w && q.h ? (
                <div className="bg-indigo-100 border-4 border-indigo-500 rounded" style={{ width: `${Math.min(q.w * 18, 180)}px`, height: `${Math.min(q.h * 18, 144)}px` }}></div>
              ) : (
                <div className="bg-indigo-100 border-4 border-indigo-500 rounded w-36 h-24 flex items-center justify-center">
                  <span className="text-amber-600 font-extrabold text-lg">?</span>
                </div>
              )}
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-extrabold text-slate-700 bg-white px-1 rounded">{q.w ? `${q.w} cm` : '? cm'}</span>
              <span className="absolute top-1/2 -right-14 -translate-y-1/2 text-xs font-extrabold text-slate-700 bg-white px-1 rounded">{q.h ? `${q.h} cm` : '? cm'}</span>
            </div>
            <p className="text-xs font-bold text-slate-400">{q.askArea ? "Calcule l'aire (réponse en cm²)" : "Calcule le périmètre (réponse en cm)"}</p>
          </div>
        )}

        {lesson.type === 'percentage' && (
          <div className="flex flex-col items-center space-y-3 py-2">
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`w-7 h-10 rounded border-2 transition-all ${i < Math.round(q.pct / 10) ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-100 border-slate-300'}`}></div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-600">{q.pct}% de la barre est colorée</p>
            <p className="text-xs font-bold text-slate-400">Écris ta réponse en nombre (ex : 10 ou 3,6)</p>
          </div>
        )}

        {lesson.type === 'ratios' && q.table && (
          <div className="overflow-x-auto py-2">
            <table className="mx-auto border-collapse text-sm">
              <tbody>
                {q.table.map((row, ri) => (
                  <tr key={ri} className={ri === 0 ? 'bg-indigo-100 font-bold' : ri === q.table.length - 1 ? 'bg-amber-50' : 'bg-white'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border-2 border-slate-300 px-5 py-2.5 text-center font-semibold text-slate-700">
                        {cell === '?' ? <span className="text-amber-500 font-extrabold text-xl">?</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Champ de réponse ── */}
      {lesson.type === 'number-bond' && (
        <input type="number" placeholder="Nombre manquant…" value={bondsInput} onChange={e => setBondsInput(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-extrabold focus:outline-none focus:border-indigo-500 touch-target mb-4" />
      )}
      {TEXT_INPUT_TYPES.includes(lesson.type) && (
        <input type="text" placeholder="Écris ta réponse ici…" value={textInput} onChange={e => setTextInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && result !== 'success' && verify()}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-extrabold focus:outline-none focus:border-indigo-500 touch-target mb-4" />
      )}

      {showHint && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-semibold flex items-start space-x-2">
          <span className="text-lg shrink-0">💡</span><p>{q.help}</p>
        </div>
      )}

      <div className="flex space-x-3">
        <button onClick={() => setShowHint(h => !h)} className="flex-1 px-4 py-3 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 touch-target">
          {showHint ? '🔼 Masquer' : '💡 Indice'}
        </button>
        <button onClick={() => setAssistantOpen(true)} className="flex-1 px-4 py-3 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-800 rounded-xl font-bold text-sm touch-target">🦉 Émile</button>
        <button onClick={verify} disabled={result === 'success'} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm shadow-md touch-target">Vérifier ✓</button>
      </div>

      {result === 'success' && (
        <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center animate-pop relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-extrabold text-emerald-800 text-sm">🎉 Superbe réussite !</h4>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Excellent travail, continue comme ça !</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-around pointer-events-none px-8">
            {['⭐','🌟','✨','⭐','🌟'].map((s, i) => <span key={i} className={`text-2xl star-${i}`} style={{ top: '20%' }}>{s}</span>)}
          </div>
          <button onClick={next} className="relative z-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all touch-target">
            {qIndex + 1 < lesson.questions.length ? 'Continuer →' : '🏆 Terminer !'}
          </button>
        </div>
      )}

      {result === 'error' && (
        <div key={shakeKey} className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-shake">
          <h4 className="font-extrabold text-rose-800 text-sm">Pas tout à fait…</h4>
          <p className="text-xs text-rose-600 font-semibold mt-1">Utilise l'ardoise pour poser ton calcul ou clique sur 💡 Indice !</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PARENT GATE
// ═══════════════════════════════════════════════════════════════
function ParentGate({ pin, onSuccess, onBack }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handle = (d) => {
    setError(false);
    const v = input + d;
    if (v.length > 4) return;
    setInput(v);
    if (v === pin)           { setTimeout(() => onSuccess(), 200); }
    else if (v.length === 4) { setTimeout(() => { setError(true); setInput(''); }, 250); }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-grid-notebook p-6">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center border border-slate-100">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold mb-4 inline-block text-sm touch-target">✕ Fermer</button>
        <h3 className="font-extrabold text-xl text-slate-800 mb-1">Espace réservé aux parents</h3>
        <p className="text-xs font-semibold text-slate-500 mb-6 uppercase tracking-wider">NIP parent à 4 chiffres</p>
        <div className="flex justify-center space-x-3 mb-6">
          {[0,1,2,3].map(i => <div key={i} className={`w-4 h-4 rounded-full border-2 ${error ? 'bg-red-500 border-red-500 animate-bounce' : input.length > i ? 'bg-slate-800 border-slate-800' : 'border-slate-300'}`}/>)}
        </div>
        {error && <p className="text-red-500 font-bold text-xs mb-4">NIP parent incorrect.</p>}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => handle(n.toString())} className="w-16 h-16 bg-slate-50 rounded-2xl font-extrabold text-xl hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200 touch-target">{n}</button>
          ))}
          <button onClick={() => setInput('')} className="w-16 h-16 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-xs flex items-center justify-center border border-red-100 touch-target">CLEAR</button>
          <button onClick={() => handle('0')} className="w-16 h-16 bg-slate-50 rounded-2xl font-extrabold text-xl hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200 touch-target">0</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PARENT DASHBOARD
// ═══════════════════════════════════════════════════════════════
function ParentDashboard({ config, progress, onSave, onBack }) {
  const [tab,         setTab]         = useState('progress');
  const [parentPin,   setParentPin]   = useState(config.parentPin || '1234');
  const [kids,        setKids]        = useState(config.kids);
  const [elKey,       setElKey]       = useState(config.elevenLabsApiKey || '');
  const [elVoice,     setElVoice]     = useState(config.elevenLabsVoiceId || 'NW7MRm1Ibz4gwivTc7oV');
  const [geminiKey,   setGeminiKey]   = useState(config.geminiApiKey || '');
  const [geminiModel, setGeminiModel] = useState(config.geminiModel || 'gemini-3.5-flash');

  const save = () => onSave({ ...config, kids, parentPin, elevenLabsApiKey: elKey, elevenLabsVoiceId: elVoice, geminiApiKey: geminiKey, geminiModel });

  const updateKid = (idx, patch) => setKids(ks => ks.map((k, i) => i === idx ? { ...k, ...patch } : k));

  const totalLessons = Object.values(CURRICULUM).reduce((s, g) => s + g.lessons.length, 0);
  const completedAll = Object.values(progress).filter(v => v.completed).length;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm touch-target">← Retour</button>
          <h2 className="text-2xl font-extrabold text-slate-800">Accès Parent · MEQ</h2>
        </div>

        <div className="flex space-x-3 mb-6 bg-slate-200/60 p-1.5 rounded-2xl">
          {[['progress','📊 Progression'],['config','⚙️ Configuration']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/40'}`}>{label}</button>
          ))}
        </div>

        {/* ── Progression ── */}
        {tab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg">Progression globale</h3>
                <span className="text-2xl font-extrabold text-indigo-600">{completedAll}/{totalLessons}</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${Math.round(completedAll / totalLessons * 100)}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <h4 className="font-extrabold text-emerald-800 text-sm mb-1">C1 : Résoudre une situation-problème</h4>
                <p className="text-xs text-emerald-600 font-semibold mb-3">Modélisation multi-étapes.</p>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: progress['6-1']?.completed ? '100%' : '0%' }}></div>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <h4 className="font-extrabold text-indigo-800 text-sm mb-1">C2 : Raisonnement mathématique</h4>
                <p className="text-xs text-indigo-600 font-semibold mb-3">Calculs, géométrie et CPA.</p>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, Math.round(completedAll / totalLessons * 100))}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-base mb-4">Leçons complétées</h3>
              <div className="divide-y divide-slate-100">
                {Object.entries(progress).length === 0 && <p className="text-slate-400 text-sm text-center py-4">Aucune leçon terminée encore.</p>}
                {Object.entries(progress).map(([id, v]) => (
                  <div key={id} className="py-3 flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-700">Leçon {id}</span>
                    <span className="text-slate-500 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">✓ {v.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Configuration ── */}
        {tab === 'config' && (
          <div className="space-y-8">

            {/* Sécurité */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-lg">Sécurité</h3>
              <div className="max-w-xs space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase">NIP Parent</label>
                <input type="text" maxLength={4} value={parentPin} onChange={e => setParentPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"/>
              </div>
            </div>

            {/* ElevenLabs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-lg">ElevenLabs — Voix clonée</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">API Key</label>
                  <input type="password" value={elKey} onChange={e => setElKey(e.target.value)} placeholder="sk-…"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Voice ID</label>
                  <input type="text" value={elVoice} onChange={e => setElVoice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"/>
                </div>
              </div>
            </div>

            {/* Gemini */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg">Gemini — Tuteur IA Émile</h3>
              <div className="max-w-md space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase">Clé API Gemini</label>
                <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIza…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"/>
                <p className="text-xs text-slate-400 pt-1">Obtenir une clé gratuite sur <span className="font-bold text-indigo-600">aistudio.google.com</span></p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Modèle d'IA</label>
                <div className="flex gap-3">
                  {[['gemini-3.5-flash','⚡ Flash 3.5','Rapide et gratuit'],['gemini-3.1-pro','🧠 Pro 3.1','Meilleur raisonnement']].map(([id, label, desc]) => (
                    <button key={id} onClick={() => setGeminiModel(id)}
                      className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${geminiModel === id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                      <p className="font-extrabold text-sm text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profils enfants */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-extrabold text-lg">Profils des enfants</h3>
              {kids.map((kid, idx) => {
                const col = KID_COLORS[kid.color] || KID_COLORS.emerald;
                return (
                  <div key={kid.id} className={`p-5 rounded-2xl border-2 space-y-4 ${col.border} ${col.soft}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{kid.avatar || '🦊'}</span>
                        <span className="font-extrabold text-slate-800">{kid.name} · {kid.grade}e année</span>
                      </div>
                      <button onClick={() => updateKid(idx, { active: !kid.active })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${kid.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                        {kid.active ? 'Actif' : 'Désactivé'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase">Prénom</label>
                        <input type="text" value={kid.name} onChange={e => updateKid(idx, { name: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase">Niveau scolaire</label>
                        <select value={kid.grade} onChange={e => updateKid(idx, { grade: parseInt(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500">
                          {[1,2,3,4,5,6].map(g => <option key={g} value={g}>{g}e Année</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase">NIP (4 chiffres)</label>
                        <input type="text" maxLength={4} value={kid.pin} onChange={e => updateKid(idx, { pin: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-center focus:outline-none focus:border-indigo-500"/>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Avatar</label>
                      <div className="flex flex-wrap gap-2">
                        {AVATARS.map(em => (
                          <button key={em} onClick={() => updateKid(idx, { avatar: em })}
                            className={`w-10 h-10 text-xl rounded-xl border-2 transition-all ${kid.avatar === em ? 'border-indigo-500 bg-indigo-50 scale-110 shadow' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Couleur du profil</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(KID_COLORS).map(([name, cls]) => (
                          <button key={name} onClick={() => updateKid(idx, { color: name })}
                            className={`w-8 h-8 rounded-full border-4 transition-all ${cls.dot} ${kid.color === name ? 'border-slate-800 scale-125 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}/>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button onClick={save} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all touch-target">Enregistrer les modifications ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
