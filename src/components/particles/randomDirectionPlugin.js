class RandomDirectionPlugin {
  constructor() {
    this.id = "randomDirection";
  }

  init() {
    // Nothing to initialize
  }

  update(particle) {
    // Randomly change particle direction mid-flight
    if (Math.random() < 0.01) {
      particle.velocity.angle = Math.random() * Math.PI * 2;
    }
  }
}

export default RandomDirectionPlugin;
