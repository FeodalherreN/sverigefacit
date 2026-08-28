# Datakatalog

Mappen `series/` är den gemensamma, versionshanterade sanningskällan för de svenska tidsserier som används i Datastudion, på startsidan, på faktasidor och på miljösidan. Varje mått har en egen JSON-fil så att ändringar blir lätta att granska och mindre sidor inte behöver ladda hela katalogen. `series/catalog.json` anger schema, ordning och uppdateringspolicy.

Varje serie innehåller:

- ett stabilt id och en ämnesgrupp
- enhet, etiketter och diagramfärg
- direktlänk och tabell- eller dataset-id för originalkällan
- metodbegränsning
- år och värde för varje observation

`series/catalog.json` dokumenterar även matematiskt inbyggda samband, till exempel att migrationsnetto bygger på invandring minus utvandring och att reallön bygger på nominell lön justerad för inflation. Datastudion använder metadatafältet för att varna när en hög korrelation inte är ett oberoende fynd.

## Uppdateringsprincip

Svenska serier hämtas inte om automatiskt när en besökare öppnar sidan. En uppdatering görs kontrollerat mot originalkällan, valideras lokalt, granskas som en vanlig kodändring och versionshanteras före publicering. Det gör att en publicerad analys kan återskapas även om en myndighet senare reviderar sin tabell eller ett API tillfälligt ligger nere.

Eurostats internationella jämförelser är ett dokumenterat undantag. De hämtas från Eurostats API i webbläsaren och har kontrollerade reservvärden i `app/international-reference-data.ts`.

## Innan publicering

Kör `npm run data:validate`. Kontrollen stoppar bland annat duplicerade serie-id:n, osorterade eller dubbla år, icke-numeriska värden, saknade metodbegränsningar och ogiltiga källänkar.

Den sammanslagna, maskinläsbara katalogen publiceras även på `/data/series.json`.
