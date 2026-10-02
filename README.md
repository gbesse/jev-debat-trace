# Jev Débat Trace

**Suit la manière dont les arguments d’un débat public français apparaissent dans les engagements ultérieurs du maître d’ouvrage.**

[![Tests](https://github.com/gbesse/jev-debat-trace/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-debat-trace/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.4 · Documentation française

Le dépôt compare une contribution sourcée à une décision ou un engagement plus récent du même projet et classe la relation : adoption, reprise partielle, réponse sans modification, absence de traitement ou autre sujet.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-debat-trace.git
cd jev-debat-trace
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple suit une proposition de desserte dans un engagement ultérieur. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { traceContribution } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const p = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    relation: {
      type: "choice",
      choice: "partially_reflected",
      probabilities: {
        adopted: 0.12,
        partially_reflected: 0.7,
        answered_without_change: 0.1,
        unaddressed: 0.05,
        unrelated: 0.03,
      },
      confidence: 0.7,
    },
  },
  usage: {},
}));
const resultat = await traceContribution(
  {
    id: "c1",
    projectId: "transport-1",
    text: "Ajouter une desserte au quartier nord.",
    date: "2026-02-01",
    sourceUrl: "https://debatpublic.fr",
  },
  {
    id: "k1",
    projectId: "transport-1",
    text: "Une étude de desserte complémentaire du nord sera lancée.",
    date: "2026-06-01",
    sourceUrl: "https://debatpublic.fr",
    authorType: "maitre_ouvrage",
  },
  p,
);
assert.equal(resultat.relation, "partially_reflected");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `relation: partially_reflected`.

### Cas limite à tester

Deux identifiants de projet différents interrompent le rapprochement. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `relation: different_project · appels Jev: 0`. La commande `npm run demo` exécute les deux exemples.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-debat-trace`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

L’identité du projet, la provenance et la chronologie sont imposées par le code. Jev n’infère ni représentativité, ni consensus, ni légitimité du projet.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://www.data.gouv.fr/datasets/saisines-de-la-cndp](https://www.data.gouv.fr/datasets/saisines-de-la-cndp)
- [https://www.debatpublic.fr](https://www.debatpublic.fr)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-debat-trace** : le scénario principal et la frontière déterministe. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
