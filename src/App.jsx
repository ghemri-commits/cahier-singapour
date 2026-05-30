// ═══════════════════════════════════════════════════════════════
// CAHIER DE MATHÉMATIQUES ÉMILE : MÉTHODE SINGAPOUR (PFEQ Québec)
// Niveaux 1re–6e année · Ardoise · IA Émile · Voix ElevenLabs
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo, useRef } from 'react';

const GEMINI_MODEL = 'gemini-2.5-flash';
const KEY_CONFIG   = 'cahier:config';
const KEY_PROGRESS = 'singapour:progress';

// Lookup table — évite les classes Tailwind dynamiques non-détectées par le purge
const KID_COLORS = {
  emerald: { dot: 'bg-emerald-500', soft: 'bg-emerald-100', border: 'border-emerald-200' },
  blue:    { dot: 'bg-blue-500',    soft: 'bg-blue-100',    border: 'border-blue-200'    },
  purple:  { dot: 'bg-purple-500',  soft: 'bg-purple-100',  border: 'border-purple-200'  },
  amber:   { dot: 'bg-amber-500',   soft: 'bg-amber-100',   border: 'border-amber-200'   },
};

// ═══════════════════════════════════════════════════════════════
// CURRICULUM — 6 exercices par leçon, 6 niveaux
// ═══════════════════════════════════════════════════════════════
const CURRICULUM = {
  1: {
    title: "1re Année (6-7 ans)",
    color: "from-emerald-400 to-teal-500",
    lessons: [
      {
        id: "1-1", title: "Les liens numériques",
        desc: "Décomposer les nombres de 0 à 10 (CPA)", type: "number-bond",
        questions: [
          { q: "Le tout est 8 et une partie est 5. Trouve la partie manquante.", target: 8, part1: 5, part2: null, answer: 3, help: "8 − 5 = ?" },
          { q: "Le tout est 10 et une partie est 6. Trouve la partie manquante.", target: 10, part1: null, part2: 6, answer: 4, help: "10 − 6 = ?" },
          { q: "Le tout est 6 et une partie est 2. Trouve la partie manquante.", target: 6, part1: 2, part2: null, answer: 4, help: "2 pommes + ? = 6 pommes" },
          { q: "Le tout est 9 et une partie est 7. Trouve la partie manquante.", target: 9, part1: null, part2: 7, answer: 2, help: "Compte de 7 jusqu'à 9." },
          { q: "Le tout est 5 et une partie est 1. Trouve la partie manquante.", target: 5, part1: 1, part2: null, answer: 4, help: "5 − 1 = ?" },
          { q: "Le tout est 7 et une partie est 3. Trouve la partie manquante.", target: 7, part1: 3, part2: null, answer: 4, help: "3 billes + ? = 7 billes" },
        ]
      },
      {
        id: "1-2", title: "Monnaie canadienne de base",
        desc: "Compter les pièces de 1 $, 2 $ et sous", type: "money",
        questions: [
          { q: "Dépose des pièces pour faire exactement 5,25 $.", answer: 5.25, help: "2 $ + 2 $ + 1 $ + 25 ¢" },
          { q: "Dépose des pièces pour faire exactement 3,50 $.", answer: 3.50, help: "2 $ + 1 $ + 25 ¢ + 25 ¢" },
          { q: "Dépose des pièces pour faire exactement 2,45 $.", answer: 2.45, help: "1 $ + 1 $ + 25 ¢ + 10 ¢ + 10 ¢" },
          { q: "Dépose des pièces pour faire exactement 6,60 $.", answer: 6.60, help: "2 $ + 2 $ + 2 $ + 25 ¢ + 25 ¢ + 10 ¢" },
          { q: "Dépose des pièces pour faire exactement 4,55 $.", answer: 4.55, help: "2 $ + 1 $ + 1 $ + 25 ¢ + 10 ¢ + 10 ¢ + 10 ¢" },
          { q: "Dépose des pièces pour faire exactement 3,10 $.", answer: 3.10, help: "2 $ + 1 $ + 10 ¢" },
        ]
      }
    ]
  },
  2: {
    title: "2e Année (7-8 ans)",
    color: "from-blue-400 to-indigo-500",
    lessons: [
      {
        id: "2-1", title: "Fractions gourmandes",
        desc: "Demi, tiers et quart en blocs picturaux", type: "fraction",
        questions: [
          { q: "Quelle fraction de la pizza est colorée ?", numerator: 1, denominator: 4, answer: "1/4", help: "Numérateur = morceaux colorés, dénominateur = total." },
          { q: "Quelle fraction est représentée par les parties colorées ?", numerator: 2, denominator: 3, answer: "2/3", help: "3 morceaux au total, 2 sont coloriés." },
          { q: "Identifie la fraction de la zone colorée.", numerator: 1, denominator: 2, answer: "1/2", help: "La moitié est colorée." },
          { q: "Trouve la fraction de ce découpage.", numerator: 3, denominator: 4, answer: "3/4", help: "3 parties sur 4 sont colorées." },
          { q: "Quelle fraction de la figure est colorée ?", numerator: 1, denominator: 3, answer: "1/3", help: "Un tiers est coloré." },
          { q: "Calcule la fraction représentée.", numerator: 2, denominator: 4, answer: "2/4", help: "2 rectangles sur 4 sont colorés." },
        ]
      },
      {
        id: "2-2", title: "Blocs de base 10",
        desc: "Additionner avec retenue visuelle", type: "base10",
        questions: [
          { q: "Représente le nombre 34 avec les blocs.", target: 34, answer: { tens: 3, ones: 4 }, help: "3 dizaines et 4 unités." },
          { q: "Représente le nombre 52 avec les blocs.", target: 52, answer: { tens: 5, ones: 2 }, help: "5 barres de dix et 2 cubes." },
          { q: "Modélise le nombre 18.", target: 18, answer: { tens: 1, ones: 8 }, help: "1 dizaine et 8 unités." },
          { q: "Représente le nombre 40.", target: 40, answer: { tens: 4, ones: 0 }, help: "4 barres de dizaines seulement." },
          { q: "Modélise le nombre 25.", target: 25, answer: { tens: 2, ones: 5 }, help: "2 dizaines et 5 unités." },
          { q: "Représente le nombre 13.", target: 13, answer: { tens: 1, ones: 3 }, help: "1 barre de dix et 3 cubes." },
        ]
      }
    ]
  },
  3: {
    title: "3e Année (8-9 ans)",
    color: "from-purple-400 to-pink-500",
    lessons: [
      {
        id: "3-1", title: "Schéma en barres",
        desc: "Résolution de problèmes Singapour", type: "barmodel",
        questions: [
          { q: "Liam a 12 billes. Camila en a 15 de plus. Combien ont-ils ensemble ?", answer: 39, help: "Camila = 12+15 = 27. Total = 12+27 = ?" },
          { q: "Un boulanger vend 45 muffins le matin et 30 l'après-midi. Total ?", answer: 75, help: "45 + 30 = ?" },
          { q: "Classe de 24 élèves, 14 sont des filles. Combien de garçons ?", answer: 10, help: "24 − 14 = ?" },
          { q: "Chloé a 50 $. Elle achète un livre à 18 $. Combien reste-t-il ?", answer: 32, help: "50 − 18 = ?" },
          { q: "Thomas a 15 voitures. Son frère en a deux fois plus. Total ?", answer: 45, help: "Frère = 15×2 = 30. Total = 15+30." },
          { q: "Un arbre mesurait 120 cm. Il a grandi de 35 cm. Nouvelle hauteur ?", answer: 155, help: "120 + 35 = ?" },
        ]
      },
      {
        id: "3-2", title: "Multiplication par groupes",
        desc: "Comprendre les groupes égaux", type: "multiplication",
        questions: [
          { q: "4 groupes de 3 étoiles. Combien d'étoiles au total ?", groups: 4, size: 3, answer: 12, help: "4 × 3 = ?" },
          { q: "5 sacs de 6 pommes. Total ?", groups: 5, size: 6, answer: 30, help: "5 × 6 = ?" },
          { q: "3 boîtes de 8 crayons. Total ?", groups: 3, size: 8, answer: 24, help: "3 × 8 = ?" },
          { q: "6 groupes de 4 objets. Combien ?", groups: 6, size: 4, answer: 24, help: "6 × 4 = ?" },
          { q: "7 paquets de 5 autocollants. Total ?", groups: 7, size: 5, answer: 35, help: "7 × 5 = ?" },
          { q: "8 enfants reçoivent chacun 2 biscuits. Total ?", groups: 8, size: 2, answer: 16, help: "8 × 2 = ?" },
        ]
      }
    ]
  },
  4: {
    title: "4e Année (9-10 ans)",
    color: "from-amber-400 to-orange-500",
    lessons: [
      {
        id: "4-1", title: "Les Solides de l'espace",
        desc: "Faces, arêtes et sommets (lexique MEQ)", type: "geometry",
        questions: [
          { q: "Combien de faces a un prisme à base triangulaire ?", answer: 5, help: "2 bases triangulaires + 3 faces rectangulaires." },
          { q: "Combien de sommets a une pyramide à base carrée ?", answer: 5, help: "4 coins de la base + 1 apex." },
          { q: "Combien d'arêtes a un cube ?", answer: 12, help: "4 en bas + 4 en haut + 4 verticales." },
          { q: "Combien de faces a un prisme à base rectangulaire ?", answer: 6, help: "Comme une boîte : 6 faces." },
          { q: "Combien de faces a un tétraèdre (pyramide à base triangulaire) ?", answer: 4, help: "1 base + 3 faces triangulaires." },
          { q: "Combien de sommets a un prisme à base triangulaire ?", answer: 6, help: "3 en bas + 3 en haut." },
        ]
      },
      {
        id: "4-2", title: "Fractions équivalentes",
        desc: "Trouver le numérateur manquant", type: "equiv-fraction",
        questions: [
          { q: "Complète : 1/2 = ?/8", answer: 4, help: "2 × 4 = 8 → multiplie aussi le numérateur par 4." },
          { q: "Complète : 3/4 = ?/12", answer: 9, help: "Multiplie le haut et le bas par 3." },
          { q: "Complète : 2/5 = ?/10", answer: 4, help: "Le dénominateur a doublé — double le numérateur." },
          { q: "Complète : 5/6 = ?/18", answer: 15, help: "Multiplie haut et bas par 3." },
          { q: "Complète : 1/3 = ?/9", answer: 3, help: "Dénominateur triplé — triple le numérateur." },
          { q: "Complète : 4/5 = ?/20", answer: 16, help: "Multiplie haut et bas par 4." },
        ]
      }
    ]
  },
  5: {
    title: "5e Année (10-11 ans)",
    color: "from-cyan-400 to-blue-600",
    lessons: [
      {
        id: "5-1", title: "Plan cartésien (1er quadrant)",
        desc: "Lire et placer des coordonnées (x, y)", type: "cartesian",
        questions: [
          { q: "Clique sur le point de coordonnées (3, 4).", targetX: 3, targetY: 4, answer: "3,4", help: "3 vers la droite (X), puis 4 vers le haut (Y)." },
          { q: "Clique sur le point de coordonnées (2, 1).", targetX: 2, targetY: 1, answer: "2,1", help: "2 vers la droite, 1 vers le haut." },
          { q: "Clique sur le point de coordonnées (0, 4).", targetX: 0, targetY: 4, answer: "0,4", help: "Reste sur l'axe vertical à la hauteur 4." },
          { q: "Clique sur le point de coordonnées (4, 2).", targetX: 4, targetY: 2, answer: "4,2", help: "4 vers la droite, 2 vers le haut." },
          { q: "Clique sur le point de coordonnées (1, 3).", targetX: 1, targetY: 3, answer: "1,3", help: "1 vers la droite, 3 vers le haut." },
          { q: "Clique sur le point de coordonnées (3, 0).", targetX: 3, targetY: 0, answer: "3,0", help: "3 vers la droite, reste sur l'axe horizontal." },
        ]
      },
      {
        id: "5-2", title: "Priorité des opérations",
        desc: "PEMDAS avec exposants simples", type: "pemdas",
        questions: [
          { q: "Calcule : 5 + 3 × (2² − 1)", answer: 14, help: "Parenthèses → Exposants (2²=4) → Multiplication → Addition." },
          { q: "Calcule : (10 − 2) ÷ 2 + 3²", answer: 13, help: "Parenthèse (8), exposant (9), division (4), addition (13)." },
          { q: "Calcule : 4 × 5 − 3 × 2", answer: 14, help: "Effectue les deux multiplications avant la soustraction." },
          { q: "Calcule : 2³ + 5 × 2", answer: 18, help: "2³ = 8. Puis 5×2=10. Puis 8+10." },
          { q: "Calcule : (3 + 2) × (8 − 5)", answer: 15, help: "Chaque parenthèse d'abord : 5 × 3." },
          { q: "Calcule : 12 ÷ 3 + 4² ÷ 2", answer: 12, help: "4²=16 ; 12÷3=4 ; 16÷2=8 ; 4+8=12." },
        ]
      }
    ]
  },
  6: {
    title: "6e Année (11-12 ans)",
    color: "from-rose-400 to-red-500",
    lessons: [
      {
        id: "6-1", title: "C1 : La kermesse de l'école",
        desc: "Situation-problème multi-étapes (MEQ)", type: "situation-problem",
        questions: [
          { q: "Jeu à 20 $ avec rabais 15 %, collation à 5 $, taxe 10 %. Coût final ?", answer: 24.2, steps: ["Rabais : 20 × 0.85 = 17 $", "Sous-total : 17 + 5 = 22 $", "Taxe : 22 × 1.10 = 24.20 $"], help: "Étape 1 : rabais. Étape 2 : additionne. Étape 3 : taxe." },
          { q: "Parc 30 m × 20 m. On double la longueur. Nouveau périmètre ?", answer: 160, steps: ["Nouvelle longueur : 30 × 2 = 60 m", "Périmètre : (60 + 20) × 2 = 160 m"], help: "Double la longueur, puis calcule (L+l)×2." },
          { q: "Recette pour 4 personnes : 120 g de sucre. Quantité pour 6 personnes ?", answer: 180, steps: ["Par personne : 120 ÷ 4 = 30 g", "Pour 6 : 30 × 6 = 180 g"], help: "Trouve la quantité unitaire, puis multiplie par 6." },
          { q: "Bibliothèque : 200 livres. 40 % sont des BD. Combien de romans ?", answer: 120, steps: ["Romans : 100 % − 40 % = 60 %", "Calcul : 200 × 0.60 = 120"], help: "Trouve le % de romans et applique au total." },
          { q: "Tirelire : 50 $ au départ, + 15 $/semaine. Total après 10 semaines ?", answer: 200, steps: ["Épargne : 15 × 10 = 150 $", "Total : 150 + 50 = 200 $"], help: "Épargne hebdomadaire × semaines + départ." },
          { q: "Citerne de 500 L fuit à 5 L/h. Heures pour être à moitié vide ?", answer: 50, steps: ["Moitié : 500 ÷ 2 = 250 L", "Temps : 250 ÷ 5 = 50 h"], help: "Calcule la moitié du volume, puis divise par le débit." },
        ]
      },
      {
        id: "6-2", title: "Moyenne et Probabilités",
        desc: "Analyser des ensembles de données", type: "statistics",
        questions: [
          { q: "Moyenne de : 75, 80, 85, 90, 70", answer: 80, help: "Somme (400) ÷ 5 notes." },
          { q: "Sac : 3 rouges, 2 bleues, 5 vertes. Probabilité (%) de piocher une bleue ?", answer: 20, help: "2 bleues ÷ 10 billes = 20 %." },
          { q: "Moyenne des températures : −2, 4, 8, 10", answer: 5, help: "−2+4+8+10 = 20 ; 20÷4 = ?" },
          { q: "Dé à 6 faces. Probabilité (%) d'obtenir un nombre pair ?", answer: 50, help: "3 pairs sur 6 = 50 %." },
          { q: "Moyenne de : 12 kg, 15 kg, 18 kg, 23 kg", answer: 17, help: "Somme = 68 ; 68÷4 = ?" },
          { q: "Sac : 1 noire, 3 blanches. Probabilité (%) de tirer la noire ?", answer: 25, help: "1 sur 4 = 25 %." },
        ]
      }
    ]
  }
};

