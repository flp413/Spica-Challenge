# Spica Challenge

Spica Challenge je razvojna naloga za podjetje Špica International. Projekt je enostranska aplikacija zgrajena z Angularjem, ki upravlja s podatki o evidenci delovnega časa zaposlenih. Povezuje se z AllHours REST API-jem (https://api4.allhours.com) in vsebuje tri poglede, ki se imenujejo:
- Nastavitve za avtorizacijo,
- Uporabniki za upravljanje zaposlenih in
- Odsotnosti za spremljanje prostih dni.

Uporabniki lahko pregledujejo, iščejo in dodajajo zaposlene ter upravljajo z njihovimi odsotnostmi preko preprostega vmesnika. Aplikacija shranjuje avtorizacijske podatke v lokalni shrambi za vzdrževanje seje.

Za pravilno delovanje aplikacije, morate imeti nameščen Angular 19. Prav tako mora biti omogočena uporaba novejše različiče ogrodja Bootstrap.

Za zagon lokalnega razvojnega strežnika, zaženite:

```bash
ng serve
```

Ko se strežnik zažene, odprite brskalnik in se pomaknite do `http://localhost:4200/`, ki se bo samodejno ponovno naložila vsakič, ko spremenite katero koli izvorno datoteko.

Upam, da bo aplikacija omogočila prijetno izkušnjo ter bo delovala nemoteno. Komentarji za izboljšave so dobrodošli. Uspešno uporabo želim!

## Basic instructions (English)
# Spica Challenge

Spica Challenge is a development task for Spica International. The project is a single page application built with Angular that manages employee timesheet data. It connects to the AllHours REST API (https://api4.allhours.com) and contains three views called:
- Authorization Settings,
- Users for employee management and
- Absences for monitoring days off.

Users can view, search, add employees and manage their absences through a simple interface. The application stores authorisation data in a local repository for session maintenance.

For the application to work properly, you must have Angular 19 installed. You must also be able to use a recent version of the Bootstrap framework.

To start the local development server, run:

```bash
ng serve
```

Once the server is running, open a browser and navigate to `http://localhost:4200/`, which will automatically reload whenever you change any of the source files.

I hope the app will provide a pleasant experience and will work smoothly. Comments for improvements are welcome. I wish you a successful application!