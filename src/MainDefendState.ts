import {
    GameObject, World, MeshComponent,
    LightComponent, CameraController, EngineType, GlowLayerComponent, ParticlesComponent, ArcRotateCameraController, HighlightLayerComponent, CubeSkyBoxComponent, GUIContainerComponent, HemisphericLightComponent, SoundComponent, FollowCameraController
  } from "@ludum_studios/brix-core";
import { Config } from "./Config";
import spaceships from "./Configs/Spaceships";
import { SkyboxAnimator } from "./Components/Animators/SkyboxAnimator";
import { StateEnvironmentData } from "./Types/StateEnvironmentData";
import { OrbitRotatorComponent } from "./Components/Ship/OrbitRotatorComponent";
import { CameraAnimator } from "./Components/Animators/CameraAnimator";
import { SpaceShipName } from "./Configs/SpaceShipName";
import { FollowOrbitCameraComponent } from "./Components/Camera/FollowOrbitCameraComponent";
import defendState1EnvironmentDataExample from "./MockData/defendStateDataExample1";
import defendState2EnvironmentDataExample from "./MockData/defendStateDataExample2";
import defendState3EnvironmentDataExample from "./MockData/defendStateDataExample3";
import { MaterialLightAnimator } from "./Components/Animators/MaterialLightAnimator";

export class MainDefendState {
  private world;
  private view;
  private started;
  private onReady: Function;

  constructor(view) {
    this.view = view;
    this.started = false;
    
  }

  public disposeEngine(){
    (this.world as World).disposeEngine();
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
  public  refreshData = async (data: Array<StateEnvironmentData>) =>{
    this.world.reset();
    await this.setEnvironmentData(data);
  }

  public setEnvironmentData = async (environmentDataList: Array<StateEnvironmentData>) => {
    await this.addPlanet();
    let followCameraFirstShip = true;
    for (let environmentData of environmentDataList) {
      await this.addSpaceship(environmentData,followCameraFirstShip);
      followCameraFirstShip = false;
    }
    this.onReady();
  }

  private async setWorld(onReady: Function) {

    this.view.blur();

    const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    this.world = new World(this.view, EngineType.STANDARD, onReady);
    await this.world.init(true, true);

    const cameraController: CameraController = await this.world.registerComponent(ArcRotateCameraController);
    cameraController.position = new BABYLON.Vector3(0, 150, 0);

    if(windowWidth < Config.responsivity.mobile) {
      cameraController.getCamera().lowerRadiusLimit = 300;
    }

    const lightComponent: LightComponent = await this.world.registerComponent(HemisphericLightComponent);
    lightComponent.intensity = Config.lightIntensity;

    let cubeSkyboxComponent: CubeSkyBoxComponent = await this.world.registerComponent(CubeSkyBoxComponent);
    cubeSkyboxComponent.texturePath = Config.paths.textures + "skybox1/skybox1"; 
    
    await this.world.registerComponent(SkyboxAnimator);
    await this.world.registerComponent(CameraAnimator);
    await this.world.registerComponent(GlowLayerComponent);


    BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
  }

  private async addSpaceship(environmentData: StateEnvironmentData, hasFollowCamera: Boolean = false) {

    const spaceshipObject: GameObject = new GameObject(environmentData.shipId, this.world);
    const meshComponent: MeshComponent = await spaceshipObject.registerComponent(MeshComponent);
    
    await meshComponent.loadAsync(Config.paths.models + spaceships.get(environmentData.shipType).path, spaceships.get(environmentData.shipType).fileName); 

    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.models + spaceships.get(environmentData.shipType).path + spaceships.get(environmentData.shipType).textureName, this.world.getScene(), false, false);
    meshComponent.get().scaling = new BABYLON.Vector3(spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale);
    meshComponent.get().material.depthFunction = BABYLON.Engine.ALWAYS;

    meshComponent.position = new BABYLON.Vector3(environmentData.x, environmentData.y, environmentData.z);

    let orbitRotator: OrbitRotatorComponent = await spaceshipObject.registerComponent(OrbitRotatorComponent);
    
    orbitRotator.rotateAroundSelf = false;
    orbitRotator.rotateAroundTarget = true;
    orbitRotator.speed = 0.005;

    if (hasFollowCamera){
      const spaceshipCamera = await  spaceshipObject.registerComponent(FollowOrbitCameraComponent);  
      (spaceshipCamera as FollowOrbitCameraComponent).setCameraSpeed(0.009);
    }

    if ( environmentData.shipType === SpaceShipName.SPACE_STATION ){

      meshComponent.get().material.subMaterials[0].emissiveTexture = new BABYLON.Texture(Config.paths.textures + "space-station-emission-texture.jpg", this.world.getScene(), false, false);
      
      let lightManager = await spaceshipObject.registerComponent(MaterialLightAnimator);
      lightManager.nrOfSeconds = Config.spacestationData.nrOfSeconds;
      lightManager.flickerRate = Config.spacestationData.lightFlickerRate;

    } else {
      meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(0, 0, 0);

      orbitRotator.speed = 0.009;
      await this.addShipJetFire(spaceshipObject, spaceships.get(environmentData.shipType).jetFirePosition);

      if (spaceships.get(environmentData.shipType).jetFirePosition2) {
        await this.addShipJetFire(spaceshipObject, spaceships.get(environmentData.shipType).jetFirePosition2);
      }

      if (spaceships.get(environmentData.shipType).jetFirePosition3) {
        await this.addShipJetFire(spaceshipObject, spaceships.get(environmentData.shipType).jetFirePosition3);
      }
    }
  }

  public async addPlanet() {

    const planetObject: GameObject = new GameObject('planet', this.world);

    const meshComponent: MeshComponent = await planetObject.registerComponent(MeshComponent);
    await meshComponent.loadAsync(Config.paths.localModels ,"planetMesh.glb");
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.textures + "planets/earth-texture.jpg", this.world.getScene(), false, false);
    meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(0, 0, 0);
    meshComponent.get().scaling = new BABYLON.Vector3(28,28,28);

    let orbitRotator: OrbitRotatorComponent = await planetObject.registerComponent(OrbitRotatorComponent);
    orbitRotator.rotateAroundSelfAngle = 0.004;
    orbitRotator.rotateAroundSelf = true;
    orbitRotator.rotateAroundTarget = false;
  }

  public async addShipJetFire(spaceShipObject: GameObject, emitPosition: BABYLON.Vector3) {
    const particles: ParticlesComponent = await spaceShipObject.registerComponent(ParticlesComponent);

    particles.particlesCapacity = 50;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/blue_flame.jpg", this.getWorld().getScene());
    particles.minSize = 0.01;
    particles.maxSize = 3;
    particles.minEmitPower = 0.01;
    particles.maxEmitPower = 0.02;
    
    particles.direction1 = new BABYLON.Vector3(0, -0.2, -1.5);
    particles.direction2 = new BABYLON.Vector3(0, -0.2, -1.5);
    particles.minEmitBox = emitPosition;
    particles.maxEmitBox = emitPosition;
  }
}