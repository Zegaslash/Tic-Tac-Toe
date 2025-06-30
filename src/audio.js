export {initAudio, sounds};

// Audio context for sound effectSs
let audioContext;
let sounds = {};

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createSounds();
    } catch (error) {
        console.log('Audio not supported in this browser');
    }
}

// Create sound effects
function createSounds() {
    // Click sound
    sounds.click = createTone(800, 0.1, 'sawtooth');
    
    // Win sound
    sounds.win = createTone(523, 0.3, 'square'); // C5 note
    
    // Draw sound
    sounds.draw = createTone(440, 0.2, 'sine'); // A4 note
    
    // Switch player sound
    sounds.switch = createTone(600, 0.1, 'sawtooth');
}

// Create a simple tone
function createTone(frequency, duration, type) {
    return function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
}