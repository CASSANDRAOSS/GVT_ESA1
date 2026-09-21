"use strict";


// --------------------------------------------------
// 1. ELEMENTE AUS DER HTML-SEITE AUSWÄHLEN
// --------------------------------------------------

// Elemente für die Scheibe
const scheibe = document.getElementById("scheibe");

const linksButton = document.getElementById("linksButton");
const rechtsButton = document.getElementById("rechtsButton");
const automatikButton = document.getElementById("automatikButton");

const automatikBeschriftung =
    document.getElementById("automatikBeschriftung");

const automatikSymbol =
    automatikButton.querySelector(".buttonsymbol");

const positionsanzeige =
    document.getElementById("positionsanzeige");


// Elemente für Cassy
const pinguin = document.getElementById("pinguin");

const pinguinButton =
    document.getElementById("pinguinButton");

const pinguinStatus =
    document.getElementById("pinguinStatus");


// --------------------------------------------------
// 2. EINSTELLUNGEN UND STARTWERTE
// --------------------------------------------------

// Die Scheibe besteht aus 24 Bildern.
const anzahlScheibenbilder = 24;

// Zwischen zwei Bildern liegen jeweils 15 Grad.
const winkelProBild = 15;

// Cassys Sprung besteht aus 8 Bildern.
const anzahlPinguinbilder = 8;

// Zu Beginn wird Bild 00 der Scheibe angezeigt.
let aktuellesScheibenbild = 0;

// Hier wird später der Zeitgeber der Automatik gespeichert.
let automatischeDrehung = null;

// Verhindert, dass Cassy während eines Sprungs
// noch einmal gestartet wird.
let pinguinSpringt = false;


// --------------------------------------------------
// 3. HILFSFUNKTION
// --------------------------------------------------

// Aus 0 wird "00", aus 1 wird "01" und so weiter.
function zweistelligeNummer(zahl) {
    return String(zahl).padStart(2, "0");
}


// --------------------------------------------------
// 4. SCHEIBE STEUERN
// --------------------------------------------------

// Zeigt das passende Bild der Scheibe an.
function scheibenbildAnzeigen() {

    const dateinummer =
        zweistelligeNummer(aktuellesScheibenbild);

    scheibe.src =
        "bilder/scheibe/scheibe-" +
        dateinummer +
        ".png";

    const winkel =
        aktuellesScheibenbild * winkelProBild;

    let zustand = "angehalten";

    if (automatischeDrehung !== null) {
        zustand = "dreht automatisch";
    }

    positionsanzeige.textContent =
        "Aktuelle Position: " +
        winkel +
        "° · " +
        zustand;

    scheibe.alt =
        "Maritime Scheibe in einer Drehposition von " +
        winkel +
        " Grad";
}


// Dreht die Scheibe um ein Bild nach links.
function nachLinksDrehen() {

    aktuellesScheibenbild =
        aktuellesScheibenbild - 1;

    // Nach Bild 00 wird Bild 23 angezeigt.
    if (aktuellesScheibenbild < 0) {
        aktuellesScheibenbild =
            anzahlScheibenbilder - 1;
    }

    scheibenbildAnzeigen();
}


// Dreht die Scheibe um ein Bild nach rechts.
function nachRechtsDrehen() {

    aktuellesScheibenbild =
        aktuellesScheibenbild + 1;

    // Nach Bild 23 wird wieder Bild 00 angezeigt.
    if (
        aktuellesScheibenbild >=
        anzahlScheibenbilder
    ) {
        aktuellesScheibenbild = 0;
    }

    scheibenbildAnzeigen();
}


// Startet oder stoppt die automatische Drehung.
function automatikUmschalten() {

    // Es läuft noch keine automatische Drehung.
    if (automatischeDrehung === null) {

        automatischeDrehung = setInterval(
            nachRechtsDrehen,
            120
        );

        automatikBeschriftung.textContent =
            "Automatik stoppen";

        automatikSymbol.textContent = "■";

        automatikButton.setAttribute(
            "aria-pressed",
            "true"
        );

    } else {

        // Den laufenden Zeitgeber beenden.
        clearInterval(automatischeDrehung);

        automatischeDrehung = null;

        automatikBeschriftung.textContent =
            "Automatik starten";

        automatikSymbol.textContent = "▶";

        automatikButton.setAttribute(
            "aria-pressed",
            "false"
        );
    }

    // Dadurch wird auch der Zustand in der
    // Positionsanzeige sofort aktualisiert.
    scheibenbildAnzeigen();
}


