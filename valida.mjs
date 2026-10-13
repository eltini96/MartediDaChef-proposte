// Controlla settimana.json prima della pubblicazione. Uso: node valida.mjs
import { readFileSync, readdirSync } from "node:fs";

const CATEGORIE = ["Antipasti", "Primi", "Secondi", "Contorni", "Dolci", "Lievitati", "Bevande", "Altro"];
const UNITA = ["g", "kg", "ml", "l", "cucchiaio", "cucchiaino", "tazza", "pz", "spicchio", "foglia", "pizzico", "q.b."];
const errori = [];
const no = (msg) => errori.push(msg);

const dati = JSON.parse(readFileSync("settimana.json", "utf8"));
if (dati.formato !== "martedi-da-chef/ricette-1") no("formato sbagliato");
if (!/^\d{4}-W\d{2}$/.test(dati.settimana || "")) no("settimana mancante o non nel formato AAAA-Wnn");
const ricette = Array.isArray(dati.ricette) ? dati.ricette : [];
if (ricette.length < 10 || ricette.length > 15) no(`servono 10-15 ricette, ce ne sono ${ricette.length}`);

const norm = (t) => String(t || "").trim().toLowerCase();
const vietati = new Set(JSON.parse(readFileSync("gia-nell-app.json", "utf8")).map(norm));
for (const f of readdirSync("archivio").filter((f) => f.endsWith(".json")).sort().slice(-8)) {
  for (const r of JSON.parse(readFileSync(`archivio/${f}`, "utf8")).ricette || []) vietati.add(norm(r.titolo));
}
const visti = new Set();
for (const [i, r] of ricette.entries()) {
  const chi = `ricetta ${i + 1} (${r.titolo || "senza titolo"})`;
  if (!r.titolo) no(`${chi}: manca il titolo`);
  if (vietati.has(norm(r.titolo))) no(`${chi}: già proposta o già nell'app`);
  if (visti.has(norm(r.titolo))) no(`${chi}: doppione`);
  visti.add(norm(r.titolo));
  if (!CATEGORIE.includes(r.categoria)) no(`${chi}: categoria non valida`);
  if (!(r.porzioni > 0)) no(`${chi}: porzioni non valide`);
  if (!["Facile", "Media"].includes(r.difficolta)) no(`${chi}: difficoltà deve essere Facile o Media`);
  if (!["Molto basso", "Basso", "Medio"].includes(r.costo)) no(`${chi}: costo deve essere basso o medio`);
  if (!/^https:\/\/ricette\.giallozafferano\.it\//.test(r.fonte?.url || "")) no(`${chi}: fonte mancante`);
  if (r.foto) no(`${chi}: niente foto`);
  if (!Array.isArray(r.ingredienti) || r.ingredienti.length < 2) no(`${chi}: ingredienti mancanti`);
  for (const ing of r.ingredienti || []) {
    if (!ing.nome) no(`${chi}: ingrediente senza nome`);
    if (!UNITA.includes(ing.unita)) no(`${chi}: unità "${ing.unita}" non ammessa (${ing.nome})`);
    if (ing.unita === "q.b." ? ing.qta != null : !(ing.qta > 0)) no(`${chi}: quantità non valida (${ing.nome})`);
  }
  if (!Array.isArray(r.passi) || r.passi.length < 4) no(`${chi}: servono almeno 4 passi`);
}
if (errori.length) {
  console.log("NON valido:\n- " + errori.join("\n- "));
  process.exit(1);
}
console.log(`valido: ${ricette.length} ricette per la settimana ${dati.settimana}`);
