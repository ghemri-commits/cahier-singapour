# Cahier de Mathématiques — Méthode Singapour

Application web éducative pour les enfants du primaire au Québec.
Méthode Singapour (CPA : Concret, Pictural, Abstrait).
Programme 1re, 2e et 3e année.

## Développement local

```bash
npm install
npm run dev
```

L'app s'ouvre à http://localhost:5173

## Déploiement Vercel

Voir le fichier README-deploiement.md pour les instructions détaillées.

## Profils par défaut

- Enfant 1 : Liam, 1re année, NIP 1111
- Enfant 2 : Camila, 2e année, NIP 2222
- Invité : désactivé par défaut, NIP 3333 (activable dans Réglages)
- Parent : NIP 1234

Modifiable dans Accès parent → Réglages.

## Profils partagés avec l'app Kumon

Cette app utilise la même clé localStorage `cahier:config` que l'app Kumon.
Si les deux apps sont déployées sur le même domaine, les profils sont synchronisés
automatiquement (mêmes noms, mêmes NIP, mêmes couleurs).

Si elles sont sur des domaines différents (par exemple kumon.vercel.app vs
singapour.vercel.app), les profils sont indépendants — il faudra les configurer
dans chaque app.
