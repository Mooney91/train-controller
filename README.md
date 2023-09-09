# Train Controller

## Introduktion

Det här repot är en *Train Controller*-applikation utvecklad av *Night and Day*-gruppen som en del av kursen *jsramverk* 
vid *Blekinge Tekniska Högskola (BTH)*.

Mer information om det här projektet finns på: https://jsramverk.se/. Data och API som används under kursen finns på 
https://api.trafikinfo.trafikverket.se/.

## Ett repo för front- och backend

Vi har valt att använda ett repo för både frontend och backend. Då kan vi säkerställa att frontend och backend är kompatibla 
med varandra efter varje commit. Detta kommer förhoppningsvis att minska antalet buggar när applikationen växer i storlek. 
Dessutom vet vi att båda ändarna befinner sig i samma utvecklingsfas. Andra fördelar inkluderar att *Frontend* och *Backend* 
har möjlighet att dela samma *libraries*, *dependencies* och eventuellt kod om så skulle behövas, och testning av hela applikationen 
kan underlättas.

## Säkerhetshål

Säkerhetshål i installerade npm-moduler i backend analyserades och åtgärdades med hjälp av kommandot `npm audit fix`.

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

Inga npm-moduler används (ännu i alla fall).

## Hur fick vi applikationen att fungera?

För det första såg vi till att vi hade installerat alla *packages* för applikationen genom att köra `npm install`. Vi körde sedan 
`bash db/reset_db.bash` för att skapa en ny sqlite databas `trains.sqlite` med en `tickets` tabell.

Vi skapade ett konto hos [TrafikVerkets API](https://api.trafikinfo.trafikverket.se) (ett per utvecklare), och genererade en API-nyckel,
som sparades i en `.env`-fil i `backend`-mappen.

Äntligen kunde `backend`-en startas med kommandot `node app.js`.

För att accessa `frontend`-en behöver man starta en till webbserver, till exempel Apache eller Pythons inbyggda. För att undvika 
CORS-problem behöver den dessutom köras på port 9000, vilket är hårdkodat i `app.js` i `backend`-mappen. Nu kan vi navigera till 
`frontend/index.html` och se en tabell och karta över alla tågförseningar.

## Vilket frontend-ramverk har vi valt?

Ramverket som kommer att användas i det här projektet är [Vue](https://vuejs.org). Vårt team övervägde också två andra ramverk – *Angular* och *Svelte*.

*Angular* övervägdes eftersom det är populärt inom branschen och det är ett omfattande ramverk med en stor *community* av utvecklare. Dock
bedömdes att ramverket är onödigt komplext och stort för vår relativt lilla applikation, och det kan också ta tid att sätta sig in i på
den begränsade tid vi har till förfogande.

*Svelte* övervägdes eftersom det skall vara snabbt och minimalistiskt. Det är också ett tydligt *open source*-alternativ, vilket ansågs vara 
fördelaktigt för teamet. *Svelte* är dock ett mindre använt ramverk och kanske inte lika kommersiellt gångbart (mindre attraktivt på CV:n).
Syntaxen verkar i vissa bitar också lite udda, vilket kan ge en "dålig" känsla att jobba med.

*Vue* är ett alternativ med *open source* som är lätt att lära sig (hoppas vi), är populärt, och har en bra *community* av utvecklare. 
*Vue* har likheter med *Angular*, men är mera lättviktigt än *Angular*, både vad gäller filstorlek och antal kodrader som behövs för att lösa
ett problem.

