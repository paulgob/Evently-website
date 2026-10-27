# Evently Website

Site vitrine du CMS **Evently**. Evently permet de créer des sites web à partir de modules pensés pour l'événementiel (festivals, marathons, séminaires…).

## Stack

- HTML / JavaScript / Three.JS / TailwindCSS
- Polices Google Fonts : Newsreader (titres) et Manrope (texte). Dépendance validée.
- Aucune autre dépendance sans validation préalable.

## Documents de référence

- `ai-guide/design.md` : direction artistique, palette, typographie (mode clair uniquement). Toujours utiliser ces couleurs et polices, sans en inventer d'autres.
- `ai-guide/lessons.md` : bonnes pratiques, conventions, principes de travail. Toujours le lire avant de commencer un développement.
- `ai-guide/structure.md` : structure du site, structure d'une page, conventions de nommage. Toujours le lire avant de commencer un développement.

## Structure

- voir `ai-guide/structure.md` pour l'arborescence, la structure d'une page et les conventions de nommage.

## Conventions

- Contenu du site en français.
- Le header, la nav et le footer sont dupliqués dans chaque page : toute modification de l'un d'eux doit être reportée sur **toutes les pages**.
- Responsive obligatoire (mobile d'abord).
- Accessibilité de base : balises sémantiques, `alt` sur les images, contrastes suffisants.

## Méthode de travail

- Si la demande est ambiguë, pose une question avant de coder.
- Si quelque chose ne se passe pas comme prévu : arrête-toi, explique le problème et propose un nouveau plan avant de continuer.
- Ne modifie que ce qui est demandé. Signale les améliorations possibles sans les appliquer.

## Principes

- **Simplicité d'abord** : la solution la plus simple, avec le moins de code modifié possible.
- **Corriger la cause, pas le symptôme** : pas de rustine temporaire. Si la vraie correction dépasse le périmètre demandé, dis-le.

## Définition de « terminé »

- La page s'affiche sans erreur dans la console.
- Le rendu est correct en mobile et en desktop.
- Tous les liens internes fonctionnent.

## Apprentissage continu

Après chaque correction de ma part, ajoute une règle dans `ai-guide/lessons.md` (crée-le s'il n'existe pas) :

- une ligne par règle, formulée comme une consigne (« Toujours… » / « Ne jamais… ») ;
- pas de doublon : reformule une règle existante plutôt que d'en ajouter une proche.
