// Curriculum MEQ — Niveaux 1 à 3 · 8 leçons · 10 questions chacune
export const CURRICULUM_1_3 = {
  1: {
    title: "1re Année (6-7 ans)",
    color: "from-emerald-400 to-teal-500",
    lessons: [
      {
        id:"1-1", title:"Les liens numériques", desc:"Décomposer les nombres de 0 à 10 (CPA)", type:"number-bond",
        questions:[
          {q:"Le tout est 8 et une partie est 5. Trouve la partie manquante.", target:8, part1:5, part2:null, answer:3, help:"8 − 5 = ?"},
          {q:"Le tout est 10 et une partie est 6. Trouve la partie manquante.", target:10, part1:null, part2:6, answer:4, help:"10 − 6 = ?"},
          {q:"Le tout est 6 et une partie est 2. Trouve la partie manquante.", target:6, part1:2, part2:null, answer:4, help:"2 + ? = 6"},
          {q:"Le tout est 9 et une partie est 7. Trouve la partie manquante.", target:9, part1:null, part2:7, answer:2, help:"Compte de 7 jusqu'à 9."},
          {q:"Le tout est 5 et une partie est 1. Trouve la partie manquante.", target:5, part1:1, part2:null, answer:4, help:"5 − 1 = ?"},
          {q:"Le tout est 7 et une partie est 3. Trouve la partie manquante.", target:7, part1:3, part2:null, answer:4, help:"3 + ? = 7"},
          {q:"Le tout est 10 et une partie est 3. Trouve la partie manquante.", target:10, part1:3, part2:null, answer:7, help:"10 − 3 = ?"},
          {q:"Le tout est 4 et une partie est 1. Trouve la partie manquante.", target:4, part1:null, part2:1, answer:3, help:"4 − 1 = ?"},
          {q:"Le tout est 9 et une partie est 4. Trouve la partie manquante.", target:9, part1:4, part2:null, answer:5, help:"4 + ? = 9"},
          {q:"Le tout est 8 et une partie est 2. Trouve la partie manquante.", target:8, part1:null, part2:2, answer:6, help:"8 − 2 = ?"},
        ]
      },
      {
        id:"1-2", title:"Monnaie canadienne de base", desc:"Compter les pièces de 1 $, 2 $ et sous", type:"money",
        questions:[
          {q:"Dépose des pièces pour faire exactement 5,25 $.", answer:5.25, help:"2 $ + 2 $ + 1 $ + 25 ¢"},
          {q:"Dépose des pièces pour faire exactement 3,50 $.", answer:3.50, help:"2 $ + 1 $ + 25 ¢ + 25 ¢"},
          {q:"Dépose des pièces pour faire exactement 2,45 $.", answer:2.45, help:"1 $ + 1 $ + 25 ¢ + 10 ¢ + 10 ¢"},
          {q:"Dépose des pièces pour faire exactement 6,60 $.", answer:6.60, help:"2 $ + 2 $ + 2 $ + 25 ¢ + 25 ¢ + 10 ¢"},
          {q:"Dépose des pièces pour faire exactement 4,55 $.", answer:4.55, help:"2 $ + 1 $ + 1 $ + 25 ¢ + 10 ¢ + 10 ¢ + 10 ¢"},
          {q:"Dépose des pièces pour faire exactement 3,10 $.", answer:3.10, help:"2 $ + 1 $ + 10 ¢"},
          {q:"Dépose des pièces pour faire exactement 1,75 $.", answer:1.75, help:"1 $ + 25 ¢ + 25 ¢ + 25 ¢"},
          {q:"Dépose des pièces pour faire exactement 2,05 $.", answer:2.05, help:"2 $ + 5 ¢"},
          {q:"Dépose des pièces pour faire exactement 4,30 $.", answer:4.30, help:"2 $ + 2 $ + 25 ¢ + 5 ¢"},
          {q:"Dépose des pièces pour faire exactement 5,00 $.", answer:5.00, help:"2 $ + 2 $ + 1 $"},
        ]
      },
      {
        id:"1-3", title:"Problèmes du quotidien MEQ", desc:"Addition et soustraction jusqu'à 10 en contexte", type:"word-problem",
        questions:[
          {q:"Léa a 3 pommes. Sa maman lui en donne 4 de plus. Combien a-t-elle de pommes en tout ?", visual:"🍎🍎🍎 + 🍎🍎🍎🍎", answer:7, help:"3 + 4 = ?"},
          {q:"Il y avait 8 oiseaux sur un fil. 5 s'envolent. Combien en reste-t-il ?", visual:"🐦🐦🐦🐦🐦🐦🐦🐦", answer:3, help:"8 − 5 = ?"},
          {q:"Tom a 2 biscuits et Zoé en a 6. Combien en ont-ils ensemble ?", visual:"🍪🍪 + 🍪🍪🍪🍪🍪🍪", answer:8, help:"2 + 6 = ?"},
          {q:"Il y a 9 ballons. 4 s'envolent. Combien en reste-t-il ?", visual:"🎈🎈🎈🎈🎈🎈🎈🎈🎈", answer:5, help:"9 − 4 = ?"},
          {q:"Mia a 5 crayons. Elle en perd 2. Combien lui en reste-t-il ?", visual:"✏️✏️✏️✏️✏️", answer:3, help:"5 − 2 = ?"},
          {q:"Dans le panier : 4 oranges et 3 bananes. Combien de fruits au total ?", visual:"🍊🍊🍊🍊 + 🍌🍌🍌", answer:7, help:"4 + 3 = ?"},
          {q:"Il y avait 10 œufs. On en casse 3. Combien reste-t-il ?", visual:"🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚", answer:7, help:"10 − 3 = ?"},
          {q:"Sam a 1 ballon rouge et 6 ballons bleus. Combien de ballons au total ?", visual:"🔴 + 🔵🔵🔵🔵🔵🔵", answer:7, help:"1 + 6 = ?"},
          {q:"Il y a 6 fleurs dans le vase. On en ajoute 4. Combien y en a-t-il maintenant ?", visual:"🌸🌸🌸🌸🌸🌸 + 🌸🌸🌸🌸", answer:10, help:"6 + 4 = ?"},
          {q:"Une boîte a 10 chocolats. On en mange 7. Combien en reste-t-il ?", visual:"🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫", answer:3, help:"10 − 7 = ?"},
        ]
      },
      {
        id:"1-4", title:"Figures géométriques MEQ", desc:"Identifier les formes planes", type:"mcq",
        questions:[
          {q:"Cette figure a 3 côtés et 3 coins. Comment s'appelle-t-elle ?", options:[{id:'a',text:'Carré'},{id:'b',text:'Triangle'},{id:'c',text:'Rectangle'},{id:'d',text:'Cercle'}], answer:'b', help:"3 côtés = triangle."},
          {q:"Cette figure a 4 côtés tous égaux et 4 coins. Comment s'appelle-t-elle ?", options:[{id:'a',text:'Triangle'},{id:'b',text:'Cercle'},{id:'c',text:'Carré'},{id:'d',text:'Rectangle'}], answer:'c', help:"4 côtés égaux → carré."},
          {q:"Cette figure est ronde et n'a aucun côté ni coin. Comment s'appelle-t-elle ?", options:[{id:'a',text:'Carré'},{id:'b',text:'Triangle'},{id:'c',text:'Rectangle'},{id:'d',text:'Cercle'}], answer:'d', help:"Pas de coin = cercle."},
          {q:"Cette figure a 4 côtés dont 2 longs et 2 courts. Comment s'appelle-t-elle ?", options:[{id:'a',text:'Cercle'},{id:'b',text:'Rectangle'},{id:'c',text:'Triangle'},{id:'d',text:'Carré'}], answer:'b', help:"2 longs + 2 courts = rectangle."},
          {q:"Quelle est la forme d'une roue de vélo ?", options:[{id:'a',text:'Triangle'},{id:'b',text:'Rectangle'},{id:'c',text:'Carré'},{id:'d',text:'Cercle'}], answer:'d', help:"La roue est ronde comme un cercle."},
          {q:"Combien de côtés a un triangle ?", options:[{id:'a',text:'2'},{id:'b',text:'3'},{id:'c',text:'4'},{id:'d',text:'5'}], answer:'b', help:"Tri = 3. Triangle = 3 côtés."},
          {q:"Quelle figure ressemble à la forme d'un terrain de basketball vu d'en haut ?", options:[{id:'a',text:'Cercle'},{id:'b',text:'Triangle'},{id:'c',text:'Rectangle'},{id:'d',text:'Carré'}], answer:'c', help:"Long et large, 4 côtés = rectangle."},
          {q:"Combien de coins a un carré ?", options:[{id:'a',text:'2'},{id:'b',text:'3'},{id:'c',text:'4'},{id:'d',text:'0'}], answer:'c', help:"Un carré a 4 coins."},
          {q:"Quelle figure n'a aucun coin ?", options:[{id:'a',text:'Carré'},{id:'b',text:'Triangle'},{id:'c',text:'Rectangle'},{id:'d',text:'Cercle'}], answer:'d', help:"Le cercle est rond, il n'a aucun coin."},
          {q:"Une pizza entière ressemble à quelle figure ?", options:[{id:'a',text:'Triangle'},{id:'b',text:'Carré'},{id:'c',text:'Cercle'},{id:'d',text:'Rectangle'}], answer:'c', help:"La pizza est ronde = cercle."},
        ]
      },
      {
        id:"1-5", title:"Doubles et suites", desc:"Reconnaître les doubles et compléter une suite", type:"word-problem",
        questions:[
          {q:"Le double de 3, c'est combien ? (3 + 3)", visual:"⭐⭐⭐ + ⭐⭐⭐", answer:6, help:"3 + 3 = ?"},
          {q:"Le double de 4, c'est combien ? (4 + 4)", visual:"🍎🍎🍎🍎 + 🍎🍎🍎🍎", answer:8, help:"4 + 4 = ?"},
          {q:"Le double de 5, c'est combien ? (5 + 5)", visual:"🐦🐦🐦🐦🐦 + 🐦🐦🐦🐦🐦", answer:10, help:"5 + 5 = 10"},
          {q:"Le double de 2, c'est combien ?", visual:"🌸🌸 + 🌸🌸", answer:4, help:"2 + 2 = ?"},
          {q:"Le double de 1, c'est combien ?", visual:"🍪 + 🍪", answer:2, help:"1 + 1 = ?"},
          {q:"La suite : 1, 2, 3, 4, … Quel est le nombre suivant ?", visual:"1️⃣ 2️⃣ 3️⃣ 4️⃣ ❓", answer:5, help:"On ajoute 1 à chaque fois."},
          {q:"La suite : 2, 4, 6, 8, … Quel est le nombre suivant ?", visual:"2️⃣ 4️⃣ 6️⃣ 8️⃣ ❓", answer:10, help:"On compte de 2 en 2."},
          {q:"La suite : 5, 6, 7, … Quel est le nombre suivant ?", visual:"5️⃣ 6️⃣ 7️⃣ ❓", answer:8, help:"On ajoute 1."},
          {q:"La suite : 10, 9, 8, 7, … Quel est le nombre suivant ?", visual:"🔟 9️⃣ 8️⃣ 7️⃣ ❓", answer:6, help:"On enlève 1 à chaque fois."},
          {q:"La suite : 0, 2, 4, 6, … Quel est le nombre suivant ?", visual:"0️⃣ 2️⃣ 4️⃣ 6️⃣ ❓", answer:8, help:"On compte de 2 en 2."},
        ]
      },
      {
        id:"1-6", title:"Comparer les nombres MEQ", desc:"Ordonner et comparer les nombres de 0 à 20", type:"mcq",
        questions:[
          {q:"Quel nombre est le plus grand : 7 ou 9 ?", options:[{id:'a',text:'7'},{id:'b',text:'9'},{id:'c',text:'Égaux'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"9 est après 7 sur la droite numérique."},
          {q:"Quel nombre est le plus petit : 5 ou 3 ?", options:[{id:'a',text:'5'},{id:'b',text:'3'},{id:'c',text:'Égaux'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"3 est avant 5 sur la droite numérique."},
          {q:"Mets ces nombres en ordre du plus petit au plus grand : 4, 1, 7. Quel est le plus petit ?", options:[{id:'a',text:'4'},{id:'b',text:'7'},{id:'c',text:'1'},{id:'d',text:'Tous pareils'}], answer:'c', help:"1 est le plus petit des trois."},
          {q:"Quel signe convient entre 6 et 8 ?", options:[{id:'a',text:'6 > 8'},{id:'b',text:'6 = 8'},{id:'c',text:'6 < 8'},{id:'d',text:'Aucun des trois'}], answer:'c', help:"6 est plus petit que 8, donc 6 < 8."},
          {q:"Quel nombre vient juste avant 10 ?", options:[{id:'a',text:'8'},{id:'b',text:'11'},{id:'c',text:'9'},{id:'d',text:'10'}], answer:'c', help:"9 vient juste avant 10."},
          {q:"Quel nombre vient juste après 15 ?", options:[{id:'a',text:'14'},{id:'b',text:'16'},{id:'c',text:'17'},{id:'d',text:'15'}], answer:'b', help:"15 + 1 = 16."},
          {q:"Parmi 12, 8, 15, 3 — lequel est le plus grand ?", options:[{id:'a',text:'12'},{id:'b',text:'8'},{id:'c',text:'3'},{id:'d',text:'15'}], answer:'d', help:"15 est le plus grand."},
          {q:"Parmi 20, 17, 11, 19 — lequel est le plus petit ?", options:[{id:'a',text:'20'},{id:'b',text:'19'},{id:'c',text:'11'},{id:'d',text:'17'}], answer:'c', help:"11 est le plus petit."},
          {q:"5 + 5 comparé à 9 : quel signe est correct ?", options:[{id:'a',text:'5+5 < 9'},{id:'b',text:'5+5 = 9'},{id:'c',text:'5+5 > 9'},{id:'d',text:'Impossible à dire'}], answer:'c', help:"5+5=10, et 10 > 9."},
          {q:"Quel nombre est entre 6 et 8 ?", options:[{id:'a',text:'5'},{id:'b',text:'9'},{id:'c',text:'7'},{id:'d',text:'6'}], answer:'c', help:"7 est entre 6 et 8 sur la droite numérique."},
        ]
      },
      {
        id:"1-7", title:"Soustraction en contexte MEQ", desc:"Soustraire jusqu'à 20 en situations réelles", type:"word-problem",
        questions:[
          {q:"Il y a 12 enfants dans la cour. 5 rentrent en classe. Combien restent dehors ?", visual:"👦👦👦👦👦👦👦👦👦👦👦👦", answer:7, help:"12 − 5 = ?"},
          {q:"Une boîte a 15 crayons. On en donne 6 à un ami. Combien en reste-t-il ?", visual:"✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️", answer:9, help:"15 − 6 = ?"},
          {q:"Il y a 20 bonbons. On en mange 8. Combien reste-t-il ?", visual:"🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬", answer:12, help:"20 − 8 = ?"},
          {q:"Un arbre a 11 pommes. 4 tombent par terre. Combien en reste-t-il sur l'arbre ?", visual:"🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎", answer:7, help:"11 − 4 = ?"},
          {q:"Un enfant a 14 billes. Il en perd 7. Combien lui en reste-t-il ?", visual:"🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵", answer:7, help:"14 − 7 = ?"},
          {q:"Il y a 18 élèves dans la classe. 9 sont absents aujourd'hui. Combien sont présents ?", visual:"🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒", answer:9, help:"18 − 9 = ?"},
          {q:"Un magasin avait 16 ballons. Il en a vendu 7. Combien en reste-t-il ?", visual:"🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈", answer:9, help:"16 − 7 = ?"},
          {q:"Il y a 13 oiseaux sur un fil. 6 s'envolent. Combien en reste-t-il ?", visual:"🐦🐦🐦🐦🐦🐦🐦🐦🐦🐦🐦🐦🐦", answer:7, help:"13 − 6 = ?"},
          {q:"Un enfant a 10 cartes. Il en donne 3 à son ami. Combien lui reste-t-il ?", visual:"🃏🃏🃏🃏🃏🃏🃏🃏🃏🃏", answer:7, help:"10 − 3 = ?"},
          {q:"Il y a 17 fleurs dans le jardin. On en coupe 9 pour un bouquet. Combien en reste-t-il ?", visual:"🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷🌷", answer:8, help:"17 − 9 = ?"},
        ]
      },
      {
        id:"1-8", title:"Mesures et comparaisons MEQ", desc:"Comparer longueurs, masses et contenances", type:"mcq",
        questions:[
          {q:"Lequel est le plus long : un crayon ou un bus scolaire ?", options:[{id:'a',text:'Le crayon'},{id:'b',text:'Le bus scolaire'},{id:'c',text:'Pareils'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"Un bus est beaucoup plus long qu'un crayon."},
          {q:"Lequel est le plus lourd : une plume ou un livre ?", options:[{id:'a',text:'La plume'},{id:'b',text:'Le livre'},{id:'c',text:'Pareils'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"Un livre est beaucoup plus lourd qu'une plume."},
          {q:"Un verre est plein d'eau. On en verse la moitié. Le verre est maintenant…", options:[{id:'a',text:'Vide'},{id:'b',text:'Plein'},{id:'c',text:'À moitié plein'},{id:'d',text:'Débordant'}], answer:'c', help:"La moitié a été versée, l'autre moitié reste."},
          {q:"Quelle unité utilise-t-on pour mesurer la longueur d'une règle ?", options:[{id:'a',text:'Kilogramme (kg)'},{id:'b',text:'Litre (L)'},{id:'c',text:'Centimètre (cm)'},{id:'d',text:'Heure (h)'}], answer:'c', help:"On mesure les longueurs en centimètres."},
          {q:"Lequel est le plus court : 10 cm ou 5 cm ?", options:[{id:'a',text:'10 cm'},{id:'b',text:'5 cm'},{id:'c',text:'Pareils'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"5 est plus petit que 10, donc 5 cm est plus court."},
          {q:"Une bouteille d'eau de 1 L et un verre de 250 mL. Lequel contient plus d'eau ?", options:[{id:'a',text:'Le verre'},{id:'b',text:'La bouteille'},{id:'c',text:'Pareils'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"1 L = 1000 mL > 250 mL."},
          {q:"Un élève mesure 120 cm et son frère mesure 90 cm. Lequel est plus grand ?", options:[{id:'a',text:'Le frère (90 cm)'},{id:'b',text:'L\'élève (120 cm)'},{id:'c',text:'Pareils'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"120 > 90, donc l'élève est plus grand."},
          {q:"Une voiture ou une bicyclette — laquelle est plus lourde ?", options:[{id:'a',text:'La bicyclette'},{id:'b',text:'La voiture'},{id:'c',text:'Pareilles'},{id:'d',text:'Impossible à dire'}], answer:'b', help:"Une voiture pèse plusieurs centaines de kg."},
          {q:"Si tu verses 2 L de jus dans un contenant de 5 L, est-il plein ?", options:[{id:'a',text:'Oui, plein'},{id:'b',text:'Non, il reste de la place'},{id:'c',text:'Il déborde'},{id:'d',text:'Il est vide'}], answer:'b', help:"2 L sur 5 L possible : il reste 3 L de place."},
          {q:"Quel objet mesure environ 1 cm ?", options:[{id:'a',text:'Une porte'},{id:'b',text:'Un crayon'},{id:'c',text:'Un ongle de doigt'},{id:'d',text:'Une table'}], answer:'c', help:"Un ongle mesure environ 1 cm de large."},
        ]
      },
    ]
  },

  2: {
    title: "2e Année (7-8 ans)",
    color: "from-blue-400 to-indigo-500",
    lessons: [
      {
        id:"2-1", title:"Fractions gourmandes", desc:"Demi, tiers et quart en blocs picturaux", type:"fraction",
        questions:[
          {q:"Quelle fraction de la pizza est colorée ?", numerator:1, denominator:4, answer:"1/4", help:"Numérateur = morceaux colorés, dénominateur = total."},
          {q:"Quelle fraction est représentée par les parties colorées ?", numerator:2, denominator:3, answer:"2/3", help:"3 morceaux au total, 2 sont coloriés."},
          {q:"Identifie la fraction de la zone colorée.", numerator:1, denominator:2, answer:"1/2", help:"La moitié est colorée."},
          {q:"Trouve la fraction de ce découpage.", numerator:3, denominator:4, answer:"3/4", help:"3 parties sur 4 sont colorées."},
          {q:"Quelle fraction de la figure est colorée ?", numerator:1, denominator:3, answer:"1/3", help:"Un tiers est coloré."},
          {q:"Calcule la fraction représentée.", numerator:2, denominator:4, answer:"2/4", help:"2 rectangles sur 4 sont colorés."},
          {q:"Identifie la fraction : 2 parties sur 6 sont colorées.", numerator:2, denominator:6, answer:"2/6", help:"Numérateur 2, dénominateur 6."},
          {q:"Identifie la fraction : 3 parties sur 6 sont colorées.", numerator:3, denominator:6, answer:"3/6", help:"3 sur 6 — c'est comme la moitié !"},
          {q:"Identifie la fraction : 1 partie sur 5 est colorée.", numerator:1, denominator:5, answer:"1/5", help:"1 sur 5 = un cinquième."},
          {q:"Identifie la fraction : 4 parties sur 5 sont colorées.", numerator:4, denominator:5, answer:"4/5", help:"4 sur 5 = quatre cinquièmes."},
        ]
      },
      {
        id:"2-2", title:"Blocs de base 10", desc:"Modéliser les nombres à deux chiffres", type:"base10",
        questions:[
          {q:"Représente le nombre 34 avec les blocs.", target:34, answer:{tens:3,ones:4}, help:"3 dizaines et 4 unités."},
          {q:"Représente le nombre 52 avec les blocs.", target:52, answer:{tens:5,ones:2}, help:"5 barres de dix et 2 cubes."},
          {q:"Modélise le nombre 18.", target:18, answer:{tens:1,ones:8}, help:"1 dizaine et 8 unités."},
          {q:"Représente le nombre 40.", target:40, answer:{tens:4,ones:0}, help:"4 barres de dizaines seulement."},
          {q:"Modélise le nombre 25.", target:25, answer:{tens:2,ones:5}, help:"2 dizaines et 5 unités."},
          {q:"Représente le nombre 13.", target:13, answer:{tens:1,ones:3}, help:"1 barre de dix et 3 cubes."},
          {q:"Modélise le nombre 67.", target:67, answer:{tens:6,ones:7}, help:"6 dizaines et 7 unités."},
          {q:"Représente le nombre 80.", target:80, answer:{tens:8,ones:0}, help:"8 barres de dizaines, 0 unité."},
          {q:"Modélise le nombre 99.", target:99, answer:{tens:9,ones:9}, help:"9 dizaines et 9 unités."},
          {q:"Représente le nombre 21.", target:21, answer:{tens:2,ones:1}, help:"2 dizaines et 1 unité."},
        ]
      },
      {
        id:"2-3", title:"L'heure sur l'horloge", desc:"Lire les heures, demi-heures et quarts d'heure", type:"time-clock",
        questions:[
          {q:"L'aiguille des heures pointe sur le 3 et l'aiguille des minutes pointe sur le 12. Quelle heure est-il ?", hours:3, minutes:0, answer:"3:00", help:"Aiguille courte = heures (3), longue sur 12 = pile → 3 h 00."},
          {q:"L'aiguille des heures est entre le 7 et le 8. L'aiguille des minutes pointe sur le 6. Quelle heure est-il ?", hours:7, minutes:30, answer:"7:30", help:"Longue sur 6 = 30 minutes → 7 h 30."},
          {q:"L'aiguille courte pointe sur le 10 et la longue sur le 12. Quelle heure est-il ?", hours:10, minutes:0, answer:"10:00", help:"10 heures pile."},
          {q:"L'aiguille courte est entre le 1 et le 2. La longue pointe sur le 6. Quelle heure est-il ?", hours:1, minutes:30, answer:"1:30", help:"Entre 1 et 2, longue sur 6 → 1 h 30."},
          {q:"Les deux aiguilles pointent sur le 12. Quelle heure est-il ?", hours:12, minutes:0, answer:"12:00", help:"Midi ! 12 h 00."},
          {q:"La petite aiguille est entre le 5 et le 6. La grande pointe sur le 6. Quelle heure est-il ?", hours:5, minutes:30, answer:"5:30", help:"Entre 5 et 6, grande sur 6 → 5 h 30."},
          {q:"La petite aiguille pointe sur le 8 et la grande sur le 3. Quelle heure est-il ?", hours:8, minutes:15, answer:"8:15", help:"Grande sur 3 = 15 minutes → 8 h 15 (et quart)."},
          {q:"La petite aiguille est entre 2 et 3. La grande pointe sur le 9. Quelle heure est-il ?", hours:2, minutes:45, answer:"2:45", help:"Grande sur 9 = 45 minutes → 2 h 45."},
          {q:"La petite aiguille pointe sur le 6 et la grande sur le 12. Quelle heure est-il ?", hours:6, minutes:0, answer:"6:00", help:"6 heures pile."},
          {q:"La petite aiguille est entre 4 et 5. La grande pointe sur le 3. Quelle heure est-il ?", hours:4, minutes:15, answer:"4:15", help:"Grande sur 3 = 15 minutes → 4 h 15."},
        ]
      },
      {
        id:"2-4", title:"Données et diagrammes MEQ", desc:"Interpréter un diagramme à bandes", type:"mcq",
        questions:[
          {q:"Bande « Chiens » = 8, bande « Chats » = 5. Combien d'animaux en tout ?", options:[{id:'a',text:'10'},{id:'b',text:'13'},{id:'c',text:'15'},{id:'d',text:'8'}], answer:'b', help:"8 + 5 = 13."},
          {q:"Lundi = 4 absents, Mardi = 2, Mercredi = 6. Quel jour y a-t-il eu le plus d'absences ?", options:[{id:'a',text:'Lundi'},{id:'b',text:'Mardi'},{id:'c',text:'Mercredi'},{id:'d',text:'Jeudi'}], answer:'c', help:"6 > 4 > 2 → Mercredi."},
          {q:"Couleurs préférées : Rouge = 7, Bleu = 4, Vert = 3. Total des votes ?", options:[{id:'a',text:'10'},{id:'b',text:'12'},{id:'c',text:'14'},{id:'d',text:'11'}], answer:'c', help:"7 + 4 + 3 = 14."},
          {q:"Football = 9, Natation = 6. De combien le football est-il plus populaire ?", options:[{id:'a',text:'2'},{id:'b',text:'4'},{id:'c',text:'3'},{id:'d',text:'15'}], answer:'c', help:"9 − 6 = 3."},
          {q:"Pomme = 5, Poire = 5, Banane = 5. Que remarques-tu ?", options:[{id:'a',text:'La pomme est la plus aimée'},{id:'b',text:'Tous les fruits sont également aimés'},{id:'c',text:'La banane est la moins aimée'},{id:'d',text:'La poire est la plus aimée'}], answer:'b', help:"Toutes les bandes ont la même hauteur."},
          {q:"Températures : Lundi 18°, Mardi 20°, Mercredi 17°, Jeudi 22°. Quel jour fait-il le plus chaud ?", options:[{id:'a',text:'Lundi'},{id:'b',text:'Mardi'},{id:'c',text:'Mercredi'},{id:'d',text:'Jeudi'}], answer:'d', help:"22° est le plus élevé → Jeudi."},
          {q:"Un sondage donne : Chien = 12, Chat = 9, Poisson = 3. Quel animal est le moins populaire ?", options:[{id:'a',text:'Chien'},{id:'b',text:'Chat'},{id:'c',text:'Poisson'},{id:'d',text:'Tous pareils'}], answer:'c', help:"3 est la valeur la plus basse → Poisson."},
          {q:"Livres lus : Janvier = 4, Février = 6, Mars = 5. Combien de livres en tout ?", options:[{id:'a',text:'10'},{id:'b',text:'14'},{id:'c',text:'15'},{id:'d',text:'11'}], answer:'c', help:"4 + 6 + 5 = 15."},
          {q:"Sports : Hockey = 8, Soccer = 10, Natation = 6. Quel sport est 2e en popularité ?", options:[{id:'a',text:'Hockey'},{id:'b',text:'Soccer'},{id:'c',text:'Natation'},{id:'d',text:'Tous pareils'}], answer:'a', help:"Soccer=10 (1er), Hockey=8 (2e), Natation=6 (3e)."},
          {q:"Bandes : Rouge = 3, Jaune = 7, Bleu = 5. Quelle couleur est entre les deux autres en popularité ?", options:[{id:'a',text:'Rouge'},{id:'b',text:'Jaune'},{id:'c',text:'Bleu'},{id:'d',text:'Elles sont pareilles'}], answer:'c', help:"Bleu=5 est entre Rouge=3 et Jaune=7."},
        ]
      },
      {
        id:"2-5", title:"Addition et soustraction à 2 chiffres", desc:"Résoudre des problèmes avec retenue", type:"barmodel",
        questions:[
          {q:"Un train transportait 32 passagers. 15 autres montent à la prochaine gare. Combien y a-t-il de passagers maintenant ?", answer:47, help:"32 + 15 = ?"},
          {q:"Une bibliothèque a 64 livres. On en prête 28. Combien reste-t-il ?", answer:36, help:"64 − 28 = ?"},
          {q:"Lundi : 43 voitures sur le stationnement. Mardi : 37 de plus. Total le mardi ?", answer:80, help:"43 + 37 = ?"},
          {q:"Un magasin avait 75 bouteilles. Il en a vendu 39. Combien reste-t-il ?", answer:36, help:"75 − 39 = ?"},
          {q:"Classe A : 25 élèves. Classe B : 28 élèves. Combien d'élèves au total ?", answer:53, help:"25 + 28 = ?"},
          {q:"Un fermier a récolté 96 carottes. Il en mange 17. Combien reste-t-il ?", answer:79, help:"96 − 17 = ?"},
          {q:"Matin : 46 pains cuits. Après-midi : 38 de plus. Total ?", answer:84, help:"46 + 38 = ?"},
          {q:"Un enfant a 55 $ dans sa tirelire. Il dépense 27 $. Combien reste-t-il ?", answer:28, help:"55 − 27 = ?"},
          {q:"Sac rouge : 19 billes. Sac bleu : 34 billes. Combien de billes au total ?", answer:53, help:"19 + 34 = ?"},
          {q:"Une piscine avait 88 nageurs. 49 sont partis. Combien reste-t-il ?", answer:39, help:"88 − 49 = ?"},
        ]
      },
      {
        id:"2-6", title:"Comptage par bonds", desc:"Multiplier en comptant par 2, 5 et 10", type:"multiplication",
        questions:[
          {q:"Compte par 2 : 2 groupes de 2. Combien au total ?", groups:2, size:2, answer:4, help:"2 × 2 = ?"},
          {q:"Compte par 5 : 3 groupes de 5 doigts. Combien au total ?", groups:3, size:5, answer:15, help:"3 × 5 = ?"},
          {q:"Compte par 10 : 4 groupes de 10 sous. Combien au total ?", groups:4, size:10, answer:40, help:"4 × 10 = ?"},
          {q:"2 sacs de 6 oranges. Total ?", groups:2, size:6, answer:12, help:"2 × 6 = ?"},
          {q:"5 groupes de 2 stylos. Total ?", groups:5, size:2, answer:10, help:"5 × 2 = ?"},
          {q:"3 groupes de 10 feuilles. Total ?", groups:3, size:10, answer:30, help:"3 × 10 = ?"},
          {q:"4 groupes de 5 pommes. Total ?", groups:4, size:5, answer:20, help:"4 × 5 = ?"},
          {q:"2 rangées de 8 chaises. Total ?", groups:2, size:8, answer:16, help:"2 × 8 = ?"},
          {q:"6 groupes de 2 biscuits. Total ?", groups:6, size:2, answer:12, help:"6 × 2 = ?"},
          {q:"3 groupes de 4 étoiles. Total ?", groups:3, size:4, answer:12, help:"3 × 4 = ?"},
        ]
      },
      {
        id:"2-7", title:"Mesure en centimètres MEQ", desc:"Résoudre des problèmes de mesure", type:"word-problem",
        questions:[
          {q:"Une règle mesure 30 cm. On en utilise 12 cm pour un trait. Quelle longueur reste-t-il sur la règle ?", visual:"📏 30 cm → trait de 12 cm", answer:18, help:"30 − 12 = ?"},
          {q:"Un crayon mesure 15 cm. Un autre mesure 8 cm. Quelle est leur longueur totale mis bout à bout ?", visual:"✏️ 15 cm + ✏️ 8 cm", answer:23, help:"15 + 8 = ?"},
          {q:"Une corde mesure 50 cm. On en coupe 22 cm. Combien reste-t-il ?", visual:"🪢 50 cm → coupe 22 cm", answer:28, help:"50 − 22 = ?"},
          {q:"Un ver de terre mesure 9 cm. Un autre mesure 6 cm. Lequel est plus long ? Donne la différence.", visual:"🪱 9 cm vs 🪱 6 cm", answer:3, help:"9 − 6 = ? cm de différence."},
          {q:"Une planche mesure 45 cm. On en coupe 18 cm. Quelle est la longueur restante ?", visual:"📋 45 cm → coupe 18 cm", answer:27, help:"45 − 18 = ?"},
          {q:"Trois bâtons de 10 cm chacun, mis bout à bout. Longueur totale ?", visual:"| 10 cm | + | 10 cm | + | 10 cm |", answer:30, help:"10 + 10 + 10 = ?"},
          {q:"Une fenêtre mesure 80 cm de large. Une porte mesure 90 cm. Quelle est la différence de largeur ?", visual:"🪟 80 cm vs 🚪 90 cm", answer:10, help:"90 − 80 = ?"},
          {q:"Un ruban de 100 cm est coupé en deux parties égales. Quelle est la longueur de chaque partie ?", visual:"🎀 100 cm ÷ 2 parties", answer:50, help:"100 ÷ 2 = ?"},
          {q:"Marc saute 65 cm. Pierre saute 48 cm. De combien Marc saute-t-il plus loin ?", visual:"👦 65 cm vs 👦 48 cm", answer:17, help:"65 − 48 = ?"},
          {q:"Un livre mesure 24 cm de haut et 16 cm de large. Quelle est la somme de ces deux mesures ?", visual:"📚 H: 24 cm + L: 16 cm", answer:40, help:"24 + 16 = ?"},
        ]
      },
      {
        id:"2-8", title:"Suites et régularités MEQ", desc:"Identifier et compléter des suites numériques", type:"mcq",
        questions:[
          {q:"Suite : 2, 4, 6, 8, … Quel est le prochain nombre ?", options:[{id:'a',text:'9'},{id:'b',text:'10'},{id:'c',text:'12'},{id:'d',text:'11'}], answer:'b', help:"On ajoute 2 à chaque fois : 8 + 2 = 10."},
          {q:"Suite : 5, 10, 15, 20, … Quel est le prochain nombre ?", options:[{id:'a',text:'22'},{id:'b',text:'24'},{id:'c',text:'25'},{id:'d',text:'21'}], answer:'c', help:"On ajoute 5 à chaque fois : 20 + 5 = 25."},
          {q:"Suite : 10, 20, 30, 40, … Quel est le prochain nombre ?", options:[{id:'a',text:'45'},{id:'b',text:'41'},{id:'c',text:'50'},{id:'d',text:'48'}], answer:'c', help:"On ajoute 10 : 40 + 10 = 50."},
          {q:"Suite : 1, 3, 5, 7, … Quel est le prochain nombre ?", options:[{id:'a',text:'8'},{id:'b',text:'9'},{id:'c',text:'10'},{id:'d',text:'11'}], answer:'b', help:"Nombres impairs : on ajoute 2 : 7 + 2 = 9."},
          {q:"Suite : 20, 18, 16, 14, … Quel est le prochain nombre ?", options:[{id:'a',text:'10'},{id:'b',text:'11'},{id:'c',text:'13'},{id:'d',text:'12'}], answer:'d', help:"On enlève 2 : 14 − 2 = 12."},
          {q:"Suite : 3, 6, 9, 12, … Quel est le prochain nombre ?", options:[{id:'a',text:'14'},{id:'b',text:'13'},{id:'c',text:'15'},{id:'d',text:'16'}], answer:'c', help:"Table de 3 : 12 + 3 = 15."},
          {q:"Suite : 100, 90, 80, 70, … Quel est le prochain nombre ?", options:[{id:'a',text:'55'},{id:'b',text:'65'},{id:'c',text:'60'},{id:'d',text:'50'}], answer:'c', help:"On enlève 10 : 70 − 10 = 60."},
          {q:"Suite : 4, 8, 12, 16, … Quel est le prochain nombre ?", options:[{id:'a',text:'18'},{id:'b',text:'20'},{id:'c',text:'22'},{id:'d',text:'24'}], answer:'b', help:"Table de 4 : 16 + 4 = 20."},
          {q:"Suite : 1, 2, 4, 8, … Quel est le prochain nombre ?", options:[{id:'a',text:'12'},{id:'b',text:'10'},{id:'c',text:'16'},{id:'d',text:'14'}], answer:'c', help:"On double à chaque fois : 8 × 2 = 16."},
          {q:"Suite : 50, 45, 40, 35, … Quel est le prochain nombre ?", options:[{id:'a',text:'28'},{id:'b',text:'30'},{id:'c',text:'25'},{id:'d',text:'32'}], answer:'b', help:"On enlève 5 : 35 − 5 = 30."},
        ]
      },
    ]
  },

  3: {
    title: "3e Année (8-9 ans)",
    color: "from-purple-400 to-pink-500",
    lessons: [
      {
        id:"3-1", title:"Schéma en barres", desc:"Résolution de problèmes Singapour", type:"barmodel",
        questions:[
          {q:"Liam a 12 billes. Camila en a 15 de plus. Combien ont-ils ensemble ?", answer:39, help:"Camila = 12+15=27. Total = 12+27=39."},
          {q:"Un boulanger vend 45 muffins le matin et 30 l'après-midi. Total ?", answer:75, help:"45 + 30 = ?"},
          {q:"Classe de 24 élèves, 14 sont des filles. Combien de garçons ?", answer:10, help:"24 − 14 = ?"},
          {q:"Chloé a 50 $. Elle achète un livre à 18 $. Combien reste-t-il ?", answer:32, help:"50 − 18 = ?"},
          {q:"Thomas a 15 voitures. Son frère en a deux fois plus. Total ?", answer:45, help:"Frère = 15×2=30. Total = 15+30=45."},
          {q:"Un arbre mesurait 120 cm. Il a grandi de 35 cm. Nouvelle hauteur ?", answer:155, help:"120 + 35 = ?"},
          {q:"Une épicerie avait 238 boîtes de soupe. Elle en a vendu 97. Combien reste-t-il ?", answer:141, help:"238 − 97 = ?"},
          {q:"Lundi : 156 visiteurs au musée. Mardi : 89 de plus. Total le mardi ?", answer:245, help:"156 + 89 = ?"},
          {q:"Une piscine a 300 places. 178 sont occupées. Combien de places libres ?", answer:122, help:"300 − 178 = ?"},
          {q:"Un producteur récolte 245 kg de pommes lundi et 187 kg mardi. Total ?", answer:432, help:"245 + 187 = ?"},
        ]
      },
      {
        id:"3-2", title:"Multiplication par groupes", desc:"Tables de 2 à 5 en groupes égaux", type:"multiplication",
        questions:[
          {q:"4 groupes de 3 étoiles. Combien d'étoiles au total ?", groups:4, size:3, answer:12, help:"4 × 3 = ?"},
          {q:"5 sacs de 6 pommes. Total ?", groups:5, size:6, answer:30, help:"5 × 6 = ?"},
          {q:"3 boîtes de 8 crayons. Total ?", groups:3, size:8, answer:24, help:"3 × 8 = ?"},
          {q:"6 groupes de 4 objets. Combien ?", groups:6, size:4, answer:24, help:"6 × 4 = ?"},
          {q:"7 paquets de 5 autocollants. Total ?", groups:7, size:5, answer:35, help:"7 × 5 = ?"},
          {q:"8 enfants reçoivent chacun 2 biscuits. Total ?", groups:8, size:2, answer:16, help:"8 × 2 = ?"},
          {q:"4 rangées de 7 livres. Total ?", groups:4, size:7, answer:28, help:"4 × 7 = ?"},
          {q:"9 enfants ont chacun 3 ballons. Total ?", groups:9, size:3, answer:27, help:"9 × 3 = ?"},
          {q:"5 classeurs de 4 feuilles. Total ?", groups:5, size:4, answer:20, help:"5 × 4 = ?"},
          {q:"6 boîtes de 5 crayons. Total ?", groups:6, size:5, answer:30, help:"6 × 5 = ?"},
        ]
      },
      {
        id:"3-3", title:"Division et partage équitable MEQ", desc:"Diviser en groupes égaux", type:"division",
        questions:[
          {q:"On partage 12 pommes entre 3 enfants. Combien chaque enfant reçoit-il ?", total:12, groups:3, emoji:"🍎", answer:4, help:"12 ÷ 3 = ?"},
          {q:"On répartit 20 biscuits dans 4 assiettes égales. Combien par assiette ?", total:20, groups:4, emoji:"🍪", answer:5, help:"20 ÷ 4 = ?"},
          {q:"On partage 18 crayons entre 2 élèves. Combien chacun en reçoit-il ?", total:18, groups:2, emoji:"✏️", answer:9, help:"18 ÷ 2 = ?"},
          {q:"On distribue 24 autocollants à 8 enfants également. Combien chacun ?", total:24, groups:8, emoji:"⭐", answer:3, help:"24 ÷ 8 = ?"},
          {q:"On partage 15 oranges dans 5 paniers. Combien par panier ?", total:15, groups:5, emoji:"🍊", answer:3, help:"15 ÷ 5 = ?"},
          {q:"On répartit 28 ballons entre 7 enfants. Combien par enfant ?", total:28, groups:7, emoji:"🎈", answer:4, help:"28 ÷ 7 = ?"},
          {q:"30 billes partagées entre 6 enfants. Combien chacun ?", total:30, groups:6, emoji:"🔵", answer:5, help:"30 ÷ 6 = ?"},
          {q:"16 gâteaux dans 4 boîtes égales. Combien par boîte ?", total:16, groups:4, emoji:"🎂", answer:4, help:"16 ÷ 4 = ?"},
          {q:"27 livres sur 9 tablettes égales. Combien par tablette ?", total:27, groups:9, emoji:"📚", answer:3, help:"27 ÷ 9 = ?"},
          {q:"21 bonbons partagés entre 3 amis. Combien chacun ?", total:21, groups:3, emoji:"🍬", answer:7, help:"21 ÷ 3 = ?"},
        ]
      },
      {
        id:"3-4", title:"Périmètre de figures MEQ", desc:"Calculer le périmètre de polygones", type:"perimeter",
        questions:[
          {q:"Calcule le périmètre d'un carré de 5 cm de côté.", sides:[5,5,5,5], answer:20, help:"4 × 5 = 20 cm."},
          {q:"Calcule le périmètre d'un rectangle de 8 cm × 3 cm.", sides:[8,3,8,3], answer:22, help:"(8+3) × 2 = 22 cm."},
          {q:"Un triangle équilatéral a des côtés de 6 cm. Périmètre ?", sides:[6,6,6], answer:18, help:"6+6+6 = 18 cm."},
          {q:"Calcule le périmètre d'un rectangle de 10 cm × 4 cm.", sides:[10,4,10,4], answer:28, help:"(10+4) × 2 = 28 cm."},
          {q:"Un carré a des côtés de 7 cm. Périmètre ?", sides:[7,7,7,7], answer:28, help:"4 × 7 = 28 cm."},
          {q:"Un triangle a des côtés de 5, 8 et 9 cm. Périmètre ?", sides:[5,8,9], answer:22, help:"5+8+9 = 22 cm."},
          {q:"Un rectangle de 12 cm × 6 cm. Périmètre ?", sides:[12,6,12,6], answer:36, help:"(12+6) × 2 = 36 cm."},
          {q:"Un carré de 9 cm de côté. Périmètre ?", sides:[9,9,9,9], answer:36, help:"4 × 9 = 36 cm."},
          {q:"Un triangle avec des côtés de 7, 7 et 10 cm. Périmètre ?", sides:[7,7,10], answer:24, help:"7+7+10 = 24 cm."},
          {q:"Un rectangle de 15 cm × 5 cm. Périmètre ?", sides:[15,5,15,5], answer:40, help:"(15+5) × 2 = 40 cm."},
        ]
      },
      {
        id:"3-5", title:"Tables de 6 à 9", desc:"Maîtriser les tables de multiplication avancées", type:"multiplication",
        questions:[
          {q:"6 groupes de 6 pièces. Total ?", groups:6, size:6, answer:36, help:"6 × 6 = 36"},
          {q:"7 boîtes de 6 biscuits. Total ?", groups:7, size:6, answer:42, help:"7 × 6 = 42"},
          {q:"8 sacs de 6 bonbons. Total ?", groups:8, size:6, answer:48, help:"8 × 6 = 48"},
          {q:"6 groupes de 7 livres. Total ?", groups:6, size:7, answer:42, help:"6 × 7 = 42"},
          {q:"7 rangées de 7 chaises. Total ?", groups:7, size:7, answer:49, help:"7 × 7 = 49"},
          {q:"8 enfants ont chacun 7 crayons. Total ?", groups:8, size:7, answer:56, help:"8 × 7 = 56"},
          {q:"6 groupes de 8 étoiles. Total ?", groups:6, size:8, answer:48, help:"6 × 8 = 48"},
          {q:"9 boîtes de 8 œufs. Total ?", groups:9, size:8, answer:72, help:"9 × 8 = 72"},
          {q:"9 tables de 9 crayons. Total ?", groups:9, size:9, answer:81, help:"9 × 9 = 81"},
          {q:"7 paquets de 9 autocollants. Total ?", groups:7, size:9, answer:63, help:"7 × 9 = 63"},
        ]
      },
      {
        id:"3-6", title:"Fractions d'une collection MEQ", desc:"Trouver une fraction d'un groupe d'objets", type:"fraction",
        questions:[
          {q:"Colorie 1/2 des 4 carrés.", numerator:2, denominator:4, answer:"2/4", help:"1/2 de 4 = 2. Colorie 2 carrés."},
          {q:"Colorie 1/3 des 6 cercles.", numerator:2, denominator:6, answer:"2/6", help:"1/3 de 6 = 2 cercles."},
          {q:"Quelle fraction des 8 étoiles est colorée si 4 le sont ?", numerator:4, denominator:8, answer:"4/8", help:"4 sur 8 = 4/8 = 1/2."},
          {q:"Colorie 3/4 des 8 triangles.", numerator:6, denominator:8, answer:"6/8", help:"3/4 de 8 = 6 triangles."},
          {q:"Quelle fraction des 10 points est colorée si 5 le sont ?", numerator:5, denominator:10, answer:"5/10", help:"5 sur 10 = 5/10 = 1/2."},
          {q:"Colorie 2/3 des 9 carrés.", numerator:6, denominator:9, answer:"6/9", help:"2/3 de 9 = 6 carrés."},
          {q:"Quelle fraction des 6 fleurs est colorée si 2 le sont ?", numerator:2, denominator:6, answer:"2/6", help:"2 sur 6 = 2/6 = 1/3."},
          {q:"Colorie 1/4 des 12 cercles.", numerator:3, denominator:12, answer:"3/12", help:"1/4 de 12 = 3 cercles."},
          {q:"Quelle fraction des 5 étoiles est colorée si 4 le sont ?", numerator:4, denominator:5, answer:"4/5", help:"4 sur 5 = 4/5."},
          {q:"Colorie 1/2 des 10 carrés.", numerator:5, denominator:10, answer:"5/10", help:"1/2 de 10 = 5 carrés."},
        ]
      },
      {
        id:"3-7", title:"Arrondir et estimer MEQ", desc:"Arrondir à la dizaine et à la centaine la plus proche", type:"mcq",
        questions:[
          {q:"Arrondi à la dizaine : 34 →", options:[{id:'a',text:'30'},{id:'b',text:'40'},{id:'c',text:'35'},{id:'d',text:'20'}], answer:'a', help:"34 : chiffre des unités = 4 < 5, on arrondit à 30."},
          {q:"Arrondi à la dizaine : 57 →", options:[{id:'a',text:'50'},{id:'b',text:'55'},{id:'c',text:'60'},{id:'d',text:'65'}], answer:'c', help:"57 : chiffre des unités = 7 ≥ 5, on arrondit à 60."},
          {q:"Arrondi à la dizaine : 85 →", options:[{id:'a',text:'80'},{id:'b',text:'85'},{id:'c',text:'90'},{id:'d',text:'95'}], answer:'c', help:"85 : unités = 5 ≥ 5, on arrondit à 90."},
          {q:"Arrondi à la centaine : 342 →", options:[{id:'a',text:'300'},{id:'b',text:'340'},{id:'c',text:'350'},{id:'d',text:'400'}], answer:'a', help:"342 : chiffre des dizaines = 4 < 5, on arrondit à 300."},
          {q:"Arrondi à la centaine : 678 →", options:[{id:'a',text:'600'},{id:'b',text:'670'},{id:'c',text:'680'},{id:'d',text:'700'}], answer:'d', help:"678 : dizaines = 7 ≥ 5, on arrondit à 700."},
          {q:"Estime : 48 + 31 ≈ (arrondis à la dizaine)", options:[{id:'a',text:'70'},{id:'b',text:'80'},{id:'c',text:'90'},{id:'d',text:'75'}], answer:'b', help:"50 + 30 = 80."},
          {q:"Estime : 62 − 29 ≈ (arrondis à la dizaine)", options:[{id:'a',text:'20'},{id:'b',text:'30'},{id:'c',text:'40'},{id:'d',text:'50'}], answer:'b', help:"62→60, 29→30 → 60−30=30."},
          {q:"Arrondi à la dizaine : 95 →", options:[{id:'a',text:'90'},{id:'b',text:'95'},{id:'c',text:'100'},{id:'d',text:'105'}], answer:'c', help:"95 : unités = 5 ≥ 5 → 100."},
          {q:"Arrondi à la centaine : 450 →", options:[{id:'a',text:'400'},{id:'b',text:'500'},{id:'c',text:'450'},{id:'d',text:'460'}], answer:'b', help:"450 : dizaines = 5 ≥ 5 → 500."},
          {q:"Estime : 198 + 203 ≈ (arrondis à la centaine)", options:[{id:'a',text:'300'},{id:'b',text:'350'},{id:'c',text:'400'},{id:'d',text:'450'}], answer:'c', help:"200 + 200 = 400."},
        ]
      },
      {
        id:"3-8", title:"Problèmes ×÷ MEQ", desc:"Schémas en barres avec multiplication et division", type:"barmodel",
        questions:[
          {q:"Un paquet coûte 6 $. On achète 8 paquets. Coût total ?", answer:48, help:"6 × 8 = ?"},
          {q:"On divise 56 $ également entre 7 amis. Combien chacun reçoit-il ?", answer:8, help:"56 ÷ 7 = ?"},
          {q:"Un autobus a 9 rangées de 4 sièges. Combien de sièges au total ?", answer:36, help:"9 × 4 = ?"},
          {q:"On partage 45 biscuits en groupes de 9. Combien de groupes ?", answer:5, help:"45 ÷ 9 = ?"},
          {q:"Un fermier a 7 rangées de 8 plants de tomates. Total de plants ?", answer:56, help:"7 × 8 = ?"},
          {q:"On répartit 63 crayons dans des boîtes de 7. Combien de boîtes ?", answer:9, help:"63 ÷ 7 = ?"},
          {q:"Chaque élève reçoit 4 feuilles. Il y a 8 élèves. Combien de feuilles en tout ?", answer:32, help:"4 × 8 = ?"},
          {q:"On a 72 fleurs à mettre dans des vases de 9. Combien de vases ?", answer:8, help:"72 ÷ 9 = ?"},
          {q:"6 cartons de 9 œufs. Combien d'œufs en tout ?", answer:54, help:"6 × 9 = ?"},
          {q:"On partage 48 livres également dans 6 étagères. Combien par étagère ?", answer:8, help:"48 ÷ 6 = ?"},
        ]
      },
    ]
  },
};
