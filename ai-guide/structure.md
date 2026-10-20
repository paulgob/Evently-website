# Structure — Evently

## 1. Arborescence

- `index.html` : accueil. Présentation d'Evently, bouton de téléchargement, liens vers les autres pages.
- `documentation.html` : fonctionnement du CMS et guide d'installation.
- `a-propos.html` : équipe, objectifs du projet.
- `mentions-legales.html` : mentions légales et sources des œuvres.
- `assets/images/` : images et icônes.
- `assets/js/` : scripts partagés entre plusieurs pages.
- `assets/3d-models/` : modèles 3D pour les scènes.
- `ai-guide/` : documents de référence pour l'IA (design, structure, leçons).

## 2. Structure d'une page

- `<header>` : logo, nav, bouton de téléchargement. Commun à toutes les pages sauf `index.html` (qui a un hero à la place).
- `<main>` : contenu principal de la page, découpé en `<section>`.
- `<footer>` : lien vers les mentions légales et les sources des œuvres, liens vers les réseaux sociaux. Commun à toutes les pages.

## 3. Conventions de nommage

Tous les noms (fichiers, classes, identifiants, variables, fonctions) sont **en anglais**. Seuls les noms des pages HTML restent en français, car ils apparaissent dans l'URL.

### Fichiers et dossiers

- Les noms de fichiers et dossiers sont en minuscules, avec des tirets pour séparer les mots (ex. `hero-banner.webp`, `assets/images/`).

### Images

- Les images sont nommées avec des mots-clés décrivant leur contenu, en minuscules et avec des tirets (ex. `hero-concert.jpg`, `logo-evently.svg`).
- Elles sont placées dans le dossier `assets/images/` ou un sous-dossier spécifique (ex. `assets/images/heroes/`, `assets/images/logos/`).

### Classes et identifiants

- Utiliser les classes utilitaires Tailwind par défaut. Ne créer une classe personnalisée que pour un style répété sur plusieurs pages ou impossible à écrire avec Tailwind (ex. effet de papier découpé).
- Les classes personnalisées sont en minuscules, avec des tirets pour séparer les mots (ex. `.main-section`, `.download-button`).
- Ne pas utiliser d'identifiants (`id`) sauf si nécessaire pour le JavaScript ou les ancres. Les identifiants sont en minuscules, avec des tirets (ex. `#menu-toggle`, `#contact-section`).

### JavaScript

- Les fichiers JavaScript sont nommés avec des mots-clés décrivant leur fonction, en minuscules et avec des tirets (ex. `navigation-menu.js`, `scene-3d.js`).
- Un script court et propre à une page reste dans un `<script>` en fin de `<body>`. Un script partagé ou long va dans `assets/js/`, ou dans un sous-dossier spécifique (ex. `assets/js/components/`, `assets/js/utils/`).
- Les variables et fonctions sont en camelCase (ex. `menuToggle`, `isOpen`, `detectBackground`).
