import React, { useState, useEffect } from 'react';
import { Target, RefreshCw, Camera } from 'lucide-react';

const MISSIONS_POOL = [
  // Gruppe & Selfies (1-40)
  { emoji: '📸', text: 'Mache ein witziges Gruppen-Selfie mit deinen Tischnachbarn!' },
  { emoji: '🤳', text: 'Mach ein Selfie mit den Brauteltern / Gastgebern.' },
  { emoji: '🤪', text: 'Mach ein Foto von 3 Personen, die deine lustigste Fratze nachmachen.' },
  { emoji: '👯', text: 'Fotografiere zwei Gäste, die sich heute erst kennengelernt haben.' },
  { emoji: '🤝', text: 'Mache ein Foto von einem epischen Handshake auf der Feier.' },
  { emoji: '😁', text: 'Fotografiere 4 Personen, die gleichzeitig bis über beide Ohren strahlen.' },
  { emoji: '✌️', text: 'Mach ein Gruppenfoto, auf dem alle das Peace-Zeichen machen.' },
  { emoji: '🕶️', text: 'Mach ein lässiges Selfie mit Sonnenbrille – auch wenn es dunkel ist!' },
  { emoji: '👑', text: 'Fotografiere die Person mit der am besten gestylten Frisur.' },
  { emoji: '🎩', text: 'Mach ein Foto mit dem am elegantesten gekleideten Gast.' },
  { emoji: '🥳', text: 'Fotografiere eine Gruppe beim lauten Anstoßen!' },
  { emoji: '🤗', text: 'Mach ein Foto von zwei Personen, die sich herzlich umarmen.' },
  { emoji: '🤫', text: 'Mache ein geheimes Foto von jemandem, der gerade am Tisch lauscht.' },
  { emoji: '🎉', text: 'Mach ein Foto von 5 Personen, die die Hände in die Luft werfen.' },
  { emoji: '🤩', text: 'Mach ein Selfie mit deiner Begleitung in bester Stimmung.' },
  { emoji: '👥', text: 'Fotografiere die älteste und die jüngste Person auf der Feier zusammen.' },
  { emoji: '💃', text: 'Mach ein Selfie mitten auf der vollen Tanzfläche!' },
  { emoji: '😜', text: 'Mach ein Bild von jemandem, der die Zunge rausstreckt.' },
  { emoji: '🤳', text: 'Mach ein Selfie mit dem Trauzeugen oder der Trauzeugin.' },
  { emoji: '🕺', text: 'Fotografiere 3 Personen beim synchronen Posen.' },
  { emoji: '🎀', text: 'Mach ein Selfie mit der am schönsten geschmückten Person.' },
  { emoji: '🥂', text: 'Stoße mit 3 fremden Personen an und macht zusammen ein Selfie!' },
  { emoji: '🎩', text: 'Mach ein Selfie mit jemandem, der eine Fliege oder Krawatte trägt.' },
  { emoji: '📸', text: 'Lass jemanden ein Foto von dir machen, während du so tust als ob du fotografierst.' },
  { emoji: '💖', text: 'Mach ein Gruppenfoto in Herz-Form mit den Händen.' },
  { emoji: '🌟', text: 'Mach ein Foto von jemandem, der heute der absolute Blickfang ist.' },
  { emoji: '🕶️', text: 'Mache ein cooles "Secret Agent" Gruppenfoto.' },
  { emoji: '🎉', text: 'Fotografiere die ausgelassenste Gruppe im Raum.' },
  { emoji: '😄', text: 'Mach ein Selfie mit jemandem, der genau denselben Vornamen-Anfangsbuchstaben hat wie du.' },
  { emoji: '📸', text: 'Mach ein Foto von 4 Personen, die alle in verschiedene Richtungen schauen.' },
  { emoji: '👯‍♀️', text: 'Fotografiere beste Freunde bei einer spontanen Umarmung.' },
  { emoji: '🤳', text: 'Mach ein Selfie im Spiegel des Veranstaltungsorts.' },
  { emoji: '✌️', text: 'Mach ein Foto mit den süßesten Tischnachbarn.' },
  { emoji: '💖', text: 'Fotografiere zwei Menschen, die sich tief in die Augen schauen.' },
  { emoji: '🥳', text: 'Mach ein Foto von der besten Partytruppe des Abends.' },
  { emoji: '📸', text: 'Mach ein Selfie mit jemandem, der eine rote Kleidung trägt.' },
  { emoji: '😄', text: 'Fotografiere jemanden, der laut lacht.' },
  { emoji: '🙌', text: 'Mach ein High-Five Foto im richtigen Moment.' },
  { emoji: '🤳', text: 'Mach ein Selfie mit den DJs oder den Musikanlagen im Hintergrund.' },
  { emoji: '🎉', text: 'Mach ein Foto von allen Personen an deinem Tisch zusammen.' },

  // Tanzfläche & Action (41-80)
  { emoji: '💃', text: 'Fotografiere den absolut wildesten Tanzschritt auf dem Parkett!' },
  { emoji: '🕺', text: 'Mach ein Bild von jemandem beim Moonwalk oder Breakdance.' },
  { emoji: '🎶', text: 'Knipse jemanden, der voller Leidenschaft mitsingt!' },
  { emoji: '🎸', text: 'Fotografiere jemanden beim Spielen einer imaginären Luftgitarre!' },
  { emoji: '✨', text: 'Mache ein Foto von einer Wirbel-Drehung beim Tanzen.' },
  { emoji: '🎵', text: 'Mach ein Foto von den allerersten Personen auf der Tanzfläche.' },
  { emoji: '💥', text: 'Fotografiere eine fantastische Hebefigur oder eine Pose beim Tanzen.' },
  { emoji: '🥳', text: 'Mach ein Bild von einer Polonaise oder einem Tanzkreis.' },
  { emoji: '👏', text: 'Fotografiere das Publikum beim klatschen im Rhythmus.' },
  { emoji: '💃', text: 'Mach ein Foto von jemandem, der barfuß tanzt.' },
  { emoji: '🕺', text: 'Mach ein Bild von jemandem, der völlig im Takt aufstampft.' },
  { emoji: '🎤', text: 'Fotografiere jemanden, der so tut als wäre die Gabel ein Mikrofon.' },
  { emoji: '✨', text: 'Mach ein Foto von schwebenden Konfettiregen oder Seifenblasen.' },
  { emoji: '🎶', text: 'Fotografiere ein Paar beim langsamen romantischen Walzer.' },
  { emoji: '🕺', text: 'Knipse jemanden beim Hüftschwung!' },
  { emoji: '💃', text: 'Mach ein Foto von jemandem, der die Tanzfläche komplett erobert.' },
  { emoji: '🎉', text: 'Fotografiere den Höhepunkt eines Partylieds.' },
  { emoji: '🎸', text: 'Mach ein Foto von 2 Personen im Luftgitarren-Duell.' },
  { emoji: '🌟', text: 'Mach ein Action-Foto mitten in einer Bewegung.' },
  { emoji: '💃', text: 'Fotografiere schwingende Kleider im Tanz.' },
  { emoji: '🎵', text: 'Knipse jemanden, der ganz versunken zur Musik nickt.' },
  { emoji: '🥳', text: 'Mach ein Bild von der Stimmung in der Disco-Beleuchtung.' },
  { emoji: '🕺', text: 'Fotografiere den lustigsten Dancemove des Abends.' },
  { emoji: '✨', text: 'Mach ein Foto von leuchtenden Wunderkerzen oder Party-Lichtern.' },
  { emoji: '👏', text: 'Mach ein Bild von tosendem Applaus.' },
  { emoji: '💃', text: 'Fotografiere jemanden, der beim Tanzen die Arme hochreißt.' },
  { emoji: '🎶', text: 'Mach ein Selfie mitten im Tanzgetümmel.' },
  { emoji: '🕺', text: 'Fotografiere 3 Männer beim spontanen Tanzduell.' },
  { emoji: '🥳', text: 'Mach ein Bild von der Tanzfläche aus einer tiefen Froschperspektive.' },
  { emoji: '✨', text: 'Fotografiere Schatten an der Wand im Rhythmus der Musik.' },
  { emoji: '💃', text: 'Mach ein Foto von den schnellsten Füßen auf der Tanzfläche.' },
  { emoji: '🎵', text: 'Fotografiere den DJ beim Auflegen eines Hit-Songs.' },
  { emoji: '💥', text: 'Mach ein Bild von einem spontanen Jubelschrei.' },
  { emoji: '🥳', text: 'Fotografiere die Stimmung beim Lieblingssong des Brautpaars.' },
  { emoji: '🕺', text: 'Mach ein Foto von jemandem, der den Rhythmus im Blut hat.' },
  { emoji: '✨', text: 'Fotografiere glitzernde Lichterreflexe auf der Tanzfläche.' },
  { emoji: '💃', text: 'Mach ein Foto von zwei Personen, die sich beim Tanzen an den Händen halten.' },
  { emoji: '🎶', text: 'Knipse die Begeisterung bei einem Schnulzensong.' },
  { emoji: '🎸', text: 'Fotografiere den engagiertesten Tänzer des Abends.' },
  { emoji: '🥳', text: 'Mach ein Bild von einer feiernden Gruppe im Kreis.' },

  // Essen, Trinken & Bar (81-120)
  { emoji: '🥂', text: 'Stoße mit jemandem an und fotografiere das Anstoßen der Gläser!' },
  { emoji: '🍰', text: 'Fotografiere das leckerste Dessert oder das Torterstück von oben.' },
  { emoji: '🍸', text: 'Mach ein stilvolles Foto von deinem Lieblingsdrink an der Bar.' },
  { emoji: '🍇', text: 'Knipse die schönste Tischdekoration oder das Buffet.' },
  { emoji: '🍷', text: 'Mach ein Foto von zwei angestoßenen Wein- oder Sektgläsern im Kerzenschein.' },
  { emoji: '🍾', text: 'Fotografiere das Ploppen eines Korkens oder das Einschenken.' },
  { emoji: '😋', text: 'Mach ein Foto von jemandem, der genüsslich sein Essen genießt.' },
  { emoji: '🎂', text: 'Fotografiere den Moment des Tortenanschnitts!' },
  { emoji: '☕', text: 'Mach ein Foto von einer dampfenden Tasse Kaffee oder Tee.' },
  { emoji: '🍹', text: 'Fotografiere den buntesten Cocktail der Bar.' },
  { emoji: '🥐', text: 'Mach ein Bild vom hübschesten Snack des Buffets.' },
  { emoji: '🥂', text: 'Fotografiere 4 Gläser beim gemeinsamen Anstoßen in Sternform.' },
  { emoji: '🍫', text: 'Mach ein Foto von den süßen Versuchungen am Candy-Table.' },
  { emoji: '🍋', text: 'Fotografiere den erfrischendsten Drink des Abends.' },
  { emoji: '🍽️', text: 'Mach ein künstlerisches Foto von einem perfekt angerichteten Teller.' },
  { emoji: '🍻', text: 'Fotografiere zwei kühle Getränke im Sonnenuntergang oder Party-Licht.' },
  { emoji: '🍓', text: 'Mach ein Nahaufnahme-Foto von einer Frucht oder Deko am Drink.' },
  { emoji: '🥂', text: 'Fotografiere die Schaumkrone eines frischen Getränks.' },
  { emoji: '🍷', text: 'Mach ein Foto von der edelsten Flasche des Abends.' },
  { emoji: '😋', text: 'Mach ein Foto von jemandem, der heimlich nascht.' },
  { emoji: '🍰', text: 'Fotografiere die Krümel nach dem Tortenverzehr.' },
  { emoji: '🍸', text: 'Mach ein Foto von den Barkeepern in Action.' },
  { emoji: '🥂', text: 'Fotografiere das Funkeln von Eiswürfeln im Glas.' },
  { emoji: '🍽️', text: 'Mach ein Foto von den Menükarten am Tisch.' },
  { emoji: '🍇', text: 'Fotografiere das farbenfrohste Arrangement auf dem Tisch.' },
  { emoji: '🍾', text: 'Mach ein Foto von der eisgekühlten Champagnerflasche.' },
  { emoji: '🍹', text: 'Fotografiere jemanden, der durch einen Strohhalm trinkt.' },
  { emoji: '🍰', text: 'Mach ein Foto von der Hochzeitstorte vor dem Anschneiden.' },
  { emoji: '🍷', text: 'Fotografiere das Brechen des Lichts in einem Kristallglas.' },
  { emoji: '🥂', text: 'Mach ein Foto von einer spontanen Rede mit erhobenem Glas.' },
  { emoji: '😋', text: 'Fotografiere den Tisch mit den leeren Schüsseln – es geschmeckt!' },
  { emoji: '🍸', text: 'Mach ein Foto von einem Drink mit Schirmchen oder Halm.' },
  { emoji: '☕', text: 'Fotografiere das Beisammensein bei der Kaffeerunde.' },
  { emoji: '🍽️', text: 'Mach ein Foto vom liebevoll eingedeckten Besteck.' },
  { emoji: '🥂', text: 'Fotografiere jemanden beim Zuprosten in die Kamera.' },
  { emoji: '🍾', text: 'Mach ein Foto von sprudelnden Bläschen im Sektglas.' },
  { emoji: '🍰', text: 'Fotografiere das niedlichste Detail der Torte.' },
  { emoji: '🍹', text: 'Mach ein Foto von zwei unterschiedlichen bunten Drinks nebeneinander.' },
  { emoji: '🍷', text: 'Fotografiere jemanden, der kennerhaft am Glas riecht.' },
  { emoji: '🥂', text: 'Mach ein Foto von einem Anstoßen aus der Vogelperspektive.' },

  // Emotionen, Romantik & Liebe (121-160)
  { emoji: '💍', text: 'Fotografiere das Brautpaar in einem romantischen, unbeobachteten Moment.' },
  { emoji: '❤️', text: 'Mach ein Foto von zwei Händen, die sich liebevoll halten.' },
  { emoji: '😍', text: 'Fotografiere jemanden, der das Brautpaar voller Stolz anschaut.' },
  { emoji: '😭', text: 'Mach ein Foto von einer kleinen Freudenträne oder Rührung.' },
  { emoji: '💋', text: 'Fotografiere einen kussvollen Moment!' },
  { emoji: '🌹', text: 'Mach ein Bild vom wunderschönen Brautstrauß.' },
  { emoji: '✨', text: 'Fotografiere das Strahlen in den Augen der Braut oder des Bräutigams.' },
  { emoji: '💖', text: 'Mach ein Foto von den Eheringen aus der Nähe.' },
  { emoji: '💐', text: 'Fotografiere den Ansteckstrauß (Boutonnière) am Revers.' },
  { emoji: '💌', text: 'Mach ein Foto von der Gästebuch-Ecke oder den Glückwunschkarten.' },
  { emoji: '🕊️', text: 'Fotografiere ein Lächeln zwischen zwei verliebten Menschen.' },
  { emoji: '🤗', text: 'Mach ein Foto von einer herzlichen Umarmung der Eltern.' },
  { emoji: '❤️', text: 'Fotografiere ein Herz, das mit Händen geformt wird.' },
  { emoji: '🌹', text: 'Mach ein Nahaufnahme-Foto von einzelnen Blumenblüten.' },
  { emoji: '✨', text: 'Fotografiere den glänzenden Schleier oder das Brautkleid-Detail.' },
  { emoji: '😍', text: 'Mach ein Foto von jemandem, der sichtlich gerührt ist.' },
  { emoji: '💖', text: 'Fotografiere das Hochzeitspaar beim gemeinsamen Lachen.' },
  { emoji: '💋', text: 'Mach ein Foto von einem Kuss auf die Wange.' },
  { emoji: '🌹', text: 'Fotografiere eine einzelne Rose in schöner Umgebung.' },
  { emoji: '🕊️', text: 'Mach ein Foto von zwei Personen, die sich ganz nah sind.' },
  { emoji: '❤️', text: 'Fotografiere die Initialen oder den Namen des Brautpaars auf der Deko.' },
  { emoji: '✨', text: 'Mach ein Foto vom romantischen Lichtspiel der Kerzen.' },
  { emoji: '😍', text: 'Fotografiere jemanden, der dem Brautpaar zujubelt.' },
  { emoji: '💐', text: 'Mach ein Foto vom Brautstrauß auf dem Tisch.' },
  { emoji: '💖', text: 'Fotografiere ein frisch verheiratetes Paar beim Händchenhalten.' },
  { emoji: '😭', text: 'Mach ein Foto vom Abtupfen einer Freudenträne.' },
  { emoji: '🌹', text: 'Fotografiere liebevolle Details am Brauttisch.' },
  { emoji: '✨', text: 'Mach ein Bild von funkelndem Schmuck oder Ringen.' },
  { emoji: '❤️', text: 'Fotografiere zwei Gläser, die ein Herzmuster bilden.' },
  { emoji: '💋', text: 'Mach ein Foto von einem Kuss-Mund in die Kamera.' },
  { emoji: '😍', text: 'Fotografiere den verträumten Blick des Brautpaars.' },
  { emoji: '💖', text: 'Mach ein Bild von Liebe in der Luft.' },
  { emoji: '💐', text: 'Fotografiere Blumenblätter auf dem Boden oder Tisch.' },
  { emoji: '🌹', text: 'Mach ein Foto vom Anstecker des Bräutigams.' },
  { emoji: '✨', text: 'Fotografiere das Paar im Scheinwerfer- oder Kerzenlicht.' },
  { emoji: '❤️', text: 'Mach ein Foto von einer herzförmigen Dekoration.' },
  { emoji: '🤗', text: 'Fotografiere die herzlichste Umarmung des Tages.' },
  { emoji: '😍', text: 'Mach ein Foto von jemandem, der vor Glück strahlt.' },
  { emoji: '💖', text: 'Fotografiere das Brautpaar von hinten im Raum.' },
  { emoji: '🕊️', text: 'Mach ein Foto von zwei zusammengefügten Händen.' },

  // Kleidung, Schuhe & Mode (161-200)
  { emoji: '👞', text: 'Fotografiere die schicksten oder glänzendsten Schuhe auf der Feier!' },
  { emoji: '👗', text: 'Mach ein Foto vom farbenfrohesten Kleid des Abends.' },
  { emoji: '👠', text: 'Fotografiere die höchsten High Heels oder die bequemsten Wechselschuhe.' },
  { emoji: '🧦', text: 'Mach ein Foto von den witzigsten oder buntesten Socken!' },
  { emoji: '👔', text: 'Fotografiere die coolste Krawatte oder Fliege im Raum.' },
  { emoji: '🕶️', text: 'Mach ein Bild von der lässigsten Sonnenbrille.' },
  { emoji: '💍', text: 'Fotografiere den schönsten Uhren- oder Schmuck-Detail am Handgelenk.' },
  { emoji: '🎩', text: 'Mach ein Foto von jemandem mit Einstecktuch im Sakko.' },
  { emoji: '👑', text: 'Fotografiere den am schönsten gestylten Haarschmuck.' },
  { emoji: '👟', text: 'Mach ein Foto von Sneakern, die zum Anzug/Kleid getragen werden.' },
  { emoji: '👗', text: 'Fotografiere das eleganteste Rücken-Detail eines Kleides.' },
  { emoji: '👞', text: 'Mach ein Bild von 3 verschiedenen Paaren Schuhe im Kreis.' },
  { emoji: '🎀', text: 'Fotografiere eine besondere Schleife am Outfit.' },
  { emoji: '🕶️', text: 'Mach ein Foto von zwei Personen mit Sonnenbrillen im Raum.' },
  { emoji: '👔', text: 'Fotografiere die bunteste Fliege des Abends.' },
  { emoji: '👠', text: 'Mach ein Foto von Schuhen, die zum Ausruhen abgelegt wurden.' },
  { emoji: '🧦', text: 'Fotografiere jemanden, der stolz seine Mustersocken zeigt.' },
  { emoji: '👗', text: 'Mach ein Bild von zwei Kleidern in der gleichen Farbe.' },
  { emoji: '🎩', text: 'Fotografiere das schickste Sakko des Abends.' },
  { emoji: '👑', text: 'Mach ein Foto von Zöpfen oder einer Flechtfrisur.' },
  { emoji: '👞', text: 'Fotografiere poliertes Leder im Scheinwerferlicht.' },
  { emoji: '🥿', text: 'Mach ein Foto von flachen Ballerinas nach lange Tanzen.' },
  { emoji: '👔', text: 'Fotografiere einen perfekt gesessenen Krawattenknoten.' },
  { emoji: '🕶️', text: 'Mach ein Foto von einer coolen Pose mit Brille.' },
  { emoji: '👗', text: 'Fotografiere den Saum eines schwebenden Kleides.' },
  { emoji: '🎩', text: 'Mach ein Bild von Manschettenknöpfen am Hemd.' },
  { emoji: '🧦', text: 'Fotografiere bunte Socken beim Sitzen mit überschlagenen Beinen.' },
  { emoji: '👠', text: 'Mach ein Foto von eleganten Riemchen-Sandalen.' },
  { emoji: '👑', text: 'Fotografiere diadem- oder blumenverzierte Haare.' },
  { emoji: '👔', text: 'Mach ein Foto von einer hölzernen oder gemusterten Fliege.' },
  { emoji: '👞', text: 'Fotografiere Tanzschuhe in voller Aktion.' },
  { emoji: '👗', text: 'Mach ein Foto von der schönsten Stoffstruktur eines Kleides.' },
  { emoji: '🎩', text: 'Fotografiere die Revers-Nadel oder den Anstecker.' },
  { emoji: '👟', text: 'Mach ein Foto von coolen Party-Sneakern auf der Tanzfläche.' },
  { emoji: '🧦', text: 'Fotografiere Socken mit lustigen Motiven.' },
  { emoji: '👠', text: 'Mach ein Foto von High Heels neben einem Drink.' },
  { emoji: '👑', text: 'Fotografiere Locke oder Lockenkopf aus der Nähe.' },
  { emoji: '👔', text: 'Mach ein Foto von einer aufgelockerten Krawatte zu später Stunde.' },
  { emoji: '👗', text: 'Fotografiere das Glitzern von Pailletten am Outfit.' },
  { emoji: '👞', text: 'Mach ein Bild von Schuhen auf dem Parkett.' },

  // Location, Deko & Atmosphäre (201-250+)
  { emoji: '🕯️', text: 'Fotografiere das romantischste Kerzenlicht auf dem Tisch.' },
  { emoji: '💐', text: 'Mach ein Nahaufnahme-Foto von der schönsten Blumendeko.' },
  { emoji: '🎈', text: 'Fotografiere Luftballons oder hängende Dekorationen.' },
  { emoji: '✨', text: 'Mach ein Foto vom schönsten Blickwinkel des Saals / Raums.' },
  { emoji: '🌙', text: 'Fotografiere die Location von draußen in der Nacht.' },
  { emoji: '🚪', text: 'Mach ein Foto vom Eingangsbereich oder der Willkommens-Tafel.' },
  { emoji: '🖼️', text: 'Fotografiere den Sitzplan oder die Platzkarten.' },
  { emoji: '📸', text: 'Mach ein Foto von der Fotobox (Photo Booth) oder Requisiten.' },
  { emoji: '🎁', text: 'Fotografiere den Geschenketisch oder das Gästebuch.' },
  { emoji: '🌿', text: 'Mach ein Foto von Eukalyptus-, Efeu- oder Gründeko.' },
  { emoji: '💡', text: 'Fotografiere die Lichterkette oder den Kronleuchter an der Decke.' },
  { emoji: '🌅', text: 'Mach ein Foto vom Abendhimmel oder Sonnenuntergang draußen.' },
  { emoji: '🍷', text: 'Fotografiere das Tischschild oder die Tischnummer.' },
  { emoji: '🕯️', text: 'Mach ein Foto von tanzenden Flammen in den Teelichtern.' },
  { emoji: '💐', text: 'Fotografiere eine einzelne Blüte in einer Vase.' },
  { emoji: '🎈', text: 'Mach ein Foto von einem schwebenden Herzballon.' },
  { emoji: '✨', text: 'Fotografiere Lichterreflexe auf poliertem Holz oder Glas.' },
  { emoji: '🌙', text: 'Mach ein Foto vom Mond oder den Sternen über der Feier.' },
  { emoji: '🚪', text: 'Fotografiere das Willkommensschild mit den Namen.' },
  { emoji: '🖼️', text: 'Mach ein Foto von einer kreativen Namenskarte.' },
  { emoji: '📸', text: 'Fotografiere lustige Requisiten auf einem Haufen.' },
  { emoji: '🎁', text: 'Mach ein Bild von verpackten Gastgeschenken.' },
  { emoji: '🌿', text: 'Fotografiere frisches Grün auf der Tischdecke.' },
  { emoji: '💡', text: 'Mach ein Foto von warmen Glühbirnen im Hintergrund.' },
  { emoji: '🌅', text: 'Fotografiere den Blick aus dem Fenster der Location.' },
  { emoji: '🍷', text: 'Mach ein Foto von den Weinflaschen auf der Eiskühlung.' },
  { emoji: '🕯️', text: 'Fotografiere Windlichter im Außenbereich.' },
  { emoji: '💐', text: 'Mach ein Foto vom Blumenschmuck am Brauttisch.' },
  { emoji: '🎈', text: 'Fotografiere bunte Luftballons an der Decke.' },
  { emoji: '✨', text: 'Mach ein Foto von funkelndem Sternenregen.' },
  { emoji: '🌙', text: 'Fotografiere die beleuchtete Fassade der Location.' },
  { emoji: '🚪', text: 'Mach ein Foto vom Holzweg oder Treppenaufgang.' },
  { emoji: '🖼️', text: 'Fotografiere alte Fotos oder Collagen an der Wand.' },
  { emoji: '📸', text: 'Mach ein Foto von jemanden beim Bedienen der Fotobox.' },
  { emoji: '🎁', text: 'Fotografiere eine schöne Karte mit Glückwünschen.' },
  { emoji: '🌿', text: 'Mach ein Foto von Holzdeko oder Rindenmustern.' },
  { emoji: '💡', text: 'Fotografiere Lichterketten in den Bäumen draußen.' },
  { emoji: '🌅', text: 'Mach ein Foto vom Schein der Dämmerung.' },
  { emoji: '🍷', text: 'Fotografiere Gläserglanz auf der Tischdecke.' },
  { emoji: '🕯️', text: 'Mach ein Foto von Kerzenlicht im Schatten.' },
  { emoji: '💐', text: 'Fotografiere ein Bouquet auf einem Stehtisch.' },
  { emoji: '🎈', text: 'Mach ein Foto von Herzballons im Wind.' },
  { emoji: '✨', text: 'Fotografiere schimmernden Vorhang oder Stoff.' },
  { emoji: '🌙', text: 'Mach ein Foto der Außenbeleuchtung in der Nacht.' },
  { emoji: '🚪', text: 'Fotografiere den liebevoll verzierten Torbogen.' },
  { emoji: '🖼️', text: 'Mach ein Foto von einer handgeschriebenen Tafelschrift.' },
  { emoji: '📸', text: 'Fotografiere Polaroid-Fotos an einer Leine.' },
  { emoji: '🎁', text: 'Mach ein Foto von kleinen Danksagungs-Kärtchen.' },
  { emoji: '🌿', text: 'Fotografiere frische Olivenzweige oder Rosmarin.' },
  { emoji: '💡', text: 'Mach ein Foto von Lichterglanz auf der Tanzfläche.' }
];

