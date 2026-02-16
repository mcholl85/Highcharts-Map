# Highcharts Map - Studio de cartographie des donnees

Application React/TypeScript pour visualiser des donnees communales sur une carte Highcharts (mode zone et mode bulles), avec saisie manuelle ou import CSV.

## Objectif produit

Le projet cible un usage operationnel simple:
- charger rapidement des valeurs par commune,
- basculer entre plusieurs modes de rendu,
- exporter la carte via le menu natif Highcharts,
- garder un socle de code testable et evolutif.

## Stack technique

- `React 18`
- `TypeScript`
- `Vite`
- `Ant Design`
- `Highcharts Maps`
- `Vitest + Testing Library` pour les tests unitaires

## Prerequis

- `Node.js 24.x` (aligne avec Vercel et `package.json`)
- `npm >= 11`

```bash
nvm use 24
npm install
```

## Lancement local

```bash
npm run dev
```

L'application est servie en local via Vite (HMR active).

## Scripts utiles

```bash
npm run dev           # demarrage local
npm run build         # build production (TypeScript + Vite)
npm run preview       # previsualisation du build
npm run lint          # lint ESLint
npm run test          # tests unitaires (Vitest)
npm run test:watch    # mode watch
npm run test:coverage # couverture de tests
```

## Format de donnees CSV

Colonnes attendues:
- `code` (obligatoire)
- `ville` (optionnelle)
- `value` (obligatoire, numerique)

Comportements:
- un code inconnu remonte une erreur utilisateur,
- les lignes invalides (code vide, valeur non numerique) sont ignorees.

## Architecture du code

Structure principale:

```text
src/
  features/charts/
    components/   # UI metier (formulaire, cartes, export csv modele)
    hooks/        # orchestration et etat metier (useDataCharts)
    utils/        # transformations pures (map <-> form)
    types/        # types metier
  constants/
    maps/         # geojson
```

Principes:
- la logique de transformation est concentree dans `utils` pour faciliter les tests,
- les composants restent focalises sur le rendu et les interactions utilisateur,
- le hook `useDataCharts` centralise le state management metier.

## Qualite et tests

Le projet inclut une suite unitaire couvrant notamment:
- transformations de donnees (`utils`),
- formulaire CSV (`MapForm`),
- hook metier (`useDataCharts`),
- generation des options chart (`MapChart`, `BubbleMapChart`).

Rapport de couverture:
- genere via `npm run test:coverage`,
- dossier `coverage/` ignore par Git.

## Export de carte

L'export est gere par le menu contextuel natif Highcharts (bouton sur la carte).  
Aucun bouton custom d'export n'est maintenu dans l'interface applicative.

## Deploiement

Vercel:
- configurer `Node.js Version = 24.x` dans les settings du projet,
- verifier que la branche cible est `main`,
- `npm run build` doit passer sans erreur en CI.

## Conventions de contribution

- Commits atomiques et messages explicites (`feat:`, `fix:`, `test:`, `chore:`).
- Pas de logique metier dans les composants si elle peut vivre dans `utils`/`hooks`.
- Toute regression corrigee doit idealement etre accompagnee d'un test.
- Eviter les changements de style non relies au besoin fonctionnel.
