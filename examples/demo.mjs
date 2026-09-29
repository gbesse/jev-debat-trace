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
