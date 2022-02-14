import {
  GameObject, World, MeshComponent,
  LightComponent, CameraController, EngineType, XmlGUIComponent, ParticlesComponent, ArcRotateCameraController, HighlightLayerComponent, CubeSkyBoxComponent, GUIContainerComponent, HemisphericLightComponent, SoundComponent, SetShapesComponent, MeshType
} from "@ludum_studios/brix-core";
import { Config } from "./Config";
import spaceships from "./Configs/Spaceships";
import { EnvironmentData } from "./Types/EnvironmentData";
import { LightSpeedComponent } from "./Components/World/LightSpeedComponent";
export class MainWarpState {
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

    this.world.getScene().clearColor = new BABYLON.Color3(0, 0, 0);
    const cameraController: CameraController = await this.world.registerComponent(ArcRotateCameraController);
    cameraController.position = new BABYLON.Vector3(0, 125, 0);

    cameraController.getCamera().upperBetaLimit = cameraController.getCamera().beta;
    cameraController.getCamera().lowerBetaLimit = cameraController.getCamera().beta;
    cameraController.getCamera().lowerRadiusLimit = cameraController.getCamera().radius;
    cameraController.getCamera().upperRadiusLimit = cameraController.getCamera().radius;
    cameraController.getCamera().lockedTarget = BABYLON.Vector3.Zero();

    const lightComponent: LightComponent = await this.world.registerComponent(HemisphericLightComponent);
    lightComponent.intensity = Config.lightIntensity;

    const lightSpeedComponent: LightSpeedComponent = await this.world.registerComponent(LightSpeedComponent);
  }

  private async addSpaceship(environmentData: EnvironmentData, position: BABYLON.Vector3 = null) {

    const spaceShipObject: GameObject = new GameObject(environmentData.shipId, this.world);

    const meshComponent: MeshComponent = await spaceShipObject.registerComponent(MeshComponent);
    await meshComponent.loadAsync(Config.paths.models + spaceships.get(environmentData.shipType).path, spaceships.get(environmentData.shipType).fileName);
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.models + spaceships.get(environmentData.shipType).path + spaceships.get(environmentData.shipType).textureName, this.world.getScene(), false, false);

    meshComponent.position = new BABYLON.Vector3(environmentData.x, environmentData.y, environmentData.z);
    meshComponent.get().scaling = new BABYLON.Vector3(spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale);
    meshComponent.get().material.depthFunction = BABYLON.Engine.ALWAYS;

    meshComponent.get().lookAt(new BABYLON.Vector3(0, -150, 0));
    await this.addShipJetFire(spaceShipObject, spaceships.get(environmentData.shipType).jetFirePosition);

    if (spaceships.get(environmentData.shipType).jetFirePosition2) {
      await this.addShipJetFire(spaceShipObject, spaceships.get(environmentData.shipType).jetFirePosition2);
    }
    if (spaceships.get(environmentData.shipType).jetFirePosition3) {
      await this.addShipJetFire(spaceShipObject, spaceships.get(environmentData.shipType).jetFirePosition3);
    }
  }

  public async addShipJetFire(spaceShipObject: GameObject, emitPosition: BABYLON.Vector3) {
    
    const particles: ParticlesComponent = await spaceShipObject.registerComponent(ParticlesComponent);

    particles.particlesCapacity = 80;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/blue_flame.jpg", this.getWorld().getScene());
    particles.minSize = 0.01;
    particles.maxSize = 3;
    particles.minEmitPower = 0.05;
    particles.maxEmitPower = 0.15;
    particles.direction1 = new BABYLON.Vector3(0, -0.2, -1.5);
    particles.direction2 = new BABYLON.Vector3(0, -0.2, -1.5);
    particles.minEmitBox = emitPosition;
    particles.maxEmitBox = emitPosition;
  }

  public setEnvironmentData = async (environmentDataList: Array<EnvironmentData>) => {

    let i = 0;
    for (let environmentData of environmentDataList) {

      if (i > 3) {
        continue;
      }
      await this.addSpaceship(environmentData);
      i++;

    }

    this.onReady();
  }
}