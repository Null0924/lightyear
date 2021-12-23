import {
  GameObject, World, MeshComponent,
  LightComponent, CameraController, EngineType, XmlGUIComponent, ParticlesComponent, ArcRotateCameraController, HighlightLayerComponent, CubeSkyBoxComponent, GUIContainerComponent, HemisphericLightComponent
} from "brix";
import { ShipAnimator } from "./Components/Ship/ShipAnimator";
import { Config } from "./Config";
import spaceships from "./Configs/Spaceships";
import { EngineComponent } from "./Components/Ship/EngineComponent";
import { SkyboxAnimator } from "./Components/Animators/SkyboxAnimator";
import { ExplosionParticle } from "./Components/Particles/ExplosionParticle";
import { ShipWeaponComponent } from "./Components/Ship/ShipWeaponComponent";
import { AttackData } from "./Types/AttackData";
import { EnvironmentData } from "./Types/EnvironmentData";
import { GUIComponent } from "./Components/Ship/GUIComponent";
import { TurnHandlingComponent } from "./Components/World/TurnHandlingComponent";
import { RotationInterpolator } from "./Components/Ship/RotationInterpolator";
import { WaitData } from "./Types/WaitData";
import { CameraData } from "./Types/CameraData";
import { CameraAnimator } from "./Components/Animators/CameraAnimator";


export class Main {
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

    this.world = new World(this.view, EngineType.STANDARD, onReady);
    await this.world.init(true, true);

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

    await this.world.registerComponent(CameraAnimator);
    let worldLayout: XmlGUIComponent = await this.world.registerComponent(XmlGUIComponent);
    await worldLayout.loadAsync(Config.paths.guiLayouts, "worldLayout.xml");
    worldLayout.name="worldLayout";

