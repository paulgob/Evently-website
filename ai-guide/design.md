# Design — Evently

> Référence visuelle : planche « Palette événementielle / Couleurs du site » fournie par l'équipe.

## 1. Concept : les classiques détournés

Utiliser des œuvres classiques reconnaissables (sculptures antiques, peintures de la Renaissance, dessins de Léonard de Vinci) comme un **langage visuel pour raconter les événements d'aujourd'hui**.

- **Style** : éditorial, cultivé, artistique, intemporel. **Pas de low-poly.**
- **Collage** : l'œuvre (photo de sculpture ou peinture) est associée à des aplats de couleur géométriques (rectangles, cercles, triangles), à des objets contemporains (vinyle, onde sonore…) et à des fragments en noir et blanc. Le tout rappelle un collage papier.
- **Règle** : chaque visuel porte une idée, pas un simple collage décoratif.
- **Détourage des sculptures** : seul le fond relié aux bords de la photo devient transparent (remplissage depuis les bords, après une fermeture morphologique). Les creux sombres de la sculpture restent opaques, sans trou. Même méthode pour les masques PNG du hero et du footer et pour la scène 3D.
- **Sur le site** : l'interface reste sobre et lisible. Les visuels détournés portent la force graphique (hero, sections clés).
- **Éléments graphiques communs** (scène 3D et sections HTML) : aplats de papier découpé avec grain et ombre portée, vinyle, onde sonore, arcs et traits de vitesse, tracés de construction façon Vinci (grille, cercle et carré de Vitruve), fragments d'œuvres en noir et blanc.

## 2. Couleurs du site

Un socle neutre et élégant, avec des accents maîtrisés.

Le site n'a qu'un **mode clair** : pas de mode sombre.

| Rôle                      | Couleur                                                      |
| ------------------------- | ------------------------------------------------------------ |
| Fond principal            | `#F3EDE4` beige ivoire (papier, comme le fond de la planche) |
| Texte principal           | `#1E1E1E` anthracite                                         |
| Texte secondaire          | `#6B7280` gris                                               |
| Fond secondaire, bordures | `#D1D1C4` gris pierre                                        |
| Accent                    | `#D72638` rouge                                              |

- `#F8F7F2` (ivoire clair) reste utilisé pour le texte sur fond sombre ou coloré.
- Exception : le hero de l'accueil est une scène de concert sur fond `#0F1115` (bleu nuit), avec un texte ivoire.

### Éléments d'interface

| État              | HEX       |
| ----------------- | --------- |
| Actif / sélection | `#D72638` |
| Survol            | `#FEE2E2` |
| Succès            | `#10B981` |
| Avertissement     | `#F59E0B` |
| Erreur            | `#EF4444` |

## 3. Palette par type d'événement

Chaque événement a sa couleur, son atmosphère et son interprétation. Ces couleurs servent aux visuels, aux affiches et à certains éléments d'interface (onglets, filtres). Elles ne remplacent pas le socle du site.

| Type                      | Principal                  | Secondaire             | Détail           | Accent               | Œuvre / intention                                                          |
| ------------------------- | -------------------------- | ---------------------- | ---------------- | -------------------- | -------------------------------------------------------------------------- |
| Musique                   | `#E6392E` rouge électrique | `#1A1A1A` noir profond | `#F5E8DD` ivoire | `#7A1E1E` bordeaux   | Buste antique, vinyle, onde sonore. Énergie, rythme, liberté.              |
| Arts visuels              | `#2F6BFF` bleu outremer    | `#F0C419` jaune ocre   | `#F5EDE3` ivoire | `#1E1E1E` anthracite | Portrait de la Renaissance (Joconde), fragments. Création, regard.         |
| Exposition                | `#2E7D32` vert musée       | `#D1D1C4` gris pierre  | `#F5EDE3` ivoire | `#1E1E1E` anthracite | Buste et architecture classique. Découverte, transmission.                 |
| Sport                     | `#0B5ED7` bleu dynamique   | `#0F172A` bleu nuit    | `#F3EDE4` ivoire | `#F59E0B` orange     | Sculpture en mouvement, arcs et diagonales. Dépassement, collectif.        |
| Cinéma                    | `#8B5CF6` violet cinéma    | `#1E1B4B` bleu nuit    | `#F3EDE4` ivoire | `#F97316` orange     | Visage en gros plan, cadrage serré. Émotion, narration.                    |
| Scènes / spectacle vivant | `#D72638` rouge scène      | `#2B2B2B` gris charbon | `#F5EDE3` ivoire | `#F59E0B` orange     | Drapés, postures théâtrales. Mouvement, émotion.                           |
| Professionnel             | `#B47A19` ocre             | —                      | —                | —                    | Absent de la planche : couleur conservée de l'ancienne palette, à valider. |

## 4. Typographie

- **Titres** : Newsreader (serif éditoriale).
- **Texte courant** : Manrope (sans-serif lisible).
- Petits libellés (catégories, menu) : Manrope en capitales espacées.

## 5. Accessibilité

- Vérifier les contrastes texte / fond avant de valider un composant.

## 6. Droits des images

Une œuvre du domaine public n'implique pas que sa photo soit libre de droits. Pour chaque image :

- vérifier le statut de l'œuvre et les droits de la reproduction ;
- privilégier les collections aux conditions de réutilisation claires (ex. Met Museum Open Access, CC0) ;
- conserver la source et la licence.

La liste publique des sources est sur la page `mentions-legales.html#sources` : la tenir à jour à chaque nouvelle œuvre.
