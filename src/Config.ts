export const Config = {
  paths : {
    models: "https://lightyear-game.vercel.app/assets/models/",
    missiles : "https://lightyear-game.vercel.app/assets/models/missles/",
    textures: "assets/textures/",
    guiLayouts: "assets/guiLayouts/"
  },
  rangeOfFluctuationMultipler: 10,
  attackDelayTime: 100,
  lightIntensity: 3,

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
  }
}