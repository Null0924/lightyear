import {
    GameObject, World, MeshComponent,
    LightComponent, CameraController, EngineType, XmlGUIComponent, ParticlesComponent, ArcRotateCameraController, HighlightLayerComponent, CubeSkyBoxComponent, GUIContainerComponent, HemisphericLightComponent, SoundComponent
  } from "@ludum_studios/brix-core";
  import { ShipAnimator } from "./Components/Ship/ShipAnimator";
  import { Config } from "./Config";
  import spaceships from "./Configs/Spaceships";
  import { EngineComponent } from "./Components/Ship/EngineComponent";
  import { SkyboxAnimator } from "./Components/Animators/SkyboxAnimator";
  import { EnvironmentData } from "./Types/EnvironmentData";
  import { SpacestationData } from "./Types/SpaceStationData";
  import { PlanetData } from "./Types/PlanetData";
  import { SpaceshipData } from "./Types/SpaceshipData";
  import { RotationInterpolator } from "./Components/Ship/RotationInterpolator";
  import { OrbitRotatorComponent } from "./Components/Ship/OrbitRotatorComponent";
  import { CameraAnimator } from "./Components/Animators/CameraAnimator";
  
  
  export class MainIdleState {
    private world;
    private view;
    private started;
    private onReady: Function;
  
    constructor(view) {
      this.view = view;
      this.started = false;
    }
  
    public getWorld(): World {
      return this.world;
    }
  
    public isStarted() {
      return this.started;
    }
  
    public setCallbacks = (inputCallback, navigationEndCallback) => {
  
    }
  
    public async setup(onReady: Function) {
      await this.setWorld(null);
      this.onReady = onReady;
  
      this.world.start();
      this.started = true;
    }
  
    private async setWorld(onReady: Function) {
  
      this.view.blur();
  
      const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  
      this.world = new World(this.view, EngineType.STANDARD, onReady);
      await this.world.init(true, true);
  
      const cameraController: CameraController = await this.world.registerComponent(ArcRotateCameraController);
      cameraController.position = new BABYLON.Vector3(0, 250, 0);
      cameraController.getCamera().lockedTarget = BABYLON.Vector3.Zero();
      cameraController.getCamera().beta = 0.8;
      cameraController.getCamera().alpha = 6;
  
      if(windowWidth < Config.responsivity.mobile) {
        cameraController.getCamera().lowerRadiusLimit = 300;
      }
  
      const lightComponent: LightComponent = await this.world.registerComponent(HemisphericLightComponent);
      lightComponent.intensity = Config.lightIntensity;
  
      let cubeSkyboxComponent: CubeSkyBoxComponent = await this.world.registerComponent(CubeSkyBoxComponent);
      cubeSkyboxComponent.texturePath = Config.paths.textures + "skybox1/skybox1"; 
     
      await this.world.registerComponent(SkyboxAnimator);
  
      await this.world.registerComponent(CameraAnimator);
  
      BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
    }
    
  
    private async addSpaceship(spaceshipData: SpaceshipData) {
  
        const spaceshipObject: GameObject = new GameObject(spaceshipData.spaceshipId, this.world);
  
        const meshComponent: MeshComponent = await spaceshipObject.registerComponent(MeshComponent);
        
        await meshComponent.loadAsync(Config.paths.localModels ,"spaceship.glb");
        
        meshComponent.position = new BABYLON.Vector3(spaceshipData.x,spaceshipData.y,spaceshipData.z);
        meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.textures + "space-station-texture.jpg", this.world.getScene(), false, false);
        meshComponent.get().scaling = new BABYLON.Vector3(5,5,5);

        let orbitRotator: OrbitRotatorComponent = await spaceshipObject.registerComponent(OrbitRotatorComponent);
        orbitRotator.rotateAroundSelf = false;
        orbitRotator.rotateAroundTarget = true;
        orbitRotator.speed = spaceshipData.speedOfOrbitalMovement;  
        await spaceshipObject.registerComponent(RotationInterpolator);
  
  
    }
    private async addSpaceStation(spaceStationData: SpacestationData) { 

        const spaceStationObject: GameObject = new GameObject(spaceStationData.spaceStationId, this.world);
  
        const meshComponent: MeshComponent = await spaceStationObject.registerComponent(MeshComponent);
        
        await meshComponent.loadAsync(Config.paths.localModels ,"space-station.glb");
        
        meshComponent.position = new BABYLON.Vector3(spaceStationData.x,spaceStationData.y,spaceStationData.z);
       
        meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.textures + "space-station-texture.jpg", this.world.getScene(), false, false);
        meshComponent.get().scaling = new BABYLON.Vector3(5,5,5);

        let orbitRotator: OrbitRotatorComponent = await spaceStationObject.registerComponent(OrbitRotatorComponent);
        orbitRotator.rotateAroundSelf = true;
        orbitRotator.rotateAroundTarget = true;
       // orbitRotator.speed = spaceStationData.speedOfOrbitalMovement;  
        //orbitRotator.rotateAroundSelfAngle =  spaceStationData.speedOfOrbitalRotation;
        await spaceStationObject.registerComponent(RotationInterpolator);
    
    }
    private async addPlanet(planetData: PlanetData) {
        const planetObject: GameObject = new GameObject(planetData.planetId, this.world);
  
        const meshComponent: MeshComponent = await planetObject.registerComponent(MeshComponent);
        await meshComponent.loadAsync(Config.paths.localModels ,"planetMesh.glb");
        meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.textures + "planets/venus.jpg", this.world.getScene(), false, false);
        meshComponent.get().scaling = new BABYLON.Vector3(23,23,23);

        let orbitRotator: OrbitRotatorComponent = await planetObject.registerComponent(OrbitRotatorComponent);
        orbitRotator.rotateAroundSelf = true;
        orbitRotator.rotateAroundTarget = false;
        await planetObject.registerComponent(RotationInterpolator);
        await planetObject.registerComponent(RotationInterpolator);    

    
    }
  
    public setPlanetData = async (planetDataList: Array<PlanetData>) => {
        for (let planetData of planetDataList) {
           await this.addPlanet(planetData)
        }
        this.onReady();
    }
    public setSpaceshipData = async (spaceshipDataList: Array<SpaceshipData>) => {
        for (let spaceShip of spaceshipDataList) {
            await this.addSpaceship(spaceShip);
        }
        this.onReady();
    }
    public setSpaceStationtData = async (spaceStationtDataList: Array<SpacestationData>) => {
        for (let spaceStation of spaceStationtDataList) {
            await this.addSpaceStation(spaceStation);
        }
        this.onReady();
    }
   
  }