import {
  GameObject, World, MeshComponent, DirectionalLightComponent,
  LightComponent, CameraController, EngineType, ParticlesComponent, ArcRotateCameraController, CubeSkyBoxComponent, GUIContainerComponent, HemisphericLightComponent
} from "brix";
import { ShipAnimator } from "./Components/Ship/ShipAnimator";
import { Config } from "./Config";
import spaceships from "./Data/Spaceships";
import { EngineComponent } from "./Components/Ship/EngineComponent";
import { SkyboxAnimator } from "./Components/Animators/SkyboxAnimator";
import { ExplosionParticle } from "./Components/Particles/ExplosionParticle";
import { ShipWeaponComponent } from "./Components/Ship/ShipWeaponComponent";
import { AttackData } from "./Types/AttackData";
import { EnvironmentData } from "./Types/EnvironmentData";
import { GUIComponent } from "./Components/Ship/GUIComponent";
import { TurnHandlingComponent } from "./Components/World/TurnHandlingComponent";
import { RotationInterpolator } from "./Components/Ship/RotationInterpolator";


export class Main {
  private world;
  private view;
  private started;
  private onReady: Function;
  private currentTurnMoves: Array<AttackData>;
  private currentMove: number;
  private attackInterval: any;

  constructor(view) {
    this.view = view;
    this.started = false;
    this.currentTurnMoves = [];
    this.currentMove = 0;
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
    
    this.world = new World(this.view, EngineType.STANDARD, onReady);
    await this.world.init(true);

    const cameraController: CameraController = await this.world.registerComponent(ArcRotateCameraController);
    cameraController.position = new BABYLON.Vector3(0, 150, 0);
    cameraController.getCamera().lockedTarget = BABYLON.Vector3.Zero();
    cameraController.getCamera().beta = 0.8;
    cameraController.getCamera().alpha = 6;


    const lightComponent: LightComponent = await this.world.registerComponent(HemisphericLightComponent);
    lightComponent.intensity = Config.lightIntensity;

    let cubeSkyboxComponent: CubeSkyBoxComponent = await this.world.registerComponent(CubeSkyBoxComponent);
    cubeSkyboxComponent.texturePath = Config.paths.textures + "skybox1/skybox1";

    await this.world.registerComponent(GUIContainerComponent);
    await this.world.registerComponent(SkyboxAnimator);
    const turnHandlingComponent: TurnHandlingComponent = await this.world.registerComponent(TurnHandlingComponent);
    turnHandlingComponent.maxWaitTimer = Config.attackDelayTime;
  }

  private async addSpaceship(environmentData: EnvironmentData) {

    const spaceShipObject: GameObject = new GameObject(environmentData.shipId, this.world);

    const meshComponent: MeshComponent = await spaceShipObject.registerComponent(MeshComponent);
    await meshComponent.loadAsync(Config.paths.models + spaceships.get(environmentData.shipType).path, spaceships.get(environmentData.shipType).fileName);
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.models + spaceships.get(environmentData.shipType).path + spaceships.get(environmentData.shipType).textureName, this.world.getScene(), false, false);

    
    meshComponent.position = new BABYLON.Vector3(environmentData.x, environmentData.y, environmentData.z);
    meshComponent.get().scaling = new BABYLON.Vector3(spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale);

    const guiComponent: GUIComponent = await spaceShipObject.registerComponent(GUIComponent);

    const shipAnimator: ShipAnimator = await spaceShipObject.registerComponent(ShipAnimator);
    shipAnimator.floatingFrequency = environmentData.frequencyOfFluctuaction;
    shipAnimator.floatingRange = environmentData.radiusOfFluctuation * Config.rangeOfFluctuationMultipler;
    shipAnimator.animating = true;

    const engineComponent: EngineComponent =  await spaceShipObject.registerComponent(EngineComponent);
    engineComponent.health = environmentData.initialHP;
    engineComponent.maxHealth = environmentData.initialHP;
    engineComponent.isMySide = environmentData.isMySide;
    engineComponent.missileName = spaceships.get(environmentData.shipType).missileName;

    await spaceShipObject.registerComponent(RotationInterpolator);

    const weaponsComponent: ShipWeaponComponent =  await spaceShipObject.registerComponent(ShipWeaponComponent);
    weaponsComponent.missileStartPosition = spaceships.get(environmentData.shipType).missilePosition;
    weaponsComponent.laserStartPosition = spaceships.get(environmentData.shipType).laserPosition;
    weaponsComponent.dronesStartPosition = spaceships.get(environmentData.shipType).dronesPosition;

    const particles: ParticlesComponent = await spaceShipObject.registerComponent(ParticlesComponent);
    
    particles.particlesCapacity = 200;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/blue_flame.jpg", this.getWorld().getScene());
    particles.minSize = 0.01;
    particles.maxSize = 3;
    particles.minEmitPower = 0.01;
    particles.maxEmitPower = 0.05;
    particles.direction1 = new BABYLON.Vector3(0, -0.2, 1.5);
    particles.direction2 = new BABYLON.Vector3(0, -0.2, 1.5);
    particles.minEmitBox = spaceships.get(environmentData.shipType).jetFirePosition;
    particles.maxEmitBox = spaceships.get(environmentData.shipType).jetFirePosition;

    await spaceShipObject.registerComponent(ExplosionParticle);

    if(environmentData.isMySide) {
      guiComponent.get().background = "green";
      meshComponent.rotate(BABYLON.Axis.Y, 3.14, BABYLON.Space.LOCAL);
    }
  }

  public setEnvironmentData = async (environmentDataList: Array<EnvironmentData>) => {

    for(let environmentData of environmentDataList) {
     await this.addSpaceship(environmentData);
    }

    this.onReady();
  }

  public setAttackTurn = async ( attackTurnData: Array<AttackData>) => {
   (this.world.getComponentByType(TurnHandlingComponent) as TurnHandlingComponent).setTurnData(attackTurnData);
  }
}