const SYSTEM_PROMPT_EMILE = `
Tu es "Émile", un tuteur bienveillant expert en mathématiques pour le primaire au Québec.
Tu utilises la méthode Singapour (Concret-Pictural-Abstrait) et le PFEQ.
Règles strictes :
1. NE DONNE JAMAIS LA RÉPONSE NUMÉRIQUE DIRECTEMENT.
2. Guide étape par étape avec des questions de relance.
3. Adapte ton langage à l'âge de l'enfant.
4. Utilise le lexique mathématique officiel du Québec.
5. Encourage en français québécois chaleureux (« Lâche pas ! », « T'es capable ! »).
`;

// ─── Feedback sonore via Web Audio API ────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
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
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ─── Toast notification ───────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-white shadow-xl animate-pop ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {message}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP — composant racine
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('home');
  const [config, setConfig] = useState({
    kids: [
      { id: 'liam',   name: 'Liam',   grade: 1, pin: '1111', color: 'emerald' },
      { id: 'camila', name: 'Camila', grade: 2, pin: '2222', color: 'blue'    },
      { id: 'invite', name: 'Invité', grade: 3, pin: '3333', color: 'purple', active: false }
    ],
    parentPin: '1234',
    elevenLabsApiKey: '',
    elevenLabsVoiceId: 'NW7MRm1Ibz4gwivTc7oV',
    geminiApiKey: ''
  });
  const [activeKid,    setActiveKid]    = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress,     setProgress]     = useState({});
  const [stars,        setStars]        = useState(0);
  const [toast,        setToast]        = useState(null);
  const [scratchpadOpen,  setScratchpadOpen]  = useState(false);
  const [assistantOpen,   setAssistantOpen]   = useState(false);

  useEffect(() => {
    const c = localStorage.getItem(KEY_CONFIG);
    if (c) { try { setConfig(p => ({ ...p, ...JSON.parse(c) })); } catch(e) {} }
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
      } catch(e) { console.warn('ElevenLabs error, fallback TTS'); }
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
              <span className={`w-3.5 h-3.5 rounded-full ${KID_COLORS[activeKid.color]?.dot || 'bg-indigo-500'} shadow-sm`}></span>
              <span className="font-bold text-sm text-slate-700">{activeKid.name} ({activeKid.grade}e)</span>
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
                <button onClick={() => setScratchpadOpen(!scratchpadOpen)} className={`p-3 rounded-2xl flex flex-col items-center transition-all shadow-sm touch-target ${scratchpadOpen ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-600'}`} title="Ardoise">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  <span className="text-[10px] font-bold mt-1">Ardoise</span>
                </button>
                <button onClick={() => setAssistantOpen(!assistantOpen)} className={`p-3 rounded-2xl flex flex-col items-center transition-all shadow-sm touch-target ${assistantOpen ? 'bg-sky-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-600'}`} title="Émile">
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
  const [pinMode, setPinMode]       = useState(false);
  const [selectedKid, setSelectedKid] = useState(null);
  const [pinInput, setPinInput]     = useState('');
  const [error, setError]           = useState(false);

  const activeKids = useMemo(() => config.kids.filter(k => k.active !== false), [config]);

  const handleKidClick = (kid) => { setSelectedKid(kid); setPinInput(''); setError(false); setPinMode(true); };

  const handlePinDigit = (d) => {
    setError(false);
    const val = pinInput + d;
    if (val.length > 4) return;
    setPinInput(val);
    if (val === selectedKid.pin) { setTimeout(() => { onPickKid(selectedKid); setPinMode(false); }, 200); }
    else if (val.length === 4)   { setTimeout(() => { setError(true); setPinInput(''); }, 250); }
  };

  const EMOJI = { liam: '🦁', camila: '🦄' };
  const kidEmoji = (k) => EMOJI[k.id] || '🦊';

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
                    {kidEmoji(k)}
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
            {selectedKid?.id === 'liam' ? '🦁' : selectedKid?.id === 'camila' ? '🦄' : '🦊'}
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
  const gradeData = CURRICULUM[kid.grade || 1];
  const completedCount = gradeData.lessons.filter(l => progress[l.id]?.completed).length;
  const pct = Math.round((completedCount / gradeData.lessons.length) * 100);

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
            return (
              <div key={lesson.id} className={`bg-white rounded-3xl p-5 border shadow-md hover:shadow-lg transition-all flex flex-col justify-between ${done ? 'bg-emerald-50/50 border-emerald-200' : 'border-slate-200/80'}`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase">Leçon {idx + 1}</span>
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
  const canvasRef  = useRef(null);
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
  const [history, setHistory] = useState([
    { role: 'assistant', text: "Bonjour ! Je suis Émile, ton guide de maths du Québec. Comment puis-je t'aider aujourd'hui ?" }
  ]);
  const [loading, setLoading] = useState(false);

  const askEmile = async (prompt) => {
    const text = prompt || query;
    if (!text.trim()) return;
    setHistory(h => [...h, { role: 'user', text }]);
    setQuery('');
    setLoading(true);

    if (!config.geminiApiKey) {
      setHistory(h => [...h, { role: 'assistant', text: "⚠️ Configure ta clé API Gemini dans le panneau Parent pour activer mon IA !" }]);
      setLoading(false);
      return;
    }

    const kidProfile = `Élève : ${activeKid.name}, ${activeKid.grade + 5} ans, ${activeKid.grade}e année au Québec.`;
    const lessonCtx  = activeLesson ? `Leçon : ${activeLesson.title} — ${activeLesson.desc}` : "Aucune leçon active.";
    const fullPrompt = `${kidProfile}\n${lessonCtx}\nQuestion : "${text}"`;

    try {
      let delay = 1000;
      for (let i = 0; i < 5; i++) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${config.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }], systemInstruction: { parts: [{ text: SYSTEM_PROMPT_EMILE }] } })
        });
        if (res.status === 429) { await new Promise(r => setTimeout(r, delay)); delay *= 2; continue; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas compris, peux-tu répéter ?";
        setHistory(h => [...h, { role: 'assistant', text: reply }]);
        speakVoice(reply);
        break;
      }
    } catch(e) {
      setHistory(h => [...h, { role: 'assistant', text: "Oups ! Émile a eu un petit problème. Réessaie !" }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
              {msg.role === 'assistant' && <span className="font-bold block text-xs text-sky-600 mb-1">🦉 ÉMILE</span>}
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
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askEmile()} placeholder="Pose une question à Émile..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <button onClick={() => askEmile()} className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all touch-target">➤</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LESSON VIEW
// ═══════════════════════════════════════════════════════════════
function LessonView({ lesson, onComplete, onExit, speakVoice, setAssistantOpen }) {
  const [qIndex, setQIndex]           = useState(0);
  const [bondsInput, setBondsInput]   = useState('');
  const [moneyItems, setMoneyItems]   = useState([]);
  const [base10, setBase10]           = useState({ tens: 0, ones: 0 });
  const [cartPt, setCartPt]           = useState({ x: 0, y: 0 });
  const [textInput, setTextInput]     = useState('');
  const [result, setResult]           = useState(null); // 'success' | 'error'
  const [showHint, setShowHint]       = useState(false);
  const [shakeKey, setShakeKey]       = useState(0);

  const q = lesson.questions[qIndex];

  useEffect(() => {
    setBondsInput(''); setMoneyItems([]); setBase10({ tens: 0, ones: 0 });
    setCartPt({ x: 0, y: 0 }); setTextInput('');
    setResult(null); setShowHint(false);
  }, [qIndex]);

  const moneyTotal = moneyItems.reduce((s, v) => s + v, 0);

  const verify = () => {
    let ok = false;
    const t = lesson.type;
    if (t === 'number-bond')    ok = parseInt(bondsInput, 10) === q.answer;
    else if (t === 'money')     ok = Math.abs(moneyTotal - q.answer) < 0.005;
    else if (t === 'base10')    ok = base10.tens === q.answer.tens && base10.ones === q.answer.ones;
    else if (t === 'cartesian') ok = `${cartPt.x},${cartPt.y}` === q.answer;
    else if (t === 'fraction')  ok = textInput.trim() === q.answer;
    else                        ok = Math.abs(parseFloat(textInput) - q.answer) < 0.01;

    if (ok) {
      setResult('success');
      playSound('correct');
      speakVoice('Wow ! Bonne réponse ! Quel talent !');
    } else {
      setResult('error');
      setShakeKey(k => k + 1);
      playSound('wrong');
      speakVoice("Ce n'est pas tout à fait ça. Essaie encore ou demande un indice !");
    }
  };

  const next = () => {
    if (qIndex + 1 < lesson.questions.length) setQIndex(i => i + 1);
    else onComplete();
  };

  const pct = Math.round(((qIndex + (result === 'success' ? 1 : 0)) / lesson.questions.length) * 100);

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-md border border-slate-200">
      {/* En-tête + barre de progression */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onExit} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 text-sm touch-target">✕ Quitter</button>
        <div className="flex-1 mx-4">
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
          </div>
          <p className="text-center text-xs text-slate-500 font-semibold mt-1">{qIndex + 1} / {lesson.questions.length}</p>
        </div>
      </div>

      {/* Question */}
      <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl mb-5 border border-slate-150">
        <button onClick={() => speakVoice(q.q)} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md touch-target" title="Écouter">🔊</button>
        <p className="flex-1 text-slate-800 font-extrabold text-lg leading-snug">{q.q}</p>
      </div>

      {/* Zone manipulable */}
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
              {[[2,'2 $','amber-400','yellow-500',12,12],[1,'1 $','slate-300','amber-600',10,10],[0.25,'25 ¢','slate-200','slate-400',9,9],[0.10,'10 ¢','slate-100','slate-300',7,7],[0.05,'5 ¢','slate-50','slate-200',6,6]].map(([val,label,bg1,bd1,w,h]) => (
                <button key={val} onClick={() => setMoneyItems(m => [...m, val])}
                  className={`w-${w+4} h-${h+4} rounded-full bg-${bg1} border-4 border-${bd1} flex items-center justify-center font-bold text-xs text-slate-800 shadow hover:scale-105 transition-all touch-target`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl min-h-[56px] flex flex-wrap gap-2 items-center justify-center">
              {moneyItems.length === 0 ? <span className="text-xs text-slate-400">Dépose tes pièces ici</span> : null}
              {moneyItems.map((v, i) => (
                <div key={i} className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-xs font-bold flex items-center">
                  💵 {v < 1 ? `${Math.round(v*100)} ¢` : `${v} $`}
                  <button onClick={() => setMoneyItems(m => m.filter((_,j) => j !== i))} className="ml-1.5 text-red-500 font-bold">✕</button>
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-sm font-extrabold text-slate-700">Total : </span>
              <span className={`text-lg font-extrabold ${Math.abs(moneyTotal - q.answer) < 0.005 ? 'text-emerald-600' : 'text-indigo-700'}`}>{moneyTotal.toFixed(2)} $</span>
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
            <p className="text-xs font-bold text-slate-400">Écris la fraction au format A/B (ex. 1/4)</p>
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
                {Array.from({ length: q.size }).map((_, s) => (
                  <span key={s} className="text-lg">⭐</span>
                ))}
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
      </div>

      {/* Champ de réponse */}
      {lesson.type === 'number-bond' && (
        <input type="number" placeholder="Nombre manquant…" value={bondsInput} onChange={e => setBondsInput(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-extrabold focus:outline-none focus:border-indigo-500 touch-target mb-4" />
      )}
      {['fraction','barmodel','multiplication','geometry','equiv-fraction','pemdas','situation-problem','statistics'].includes(lesson.type) && (
        <input type="text" placeholder="Écris ta réponse ici…" value={textInput} onChange={e => setTextInput(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-extrabold focus:outline-none focus:border-indigo-500 touch-target mb-4" />
      )}

      {/* Indice rapide */}
      {showHint && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-semibold flex items-start space-x-2">
          <span className="text-lg shrink-0">💡</span><p>{q.help}</p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex space-x-3">
        <button onClick={() => setShowHint(h => !h)} className="flex-1 px-4 py-3 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 touch-target">
          {showHint ? '🔼 Masquer' : '💡 Indice'}
        </button>
        <button onClick={() => setAssistantOpen(true)} className="flex-1 px-4 py-3 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-800 rounded-xl font-bold text-sm touch-target">🦉 Émile</button>
        <button onClick={verify} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md touch-target">Vérifier ✓</button>
      </div>

      {/* Résultat succès */}
      {result === 'success' && (
        <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center animate-pop relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-extrabold text-emerald-800 text-sm">🎉 Superbe réussite !</h4>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Excellent travail, continue comme ça !</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-around pointer-events-none px-8">
            {['⭐','🌟','✨','⭐','🌟'].map((s, i) => (
              <span key={i} className={`text-2xl star-${i}`} style={{ top: '20%' }}>{s}</span>
            ))}
          </div>
          <button onClick={next} className="relative z-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all touch-target">
            {qIndex + 1 < lesson.questions.length ? 'Continuer →' : '🏆 Terminer !'}
          </button>
        </div>
      )}

      {/* Résultat erreur */}
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
    if (v === pin)        { setTimeout(() => onSuccess(), 200); }
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
  const [tab,        setTab]        = useState('progress');
  const [parentPin,  setParentPin]  = useState(config.parentPin || '1234');
  const [kids,       setKids]       = useState(config.kids);
  const [elKey,      setElKey]      = useState(config.elevenLabsApiKey || '');
  const [elVoice,    setElVoice]    = useState(config.elevenLabsVoiceId || 'NW7MRm1Ibz4gwivTc7oV');
  const [geminiKey,  setGeminiKey]  = useState(config.geminiApiKey || '');

  const save = () => onSave({ ...config, kids, parentPin, elevenLabsApiKey: elKey, elevenLabsVoiceId: elVoice, geminiApiKey: geminiKey });

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

        {tab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg">Progression globale</h3>
                <span className="text-2xl font-extrabold text-indigo-600">{completedAll}/{totalLessons}</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${Math.round(completedAll/totalLessons*100)}%` }}></div>
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
                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, Math.round(completedAll/totalLessons*100))}%` }}></div>
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

        {tab === 'config' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            {/* Sécurité */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-lg">Sécurité</h3>
              <div className="max-w-xs space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase">NIP Parent</label>
                <input type="text" maxLength={4} value={parentPin} onChange={e => setParentPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"/>
              </div>
            </div>

            {/* ElevenLabs */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
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
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h3 className="font-extrabold text-lg">Gemini — Tuteur IA Émile</h3>
              <div className="max-w-md space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase">Clé API Gemini</label>
                <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIza…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"/>
                <p className="text-xs text-slate-400 pt-1">Obtenir une clé gratuite sur <span className="font-bold text-indigo-600">aistudio.google.com</span></p>
              </div>
            </div>

            {/* Profils enfants */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-extrabold text-base">Profils des enfants</h3>
              {kids.map(kid => (
                <div key={kid.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{kid.id === 'liam' ? '🦁' : kid.id === 'camila' ? '🦄' : '🦊'}</span>
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-sm">{kid.name}</h5>
                      <p className="text-xs text-slate-500 font-bold">{kid.grade}e Année</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">NIP</label>
                      <input type="text" maxLength={4} value={kid.pin}
                        onChange={e => setKids(ks => ks.map(k => k.id === kid.id ? { ...k, pin: e.target.value } : k))}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono w-20 text-center"/>
                    </div>
                    <button onClick={() => setKids(ks => ks.map(k => k.id === kid.id ? { ...k, active: k.active === false } : k))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${kid.active !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                      {kid.active !== false ? 'Actif' : 'Désactivé'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button onClick={save} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all touch-target">Enregistrer les modifications</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
