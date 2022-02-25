export const Config = {
  paths : {
    models: "https://lightyear-game.vercel.app/assets/models/",
    missiles : "https://lightyear-game.vercel.app/assets/models/missles/",
    localModels : "assets/models/",
    textures: "assets/textures/",
    guiLayouts: "assets/guiLayouts/",
    audio: {
      effects: "assets/sounds/effects/"
    }
  },

  healthBarScale: 15,
  rangeOfFluctuationMultipler: 10,
  attackDelayTime: 100,
  lightIntensity: 3,

  responsivity: {
    mobile: 500,
    tablet: 1400
  },

  droneInfo: {
    xSpacing: 7,
    scaling: 1,
    shootingAnimationSpeed: 0.08
  },

  laserInfo: {
    scaling: 30,
    animationSpeed: 0.2
  },

  staticLayout : {
    active: true,
    xSpacing: 20,
    zSpacing: 10,
    initialZ: 70
  },

  staticCameraAnimation : {
    active: true,
    zDistance: 100,
    yDistance: 50,
    speed: 5
  },

  spacestationData : {
    lightFlickerRate: 0.5,  // %of time the light is on | from 0(off) to 1(on)
    // for example 0.5 means half the nrOfSeconds given below, bigger the number, the more time the light stays on | min 0, max 1, default 0.5
    nrOfSeconds:1,  // min 0, max 10  | default 1
  }
}