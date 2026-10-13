# Istruzioni per l'aggiornamento settimanale

Ogni lunedì mattina si preparano ~12 nuove ricette di stagione per l'app "Martedì da chef" e si pubblicano in
`settimana.json`. L'app le scarica da `https://raw.githubusercontent.com/eltini96/MartediDaChef-proposte/main/settimana.json`.

## Passi
1. Calcola la settimana ISO corrente (es. `2026-W43`). Se `settimana.json` ha già quella settimana con ricette, fermati.
2. Sposta la `settimana.json` attuale (se ha ricette) in `archivio/<settimana>.json`.
3. Scegli **12 ricette** (minimo 10) dal sito GialloZafferano (`ricette.giallozafferano.it`):
   - **di stagione** per il mese corrente in Italia (frutta e verdura del mese);
   - **difficoltà "Media"** (se non bastano, "Facile") e **costo "Basso" o "Medio"** (mai "Elevato"/"Molto elevato");
   - varie: almeno 3 primi, 2 secondi, 1 contorno o antipasto, 2 dolci, 1 lievitato;
   - **mai** ricette già in `gia-nell-app.json` o in `archivio/` delle ultime 8 settimane (confronta i titoli);
   - difficoltà e costo si leggono nella pagina: `estimatedCost` nel JSON-LD e "Difficoltà: <strong>…</strong>" nell'HTML.
4. Per ogni ricetta leggi i dati strutturati della pagina (`<script type="application/ld+json">`, oggetto `@type: Recipe`):
   nome, `recipeCategory`, `recipeYield`, `prepTime`, `cookTime`, `estimatedCost`, `recipeIngredient`.
   Ingredienti, dosi e tempi sono dati e si possono riportare.
5. **Il procedimento NON si copia**: scrivilo da capo con parole tue, in italiano, 5-8 passi chiari all'imperativo
   (seconda persona: "Taglia…", "Cuoci…"), coerenti con gli ingredienti e i tempi. Niente frasi riprese dal sito.
   Nessuna foto (le immagini del sito sono protette).
6. Scrivi `settimana.json` nel formato sotto e lancia `node valida.mjs`: deve dire "valido". Correggi finché non lo è.
7. Commit (`Proposte <settimana>`) e push su `main`.

## Formato
```json
{
  "formato": "martedi-da-chef/ricette-1",
  "settimana": "2026-W43",
  "aggiornato": "2026-10-19",
  "nota": "Frase breve sulla settimana (es. Zucca, cavoli e prime castagne).",
  "ricette": [
    {
      "titolo": "Gnocchi di zucca",
      "categoria": "Primi",            // Antipasti | Primi | Secondi | Contorni | Dolci | Lievitati | Bevande | Altro
      "porzioni": 4,
      "tempoPrep": 40, "tempoCottura": 40,   // minuti
      "difficolta": "Media",           // Facile | Media | Difficile
      "costo": "Basso",                // Molto basso | Basso | Medio
      "ingredienti": [
        { "nome": "zucca mantovana", "qta": 500, "unita": "g", "nota": "da pulire" },
        { "nome": "tuorli", "qta": 2, "unita": "pz" },
        { "nome": "sale fino", "qta": null, "unita": "q.b." }
      ],
      "passi": ["…", "…"],
      "note": "",
      "foto": null,
      "tag": ["autunno"],
      "stagione": ["ottobre", "novembre"],
      "preferita": false,
      "fonte": { "nome": "GialloZafferano", "url": "https://ricette.giallozafferano.it/Gnocchi-di-zucca.html" }
    }
  ]
}
```
Unità ammesse: `g`, `kg`, `ml`, `l`, `cucchiaio`, `cucchiaino`, `tazza`, `pz`, `spicchio`, `foglia`, `pizzico`, `q.b.`
(al singolare). Unità diverse (rametto, costa, ciuffo, bicchiere…) diventano `pz` con l'unità nella `nota`.
Nomi degli ingredienti in minuscolo (salvo nomi propri: "Parmigiano Reggiano DOP").
