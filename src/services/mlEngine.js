/**
 * SENTINEL ML Engine (Prototype/Heuristic)
 * Provides predictive modeling for disaster cascades, plumes, and blast radii.
 */

export const mlEngine = {
  /**
   * Calculates a Gaussian plume dispersion area.
   * @param {Array} origin - [lat, lng]
   * @param {Object} params - { windSpeed, windDirection, stability }
   * @returns {Object} GeoJSON-like dispersion polygon
   */
  calculateCBRNPlume: (origin, params = {}) => {
    const { windDirection = 45, windSpeed = 5 } = params;
    const lat = origin[0];
    const lng = origin[1];
    
    // Create a cone-like polygon for the plume
    const length = 0.05 * (windSpeed / 5); // Rough degree length
    const width = 0.02;
    
    const rad = (90 - windDirection) * (Math.PI / 180);
    const tip = [lat + Math.sin(rad) * length, lng + Math.cos(rad) * length];
    const left = [lat + Math.sin(rad - 0.4) * (length * 0.8), lng + Math.cos(rad - 0.4) * (length * 0.8)];
    const right = [lat + Math.sin(rad + 0.4) * (length * 0.8), lng + Math.cos(rad + 0.4) * (length * 0.8)];

    return [
      origin,
      left,
      tip,
      right
    ];
  },

  /**
   * Calculates Hopkinson-Cranz scaled overpressure zones.
   * @param {Array} origin - [lat, lng]
   * @param {number} yieldKg - Explosive yield in kg TNT equivalent
   * @returns {Array} List of radii for { lethal, severe, moderate }
   */
  calculateBlastZones: (origin, yieldKg) => {
    // Very rough heuristic for prototype
    const lethal = Math.pow(yieldKg, 1/3) * 5;
    const severe = lethal * 2.5;
    const moderate = lethal * 5;
    
    return [
      { radius: lethal, label: 'Lethal', color: '#ef4444' },
      { radius: severe, label: 'Severe Injury', color: '#f59e0b' },
      { radius: moderate, label: 'Moderate Injury', color: '#3b82f6' }
    ];
  },

  /**
   * Predicts disaster probability based on sensor precursors.
   */
  predictThreatProbability: (sensorData) => {
    // Heuristic: if multiple sensors are abnormal, probability increases
    const abnormalCount = sensorData.filter(s => s.value > s.threshold).length;
    return Math.min(abnormalCount * 0.25, 1.0);
  }
};
