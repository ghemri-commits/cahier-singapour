// Curriculum MEQ — 4 leçons par niveau, 6 questions chacune (Singapour CPA · Québec)

export const CURRICULUM = {
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
      },
      {
        id: "1-3", title: "Problèmes du quotidien MEQ",
        desc: "Addition et soustraction jusqu'à 10 en contexte", type: "word-problem",
        questions: [
          { q: "Léa a 3 pommes. Sa maman lui en donne 4 de plus. Combien a-t-elle de pommes en tout ?", visual: "🍎🍎🍎 + 🍎🍎🍎🍎", answer: 7, help: "3 + 4 = ? Compte sur tes doigts !" },
          { q: "Il y avait 8 oiseaux sur un fil. 5 s'envolent. Combien en reste-t-il ?", visual: "🐦🐦🐦🐦🐦🐦🐦🐦", answer: 3, help: "8 − 5 = ? Barre 5 oiseaux." },
          { q: "Tom a 2 biscuits et Zoé en a 6. Combien en ont-ils ensemble ?", visual: "🍪🍪 + 🍪🍪🍪🍪🍪🍪", answer: 8, help: "2 + 6 = ?" },
          { q: "Il y a 9 ballons. 4 s'envolent. Combien en reste-t-il ?", visual: "🎈🎈🎈🎈🎈🎈🎈🎈🎈", answer: 5, help: "9 − 4 = ? Compte à rebours." },
          { q: "Mia a 5 crayons. Elle en perd 2. Combien lui en reste-t-il ?", visual: "✏️✏️✏️✏️✏️", answer: 3, help: "5 − 2 = ?" },
          { q: "Dans le panier : 4 oranges et 3 bananes. Combien de fruits au total ?", visual: "🍊🍊🍊🍊 + 🍌🍌🍌", answer: 7, help: "4 + 3 = ? Compte tous les fruits." },
        ]
      },
      {
        id: "1-4", title: "Figures géométriques MEQ",
        desc: "Identifier les formes planes (triangle, carré, rectangle, cercle)", type: "mcq",
        questions: [
          { q: "Cette figure a 3 côtés et 3 coins. Comment s'appelle-t-elle ?", options: [{id:'a',text:'Carré'},{id:'b',text:'Triangle'},{id:'c',text:'Rectangle'},{id:'d',text:'Cercle'}], answer: 'b', help: "Compte les côtés : 3 côtés = triangle." },
          { q: "Cette figure a 4 côtés tous égaux et 4 coins. Comment s'appelle-t-elle ?", options: [{id:'a',text:'Triangle'},{id:'b',text:'Cercle'},{id:'c',text:'Carré'},{id:'d',text:'Rectangle'}], answer: 'c', help: "4 côtés égaux → carré." },
          { q: "Cette figure est ronde et n'a aucun côté ni coin. Comment s'appelle-t-elle ?", options: [{id:'a',text:'Carré'},{id:'b',text:'Triangle'},{id:'c',text:'Rectangle'},{id:'d',text:'Cercle'}], answer: 'd', help: "Pas de coin, pas de côté = cercle." },
          { q: "Cette figure a 4 côtés mais les côtés ne sont pas tous égaux. Comment s'appelle-t-elle ?", options: [{id:'a',text:'Cercle'},{id:'b',text:'Rectangle'},{id:'c',text:'Triangle'},{id:'d',text:'Carré'}], answer: 'b', help: "2 longs côtés + 2 courts côtés = rectangle." },
          { q: "Quelle figure ressemble à une fenêtre avec 4 côtés exactement égaux ?", options: [{id:'a',text:'Carré'},{id:'b',text:'Cercle'},{id:'c',text:'Triangle'},{id:'d',text:'Rectangle'}], answer: 'a', help: "La fenêtre carrée a 4 côtés tous pareils." },
          { q: "Quelle est la forme d'une roue de vélo ?", options: [{id:'a',text:'Triangle'},{id:'b',text:'Rectangle'},{id:'c',text:'Carré'},{id:'d',text:'Cercle'}], answer: 'd', help: "La roue est ronde comme un cercle." },
        ]
      },
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
        desc: "Modéliser les nombres à deux chiffres", type: "base10",
        questions: [
          { q: "Représente le nombre 34 avec les blocs.", target: 34, answer: { tens: 3, ones: 4 }, help: "3 dizaines et 4 unités." },
          { q: "Représente le nombre 52 avec les blocs.", target: 52, answer: { tens: 5, ones: 2 }, help: "5 barres de dix et 2 cubes." },
          { q: "Modélise le nombre 18.", target: 18, answer: { tens: 1, ones: 8 }, help: "1 dizaine et 8 unités." },
          { q: "Représente le nombre 40.", target: 40, answer: { tens: 4, ones: 0 }, help: "4 barres de dizaines seulement." },
          { q: "Modélise le nombre 25.", target: 25, answer: { tens: 2, ones: 5 }, help: "2 dizaines et 5 unités." },
          { q: "Représente le nombre 13.", target: 13, answer: { tens: 1, ones: 3 }, help: "1 barre de dix et 3 cubes." },
        ]
      },
      {
        id: "2-3", title: "L'heure sur l'horloge",
        desc: "Lire les heures et les demi-heures", type: "time-clock",
        questions: [
          { q: "L'aiguille des heures pointe sur le 3 et l'aiguille des minutes pointe sur le 12. Quelle heure est-il ?", hours: 3, minutes: 0, answer: "3:00", help: "Aiguille courte = heures (3), aiguille longue sur 12 = pile → 3 h 00." },
          { q: "L'aiguille des heures est entre le 7 et le 8. L'aiguille des minutes pointe sur le 6. Quelle heure est-il ?", hours: 7, minutes: 30, answer: "7:30", help: "Aiguille longue sur 6 = 30 minutes → 7 h 30." },
          { q: "L'aiguille courte pointe sur le 10 et la longue sur le 12. Quelle heure est-il ?", hours: 10, minutes: 0, answer: "10:00", help: "10 heures pile. La longue sur le 12 = 00 minutes." },
          { q: "L'aiguille courte est entre le 1 et le 2. La longue pointe sur le 6. Quelle heure est-il ?", hours: 1, minutes: 30, answer: "1:30", help: "Entre 1 et 2, longue sur 6 → 1 h 30." },
          { q: "L'aiguille des heures et l'aiguille des minutes pointent toutes les deux sur le 12. Quelle heure est-il ?", hours: 12, minutes: 0, answer: "12:00", help: "Les deux aiguilles sur 12 = midi → 12 h 00." },
          { q: "La petite aiguille est entre le 5 et le 6. La grande aiguille pointe sur le 6. Quelle heure est-il ?", hours: 5, minutes: 30, answer: "5:30", help: "Petite entre 5 et 6, grande sur 6 → 5 h 30." },
        ]
      },
      {
        id: "2-4", title: "Données et diagrammes MEQ",
        desc: "Interpréter un diagramme à bandes simple", type: "mcq",
        questions: [
          { q: "Dans un diagramme, la bande « Chiens » mesure 8 et la bande « Chats » mesure 5. Combien y a-t-il d'animaux en tout ?", options: [{id:'a',text:'10'},{id:'b',text:'13'},{id:'c',text:'15'},{id:'d',text:'8'}], answer: 'b', help: "8 + 5 = 13 animaux au total." },
          { q: "Lundi = 4 absents, Mardi = 2, Mercredi = 6. Quel jour y a-t-il eu le plus d'absences ?", options: [{id:'a',text:'Lundi'},{id:'b',text:'Mardi'},{id:'c',text:'Mercredi'},{id:'d',text:'Jeudi'}], answer: 'c', help: "La barre la plus haute = 6 absences = Mercredi." },
          { q: "Couleurs préférées : Rouge = 7, Bleu = 4, Vert = 3. Combien d'élèves ont voté en tout ?", options: [{id:'a',text:'10'},{id:'b',text:'12'},{id:'c',text:'14'},{id:'d',text:'11'}], answer: 'c', help: "7 + 4 + 3 = 14." },
          { q: "Football = 9, Natation = 6. De combien le football est-il plus populaire ?", options: [{id:'a',text:'2'},{id:'b',text:'4'},{id:'c',text:'3'},{id:'d',text:'15'}], answer: 'c', help: "9 − 6 = 3 élèves de plus." },
          { q: "Pomme = 5, Poire = 5, Banane = 5. Que remarques-tu ?", options: [{id:'a',text:'La pomme est la plus aimée'},{id:'b',text:'Tous les fruits sont également aimés'},{id:'c',text:'La banane est la moins aimée'},{id:'d',text:'La poire est la plus aimée'}], answer: 'b', help: "Toutes les bandes ont la même hauteur (5) = égalité." },
          { q: "Températures : Lundi 18°, Mardi 20°, Mercredi 17°, Jeudi 22°. Quel jour fait-il le plus chaud ?", options: [{id:'a',text:'Lundi'},{id:'b',text:'Mardi'},{id:'c',text:'Mercredi'},{id:'d',text:'Jeudi'}], answer: 'd', help: "22° est la valeur la plus haute → Jeudi." },
        ]
      },
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
      },
      {
        id: "3-3", title: "Division et partage équitable",
        desc: "Diviser en groupes égaux (MEQ)", type: "division",
        questions: [
          { q: "On partage 12 pommes entre 3 enfants également. Combien chaque enfant reçoit-il de pommes ?", total: 12, groups: 3, emoji: "🍎", answer: 4, help: "12 ÷ 3 = ? Distribue 1 pomme à la fois dans chaque groupe." },
          { q: "On répartit 20 biscuits dans 4 assiettes égales. Combien de biscuits dans chaque assiette ?", total: 20, groups: 4, emoji: "🍪", answer: 5, help: "20 ÷ 4 = ? Pense : 4 × ? = 20." },
          { q: "On partage 18 crayons entre 2 élèves également. Combien chacun en reçoit-il ?", total: 18, groups: 2, emoji: "✏️", answer: 9, help: "18 ÷ 2 = ? Divise en deux groupes égaux." },
          { q: "On distribue 24 autocollants à 8 enfants. Même nombre pour chacun. Combien d'autocollants ?", total: 24, groups: 8, emoji: "⭐", answer: 3, help: "24 ÷ 8 = ? Pense à la table de 8." },
          { q: "On partage 15 oranges dans 5 paniers égaux. Combien d'oranges par panier ?", total: 15, groups: 5, emoji: "🍊", answer: 3, help: "15 ÷ 5 = ? Compte par bonds de 5." },
          { q: "On répartit 28 ballons entre 7 enfants également. Combien de ballons par enfant ?", total: 28, groups: 7, emoji: "🎈", answer: 4, help: "28 ÷ 7 = ? Pense : 7 × 4 = 28." },
        ]
      },
      {
        id: "3-4", title: "Périmètre de figures MEQ",
        desc: "Calculer le périmètre de polygones", type: "perimeter",
        questions: [
          { q: "Calcule le périmètre d'un carré dont chaque côté mesure 5 cm.", sides: [5, 5, 5, 5], answer: 20, help: "4 côtés de 5 cm : 5 + 5 + 5 + 5 = 20 cm." },
          { q: "Calcule le périmètre d'un rectangle de 8 cm de long et 3 cm de large.", sides: [8, 3, 8, 3], answer: 22, help: "(8 + 3) × 2 = 22 cm." },
          { q: "Un triangle équilatéral a des côtés de 6 cm. Quel est son périmètre ?", sides: [6, 6, 6], answer: 18, help: "3 côtés de 6 cm : 6 + 6 + 6 = 18 cm." },
          { q: "Calcule le périmètre d'un rectangle de 10 cm de long et 4 cm de large.", sides: [10, 4, 10, 4], answer: 28, help: "(10 + 4) × 2 = 28 cm." },
          { q: "Un carré a des côtés de 7 cm chacun. Quel est son périmètre ?", sides: [7, 7, 7, 7], answer: 28, help: "4 × 7 = 28 cm." },
          { q: "Un triangle a des côtés de 5 cm, 8 cm et 9 cm. Quel est son périmètre ?", sides: [5, 8, 9], answer: 22, help: "5 + 8 + 9 = 22 cm. Additionne tous les côtés." },
        ]
      },
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
      },
      {
        id: "4-3", title: "Nombres décimaux MEQ",
        desc: "Comparer, ordonner et opérer avec les décimaux", type: "decimals",
        questions: [
          { q: "Calcule : 3,4 + 2,5 = ?", answer: 5.9, help: "Aligne les virgules : unités 3+2=5, dixièmes 4+5=9 → 5,9" },
          { q: "Calcule : 8,7 − 3,2 = ?", answer: 5.5, help: "8,7 − 3,2 : soustrais chiffre par chiffre → 5,5" },
          { q: "Quel nombre est le plus grand entre 4,6 et 4,9 ? Écris le plus grand.", answer: 4.9, help: "Même partie entière (4). Compare les dixièmes : 9 > 6. Donc 4,9." },
          { q: "Calcule : 6,0 − 2,4 = ?", answer: 3.6, help: "6,0 − 2,4 : emprunte une unité → 3,6" },
          { q: "Place en ordre croissant et écris le plus petit : 3,7 ; 3,2 ; 3,9 ; 3,4", answer: 3.2, help: "Compare les dixièmes : 2 < 4 < 7 < 9. Le plus petit est 3,2." },
          { q: "Calcule : 5,5 + 1,8 = ?", answer: 7.3, help: "5 + 1 = 6, 0,5 + 0,8 = 1,3. Total : 6 + 1,3 = 7,3." },
        ]
      },
      {
        id: "4-4", title: "Aire et périmètre MEQ",
        desc: "Calculer l'aire et le périmètre de rectangles", type: "area",
        questions: [
          { q: "Un rectangle mesure 6 cm de long et 4 cm de large. Calcule son aire.", w: 6, h: 4, askArea: true, answer: 24, help: "Aire = longueur × largeur = 6 × 4 = 24 cm²." },
          { q: "Un carré a un côté de 5 cm. Calcule son aire.", w: 5, h: 5, askArea: true, answer: 25, help: "Aire = côté × côté = 5 × 5 = 25 cm²." },
          { q: "Un rectangle mesure 9 cm de long et 3 cm de large. Calcule son périmètre.", w: 9, h: 3, askArea: false, answer: 24, help: "Périmètre = (9 + 3) × 2 = 24 cm." },
          { q: "Un rectangle a une aire de 20 cm². Sa largeur est 4 cm. Quelle est sa longueur ?", w: null, h: 4, askArea: true, answer: 5, help: "Aire = L × l → L = 20 ÷ 4 = 5 cm." },
          { q: "Un carré a un périmètre de 32 cm. Quelle est la mesure d'un côté ?", w: null, h: null, askArea: false, answer: 8, help: "Périmètre = 4 × côté → côté = 32 ÷ 4 = 8 cm." },
          { q: "Un rectangle mesure 7 cm × 3 cm. Calcule son aire.", w: 7, h: 3, askArea: true, answer: 21, help: "Aire = 7 × 3 = 21 cm²." },
        ]
      },
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
      },
      {
        id: "5-3", title: "Pourcentages en contexte MEQ",
        desc: "Calculer des pourcentages, rabais et taxes", type: "percentage",
        questions: [
          { q: "Un jeu coûte 40 $. Il est en solde à 25 % de rabais. Quel est le montant du rabais ?", pct: 25, answer: 10, help: "25 % de 40 $ = 40 × 0,25 = 10 $." },
          { q: "Un livre coûte 20 $. La TPS est de 5 %. Combien coûte la taxe ?", pct: 5, answer: 1, help: "5 % de 20 $ = 20 × 0,05 = 1 $." },
          { q: "Dans une classe de 30 élèves, 60 % sont des filles. Combien y a-t-il de filles ?", pct: 60, answer: 18, help: "60 % de 30 = 30 × 0,60 = 18 filles." },
          { q: "Un chandail coûte 50 $. Il est rabaisé de 10 %. Quel est son nouveau prix ?", pct: 10, answer: 45, help: "Rabais = 50 × 0,10 = 5 $. Prix final = 50 − 5 = 45 $." },
          { q: "Une épicerie a vendu 80 produits. 75 % sont des légumes. Combien de légumes ?", pct: 75, answer: 60, help: "75 % de 80 = 80 × 0,75 = 60 légumes." },
          { q: "Un repas coûte 24 $. Le pourboire recommandé est 15 %. Combien de pourboire ?", pct: 15, answer: 3.6, help: "15 % de 24 $ = 24 × 0,15 = 3,60 $." },
        ]
      },
      {
        id: "5-4", title: "Proportions et ratios MEQ",
        desc: "Tables de ratio et taux unitaire", type: "ratios",
        questions: [
          { q: "Si 2 livres coûtent 14 $, combien coûtent 5 livres ?", table: [["Livres","Prix ($)"],["2","14"],["5","?"]], answer: 35, help: "Taux unitaire : 14 ÷ 2 = 7 $/livre. 5 × 7 = 35 $." },
          { q: "Un robinet remplit 3 litres en 6 minutes. Combien remplit-il en 10 minutes ?", table: [["Minutes","Litres"],["6","3"],["10","?"]], answer: 5, help: "Taux : 3 ÷ 6 = 0,5 L/min. 10 × 0,5 = 5 L." },
          { q: "Pour faire 4 gâteaux, il faut 200 g de farine. Quelle quantité pour 10 gâteaux ?", table: [["Gâteaux","Farine (g)"],["4","200"],["10","?"]], answer: 500, help: "Taux : 200 ÷ 4 = 50 g/gâteau. 10 × 50 = 500 g." },
          { q: "Une voiture parcourt 90 km en 1 heure. Combien en 3 heures ?", table: [["Heures","Kilomètres"],["1","90"],["3","?"]], answer: 270, help: "90 km/h × 3 h = 270 km." },
          { q: "Pour 6 personnes, il faut 18 boulettes. Combien pour 4 personnes ?", table: [["Personnes","Boulettes"],["6","18"],["4","?"]], answer: 12, help: "Taux : 18 ÷ 6 = 3 boulettes/personne. 4 × 3 = 12." },
          { q: "Une imprimante produit 15 pages en 3 minutes. Combien en 7 minutes ?", table: [["Minutes","Pages"],["3","15"],["7","?"]], answer: 35, help: "Taux : 15 ÷ 3 = 5 pages/min. 7 × 5 = 35 pages." },
        ]
      },
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
      },
      {
        id: "6-3", title: "C2 : Raisonnement mathématique",
        desc: "Résolution de situations complexes multi-étapes", type: "situation-problem",
        questions: [
          { q: "Une piscine rectangulaire mesure 15 m × 8 m. On veut poser une bordure tout autour. Quelle longueur de bordure faut-il ?", answer: 46, steps: ["Périmètre = (L + l) × 2", "(15 + 8) × 2 = 23 × 2 = 46 m"], help: "Calcule le périmètre du rectangle : (15 + 8) × 2." },
          { q: "Trois amis partagent 375 $ également. Chacun dépense 45 $. Combien reste-t-il à chacun ?", answer: 80, steps: ["Part de chacun : 375 ÷ 3 = 125 $", "Reste : 125 − 45 = 80 $"], help: "Divise d'abord, puis soustrais la dépense." },
          { q: "Un marchand achète des pommes à 0,40 $ chacune et les revend à 0,75 $. Quel profit fait-il sur 120 pommes ?", answer: 42, steps: ["Profit par pomme : 0,75 − 0,40 = 0,35 $", "Profit total : 0,35 × 120 = 42 $"], help: "Trouve le profit unitaire, puis multiplie par la quantité." },
          { q: "Marie a épargné 60 % des 250 $ reçus pour son anniversaire. Combien a-t-elle dépensé ?", answer: 100, steps: ["Épargne : 250 × 0,60 = 150 $", "Dépensé : 250 − 150 = 100 $"], help: "Calcule 60 % pour l'épargne, le reste est la dépense." },
          { q: "Un train avance à 120 km/h. Après 2 h 30 min, quelle distance a-t-il parcourue ?", answer: 300, steps: ["2 h 30 min = 2,5 heures", "Distance = 120 × 2,5 = 300 km"], help: "Convertis les minutes en fraction d'heure, puis distance = vitesse × temps." },
          { q: "Une salle rectangulaire de 12 m × 9 m doit être recouverte de carreaux de 1 m². Combien de carreaux faut-il ?", answer: 108, steps: ["Aire = 12 × 9 = 108 m²", "1 carreau = 1 m² → 108 carreaux"], help: "Calcule l'aire, puis chaque m² = 1 carreau." },
        ]
      },
      {
        id: "6-4", title: "Examen fin d'année MEQ",
        desc: "Situations-problèmes C1 style examen officiel", type: "situation-problem",
        questions: [
          { q: "Mégane veut acheter 3 livres à 12,75 $ chacun. Elle paie avec 50 $. Quelle monnaie reçoit-elle ?", answer: 11.75, steps: ["Total : 3 × 12,75 = 38,25 $", "Monnaie : 50 − 38,25 = 11,75 $"], help: "Multiplie le prix par la quantité, puis soustrais de 50 $." },
          { q: "Une classe de 28 élèves fait une sortie. Les autobus ont 12 places. Combien d'autobus faut-il au minimum ?", answer: 3, steps: ["28 ÷ 12 = 2 reste 4", "Il faut 3 autobus (le 3e pour les 4 restants)"], help: "Divise et arrondis toujours vers le haut si un reste existe." },
          { q: "Une boulangerie produit 120 croissants par jour. Elle en vend 80 % le matin. Combien reste-t-il pour l'après-midi ?", answer: 24, steps: ["Vendus matin : 120 × 0,80 = 96", "Restants : 120 − 96 = 24"], help: "Calcule 80 % de 120, puis soustrais." },
          { q: "Le périmètre d'un carré est 52 cm. Calcule son aire.", answer: 169, steps: ["Côté = 52 ÷ 4 = 13 cm", "Aire = 13 × 13 = 169 cm²"], help: "Trouve le côté avec le périmètre, puis calcule l'aire." },
          { q: "Un magasin affiche un jeu à 85 $ avec 20 % de rabais. Après le rabais, on ajoute 20 % de taxe. Prix final ?", answer: 81.6, steps: ["Prix réduit : 85 × 0,80 = 68 $", "Avec taxe : 68 × 1,20 = 81,60 $"], help: "Applique le rabais d'abord, puis la taxe sur le nouveau prix." },
          { q: "Alexis court 8,5 km par jour. En combien de jours aura-t-il couru 127,5 km en tout ?", answer: 15, steps: ["127,5 ÷ 8,5 = 15 jours"], help: "Divise la distance totale par la distance quotidienne." },
        ]
      },
    ]
  },
};