// --------------------------------------------------
// 5. CASSYS SPRUNG STEUERN
// --------------------------------------------------

// Zeigt ein bestimmtes Bild von Cassy an.
function pinguinbildAnzeigen(bildnummer) {

    const dateinummer =
        zweistelligeNummer(bildnummer);

    pinguin.src =
        "bilder/pinguin/pinguin-" +
        dateinummer +
        ".png";

    pinguin.alt =
        "Pinguin Cassy in Sprungphase " +
        (bildnummer + 1);
}


// Spielt Cassys Sprung einmal vollständig ab.
function pinguinSpringen() {

    // Während eines Sprungs kann kein zweiter
    // Sprung gestartet werden.
    if (pinguinSpringt === true) {
        return;
    }

    pinguinSpringt = true;

    pinguinButton.disabled = true;

    pinguinStatus.textContent =
        "Cassy springt gerade.";

    let aktuellesPinguinbild = 0;

    pinguinbildAnzeigen(aktuellesPinguinbild);

    const sprungAnimation = setInterval(
        function() {

            aktuellesPinguinbild =
                aktuellesPinguinbild + 1;

            pinguinbildAnzeigen(
                aktuellesPinguinbild
            );

            // Das letzte Bild wurde erreicht.
            if (
                aktuellesPinguinbild >=
                anzahlPinguinbilder - 1
            ) {
                clearInterval(sprungAnimation);

                // Das letzte Bild bleibt kurz sichtbar.
                setTimeout(function() {

                    pinguinbildAnzeigen(0);

                    pinguin.alt =
                        "Pinguin Cassy steht nach ihrem Sprung";

                    pinguinStatus.textContent =
                        "Cassy ist wieder sicher gelandet.";

                    pinguinButton.disabled = false;

                    pinguinSpringt = false;

                }, 500);
            }

        },
        160
    );
}


// --------------------------------------------------
// 6. BILDER VORLADEN
// --------------------------------------------------

// Das Vorladen verhindert kurzes Flackern,
// wenn ein Bild zum ersten Mal angezeigt wird.
function bilderVorladen(
    ordner,
    dateiname,
    anzahl
) {

    for (let nummer = 0; nummer < anzahl; nummer++) {

        const bild = new Image();

        bild.src =
            "bilder/" +
            ordner +
            "/" +
            dateiname +
            "-" +
            zweistelligeNummer(nummer) +
            ".png";
    }
}


// --------------------------------------------------
// 7. MAUSKLICKS VERARBEITEN
// --------------------------------------------------

linksButton.addEventListener(
    "click",
    nachLinksDrehen
);

rechtsButton.addEventListener(
    "click",
    nachRechtsDrehen
);

automatikButton.addEventListener(
    "click",
    automatikUmschalten
);

pinguinButton.addEventListener(
    "click",
    pinguinSpringen
);


// --------------------------------------------------
// 8. TASTATUREINGABEN VERARBEITEN
// --------------------------------------------------

document.addEventListener(
    "keydown",
    function(event) {

        // Eine gedrückt gehaltene Taste soll nicht
        // mehrfach hintereinander ausgelöst werden.
        if (event.repeat === true) {
            return;
        }

        const taste =
            event.key.toLowerCase();

        if (taste === "l") {
            nachLinksDrehen();
        }

        if (taste === "r") {
            nachRechtsDrehen();
        }

        if (taste === "a") {
            automatikUmschalten();
        }

        if (taste === "h") {
            pinguinSpringen();
        }
    }
);


// --------------------------------------------------
// 9. SEITE VORBEREITEN
// --------------------------------------------------

// Alle Animationsbilder in den Speicher laden.
bilderVorladen(
    "scheibe",
    "scheibe",
    anzahlScheibenbilder
);

bilderVorladen(
    "pinguin",
    "pinguin",
    anzahlPinguinbilder
);

// Den richtigen Anfangszustand anzeigen.
scheibenbildAnzeigen();
pinguinbildAnzeigen(0);