    await this.world.registerComponent(HighlightLayerComponent);
  }

  private async addSpaceship(environmentData: EnvironmentData, position: BABYLON.Vector3 = null) {

    const spaceShipObject: GameObject = new GameObject(environmentData.shipId, this.world);

    const meshComponent: MeshComponent = await spaceShipObject.registerComponent(MeshComponent);
    await meshComponent.loadAsync(Config.paths.models + spaceships.get(environmentData.shipType).path, spaceships.get(environmentData.shipType).fileName);
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.models + spaceships.get(environmentData.shipType).path + spaceships.get(environmentData.shipType).textureName, this.world.getScene(), false, false);


    if(!Config.staticLayout.active) {
      meshComponent.position = new BABYLON.Vector3(environmentData.x, environmentData.y, environmentData.z);
    } else if(position){
      meshComponent.position = position.clone();
    }
    
    meshComponent.get().scaling = new BABYLON.Vector3(spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale, spaceships.get(environmentData.shipType).scale);

    const guiComponent: GUIComponent = await spaceShipObject.registerComponent(GUIComponent);

    const shipAnimator: ShipAnimator = await spaceShipObject.registerComponent(ShipAnimator);
    shipAnimator.floatingFrequency = environmentData.frequencyOfFluctuaction;
    shipAnimator.floatingRange = environmentData.radiusOfFluctuation * Config.rangeOfFluctuationMultipler;
    shipAnimator.animating = true;

    const engineComponent: EngineComponent = await spaceShipObject.registerComponent(EngineComponent);
    engineComponent.health = environmentData.initialHP;
    engineComponent.maxHealth = environmentData.initialHP;
    engineComponent.isMySide = environmentData.isMySide;
    engineComponent.missileName = spaceships.get(environmentData.shipType).missileName;
    engineComponent.shipId = environmentData.shipId;

    await spaceShipObject.registerComponent(RotationInterpolator);

    const weaponsComponent: ShipWeaponComponent = await spaceShipObject.registerComponent(ShipWeaponComponent);
    weaponsComponent.missileStartPosition = spaceships.get(environmentData.shipType).missilePosition;
    weaponsComponent.laserStartPosition = spaceships.get(environmentData.shipType).laserPosition;
    weaponsComponent.dronesStartPosition = spaceships.get(environmentData.shipType).dronesPosition;

    await spaceShipObject.registerComponent(ExplosionParticle);

    await this.addShipJetFire(spaceShipObject, spaceships.get(environmentData.shipType).jetFirePosition);

    if (spaceships.get(environmentData.shipType).jetFirePosition2) {
      await this.addShipJetFire(spaceShipObject, spaceships.get(environmentData.shipType).jetFirePosition2);
    }

    if (spaceships.get(environmentData.shipType).jetFirePosition3) {
      await this.addShipJetFire(spaceShipObject, spaceships.get(environmentData.shipType).jetFirePosition3);
    }

    if (!environmentData.isMySide) {
      guiComponent.get().background = "red";
      meshComponent.rotate(BABYLON.Axis.Y, 3.14, BABYLON.Space.LOCAL);
    }

  }

  public async addShipJetFire(spaceShipObject: GameObject, emitPosition: BABYLON.Vector3) {
    const particles: ParticlesComponent = await spaceShipObject.registerComponent(ParticlesComponent);

    particles.particlesCapacity = 50;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/blue_flame.jpg", this.getWorld().getScene());
    particles.minSize = 0.01;
    particles.maxSize = 3;
    particles.minEmitPower = 0.01;
    particles.maxEmitPower = 0.05;
    particles.direction1 = new BABYLON.Vector3(0, -0.2, -1.5);
    particles.direction2 = new BABYLON.Vector3(0, -0.2, -1.5);
    particles.minEmitBox = emitPosition;
    particles.maxEmitBox = emitPosition;
  }

  public setEnvironmentData = async (environmentDataList: Array<EnvironmentData>) => {

    if(Config.staticLayout.active) {
      await this.loadStaticLayout(environmentDataList);
    } else {
      for (let environmentData of environmentDataList) {
        await this.addSpaceship(environmentData);
        await this.addShipInfoGUI(environmentData);
      }
    }

    this.onReady();
  }

  private async addShipInfoGUI(environmentData: EnvironmentData) {

    let infoPath = "myShipInfo.xml";
    let container = "leftShipContainer";
    
    if(!environmentData.isMySide) {
      infoPath = "otherShipInfo.xml";
      container = "rightShipContainer";
    }

    let shipInfo: XmlGUIComponent = await this.world.registerComponent(XmlGUIComponent);
    shipInfo.attached="false";
    await shipInfo.loadAsync(Config.paths.guiLayouts, infoPath);
    shipInfo.name = "shipInfo" + environmentData.shipId;  
    shipInfo.get().getNodeById("shipName").text = environmentData.shipId;
    shipInfo.get().getNodeById("currentHealth").text = environmentData.initialHP;
    shipInfo.get().getNodeById("maxHealth").text = environmentData.initialHP;
    this.world.getComponentByName("worldLayout").get().getNodeById(container).addControl(shipInfo.get().getNodeById("shipInfo"));
  }

  private async loadStaticLayout(environmentDataList: Array<EnvironmentData>) {

    const mySideShips: Array<EnvironmentData> = [];
    const otherSideShips: Array<EnvironmentData> = [];

    for (let environmentData of environmentDataList) {
      if (!environmentData.isMySide) {
        mySideShips.push(environmentData);
      } else {
        otherSideShips.push(environmentData);
      }
      await this.addShipInfoGUI(environmentData);
    }

    let beginningX = 0;
    let beginningZ = Config.staticLayout.initialZ;

    beginningX = (mySideShips.length / 2) * -1 * Config.staticLayout.xSpacing;

    for (let index = 0; index < mySideShips.length; index++) {
      if (index <= mySideShips.length / 2) {
        beginningZ -= Config.staticLayout.zSpacing;
      } else {
        beginningZ += Config.staticLayout.zSpacing;
      }
      await this.addSpaceship(mySideShips[index], new BABYLON.Vector3(beginningX, 0, beginningZ));
      beginningX += Config.staticLayout.xSpacing;
    }

    beginningZ = -1 * Config.staticLayout.initialZ;
    beginningX = (otherSideShips.length / 2) * -1 * Config.staticLayout.xSpacing;

    for (let index = 0; index < otherSideShips.length; index++) {
      if (index <= otherSideShips.length / 2) {
        beginningZ += Config.staticLayout.zSpacing;
      } else {
        beginningZ -= Config.staticLayout.zSpacing;
      }
      await this.addSpaceship(otherSideShips[index], new BABYLON.Vector3(beginningX, 0, beginningZ));
      beginningX += Config.staticLayout.xSpacing;
    }
  }

  public setAttackTurn = async (attackTurnData: Array<WaitData | CameraData | AttackData>) => {
    (this.world.getComponentByType(TurnHandlingComponent) as TurnHandlingComponent).setTurnData(attackTurnData);
  }
}