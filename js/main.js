// ==================== ANIMATED PARTICLES ====================
function createParticles() {
    const container = document.getElementById('particles');
    // Colores oficiales de BLACKPINK
    const colors = ['#FF2E93', '#FF006D', '#FFC0E3', '#C724B1', '#00D4FF', '#FF10F0'];
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 12 + 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particle.style.boxShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
        container.appendChild(particle);
    }
}

// ==================== AUDIO PLAYER ====================
const audio = document.getElementById('audioElement');
const playButton = document.getElementById('playButton');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const audioStatus = document.getElementById('audioStatus');

// Set initial volume
audio.volume = 0.7;

// Check if audio file is loaded
let audioLoaded = false;

// Format time helper function
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Check if audio can be loaded
audio.addEventListener('loadedmetadata', function() {
    console.log('Audio cargado correctamente');
    console.log('Duración:', audio.duration);
    durationEl.textContent = formatTime(audio.duration);
    audioLoaded = true;
    audioStatus.classList.remove('show');
});

audio.addEventListener('canplay', function() {
    console.log('Audio listo para reproducir');
    audioLoaded = true;
    audioStatus.classList.remove('show');
});

// Handle audio errors
audio.addEventListener('error', function(e) {
    console.error('Error al cargar el audio:', e);
    console.error('Código de error:', audio.error.code);
    console.error('Mensaje:', audio.error.message);
    
    audioLoaded = false;
    audioStatus.classList.add('show');
    playButton.disabled = false;
    
    let errorMsg = 'No se pudo cargar el archivo de audio. ';
    
    switch(audio.error.code) {
        case 1:
            errorMsg += 'La carga fue abortada.';
            break;
        case 2:
            errorMsg += 'Error de red.';
            break;
        case 3:
            errorMsg += 'Error de decodificación.';
            break;
        case 4:
            errorMsg += 'Archivo no encontrado o formato no soportado. Asegúrate de que <strong>blue_yungkai.mp3</strong> esté en la carpeta <strong>assets/</strong>';
            break;
    }
    
    audioStatus.innerHTML = '⚠️ ' + errorMsg;
});

// Play/Pause toggle
playButton.addEventListener('click', function() {
    if (!audioLoaded) {
        alert('⚠️ Por favor, coloca el archivo "blue_yungkai.mp3" en la carpeta "assets/"\n\nPasos:\n1. Descarga la canción "Blue" de Yung Kai\n2. Guárdala como "blue_yungkai.mp3"\n3. Colócala en la carpeta "assets/"\n4. Recarga la página');
        return;
    }
    
    if (audio.paused) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Reproducción iniciada');
                playButton.classList.add('playing');
            }).catch(error => {
                console.error('Error al reproducir:', error);
                alert('Error al reproducir el audio. Verifica que el archivo MP3 esté en la carpeta "assets/"');
            });
        }
    } else {
        audio.pause();
        playButton.classList.remove('playing');
        console.log('Reproducción pausada');
    }
});

// Update progress bar as audio plays
audio.addEventListener('timeupdate', function() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

// Click on progress bar to seek
progressBar.addEventListener('click', function(e) {
    if (!audioLoaded || !audio.duration) {
        return;
    }
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// Volume control
volumeSlider.addEventListener('input', function() {
    audio.volume = this.value / 100;
    console.log('Volumen:', audio.volume);
});

// When song ends
audio.addEventListener('ended', function() {
    playButton.classList.remove('playing');
    progress.style.width = '0%';
    audio.currentTime = 0;
    console.log('Canción terminada');
});

// Keyboard controls (Space bar for play/pause)
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        playButton.click();
    }
});

// Try to load audio on page load
window.addEventListener('load', function() {
    // Force audio to try loading
    audio.load();
    
    // Check after 2 seconds if audio is still not loaded
    setTimeout(function() {
        if (!audioLoaded) {
            console.warn('Audio no cargado después de 2 segundos');
            audioStatus.classList.add('show');
        }
    }, 2000);
    
    // Load lyrics
    loadLyrics();
});

