// 1. Pegamos el contenido LRC exacto que conseguiste
const lrcRaw = `
[00:18.18]Your morning eyes, I could stare like watching stars
[00:26.00]I could walk you by, and I'll tell without a thought
[00:32.54]You'd be mine
[00:34.77]Would you mind if i took your hand tonight
[00:40.07]Know you're all that I want this life
[00:47.83]I'll imagine we fell in love
[00:51.09]I'll nap under moonlight skies with you
[00:54.92]I think I'll picture us, you with the waves
[00:58.70]The oceans colors on your face
[01:02.46]I'll leave my heart with your air
[01:06.71]So let me fly with you
[01:10.54]Will you be forever with me
[01:48.03]My love will always stay by you
[01:54.34]I'll keep it safe so don't you worry a thing, I'll tell you i love you more
[02:02.63]It's stuck with you forever so promise you won't let it go
[02:09.67]I'll trust the universe will always bring me to you
[02:18.01]I'll imagine we fell in love
[02:20.78]I'll nap under moonlight skies with you
[02:24.55]I think I'll picture us, you with the waves
[02:28.58]The oceans colors on your face
[02:32.35]I'll leave my heart with your air
[02:36.62]So let me fly with you
[02:39.88]Will you be forever with me
`;

// 2. Diccionario de traducciones (para no perder tu trabajo anterior)
const translations = {
    "Your morning eyes, I could stare like watching stars": "Tus ojos de la mañana, podría mirar como mirar las estrellas",
    "I could walk you by, and I'll tell without a thought": "Podría pasearte y lo diría sin pensarlo",
    "You'd be mine": "Serías mía",
    "Would you mind if i took your hand tonight": "¿Te importaría que te cogiera de la mano esta noche?",
    "Know you're all that I want this life": "Saber que eres todo lo que quiero, esta vida",
    "I'll imagine we fell in love": "Imaginaré que nos enamoramos",
    "I'll nap under moonlight skies with you": "Dormiré contigo bajo la luz de la luna",
    "I think I'll picture us, you with the waves": "Creo que nos voy a imaginar, tú con las olas",
    "The oceans colors on your face": "Los colores del océano en tu cara",
    "I'll leave my heart with your air": "Dejaré mi corazón con tu aire",
    "So let me fly with you": "Así que déjame volar contigo",
    "Will you be forever with me": "¿Estarás para siempre conmigo?",
    "My love will always stay by you": "Mi amor siempre estará a tu lado",
    "I'll keep it safe so don't you worry a thing, I'll tell you i love you more": "Lo mantendré a salvo, así que no te preocupes, te diré que te quiero más",
    "It's stuck with you forever so promise you won't let it go": "Está pegado a ti para siempre, así que promete que no lo dejarás ir",
    "I'll trust the universe will always bring me to you": "Confiaré en que el universo siempre me traerá a ti"
};

// 3. Función Parser que genera el array que tu reproductor necesita
function parseLRC(lrc) {
    return lrc.trim().split('\n').map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const totalSeconds = parseInt(match[1]) * 60 + parseFloat(match[2]);
            const englishText = match[3].trim();
            // Buscamos la traducción en nuestro diccionario, si no existe, dejamos vacío
            const spanishText = translations[englishText] || ""; 
            return [totalSeconds, englishText, spanishText];
        }
        return null;
    }).filter(Boolean);
}

// 4. Esta es la variable que tu script principal ya usa
const lyricsData = parseLRC(lrcRaw);