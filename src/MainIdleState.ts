import {
    GameObject, World, MeshComponent,
    LightComponent, CameraController, EngineType, XmlGUIComponent, ParticlesComponent, ArcRotateCameraController, HighlightLayerComponent, CubeSkyBoxComponent, GUIContainerComponent, HemisphericLightComponent, SoundComponent, GlowLayerComponent
  } from "@ludum_studios/brix-core";
import { Config } from "./Config";
import spaceships from "./Configs/Spaceships";
import { SkyboxAnimator } from "./Components/Animators/SkyboxAnimator";
import { StateEnvironmentData } from "./Types/StateEnvironmentData";
import { RotationInterpolator } from "./Components/Ship/RotationInterpolator";
import { OrbitRotatorComponent } from "./Components/Ship/OrbitRotatorComponent";
import { CameraAnimator } from "./Components/Animators/CameraAnimator";
import { FollowOrbitCameraComponent } from "./Components/Camera/FollowOrbitCameraComponent";
import { SpaceShipName } from "./Configs/SpaceShipName";
import { MaterialLightAnimator } from "./Components/Animators/MaterialLightAnimator";

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
  
  public disposeEngine(){
    (this.world as World).disposeEngine();
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
      await this.addSpaceship(environmentData,null,followCameraFirstShip);
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
    cameraController.position = new BABYLON.Vector3(0, 350, 0);
    cameraController.getCamera().lockedTarget = BABYLON.Vector3.Zero();
    cameraController.getCamera().upperRadiusLimit = 400;
    cameraController.getCamera().lowerRadiusLimit = 200;

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

  private async addSpaceship(environmentData: StateEnvironmentData, position: BABYLON.Vector3 = null, hasFollowCamera: Boolean = false) {

    const spaceshipObject: GameObject = new GameObject(environmentData.shipId, this.world);

    const meshComponent: MeshComponent = await spaceshipObject.registerComponent(MeshComponent);
    await meshComponent.loadAsync(Config.paths.models + spaceships.get(environmentData.shipType).path, spaceships.get(environmentData.shipType).fileName); 

    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.models + spaceships.get(environmentData.shipType).path + spaceships.get(environmentData.shipType).textureName, this.world.getScene(), false, false);
    meshComponent.get().scaling = new BABYLON.Vector3(spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale);
    meshComponent.get().material.depthFunction = BABYLON.Engine.ALWAYS;

    meshComponent.position = new BABYLON.Vector3(environmentData.x, environmentData.y, environmentData.z);

    if ( environmentData.shipType === SpaceShipName.SPACE_STATION ){

      meshComponent.get().material.subMaterials[0].emissiveTexture = new BABYLON.Texture(Config.paths.textures + "space-station-emission-texture.jpg", this.world.getScene(), false, false);
      let lightManager = await spaceshipObject.registerComponent(MaterialLightAnimator);
      lightManager.nrOfSeconds = Config.spacestationData.nrOfSeconds;
      lightManager.flickerRate = Config.spacestationData.lightFlickerRate;

    }
    else{
      meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(0, 0, 0);
    }
    let orbitRotator: OrbitRotatorComponent = await spaceshipObject.registerComponent(OrbitRotatorComponent);
    orbitRotator.rotateAroundSelf = false;
    orbitRotator.rotateAroundTarget = true;

    if (hasFollowCamera){
      await  spaceshipObject.registerComponent(FollowOrbitCameraComponent);  
      (spaceshipObject.getComponentByType(FollowOrbitCameraComponent) as FollowOrbitCameraComponent).setCameraSpeed(0.008);
    }
  }

  public async addPlanet() {
    const planetObject: GameObject = new GameObject('planet', this.world);

    const meshComponent: MeshComponent = await planetObject.registerComponent(MeshComponent);
    await meshComponent.loadAsync(Config.paths.localModels ,"planetMesh.glb");
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.textures + "planets/earth-texture.jpg", this.world.getScene(), false, false);
    meshComponent.get().scaling = new BABYLON.Vector3(28,28,28);
    meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(0, 0, 0);
    
    let orbitRotator: OrbitRotatorComponent = await planetObject.registerComponent(OrbitRotatorComponent);
    orbitRotator.rotateAroundSelfAngle = 0.004;
    orbitRotator.rotateAroundSelf = true;
    orbitRotator.rotateAroundTarget = false;
    await planetObject.registerComponent(RotationInterpolator);
    await planetObject.registerComponent(RotationInterpolator);   
  }
}