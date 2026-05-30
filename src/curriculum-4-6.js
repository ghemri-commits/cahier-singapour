// Curriculum MEQ — Niveaux 4 à 6 · 8 leçons · 10 questions chacune
export const CURRICULUM_4_6 = {
  4: {
    title: "4e Année (9-10 ans)",
    color: "from-amber-400 to-orange-500",
    lessons: [
      {
        id:"4-1", title:"Les Solides de l'espace", desc:"Faces, arêtes et sommets (lexique MEQ)", type:"geometry",
        questions:[
          {q:"Combien de faces a un prisme à base triangulaire ?", answer:5, help:"2 bases triangulaires + 3 faces rectangulaires."},
          {q:"Combien de sommets a une pyramide à base carrée ?", answer:5, help:"4 coins de la base + 1 apex."},
          {q:"Combien d'arêtes a un cube ?", answer:12, help:"4 en bas + 4 en haut + 4 verticales."},
          {q:"Combien de faces a un prisme à base rectangulaire ?", answer:6, help:"Comme une boîte : 6 faces."},
          {q:"Combien de faces a un tétraèdre ?", answer:4, help:"1 base + 3 faces triangulaires."},
          {q:"Combien de sommets a un prisme à base triangulaire ?", answer:6, help:"3 en bas + 3 en haut."},
          {q:"Combien d'arêtes a une pyramide à base carrée ?", answer:8, help:"4 arêtes de la base + 4 arêtes latérales."},
          {q:"Combien de faces a une pyramide à base triangulaire ?", answer:4, help:"1 base triangle + 3 faces triangulaires."},
          {q:"Combien de sommets a un cube ?", answer:8, help:"8 coins."},
          {q:"Combien d'arêtes a un prisme à base rectangulaire ?", answer:12, help:"4 en bas + 4 en haut + 4 verticales."},
        ]
      },
      {
        id:"4-2", title:"Fractions équivalentes", desc:"Trouver le numérateur ou dénominateur manquant", type:"equiv-fraction",
        questions:[
          {q:"Complète : 1/2 = ?/8", answer:4, help:"2 × 4 = 8 → multiplie aussi le numérateur par 4."},
          {q:"Complète : 3/4 = ?/12", answer:9, help:"Multiplie haut et bas par 3."},
          {q:"Complète : 2/5 = ?/10", answer:4, help:"Le dénominateur a doublé — double le numérateur."},
          {q:"Complète : 5/6 = ?/18", answer:15, help:"Multiplie haut et bas par 3."},
          {q:"Complète : 1/3 = ?/9", answer:3, help:"Dénominateur triplé — triple le numérateur."},
          {q:"Complète : 4/5 = ?/20", answer:16, help:"Multiplie haut et bas par 4."},
          {q:"Complète : 2/3 = ?/12", answer:8, help:"3 × 4 = 12 → 2 × 4 = 8."},
          {q:"Complète : 3/5 = ?/15", answer:9, help:"5 × 3 = 15 → 3 × 3 = 9."},
          {q:"Complète : 1/4 = ?/16", answer:4, help:"4 × 4 = 16 → 1 × 4 = 4."},
          {q:"Complète : 5/8 = ?/24", answer:15, help:"8 × 3 = 24 → 5 × 3 = 15."},
        ]
      },
      {
        id:"4-3", title:"Nombres décimaux MEQ", desc:"Comparer, ordonner et opérer avec les décimaux", type:"decimals",
        questions:[
          {q:"Calcule : 3,4 + 2,5 = ?", answer:5.9, help:"Unités 3+2=5, dixièmes 4+5=9 → 5,9"},
          {q:"Calcule : 8,7 − 3,2 = ?", answer:5.5, help:"8−3=5, 7−2=5 → 5,5"},
          {q:"Quel est le plus grand entre 4,6 et 4,9 ?", answer:4.9, help:"Même partie entière. 9 > 6 aux dixièmes → 4,9."},
          {q:"Calcule : 6,0 − 2,4 = ?", answer:3.6, help:"6,0 − 2,4 = 3,6"},
          {q:"Le plus petit de : 3,7 ; 3,2 ; 3,9 ; 3,4 ?", answer:3.2, help:"Compare les dixièmes : 2 < 4 < 7 < 9 → 3,2."},
          {q:"Calcule : 5,5 + 1,8 = ?", answer:7.3, help:"5+1=6, 0,5+0,8=1,3 → 7,3"},
          {q:"Calcule : 12,4 + 3,7 = ?", answer:16.1, help:"12+3=15, 0,4+0,7=1,1 → 16,1"},
          {q:"Calcule : 9,0 − 4,6 = ?", answer:4.4, help:"9,0 − 4,6 = 4,4"},
          {q:"Place en ordre croissant et écris le 2e plus petit : 5,1 ; 5,8 ; 5,3 ; 5,6", answer:5.3, help:"5,1 < 5,3 < 5,6 < 5,8. Le 2e est 5,3."},
          {q:"Calcule : 7,2 + 2,9 = ?", answer:10.1, help:"7+2=9, 0,2+0,9=1,1 → 10,1"},
        ]
      },
      {
        id:"4-4", title:"Aire et périmètre MEQ", desc:"Calculer l'aire et le périmètre de rectangles", type:"area",
        questions:[
          {q:"Un rectangle mesure 6 cm × 4 cm. Calcule son aire.", w:6, h:4, askArea:true, answer:24, help:"Aire = 6 × 4 = 24 cm²."},
          {q:"Un carré a un côté de 5 cm. Calcule son aire.", w:5, h:5, askArea:true, answer:25, help:"Aire = 5 × 5 = 25 cm²."},
          {q:"Un rectangle mesure 9 cm × 3 cm. Calcule son périmètre.", w:9, h:3, askArea:false, answer:24, help:"(9+3) × 2 = 24 cm."},
          {q:"Un rectangle a une aire de 20 cm². Sa largeur est 4 cm. Quelle est sa longueur ?", w:null, h:4, askArea:true, answer:5, help:"L = 20 ÷ 4 = 5 cm."},
          {q:"Un carré a un périmètre de 32 cm. Quelle est la mesure d'un côté ?", w:null, h:null, askArea:false, answer:8, help:"Côté = 32 ÷ 4 = 8 cm."},
          {q:"Un rectangle mesure 7 cm × 3 cm. Calcule son aire.", w:7, h:3, askArea:true, answer:21, help:"Aire = 7 × 3 = 21 cm²."},
          {q:"Un rectangle 11 cm × 5 cm. Calcule son aire.", w:11, h:5, askArea:true, answer:55, help:"Aire = 11 × 5 = 55 cm²."},
          {q:"Un carré a un côté de 8 cm. Calcule son périmètre.", w:8, h:8, askArea:false, answer:32, help:"Périmètre = 4 × 8 = 32 cm."},
          {q:"Un rectangle a une aire de 48 cm². Sa largeur est 6 cm. Quelle est sa longueur ?", w:null, h:6, askArea:true, answer:8, help:"L = 48 ÷ 6 = 8 cm."},
          {q:"Un rectangle 10 cm × 4 cm. Calcule son périmètre.", w:10, h:4, askArea:false, answer:28, help:"(10+4) × 2 = 28 cm."},
        ]
      },
      {
        id:"4-5", title:"Grands nombres MEQ", desc:"Lire, écrire et comparer les nombres jusqu'à 100 000", type:"barmodel",
        questions:[
          {q:"Un stade a 45 000 places. 12 500 sont occupées. Combien de places sont libres ?", answer:32500, help:"45 000 − 12 500 = ?"},
          {q:"Une ville a 67 890 habitants. Une autre en a 34 210. Quelle est la population totale ?", answer:102100, help:"67 890 + 34 210 = ?"},
          {q:"Une usine produit 8 500 voitures par mois. Combien en produit-elle en 2 mois ?", answer:17000, help:"8 500 × 2 = ?"},
          {q:"Un avion parcourt 9 500 km par vol. Combien de km pour 4 vols identiques ?", answer:38000, help:"9 500 × 4 = ?"},
          {q:"Un entrepôt a 75 000 boîtes. On en enlève 28 350. Combien reste-t-il ?", answer:46650, help:"75 000 − 28 350 = ?"},
          {q:"École A : 1 245 élèves. École B : 987 élèves. Total ?", answer:2232, help:"1 245 + 987 = ?"},
          {q:"Un livre coûte 1 200 $. On en commande 8. Coût total ?", answer:9600, help:"1 200 × 8 = ?"},
          {q:"Un magasin a vendu 4 320 articles en janvier et 5 680 en février. Total ?", answer:10000, help:"4 320 + 5 680 = ?"},
          {q:"Une région a 56 780 arbres. On en plante 13 220 de plus. Nouveau total ?", answer:70000, help:"56 780 + 13 220 = ?"},
          {q:"100 000 billets d'avion vendus. 38 750 sont des allers-retours. Combien sont des simples ?", answer:61250, help:"100 000 − 38 750 = ?"},
        ]
      },
      {
        id:"4-6", title:"Calcul mental et priorités MEQ", desc:"Appliquer les règles des opérations", type:"pemdas",
        questions:[
          {q:"Calcule : 4 × 5 + 3", answer:23, help:"Multiplication d'abord : 4×5=20, puis 20+3=23."},
          {q:"Calcule : 30 − 2 × 4", answer:22, help:"Multiplication d'abord : 2×4=8, puis 30−8=22."},
          {q:"Calcule : (6 + 4) × 3", answer:30, help:"Parenthèse d'abord : 6+4=10, puis 10×3=30."},
          {q:"Calcule : 50 − (8 + 12)", answer:30, help:"Parenthèse : 8+12=20, puis 50−20=30."},
          {q:"Calcule : 3 × (10 − 4)", answer:18, help:"Parenthèse : 10−4=6, puis 3×6=18."},
          {q:"Calcule : 100 ÷ (4 × 5)", answer:5, help:"Parenthèse : 4×5=20, puis 100÷20=5."},
          {q:"Calcule : 6 + 3 × 7", answer:27, help:"Multiplication d'abord : 3×7=21, puis 6+21=27."},
          {q:"Calcule : (15 − 5) ÷ 2", answer:5, help:"Parenthèse : 15−5=10, puis 10÷2=5."},
          {q:"Calcule : 4 × 8 − 2 × 5", answer:22, help:"4×8=32, 2×5=10, puis 32−10=22."},
          {q:"Calcule : (7 + 3) × (9 − 4)", answer:50, help:"7+3=10, 9−4=5, puis 10×5=50."},
        ]
      },
      {
        id:"4-7", title:"Angles et triangles MEQ", desc:"Classer les angles et les triangles", type:"geometry",
        questions:[
          {q:"Un angle de 90° s'appelle un angle…", answer:90, help:"Un angle droit mesure exactement 90°."},
          {q:"La somme des angles d'un triangle vaut toujours combien de degrés ?", answer:180, help:"Tout triangle : 180°."},
          {q:"Un triangle a des angles de 60°, 60° et ?°", answer:60, help:"60+60+? = 180 → ? = 60°."},
          {q:"Un triangle a des angles de 90° et 45°. Quel est le 3e angle ?", answer:45, help:"90+45+? = 180 → ? = 45°."},
          {q:"Un angle de 45° est-il aigu ou obtus ? Écris le nombre de degrés d'un angle droit pour comparer.", answer:90, help:"Aigu < 90°. Angle droit = 90°."},
          {q:"Un triangle a des angles de 30°, 60° et ?°", answer:90, help:"30+60+? = 180 → ? = 90°."},
          {q:"Un triangle équilatéral a 3 angles égaux. Quelle est la mesure de chacun ?", answer:60, help:"180 ÷ 3 = 60°."},
          {q:"Un angle de 120° est-il aigu (< 90°) ou obtus (> 90°) ? Écris sa valeur.", answer:120, help:"120° > 90° = obtus."},
          {q:"Un triangle a des angles de 50°, 70° et ?°", answer:60, help:"50+70+? = 180 → ? = 60°."},
          {q:"Combien y a-t-il d'angles dans un triangle ?", answer:3, help:"Un triangle a 3 côtés et 3 angles."},
        ]
      },
      {
        id:"4-8", title:"Problèmes contextualisés MEQ", desc:"Résoudre des problèmes à plusieurs étapes", type:"word-problem",
        questions:[
          {q:"Un livre coûte 12 $ et un crayon 3 $. Marie achète 2 livres et 4 crayons. Total ?", visual:"📚 × 2 + ✏️ × 4", answer:36, help:"(2 × 12) + (4 × 3) = 24 + 12 = 36 $."},
          {q:"Un autobus a 48 places. Il est à moitié plein. Combien de passagers ?", visual:"🚌 ÷ 2", answer:24, help:"48 ÷ 2 = 24 passagers."},
          {q:"Une bouteille contient 1,5 L. On en verse 0,6 L. Combien reste-t-il ?", visual:"🧴 1,5 L − 0,6 L", answer:0.9, help:"1,5 − 0,6 = 0,9 L."},
          {q:"Un fermier a 125 poules. Chaque poule pond 1 œuf par jour. Combien d'œufs en 7 jours ?", visual:"🐔 × 125 × 7 jours", answer:875, help:"125 × 7 = 875 œufs."},
          {q:"Un rectangle a un périmètre de 38 cm. Sa longueur est 12 cm. Quelle est sa largeur ?", visual:"Périmètre = 38 cm, L = 12 cm", answer:7, help:"Largeur = (38 − 24) ÷ 2 = 7 cm."},
          {q:"Un magasin vend 240 pommes par jour. Il en reçoit 500. Dans combien de jours les aura-t-il toutes vendues ?", visual:"500 ÷ 240 ≈ ? jours", answer:2, help:"500 ÷ 240 ≈ 2 jours (avec reste le 3e jour). Réponse : 2 jours complets + reste."},
          {q:"3 amis se partagent 84 $. Combien chacun reçoit-il ?", visual:"💰 84 $ ÷ 3", answer:28, help:"84 ÷ 3 = 28 $."},
          {q:"Un carré a une aire de 64 cm². Quelle est la mesure d'un côté ?", visual:"Carré : aire = 64 cm²", answer:8, help:"√64 = 8 cm (8 × 8 = 64)."},
          {q:"Une voiture parcourt 80 km en 1 h. Combien de km en 3 h ?", visual:"🚗 80 km/h × 3 h", answer:240, help:"80 × 3 = 240 km."},
          {q:"On a 250 g de farine pour 5 muffins. Combien de grammes pour 12 muffins ?", visual:"250 g → 5 muffins ; ? → 12 muffins", answer:600, help:"50 g/muffin × 12 = 600 g."},
        ]
      },
    ]
  },

  5: {
    title: "5e Année (10-11 ans)",
    color: "from-cyan-400 to-blue-600",
    lessons: [
      {
        id:"5-1", title:"Plan cartésien (1er quadrant)", desc:"Lire et placer des coordonnées (x, y)", type:"cartesian",
        questions:[
          {q:"Clique sur le point de coordonnées (3, 4).", targetX:3, targetY:4, answer:"3,4", help:"3 vers la droite, 4 vers le haut."},
          {q:"Clique sur le point de coordonnées (2, 1).", targetX:2, targetY:1, answer:"2,1", help:"2 vers la droite, 1 vers le haut."},
          {q:"Clique sur le point de coordonnées (0, 4).", targetX:0, targetY:4, answer:"0,4", help:"Reste sur l'axe vertical à la hauteur 4."},
          {q:"Clique sur le point de coordonnées (4, 2).", targetX:4, targetY:2, answer:"4,2", help:"4 vers la droite, 2 vers le haut."},
          {q:"Clique sur le point de coordonnées (1, 3).", targetX:1, targetY:3, answer:"1,3", help:"1 vers la droite, 3 vers le haut."},
          {q:"Clique sur le point de coordonnées (3, 0).", targetX:3, targetY:0, answer:"3,0", help:"3 vers la droite, sur l'axe horizontal."},
          {q:"Clique sur le point de coordonnées (0, 0).", targetX:0, targetY:0, answer:"0,0", help:"L'origine — x=0 et y=0."},
          {q:"Clique sur le point de coordonnées (4, 4).", targetX:4, targetY:4, answer:"4,4", help:"4 vers la droite, 4 vers le haut."},
          {q:"Clique sur le point de coordonnées (2, 4).", targetX:2, targetY:4, answer:"2,4", help:"2 vers la droite, 4 vers le haut."},
          {q:"Clique sur le point de coordonnées (1, 1).", targetX:1, targetY:1, answer:"1,1", help:"1 vers la droite, 1 vers le haut."},
        ]
      },
      {
        id:"5-2", title:"Priorité des opérations", desc:"PEMDAS avec exposants simples", type:"pemdas",
        questions:[
          {q:"Calcule : 5 + 3 × (2² − 1)", answer:14, help:"2²=4 → (4−1)=3 → 3×3=9 → 5+9=14."},
          {q:"Calcule : (10 − 2) ÷ 2 + 3²", answer:13, help:"(8)÷2=4, 3²=9, 4+9=13."},
          {q:"Calcule : 4 × 5 − 3 × 2", answer:14, help:"20−6=14."},
          {q:"Calcule : 2³ + 5 × 2", answer:18, help:"2³=8, 5×2=10, 8+10=18."},
          {q:"Calcule : (3 + 2) × (8 − 5)", answer:15, help:"5 × 3 = 15."},
          {q:"Calcule : 12 ÷ 3 + 4² ÷ 2", answer:12, help:"12÷3=4, 4²=16, 16÷2=8, 4+8=12."},
          {q:"Calcule : 3² × 2 − 4", answer:14, help:"3²=9, 9×2=18, 18−4=14."},
          {q:"Calcule : (5 − 2)² + 1", answer:10, help:"(3)²=9, 9+1=10."},
          {q:"Calcule : 20 ÷ (2 + 3) × 4", answer:16, help:"(2+3)=5, 20÷5=4, 4×4=16."},
          {q:"Calcule : 6² − (4 × 3 + 1²)", answer:23, help:"6²=36, 4×3=12, 1²=1, 12+1=13, 36−13=23."},
        ]
      },
      {
        id:"5-3", title:"Pourcentages en contexte MEQ", desc:"Calculer des pourcentages, rabais et taxes", type:"percentage",
        questions:[
          {q:"Un jeu coûte 40 $. Rabais de 25 %. Quel est le montant du rabais ?", pct:25, answer:10, help:"25% de 40 = 40 × 0,25 = 10 $."},
          {q:"Un livre coûte 20 $. La TPS est 5 %. Combien coûte la taxe ?", pct:5, answer:1, help:"5% de 20 = 20 × 0,05 = 1 $."},
          {q:"Dans 30 élèves, 60 % sont des filles. Combien de filles ?", pct:60, answer:18, help:"60% de 30 = 18."},
          {q:"Un chandail coûte 50 $. Rabais de 10 %. Nouveau prix ?", pct:10, answer:45, help:"Rabais = 5 $. 50−5=45 $."},
          {q:"80 produits vendus, 75 % sont des légumes. Combien de légumes ?", pct:75, answer:60, help:"75% de 80 = 60."},
          {q:"Un repas coûte 24 $. Pourboire de 15 %. Combien de pourboire ?", pct:15, answer:3.6, help:"15% de 24 = 3,60 $."},
          {q:"Un vélo coûte 200 $. Il y a 20 % de rabais. Quel est le prix final ?", pct:20, answer:160, help:"Rabais = 40 $. 200−40=160 $."},
          {q:"Une classe de 25 élèves : 40 % ont les yeux bleus. Combien ?", pct:40, answer:10, help:"40% de 25 = 10."},
          {q:"Une pizza de 16 pointes : on mange 25 % des pointes. Combien mange-t-on ?", pct:25, answer:4, help:"25% de 16 = 4 pointes."},
          {q:"Un magasin a vendu 500 articles. 80 % ont été payés en ligne. Combien ?", pct:80, answer:400, help:"80% de 500 = 400."},
        ]
      },
      {
        id:"5-4", title:"Proportions et ratios MEQ", desc:"Tables de ratio et taux unitaire", type:"ratios",
        questions:[
          {q:"Si 2 livres coûtent 14 $, combien coûtent 5 livres ?", table:[["Livres","Prix ($)"],["2","14"],["5","?"]], answer:35, help:"7 $/livre × 5 = 35 $."},
          {q:"Un robinet remplit 3 L en 6 min. Combien en 10 min ?", table:[["Minutes","Litres"],["6","3"],["10","?"]], answer:5, help:"0,5 L/min × 10 = 5 L."},
          {q:"Pour 4 gâteaux : 200 g de farine. Quelle quantité pour 10 gâteaux ?", table:[["Gâteaux","Farine (g)"],["4","200"],["10","?"]], answer:500, help:"50 g/gâteau × 10 = 500 g."},
          {q:"Une voiture parcourt 90 km en 1 h. Combien en 3 h ?", table:[["Heures","Kilomètres"],["1","90"],["3","?"]], answer:270, help:"90 km/h × 3 = 270 km."},
          {q:"Pour 6 personnes : 18 boulettes. Combien pour 4 personnes ?", table:[["Personnes","Boulettes"],["6","18"],["4","?"]], answer:12, help:"3 boulettes/personne × 4 = 12."},
          {q:"Une imprimante : 15 pages en 3 min. Combien en 7 min ?", table:[["Minutes","Pages"],["3","15"],["7","?"]], answer:35, help:"5 pages/min × 7 = 35."},
          {q:"3 pizzas pour 9 enfants. Combien de pizzas pour 15 enfants ?", table:[["Enfants","Pizzas"],["9","3"],["15","?"]], answer:5, help:"1 pizza pour 3 enfants. 15÷3=5."},
          {q:"Une voiture consomme 8 L aux 100 km. Combien pour 250 km ?", table:[["Kilomètres","Litres"],["100","8"],["250","?"]], answer:20, help:"8÷100=0,08 L/km. 0,08×250=20 L."},
          {q:"5 kg de pommes coûtent 15 $. Combien coûtent 8 kg ?", table:[["Kg","Prix ($)"],["5","15"],["8","?"]], answer:24, help:"3 $/kg × 8 = 24 $."},
          {q:"2 ouvriers construisent 4 maisons en 1 mois. Combien de maisons pour 5 ouvriers ?", table:[["Ouvriers","Maisons"],["2","4"],["5","?"]], answer:10, help:"2 maisons/ouvrier × 5 = 10."},
        ]
      },
      {
        id:"5-5", title:"Nombres relatifs MEQ", desc:"Entiers positifs et négatifs en contexte", type:"word-problem",
        questions:[
          {q:"La température est −3°C. Elle monte de 8°C. Quelle est la nouvelle température ?", visual:"🌡️ −3°C + 8°C", answer:5, help:"−3 + 8 = 5°C."},
          {q:"Un ascenseur est au 4e sous-sol (−4). Il monte de 7 étages. À quel étage est-il ?", visual:"🛗 −4 + 7", answer:3, help:"−4 + 7 = 3e étage."},
          {q:"La température était −8°C. Elle baisse encore de 5°C. Quelle est la température ?", visual:"🌡️ −8°C − 5°C", answer:-13, help:"−8 − 5 = −13°C."},
          {q:"Un nageur est à 3 m sous l'eau (−3 m). Il remonte 5 m. À quelle position est-il ?", visual:"🏊 −3 m + 5 m", answer:2, help:"−3 + 5 = 2 m au-dessus."},
          {q:"Le compte en banque : −120 $. On dépose 250 $. Nouveau solde ?", visual:"💳 −120 + 250", answer:130, help:"−120 + 250 = 130 $."},
          {q:"Sommet de montagne : 1200 m. Fond de vallée : −300 m. Quelle est la différence d'altitude ?", visual:"⛰️ 1200 − (−300)", answer:1500, help:"1200 − (−300) = 1500 m."},
          {q:"Température à midi : 6°C. À minuit : −9°C. De combien a-t-elle baissé ?", visual:"🌡️ 6°C → −9°C", answer:15, help:"6 − (−9) = 15°C de baisse."},
          {q:"On doit −45 $ à un ami. On lui rembourse 20 $. Quelle est la dette restante ?", visual:"💰 −45 + 20", answer:-25, help:"−45 + 20 = −25 $ (encore une dette)."},
          {q:"Un hélicoptère est à 500 m d'altitude. Il descend 700 m sous l'eau. Quelle est sa nouvelle position ?", visual:"🚁 500 − 700", answer:-200, help:"500 − 700 = −200 m."},
          {q:"Tableau des températures : −5, −2, 0, 3. Quelle est la différence entre la plus froide et la plus chaude ?", visual:"🌡️ −5°C à 3°C", answer:8, help:"3 − (−5) = 8°C."},
        ]
      },
      {
        id:"5-6", title:"Volume de solides MEQ", desc:"Calculer le volume de prismes rectangulaires", type:"word-problem",
        questions:[
          {q:"Une boîte mesure 4 cm × 3 cm × 5 cm. Quel est son volume ?", visual:"📦 L=4 × l=3 × h=5", answer:60, help:"V = 4 × 3 × 5 = 60 cm³."},
          {q:"Un bac à sable mesure 2 m × 3 m × 0,5 m. Quel est son volume ?", visual:"🏖️ 2 × 3 × 0,5", answer:3, help:"V = 2 × 3 × 0,5 = 3 m³."},
          {q:"Un cube a un côté de 6 cm. Quel est son volume ?", visual:"🟦 côté = 6 cm", answer:216, help:"V = 6 × 6 × 6 = 216 cm³."},
          {q:"Un aquarium mesure 50 cm × 30 cm × 40 cm. Volume en cm³ ?", visual:"🐠 50 × 30 × 40", answer:60000, help:"50 × 30 × 40 = 60 000 cm³."},
          {q:"Un cube a un volume de 27 cm³. Quelle est la mesure d'un côté ?", visual:"🟦 V = 27 cm³", answer:3, help:"3 × 3 × 3 = 27 → côté = 3 cm."},
          {q:"Un container : 10 m × 2,5 m × 3 m. Volume en m³ ?", visual:"📦 10 × 2,5 × 3", answer:75, help:"10 × 2,5 × 3 = 75 m³."},
          {q:"Un prisme rectangulaire : base 8 cm², hauteur 5 cm. Volume ?", visual:"📐 Aire base = 8 cm², h = 5", answer:40, help:"V = 8 × 5 = 40 cm³."},
          {q:"Une caisse mesure 60 cm × 40 cm × 20 cm. Volume en cm³ ?", visual:"📦 60 × 40 × 20", answer:48000, help:"60 × 40 × 20 = 48 000 cm³."},
          {q:"Un cube de côté 4 cm. Volume ?", visual:"🟦 côté = 4 cm", answer:64, help:"4 × 4 × 4 = 64 cm³."},
          {q:"Un prisme : L=9 cm, l=5 cm, h=3 cm. Volume ?", visual:"📦 9 × 5 × 3", answer:135, help:"9 × 5 × 3 = 135 cm³."},
        ]
      },
      {
        id:"5-7", title:"Transformations géométriques MEQ", desc:"Translation, rotation et réflexion", type:"mcq",
        questions:[
          {q:"On déplace une figure de 3 cases vers la droite sans la tourner ni la retourner. C'est une…", options:[{id:'a',text:'Rotation'},{id:'b',text:'Réflexion'},{id:'c',text:'Translation'},{id:'d',text:'Dilatation'}], answer:'c', help:"Déplacement sans tourner ni retourner = translation."},
          {q:"On retourne une figure comme dans un miroir. C'est une…", options:[{id:'a',text:'Translation'},{id:'b',text:'Réflexion (symétrie)'},{id:'c',text:'Rotation'},{id:'d',text:'Projection'}], answer:'b', help:"Image miroir = réflexion ou symétrie axiale."},
          {q:"On fait tourner une figure de 90° autour d'un point central. C'est une…", options:[{id:'a',text:'Translation'},{id:'b',text:'Réflexion'},{id:'c',text:'Rotation'},{id:'d',text:'Agrandissement'}], answer:'c', help:"Tourner autour d'un point = rotation."},
          {q:"Après une translation de 2 cases vers le haut, un point en (3,1) se retrouve à…", options:[{id:'a',text:'(3,3)'},{id:'b',text:'(5,1)'},{id:'c',text:'(1,1)'},{id:'d',text:'(3,−1)'}], answer:'a', help:"2 cases vers le haut → y augmente de 2 : (3, 1+2) = (3, 3)."},
          {q:"Quelle transformation conserve la forme ET les dimensions de la figure ?", options:[{id:'a',text:'Agrandissement'},{id:'b',text:'Translation'},{id:'c',text:'Réduction'},{id:'d',text:'Étirement'}], answer:'b', help:"La translation ne change ni la forme ni la taille."},
          {q:"Une figure a été tournée de 180°. Elle ressemble à…", options:[{id:'a',text:'Elle est inversée (retournée)'},{id:'b',text:'Elle est identique'},{id:'c',text:'Elle est agrandie'},{id:'d',text:'Elle a disparu'}], answer:'a', help:"180° = demi-tour → la figure est retournée."},
          {q:"La réflexion d'un point (2, 3) par rapport à l'axe des y donne…", options:[{id:'a',text:'(2, −3)'},{id:'b',text:'(−2, 3)'},{id:'c',text:'(3, 2)'},{id:'d',text:'(−2, −3)'}], answer:'b', help:"Réflexion par rapport à l'axe y : x change de signe → (−2, 3)."},
          {q:"Quelle transformation donne une image de même taille mais à un endroit différent ?", options:[{id:'a',text:'Agrandissement'},{id:'b',text:'Rotation'},{id:'c',text:'Translation'},{id:'d',text:'Réduction'}], answer:'c', help:"La translation déplace sans changer la taille."},
          {q:"Un carré tourne de 90°. À quoi ressemble-t-il ?", options:[{id:'a',text:'Un rectangle'},{id:'b',text:'Un losange'},{id:'c',text:'Un carré identique'},{id:'d',text:'Un cercle'}], answer:'c', help:"Un carré est symétrique — une rotation de 90° donne un carré identique."},
          {q:"La réflexion d'un point (4, −2) par rapport à l'axe des x donne…", options:[{id:'a',text:'(4, 2)'},{id:'b',text:'(−4, −2)'},{id:'c',text:'(−4, 2)'},{id:'d',text:'(2, 4)'}], answer:'a', help:"Réflexion par rapport à l'axe x : y change de signe → (4, 2)."},
        ]
      },
      {
        id:"5-8", title:"Probabilité MEQ", desc:"Calculer et comparer des probabilités", type:"statistics",
        questions:[
          {q:"Un sac contient 3 billes rouges et 7 billes bleues. Probabilité (%) de tirer une rouge ?", answer:30, help:"3 rouges ÷ 10 total = 30%."},
          {q:"On lance un dé à 6 faces. Probabilité (%) d'obtenir un 3 ?", answer:17, help:"1 chance sur 6 ≈ 17 % (arrondi)."},
          {q:"Un paquet de 10 cartes numérotées 1 à 10. Probabilité (%) de tirer un nombre pair ?", answer:50, help:"5 pairs (2,4,6,8,10) sur 10 = 50%."},
          {q:"Un sac : 4 rouges, 4 bleues, 2 vertes. Probabilité (%) de tirer une verte ?", answer:20, help:"2 vertes ÷ 10 = 20%."},
          {q:"Une roue divisée en 4 secteurs égaux : rouge, bleu, vert, jaune. Probabilité (%) d'arrêter sur le bleu ?", answer:25, help:"1 secteur sur 4 = 25%."},
          {q:"Une pièce de monnaie est lancée. Probabilité (%) d'obtenir face ?", answer:50, help:"1 résultat sur 2 possibles = 50%."},
          {q:"Un sac : 2 rouges, 3 bleues, 5 vertes. Probabilité (%) de tirer une bleue ?", answer:30, help:"3 bleues ÷ 10 = 30%."},
          {q:"Un dé à 6 faces. Probabilité (%) d'obtenir un nombre > 4 ?", answer:33, help:"Les nombres > 4 sont : 5 et 6 (2 sur 6) ≈ 33 % (arrondi)."},
          {q:"Sac : 6 rouge, 4 jaune. Probabilité (%) de tirer une jaune ?", answer:40, help:"4 jaunes ÷ 10 = 40%."},
          {q:"Dé à 6 faces. Probabilité (%) d'obtenir un nombre impair ?", answer:50, help:"Impairs : 1,3,5 (3 sur 6) = 50%."},
        ]
      },
    ]
  },

  6: {
    title: "6e Année (11-12 ans)",
    color: "from-rose-400 to-red-500",
    lessons: [
      {
        id:"6-1", title:"C1 : La kermesse de l'école", desc:"Situation-problème multi-étapes (MEQ)", type:"situation-problem",
        questions:[
          {q:"Jeu à 20 $ avec rabais 15 %, collation à 5 $, taxe 10 %. Coût final ?", answer:24.2, steps:["Rabais : 20 × 0.85 = 17 $","Sous-total : 17 + 5 = 22 $","Taxe : 22 × 1.10 = 24.20 $"], help:"Rabais → addition → taxe."},
          {q:"Parc 30 m × 20 m. On double la longueur. Nouveau périmètre ?", answer:160, steps:["Nouvelle longueur : 30×2=60 m","Périmètre : (60+20)×2=160 m"], help:"Double L puis calcule périmètre."},
          {q:"Recette pour 4 personnes : 120 g de sucre. Quantité pour 6 personnes ?", answer:180, steps:["Par personne : 120÷4=30 g","Pour 6 : 30×6=180 g"], help:"Taux unitaire puis multiplie."},
          {q:"Bibliothèque : 200 livres. 40 % sont des BD. Combien de romans ?", answer:120, steps:["Romans : 100%−40%=60%","200×0.60=120"], help:"Trouve le % de romans."},
          {q:"Tirelire : 50 $ au départ, + 15 $/semaine. Total après 10 semaines ?", answer:200, steps:["Épargne : 15×10=150 $","Total : 150+50=200 $"], help:"Épargne × semaines + départ."},
          {q:"Citerne de 500 L fuit à 5 L/h. Heures pour être à moitié vide ?", answer:50, steps:["Moitié : 500÷2=250 L","Temps : 250÷5=50 h"], help:"Calcule la moitié, divise par débit."},
          {q:"3 amis achètent 4 pizzas à 12 $ chacune. Ils se partagent le coût également. Combien chacun paie-t-il ?", answer:16, steps:["Total : 4×12=48 $","Par personne : 48÷3=16 $"], help:"Total puis divise."},
          {q:"Un cycliste roule à 18 km/h pendant 2,5 h. Quelle distance a-t-il parcourue ?", answer:45, steps:["Distance = vitesse × temps","18×2,5=45 km"], help:"d = v × t."},
          {q:"Une salle rectangulaire 15 m × 8 m. On pose un tapis de 6 m × 4 m. Aire non couverte ?", answer:96, steps:["Aire salle : 15×8=120 m²","Aire tapis : 6×4=24 m²","Non couverte : 120−24=96 m²"], help:"Aire salle minus aire tapis."},
          {q:"Un billet de train coûte 22,50 $ aller. On achète 4 allers-retours. Total ?", answer:180, steps:["Aller-retour : 22,50×2=45 $","4 AR : 45×4=180 $"], help:"AR = 2× l'aller, multiplie par 4."},
        ]
      },
      {
        id:"6-2", title:"Moyenne et Probabilités", desc:"Analyser des ensembles de données", type:"statistics",
        questions:[
          {q:"Moyenne de : 75, 80, 85, 90, 70", answer:80, help:"Somme (400) ÷ 5 = 80."},
          {q:"Sac : 3 rouges, 2 bleues, 5 vertes. Probabilité (%) de piocher une bleue ?", answer:20, help:"2÷10=20%."},
          {q:"Moyenne de : −2, 4, 8, 10", answer:5, help:"−2+4+8+10=20 ; 20÷4=5."},
          {q:"Dé à 6 faces. Probabilité (%) d'obtenir un nombre pair ?", answer:50, help:"3 pairs sur 6 = 50%."},
          {q:"Moyenne de : 12, 15, 18, 23", answer:17, help:"Somme=68 ; 68÷4=17."},
          {q:"Sac : 1 noire, 3 blanches. Probabilité (%) de tirer la noire ?", answer:25, help:"1 sur 4 = 25%."},
          {q:"Notes de maths : 72, 68, 85, 91, 74. Quelle est la moyenne ?", answer:78, help:"(72+68+85+91+74)=390 ; 390÷5=78."},
          {q:"Urne : 5 rouges, 3 bleues, 2 jaunes. Probabilité (%) de tirer une rouge ?", answer:50, help:"5÷10=50%."},
          {q:"Températures : 22, 19, 25, 18, 21. Quelle est la moyenne ?", answer:21, help:"(22+19+25+18+21)=105 ; 105÷5=21."},
          {q:"Sac : 4 vertes, 4 rouges, 2 bleues. Probabilité (%) d'une bleue ?", answer:20, help:"2÷10=20%."},
        ]
      },
      {
        id:"6-3", title:"C2 : Raisonnement mathématique", desc:"Situations complexes multi-étapes", type:"situation-problem",
        questions:[
          {q:"Piscine rectangulaire 15 m × 8 m. Longueur de bordure nécessaire tout autour ?", answer:46, steps:["Périmètre=(15+8)×2=46 m"], help:"(L+l)×2."},
          {q:"3 amis partagent 375 $ également. Chacun dépense 45 $. Combien reste-t-il à chacun ?", answer:80, steps:["Part : 375÷3=125 $","Reste : 125−45=80 $"], help:"Divise puis soustrais."},
          {q:"Pommes achetées à 0,40 $ et revendues à 0,75 $. Profit sur 120 pommes ?", answer:42, steps:["Profit unitaire : 0,75−0,40=0,35 $","Total : 0,35×120=42 $"], help:"Profit unitaire × quantité."},
          {q:"Marie épargne 60 % des 250 $ reçus. Combien a-t-elle dépensé ?", answer:100, steps:["Épargne : 250×0,60=150 $","Dépensé : 250−150=100 $"], help:"Calcule l'épargne, reste = dépense."},
          {q:"Train à 120 km/h pendant 2 h 30 min. Quelle distance ?", answer:300, steps:["2 h 30 min = 2,5 h","120×2,5=300 km"], help:"Convertis les minutes en fraction."},
          {q:"Salle 12 m × 9 m, carreaux de 1 m². Combien de carreaux ?", answer:108, steps:["Aire=12×9=108 m²","1 carreau=1 m² → 108"], help:"Aire = nombre de carreaux."},
          {q:"Un rectangle a un périmètre de 54 cm. Sa longueur est le double de sa largeur. Quelle est la largeur ?", answer:9, steps:["Soit l la largeur ; longueur=2l","2(2l+l)=54 → 6l=54 → l=9 cm"], help:"Périmètre = 2(L+l), L=2l."},
          {q:"Un capital de 2 000 $. Intérêt de 5 % par année. Intérêt après 3 ans (simple) ?", answer:300, steps:["Intérêt annuel : 2 000×0,05=100 $","3 ans : 100×3=300 $"], help:"Intérêt simple = capital × taux × temps."},
          {q:"On remplit un réservoir de 240 L à 40 L/min. Puis on en utilise 80 L. Volume restant ?", answer:160, steps:["Remplissage : 6 min pour 240 L","Restant : 240−80=160 L"], help:"Calcule le plein puis soustrais."},
          {q:"Vitesse A : 60 km/h. Vitesse B : 80 km/h. Différence de distance après 2,5 h ?", answer:50, steps:["A : 60×2,5=150 km","B : 80×2,5=200 km","Différence : 200−150=50 km"], help:"Calcule chaque distance puis soustrais."},
        ]
      },
      {
        id:"6-4", title:"Examen fin d'année MEQ", desc:"Situations-problèmes C1 style examen officiel", type:"situation-problem",
        questions:[
          {q:"Mégane achète 3 livres à 12,75 $ chacun. Elle paie avec 50 $. Quelle monnaie reçoit-elle ?", answer:11.75, steps:["Total : 3×12,75=38,25 $","Monnaie : 50−38,25=11,75 $"], help:"Multiplie puis soustrais."},
          {q:"28 élèves en sortie. Autobus de 12 places. Combien d'autobus minimum ?", answer:3, steps:["28÷12=2 reste 4","Il faut 3 autobus"], help:"Arrondi vers le haut si reste."},
          {q:"120 croissants par jour. 80 % vendus le matin. Combien reste-t-il l'après-midi ?", answer:24, steps:["Vendus : 120×0,80=96","Restants : 120−96=24"], help:"Calcule 80% puis soustrais."},
          {q:"Périmètre d'un carré = 52 cm. Calcule son aire.", answer:169, steps:["Côté=52÷4=13 cm","Aire=13×13=169 cm²"], help:"Trouve le côté puis calcule l'aire."},
          {q:"Jeu à 85 $ avec 20 % de rabais puis 20 % de taxe. Prix final ?", answer:81.6, steps:["Prix réduit : 85×0,80=68 $","Avec taxe : 68×1,20=81,60 $"], help:"Rabais d'abord, taxe ensuite."},
          {q:"Alexis court 8,5 km par jour. En combien de jours aura-t-il couru 127,5 km ?", answer:15, steps:["127,5÷8,5=15 jours"], help:"Divise la distance totale par la quotidienne."},
          {q:"Un triangle isocèle a un périmètre de 40 cm. Sa base mesure 10 cm. Longueur d'un côté égal ?", answer:15, steps:["Les 2 côtés égaux : (40−10)÷2=15 cm"], help:"P = 2×côté + base → côté = (P−base)÷2."},
          {q:"Un robinet fuit à 0,5 L/h. Combien de litres perdus en une semaine ?", answer:84, steps:["24×7=168 h par semaine","0,5×168=84 L"], help:"Litres = débit × heures totales."},
          {q:"Un investissement de 5 000 $ rapporte 4 % par an. Valeur après 1 an ?", answer:5200, steps:["Intérêt : 5 000×0,04=200 $","Valeur : 5 000+200=5 200 $"], help:"Valeur = capital + intérêt."},
          {q:"Un rectangle de 14 cm × 9 cm. Calcule son périmètre et son aire. Écris l'aire.", answer:126, steps:["Périmètre : (14+9)×2=46 cm","Aire : 14×9=126 cm²"], help:"Aire = L × l = 14 × 9."},
        ]
      },
      {
        id:"6-5", title:"Algèbre : équations simples MEQ", desc:"Résoudre des équations à une variable", type:"barmodel",
        questions:[
          {q:"x + 5 = 12. Quelle est la valeur de x ?", answer:7, help:"x = 12 − 5 = 7."},
          {q:"3 × n = 24. Quelle est la valeur de n ?", answer:8, help:"n = 24 ÷ 3 = 8."},
          {q:"y − 9 = 15. Quelle est la valeur de y ?", answer:24, help:"y = 15 + 9 = 24."},
          {q:"z ÷ 4 = 7. Quelle est la valeur de z ?", answer:28, help:"z = 7 × 4 = 28."},
          {q:"2a + 3 = 11. Quelle est la valeur de a ?", answer:4, help:"2a = 11−3=8 → a=8÷2=4."},
          {q:"15 − b = 6. Quelle est la valeur de b ?", answer:9, help:"b = 15 − 6 = 9."},
          {q:"4x = 36. Quelle est la valeur de x ?", answer:9, help:"x = 36 ÷ 4 = 9."},
          {q:"c ÷ 6 + 2 = 7. Quelle est la valeur de c ?", answer:30, help:"c÷6 = 5 → c = 5×6 = 30."},
          {q:"3(m − 2) = 18. Quelle est la valeur de m ?", answer:8, help:"m−2 = 6 → m = 8."},
          {q:"n + n + 4 = 20. Quelle est la valeur de n ?", answer:8, help:"2n = 16 → n = 8."},
        ]
      },
      {
        id:"6-6", title:"Géométrie avancée MEQ", desc:"Figures composées et introduction aux cercles", type:"area",
        questions:[
          {q:"Un rectangle 10 cm × 6 cm avec un trou carré de 2 cm × 2 cm. Aire nette ?", w:10, h:6, askArea:true, answer:56, help:"Aire rectangle − Aire trou = 60−4=56 cm²."},
          {q:"Un L-shape : rectangle 8×5 avec un coin 3×2 enlevé. Aire ?", w:8, h:5, askArea:true, answer:34, help:"8×5=40, 3×2=6, 40−6=34 cm²."},
          {q:"Un carré de 7 cm. Calcule son aire.", w:7, h:7, askArea:true, answer:49, help:"7 × 7 = 49 cm²."},
          {q:"Un rectangle 12 cm × 5 cm. Calcule son périmètre.", w:12, h:5, askArea:false, answer:34, help:"(12+5)×2=34 cm."},
          {q:"Un carré a un périmètre de 44 cm. Calcule son aire.", w:null, h:null, askArea:true, answer:121, help:"Côté=44÷4=11 cm. Aire=11²=121 cm²."},
          {q:"Rectangle 20 cm × 8 cm. Calcule son aire.", w:20, h:8, askArea:true, answer:160, help:"20×8=160 cm²."},
          {q:"Un rectangle a une aire de 90 cm² et une largeur de 9 cm. Longueur ?", w:null, h:9, askArea:true, answer:10, help:"L=90÷9=10 cm."},
          {q:"Un carré a un côté de 12 cm. Calcule son aire.", w:12, h:12, askArea:true, answer:144, help:"12×12=144 cm²."},
          {q:"Rectangle 15 cm × 7 cm. Calcule son périmètre.", w:15, h:7, askArea:false, answer:44, help:"(15+7)×2=44 cm."},
          {q:"Un rectangle a une aire de 72 cm². Sa longueur est 12 cm. Quelle est sa largeur ?", w:12, h:null, askArea:true, answer:6, help:"l=72÷12=6 cm."},
        ]
      },
      {
        id:"6-7", title:"Médiane et mode MEQ", desc:"Calculer moyenne, médiane et mode", type:"statistics",
        questions:[
          {q:"Données : 3, 7, 7, 9, 4. Quelle est la médiane ?", answer:7, help:"Ordre croissant : 3,4,7,7,9. Valeur centrale = 7."},
          {q:"Données : 5, 5, 8, 12, 10. Quel est le mode (la valeur la plus fréquente) ?", answer:5, help:"5 apparaît 2 fois, les autres 1 fois → mode = 5."},
          {q:"Données : 2, 4, 6, 8, 10. Quelle est la moyenne ?", answer:6, help:"Somme=30 ; 30÷5=6."},
          {q:"Données : 11, 13, 13, 17, 19. Quelle est la médiane ?", answer:13, help:"Ordre : 11,13,13,17,19. Valeur centrale = 13."},
          {q:"Notes : 80, 72, 95, 88, 75. Quelle est la moyenne ?", answer:82, help:"(80+72+95+88+75)=410 ; 410÷5=82."},
          {q:"Données : 6, 6, 6, 8, 9, 11. Quel est le mode ?", answer:6, help:"6 apparaît 3 fois → mode = 6."},
          {q:"Données : 1, 3, 5, 7, 9, 11. Quelle est la médiane ?", answer:6, help:"6 valeurs : moyenne des 2 centrales (5+7)÷2=6."},
          {q:"Données : 20, 30, 30, 40, 50. Quelle est la moyenne ?", answer:34, help:"(20+30+30+40+50)=170 ; 170÷5=34."},
          {q:"Données : 4, 4, 7, 8, 8, 9. Quel est/quels sont les modes ?", answer:4, help:"4 et 8 apparaissent chacun 2 fois. Écris le plus petit : 4."},
          {q:"Températures (°C) sur 7 jours : 18, 22, 19, 25, 22, 21, 19. Quelle est la médiane ?", answer:21, help:"Ordre : 18,19,19,21,22,22,25. Valeur centrale (4e) = 21."},
        ]
      },
      {
        id:"6-8", title:"Préparation au secondaire MEQ", desc:"Problèmes complexes de préparation au secondaire", type:"situation-problem",
        questions:[
          {q:"Un escalier a 12 marches de 20 cm de hauteur chacune. Hauteur totale en mètres ?", answer:2.4, steps:["12 × 20 = 240 cm","240 cm = 2,4 m"], help:"Multiplie, puis convertis en mètres."},
          {q:"Taux horaire 14,50 $/h. On travaille 35 h par semaine. Salaire hebdomadaire ?", answer:507.5, steps:["14,50 × 35 = 507,50 $"], help:"Taux × heures = salaire."},
          {q:"Compte bancaire : +1 250 $ le 1er, −370 $ le 5, −285 $ le 12. Solde final ?", answer:595, steps:["1 250 − 370 = 880 $","880 − 285 = 595 $"], help:"Additionne et soustrais dans l'ordre."},
          {q:"Un triangle rectangle a des jambes de 6 cm et 8 cm. Quelle est la longueur de l'hypoténuse ?", answer:10, steps:["c² = 6² + 8² = 36 + 64 = 100","c = √100 = 10 cm"], help:"Théorème de Pythagore : c² = a² + b²."},
          {q:"Un magasin applique 25 % de rabais puis 15 % de taxes sur 80 $. Prix final ?", answer:69, steps:["Prix réduit : 80×0,75=60 $","Avec taxe : 60×1,15=69 $"], help:"Rabais d'abord, taxe ensuite."},
          {q:"Une piscine de 50 m × 25 m est entourée d'un chemin de 2 m de large. Aire du chemin ?", answer:316, steps:["Dimensions totales : (50+4)×(25+4) = 54×29","Aire totale : 54×29 = 1566 m²","Aire piscine : 50×25 = 1250 m²","Chemin : 1566−1250 = 316 m²"], help:"Aire grand rectangle − aire piscine."},
          {q:"On mélange 2 L de jus à 30 % de sucre avec 3 L à 20 % de sucre. Quelle est la concentration finale ?", answer:24, steps:["Sucre total : 0,6+0,6=1,2 L","Volume total : 5 L","Concentration : 1,2÷5=24%"], help:"Sucre total ÷ volume total × 100."},
          {q:"Plan à l'échelle 1:50 000. Sur la carte, la distance est 4,2 cm. Distance réelle en km ?", answer:2.1, steps:["Distance réelle=4,2×50 000=210 000 cm","210 000 cm = 2,1 km"], help:"Multiplie par l'échelle puis convertis."},
          {q:"Un investissement de 10 000 $ à 6 % d'intérêt composé annuel. Valeur après 2 ans ?", answer:11236, steps:["Après 1 an : 10 000×1,06=10 600 $","Après 2 ans : 10 600×1,06=11 236 $"], help:"Intérêt composé : multiplie par 1,06 chaque année."},
          {q:"Un conteneur de 2 m × 1,5 m × 1 m est rempli à 75 %. Volume d'eau en m³ ?", answer:2.25, steps:["Volume total : 2×1,5×1=3 m³","75% de 3 = 2,25 m³"], help:"Volume total × 75%."},
        ]
      },
    ]
  },
};
