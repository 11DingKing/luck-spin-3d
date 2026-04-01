const AudioManager = {
  audioContext: null,
  tickInterval: null,
  isEnabled: true,

  init() {
    try {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      Logger.debug("AudioManager initialized");
    } catch (error) {
      Logger.error("Failed to initialize AudioContext", {
        error: error.message,
      });
    }
  },

  setEnabled(enabled) {
    this.isEnabled = enabled;
    Logger.debug("Audio enabled set", { enabled });
  },

  playTick() {
    if (!this.isEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      800 + Math.random() * 400,
      this.audioContext.currentTime,
    );
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.05,
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  },

  startTickLoop(interval = 100) {
    if (!this.isEnabled) return;

    this.stopTickLoop();
    this.playTick();

    this.tickInterval = setInterval(() => {
      this.playTick();
    }, interval);

    Logger.debug("Tick loop started", { interval });
  },

  stopTickLoop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
      Logger.debug("Tick loop stopped");
    }
  },

  playCelebration() {
    if (!this.isEnabled || !this.audioContext) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const startTime = this.audioContext.currentTime;

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(freq, startTime + index * 0.15);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, startTime + index * 0.15);
      gainNode.gain.linearRampToValueAtTime(
        0.2,
        startTime + index * 0.15 + 0.05,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + index * 0.15 + 0.5,
      );

      oscillator.start(startTime + index * 0.15);
      oscillator.stop(startTime + index * 0.15 + 0.5);
    });

    for (let i = 0; i < 3; i++) {
      const noiseOsc = this.audioContext.createOscillator();
      const noiseGain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      noiseOsc.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.audioContext.destination);

      noiseOsc.type = "triangle";
      noiseOsc.frequency.setValueAtTime(
        200 + Math.random() * 1000,
        startTime + 0.2 + i * 0.2,
      );

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(5000, startTime + 0.2 + i * 0.2);

      noiseGain.gain.setValueAtTime(0, startTime + 0.2 + i * 0.2);
      noiseGain.gain.linearRampToValueAtTime(
        0.1,
        startTime + 0.2 + i * 0.2 + 0.02,
      );
      noiseGain.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + 0.2 + i * 0.2 + 0.3,
      );

      noiseOsc.start(startTime + 0.2 + i * 0.2);
      noiseOsc.stop(startTime + 0.2 + i * 0.2 + 0.3);
    }

    Logger.debug("Celebration sound played");
  },
};
