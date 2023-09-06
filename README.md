# Train Controller

## Introduktion

Det här repot är en *Train Controller*-applikation utvecklad av *Nght and Day*-gruppen som en del av kursen *jsramverk* vid *Blekinge Tekniska Högskola (BTH)*.

Mer information om det här projektet finns på: https://jsramverk.se/. Data och API som används under kursen finns på https://api.trafikinfo.trafikverket.se/.

## Varför har vi en repo?

Vi har valt att använda en repo för både frontend och backend av flera anledningar. För det första kan vi säkerställa att frontend och backend är kompatibla med varandra efter varje commit. Detta kommer förhoppningsvis att minska antalet buggar när applikationen växer i storlek. Dessutom vet vi att båda ändarna befinner sig i samma utvecklingsfas. Andra fördelar inkluderar att *Frontend* och *Backend* kan dela samma *libraries*, *dependencies* och eventuellt kod och applikationen kan testas i en repo.

## Säkerhetshål

Säkerhetshål analyserades och åtgärdades delvis med hjälp av `npm audit`.

### Backend

| Vulnerability                       | Severity | Solution      |
| ----------------------------------- | -------  |---------------|
| debug  <=2.6.8                      | high     | npm audit fix |
| fresh  <0.5.2                       | high     | npm audit fix |
| mime  <1.4.1                        | moderate | npm audit fix |
| ms  <2.0.0                          | moderate | npm audit fix |
| node-fetch  <2.6.7                  | high     | npm audit fix |
| qs  <=6.2.3                         | high     | npm audit fix |
| semver  6.0.0 - 6.3.0 7.0.0 - 7.5.1 | moderate | npm audit fix |

### Frontend

Inga *vulnerabilities* hittades.

## Hur fick vi applikationen att fungera?

För det första såg vi till att vi hade installerat alla *packages* för applikationen genom att köra `npm install`. Vi körde sedan `bash db/reset_db.bash` för att skapa en ny sqlite databas `trains.sqlite`.

Genom att registrera med TrafikVerkets API kan vi skapa våra egen nycklar som kan sparas i `.env` inom `backend`-mappen.

Äntligen var `backend`-en redo att köra genom att använda `node app.js`. Sedan kunde `frontend`-en komma igång genom att starta en annan webbserver lokalt (till exempel Apache eller Python). 

## Vilket frontend-ramverk använder vi?

Ramverket som används i det här projektet kommer att vara Vue. Vårt team övervägde först två andra ramverk – *Angular* och *Svelte*.

*Angular* övervägdes eftersom det är populärt inom branschen och det är ett omfattande ramverk med en stor *community* av utvecklare. *Svelte* övervägdes också eftersom det är snabbt och minimalistiskt. Det är också ett alternativ med *open source*, vilket ansågs vara fördelaktigt för teamet. Till slut ansågs *Angular* vara för komplext för ett så litet projekt och det är inte lika lätt att lära sig. På samma sätt fungerar *Svelte* på ett helt annat sätt än de andra ramverken och kan vara för svåra att implementera.

*Vue* är ett alternativ med *open source* som är lätt att lära sig, blir populärt och har en bra *community* av utvecklare. *Vue* är också lätt och mindre jämfört med *Angular* både när du jämför det med filstorlek och med kodrader.
