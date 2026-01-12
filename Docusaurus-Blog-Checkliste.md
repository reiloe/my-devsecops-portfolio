# Inhalt der Checkliste

**Inhalt der Checkliste 1**

**Projektabgabe Docusaurus Blog & Portfolio 2**

[1\. Repository 2](#repository)

Komponenten [2](#vorhandene-dateien)

README.md 3

[2\. Dokumentation](#hinweise) 3

      3[. Hinweise](#hinweise) 3

#

#

#

# Projektabgabe \- Docusaurus Portfolio {#projektabgabe---docusaurus-portfolio}

Bitte erfülle alle Punkte auf dieser Liste, bevor du das Projekt einreichst. Solltest du weitere Extras eingebaut haben, erwähne das kurz, damit sich die Mentoren dies bei Bedarf anschauen können.

1. ## **Repository** {#repository}

### **Vorhandene Dateien** {#vorhandene-dateien}

- [x] Das Repository enthält mehrere Commits, die zum erstellen des Portfolios erstellt wurden  
      - [x] Aus deiner History lässt sich erkennen, dass du mit Hilfe von Feature-Branches einzelne Unteraufgaben des Portfolios entwickelt hast  
      - [x] Die Feature-Branches wurden über Pull-Requests in den Haupt-Entwicklungsbranch des Repositories gemerged  
- [x] Eine Datei namens README.md ist vorhanden und entsprechend der Kriterien unten erweitert worden  
- [x] Es befinden sich keine weiteren Dateien im Repository, ohne dass diese explizit in der README.md benannt und beschrieben werden.

### **Portfolio Komponenten**

- [x] Dein Portfolio beinhaltet die geforderten Sektionen:
      - [x] Header  
      - [x] Hero  
      - [x] My-Skills  
      - [x] My Project-Highlights  
      - [x] Contact  
      - [x] Footer  
- [x] Jede der oben genannten Sektionen besteht aus jeweils mindestens einer React-Component  
- [x] Die Sektionen werden in der Datei src/pages/index.tsx zu einem Layout zusammengesetzt  
- [x] Alle Komponenten sind jeweils in einem eigenen Ordner innerhalb von src/components gespeichert  
      - [x] Die Datei, in der die eigentliche Komponente erstellt wird heißt index.tsx  
      - [x] CSS Dateien sind css-modules und entsprechend der Komponente benannt, bspw button.module.css für das Stylesheet eines Buttons.

### **README.md**

- [x] Die README sollte ein Inhaltsverzeichnis a.k.a. eine Table-of-Contents (ToC) enthalten  
      - [x] Die einzelnen Sektionen sind in der ToC verlinkt  
- [x] Eine Sektion mit einer Beschreibung des Repositories muss vorhanden sein. In dieser Beschreibung sollte genannt werden was die wesentlichen Inhalte sind, was der Zweck des Repositories ist  
- [x] Eine Sektion "Quickstart" sollte als Teil der README enthalten sein. Hier sollen kurz die Voraussetzungen genannt und eine Schnellstart-Anleitung beschrieben sein.  
      - [x] es sollte hierbei eine sektion how-to-start geben  
- [x] Es soll eine ausführliche Variante der vorgenannten Sektion als "Usage" enthalten sein. Hier soll genauer auf die Konfiguration und Konfigurierbarkeit eingegangen werden, d.h. es soll auch erklärt werden, wie relevante Passagen modifiziert werden können, um andere Resultate zu erzielen.  
      - [x] Es muss dokumentiert sein, wie man das Projekt startet  
      - [x] Es muss dokumentiert sein, wie man einen build des Projektes durchführt  
      - [x] Es muss dokumentiert sein, wie das Projekt bereitgestellt werden kann, bspw mit NGINX oder GitHub/GitLab Pages

1. ## **Dokumentation**

Die Dokumentation des Codes, sowie des Projektes soll im Repository in Form einer README Datei stattfinden.  
Die Dokumentationssprache für alle Projekte (und zugehörige Unterlagen) ist englisch.

1. ## **Hinweise** {#hinweise}

### **Allgemeine Hinweise**

- [x] Zusätzlich zu deinem GitHub Repository solltest du ein kurzes Loom Video (maximal 5min.) aufnehmen und bereitstellen, indem du kurz deine Abgabe zeigst und vorstellst was du getan hast \- dabei musst du nicht alle Details erwähnen, jedoch sollst du auf alle relevanten Schritte kurz eingehen und diese zeigen.  
- [x] Bei Fragen melde dich gerne über das Ticketsystem  
      - [x] Bitte mache ein Frage-Ticket im entsprechenden Channel auf, um Fragen zu stellen  
      - [x] Wenn du Dein Projekt einreichst, dann sollten keine Unklarheiten oder Ähnliches mehr offen sein. Bei Fragen oder Unklarheiten deinerseits behalten wir uns vor eine Abgabe direkt abzulehnen

### **Sicherheitshinweise**

- [x] Speichere keine SSH-Keys im Workspace deines Git-Repositories  
- [x] Speichere keine Passwörter, Tokens, oder Benutzernamen in deinem Code. Verwende hierfür stattdessen Environment-Variablen  
- [x] Speichere keine IP-Adressen, oder sonstigen sensiblen Informationen in einem Git Repository

### **Code-Konventionen**

- [x] React Components:  
      - [x] sollten innerhalb von src/components gespeichert werden  
      - [x] Der Ordnername sollte dabei im kebab-case benannt sein \-\> CustomButton \-\> custom-button  
      - [x] Die Datei die die component enthält heisst index.tsx  
      - [x] Die Component selbst ist im PascalCase benannt, d.h. jeder Anfangsbuchstabe eines Wortes wird groß geschrieben  
- [x] In deinem Code sollte kein Wert vom Typ any vorkommen. Das heißt Eigenschaften deiner Components sollten entsprechend auch mit einem TypeScript Interface modelliert und typisiert werden.  
- [x] Kritische Konfiguration wie Tokens, Passwörter oder ähnliches sollte nicht im Code-Repository gespeichert sein, sondern bspw. durch die Verwendung eines .env-files in einen Container hineingegeben werden

### **Testing**

Bevor Du dein Projekt einreichst, solltest du die folgenden Dinge sicherstellen und getestet haben:

- [x] Die Anwendung kann lokal und in der CI-Pipeline gebaut werden  
- [x] Die Anwendung wird bei einem Commit auf den Default branch nach GitHub Pages deployed und ist zum Zeitpunkt der Abnahme auf dem aktuellsten Stand

####
