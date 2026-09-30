// Cas limite : une contribution ne peut être reliée qu’au même projet.
import assert from "node:assert/strict";
import { traceContribution } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await traceContribution(
  {
    id: "c-2",
    projectId: "tram-a",
    text: "Ajouter une desserte",
    date: "2026-02-01",
    sourceUrl: "https://debatpublic.fr",
  },
  {
    id: "k-2",
    projectId: "tram-b",
    text: "Étudier une desserte",
    date: "2026-06-01",
    sourceUrl: "https://debatpublic.fr",
  },
  jev,
);
assert.equal(resultat.relation, "different_project");
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