export default function PhotoMissionsCard({ onAcceptMission }) {
  const [currentMission, setCurrentMission] = useState(() => {
    const randomIndex = Math.floor(Math.random() * MISSIONS_POOL.length);
    return MISSIONS_POOL[randomIndex];
  });

  const handleNextMission = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * MISSIONS_POOL.length);
    } while (MISSIONS_POOL[nextIndex].text === currentMission.text);

    setCurrentMission(MISSIONS_POOL[nextIndex]);
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs space-y-3 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Foto-Mission für dich</span>
        </div>

        <button
          type="button"
          onClick={handleNextMission}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Andere Ziehen (250+ Missionen)</span>
        </button>
      </div>

      <div className="flex items-center space-x-3 bg-white/80 dark:bg-slate-950/70 p-3.5 rounded-xl border border-indigo-100/80 dark:border-slate-800 shadow-2xs">
        <span className="text-2xl flex-shrink-0">{currentMission.emoji}</span>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
          "{currentMission.text}"
        </p>
      </div>

      <button
        type="button"
        onClick={() => onAcceptMission && onAcceptMission(`[Foto-Mission] ${currentMission.text}`)}
        className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition active:scale-98 flex items-center justify-center space-x-1.5"
      >
        <Camera className="w-4 h-4" />
        <span>Mission jetzt erfüllen!</span>
      </button>
    </div>
  );
}
