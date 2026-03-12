export const DISASTER_TYPES = {
  // Natural Disasters
  SEISMIC: 'Seismic',
  FLOOD: 'Flood',
  WILDFIRE: 'Wildfire',
  CYCLONE: 'Cyclone',
  TSUNAMI: 'Tsunami',
  VOLCANIC: 'Volcanic',
  LANDSLIDE: 'Landslide',
  DROUGHT: 'Drought',
  // Man-Made / Technological
  CBRN: 'CBRN',
  NUCLEAR: 'Nuclear',
  INDUSTRIAL: 'Industrial',
  TERRORISM: 'Terrorism',
  CONFLICT: 'Conflict',
  INFRASTRUCTURE: 'Infrastructure',
  OIL_SPILL: 'Oil Spill',
};

export const SEVERITY_LEVELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

const generateRandomCoord = (center, radius) => {
  const y0 = center[0];
  const x0 = center[1];
  const rd = radius / 111300; // about 111300 meters in one degree

  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return [y0 + y, x0 + x];
};

export const mockDataService = {
  getIncidents: () => [
    {
      id: 1,
      type: DISASTER_TYPES.SEISMIC,
      title: 'Earthquake Magnitude 6.2',
      location: [34.0522, -118.2437],
      severity: SEVERITY_LEVELS.CRITICAL,
      timestamp: new Date().toISOString(),
      description: 'Major seismic activity detected near downtown Los Angeles.',
      resourcesAssigned: 12
    },
    {
      id: 2,
      type: DISASTER_TYPES.CBRN,
      title: 'Chemical Leak Detected',
      location: [34.1022, -118.3437],
      severity: SEVERITY_LEVELS.HIGH,
      timestamp: new Date().toISOString(),
      description: 'Industrial facility report: Ammonia plume dispersing north.',
      resourcesAssigned: 5
    },
    {
      id: 3,
      type: DISASTER_TYPES.CYCLONE,
      title: 'Category 3 Cyclone Approaching',
      location: [13.0827, 80.2707],
      severity: SEVERITY_LEVELS.CRITICAL,
      timestamp: new Date().toISOString(),
      description: 'Cyclone Vayu projected to make landfall within 36 hours. Evacuation orders issued.',
      resourcesAssigned: 42
    },
    {
      id: 4,
      type: DISASTER_TYPES.NUCLEAR,
      title: 'Nuclear Facility Coolant Alarm',
      location: [21.6551, 69.7748],
      severity: SEVERITY_LEVELS.CRITICAL,
      timestamp: new Date().toISOString(),
      description: 'Primary coolant loop pressure drop detected. IAEA protocols initiated.',
      resourcesAssigned: 18
    },
    {
      id: 5,
      type: DISASTER_TYPES.TSUNAMI,
      title: 'Tsunami Warning — Indian Ocean',
      location: [3.3194, 95.3647],
      severity: SEVERITY_LEVELS.HIGH,
      timestamp: new Date().toISOString(),
      description: 'Underwater seismic event M7.8 generated a tsunami. Coastal evacuation underway.',
      resourcesAssigned: 30
    },
    {
      id: 6,
      type: DISASTER_TYPES.INDUSTRIAL,
      title: 'Refinery Explosion — Chemical Plant',
      location: [22.3072, 73.1812],
      severity: SEVERITY_LEVELS.HIGH,
      timestamp: new Date().toISOString(),
      description: 'Explosion at petroleum refinery. Multiple casualties reported. Fire spreading to neighboring units.',
      resourcesAssigned: 22
    }
  ],

  getSatelliteRegions: () => [
    { id: 'R1', bounds: [[34.0, -118.4], [34.2, -118.1]], type: 'Thermal Anomaly' }
  ]
};
