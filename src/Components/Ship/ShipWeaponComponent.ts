import { Component, GameObject, HighlightLayerComponent, MeshComponent, MeshType, ParticlesComponent, SetShapesComponent, SoundComponent } from "@ludum_studios/brix-core";
import { Config } from "../../Config";
import { ProjectileComponent } from "../Attacks/ProjectileComponent";
import { DroneComponent } from "../Attacks/DroneComponent";
import { EngineComponent } from "./EngineComponent";
import { RotationInterpolator } from "./RotationInterpolator";
import { MissileName } from "../../Configs/MissileName";
import { DroneWeaponComponent } from "./DroneWeaponComponent";


export class ShipWeaponComponent extends Component {

  public missileStartPosition: BABYLON.Vector3;
  public laserStartPosition: BABYLON.Vector3;
  public dronesStartPosition: BABYLON.Vector3;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.missileStartPosition = BABYLON.Vector3.Zero();
    this.laserStartPosition = BABYLON.Vector3.Zero();
    this.dronesStartPosition = BABYLON.Vector3.Zero();

    this.manualDependencies.push(MeshComponent);
    this.manualDependencies.push(EngineComponent);
    this.manualDependencies.push(RotationInterpolator);
  }

  private async createMissile(): Promise<GameObject> {
    const missileObject = new GameObject("missile", (this.object as GameObject).getWorld());

    const meshComponent: MeshComponent = await missileObject.registerComponent(MeshComponent);

    await meshComponent.loadAsync(Config.paths.missiles, (this.object.getComponentByType(EngineComponent) as EngineComponent).missileName);
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.missiles + MissileName.MISSILE_TEXTURE, (this.object as GameObject).getWorld().getScene(), false, false);

    meshComponent.get().scaling = new BABYLON.Vector3(10, 10, 10);
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.add(this.missileStartPosition.clone());
    meshComponent.get().rotate(BABYLON.Axis.X, 1.57, BABYLON.Space.LOCAL);

    if ((this.object.getComponentByType(EngineComponent) as EngineComponent).isMySide) {
      meshComponent.get().rotate(BABYLON.Axis.Z, 3.14, BABYLON.Space.LOCAL);
    }

    const particles: ParticlesComponent = await missileObject.registerComponent(ParticlesComponent);
    particles.particlesCapacity = 200;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/flame.jpg", (this.object as GameObject).getWorld().getScene());
    particles.minSize = 3;
    particles.maxSize = 3;

    await missileObject.registerComponent(ProjectileComponent);

    return missileObject;
  }

  private async createDrone(xPosition: number): Promise<GameObject> {

    const droneObject = new GameObject("drone", (this.object as GameObject).getWorld());

    const meshComponent: MeshComponent = await droneObject.registerComponent(MeshComponent);
    meshComponent.loadMeshAsHidden = true;

    await meshComponent.loadAsync(Config.paths.missiles, MissileName.DRONE);
    meshComponent.get().isVisible = 1;
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.missiles + MissileName.MISSILE_TEXTURE, (this.object as GameObject).getWorld().getScene(), false, false);
    meshComponent.get().scaling = new BABYLON.Vector3(Config.droneInfo.scaling, Config.droneInfo.scaling, Config.droneInfo.scaling);

    let positionToAdd = this.dronesStartPosition.clone();
    positionToAdd.x = xPosition;

    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.add(positionToAdd);

    await droneObject.registerComponent(DroneComponent);
    await droneObject.registerComponent(RotationInterpolator);
    await droneObject.registerComponent(DroneWeaponComponent);

    return droneObject;
  }

  private async createLaser(): Promise<GameObject> {
    const laserObject = new GameObject("laser", (this.object as GameObject).getWorld());

    const setShapes: SetShapesComponent = await laserObject.registerComponent(SetShapesComponent);
    setShapes.meshType = MeshType.CYLINDER;

    let meshComponent: MeshComponent = (laserObject.getComponentByType(MeshComponent) as MeshComponent);
    meshComponent.get().scaling = new BABYLON.Vector3(0.25, Config.laserInfo.scaling, 0.25);
    meshComponent.get().position = this.laserStartPosition.clone();
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.add(this.laserStartPosition.clone());
    meshComponent.get().material = new BABYLON.StandardMaterial('glow', (this.object as GameObject).getWorld().getScene());
    meshComponent.get().material.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
    meshComponent.get().material.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
    meshComponent.get().rotate(BABYLON.Axis.X, 1.57, BABYLON.Space.LOCAL);

    ((this.object as GameObject).getWorld().getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).add(
      meshComponent.get(), new BABYLON.Color3(0, 0.5, 1)
    );

    await laserObject.registerComponent(ProjectileComponent);

    return laserObject;
  }

  public async launchMissile(target: GameObject) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position, true));

    const missileObject = await this.createMissile();

    const projectileComponent: ProjectileComponent = (missileObject.getComponentByType(ProjectileComponent) as ProjectileComponent);
    projectileComponent.animationSpeed = 0.02;

    projectileComponent.doneCallback = () => {
      (this.object.getComponentByType(EngineComponent) as EngineComponent).onAttackDone();
      (target.getComponentByType(EngineComponent) as EngineComponent).calculateHealth();
    }

    projectileComponent.target = target;
    projectileComponent.initiator = (this.object as GameObject);
    projectileComponent.rotate = true;

    (((this.object as GameObject).getWorld()).getComponentByName("missileAudio") as SoundComponent).play();
  }


  public async performDroneAttack(target: GameObject, count: number) {
    let beginningX = 0;

    beginningX = count / 2 * -1 * Config.droneInfo.xSpacing;

    for (let index = 0; index < count; index++) {  

      if(index === count - 1) {
        await this.launchDrone(target, beginningX,   () => {
          (this.object.getComponentByType(EngineComponent) as EngineComponent).onAttackDone();
          (target.getComponentByType(EngineComponent) as EngineComponent).calculateHealth();
        });
      } else {
        await this.launchDrone(target, beginningX);
      }
      beginningX += Config.droneInfo.xSpacing;
    }
  }

  public async launchDrone(target: GameObject, xPosition: number, onDone: Function = null) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position, true));

    const droneObject = await this.createDrone(xPosition);

    const droneComponent: DroneComponent = (droneObject.getComponentByType(DroneComponent) as DroneComponent);
    droneComponent.animationSpeed = 0.01;
    droneComponent.target = target;
    droneComponent.initiator = (this.object as GameObject);

    if(onDone) {

    }
    droneComponent.doneCallback = onDone;
  }


  public async performLaserAttack(target: GameObject) {

    this.shootLaser(target);
    setTimeout(() => {
      this.shootLaser(target);
    }, 200);
    setTimeout(() => {
      this.shootLaser(target, () => {
        (this.object.getComponentByType(EngineComponent) as EngineComponent).onAttackDone();
        (target.getComponentByType(EngineComponent) as EngineComponent).calculateHealth();
      });
    }, 400);
  }

  public async shootLaser(target: GameObject, finishCallback: Function = null) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position, true));


    const laserObject = await this.createLaser();

    const projectileComponent: ProjectileComponent = (laserObject.getComponentByType(ProjectileComponent) as ProjectileComponent);
    projectileComponent.animationSpeed = Config.laserInfo.animationSpeed;

    if (finishCallback) {
      projectileComponent.doneCallback = finishCallback;
    }

    projectileComponent.target = target;
    projectileComponent.initiator = (this.object as GameObject);
    projectileComponent.rotate = true;

    (((this.object as GameObject).getWorld()).getComponentByName("laserAudio") as SoundComponent).play();
  }

  updateBeforeRender = () => {
  }
  updateAfterRender = () => {
  }
}