// ==================== SYNCHRONIZED LYRICS SYSTEM ====================
const lyricsContainer = document.getElementById('lyricsScroll');
let currentActiveLine = -1;

// Load and render lyrics
function loadLyrics() {
    if (typeof lyricsData === 'undefined') {
        console.error('Archivo lyrics.js no cargado');
        lyricsContainer.innerHTML = '<p style="text-align: center; color: var(--bp-light-pink);">⚠️ Error: No se encontró el archivo de letras. Asegúrate de que lyrics.js esté cargado.</p>';
        return;
    }
    
    lyricsContainer.innerHTML = '';
    
    lyricsData.forEach((line, index) => {
        const [time, english, spanish] = line;
        
        // Skip empty lines at beginning and end
        if (!english && !spanish && (index === 0 || index === lyricsData.length - 1)) {
            return;
        }
        
        const lineDiv = document.createElement('div');
        lineDiv.className = 'lyrics-line';
        lineDiv.setAttribute('data-time', time);
        lineDiv.setAttribute('data-index', index);
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'lyrics-timestamp';
        timestamp.textContent = formatTime(time);
        lineDiv.appendChild(timestamp);
        
        // Add English lyrics
        if (english) {
            const englishDiv = document.createElement('div');
            englishDiv.className = 'lyrics-english';
            englishDiv.textContent = english;
            lineDiv.appendChild(englishDiv);
        }
        
        // Add Spanish translation
        if (spanish) {
            const spanishDiv = document.createElement('div');
            spanishDiv.className = 'lyrics-spanish';
            spanishDiv.textContent = spanish;
            lineDiv.appendChild(spanishDiv);
        }
        
        // Add instrumental indicator if both are empty
        if (!english && !spanish) {
            const instrumental = document.createElement('div');
            instrumental.className = 'lyrics-english';
            instrumental.style.textAlign = 'center';
            instrumental.style.opacity = '0.5';
            instrumental.textContent = '♪ Instrumental ♪';
            lineDiv.appendChild(instrumental);
        }
        
        // Make line clickable to seek
        lineDiv.addEventListener('click', function() {
            if (audioLoaded && audio.duration) {
                audio.currentTime = time;
                if (audio.paused) {
                    audio.play();
                    playButton.classList.add('playing');
                }
            }
        });
        
        lyricsContainer.appendChild(lineDiv);
    });
    
    console.log('Letras cargadas:', lyricsData.length, 'líneas');
}

// Update active lyrics line based on current time
function updateActiveLyrics() {
    if (!audioLoaded || typeof lyricsData === 'undefined') return;
    
    const currentTime = audio.currentTime;
    let newActiveLine = -1;
    
    // Buscamos de atrás hacia adelante para encontrar la línea actual más rápido
    for (let i = lyricsData.length - 1; i >= 0; i--) {
        if (currentTime >= lyricsData[i][0]) {
            newActiveLine = i;
            break; 
        }
    }
    
    // Update only if changed
    if (newActiveLine !== currentActiveLine) {
        // Remove previous active states
        const allLines = lyricsContainer.querySelectorAll('.lyrics-line');
        allLines.forEach((line, index) => {
            line.classList.remove('active', 'passed');
            
            const lineIndex = parseInt(line.getAttribute('data-index'));
            if (lineIndex < newActiveLine) {
                line.classList.add('passed');
            } else if (lineIndex === newActiveLine) {
                line.classList.add('active');
                
                // Scroll to active line (centered)
                line.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
        
        currentActiveLine = newActiveLine;
    }
}

// Update lyrics on timeupdate
audio.addEventListener('timeupdate', function() {
    updateActiveLyrics();
});

// Reset lyrics when song restarts
audio.addEventListener('seeked', function() {
    updateActiveLyrics();
});

// ==================== SCROLL ANIMATIONS ====================
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== GALLERY HOVER EFFECTS ====================
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 60px rgba(255, 0, 110, 0.6)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// ==================== INITIALIZE ====================
window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', () => {
    createParticles();
    handleScrollAnimations();
});