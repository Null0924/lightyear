import { Component, GameObject, MeshComponent, MeshType, ParticlesComponent, SetShapesComponent, VolumeScatteringPostProcessComponent } from "brix";
import { Config } from "../../Config";
import { ProjectileComponent } from "../Attacks/ProjectileComponent";
import { DroneComponent } from "../Attacks/DroneComponent";
import { EngineComponent } from "./EngineComponent";
import { RotationInterpolator } from "./RotationInterpolator";
import { MissileName } from "../../Data/MissileName";
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
  }

  private async createMissile(): Promise<GameObject> {
    const missileObject = new GameObject("missile", this.object.getWorld());

    const meshComponent: MeshComponent = await missileObject.registerComponent(MeshComponent);
    
    await meshComponent.loadAsync(Config.paths.missiles, (this.object.getComponentByType(EngineComponent) as EngineComponent).missileName);
    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.missiles + MissileName.MISSILE_TEXTURE, this.object.getWorld().getScene(), false, false);

    meshComponent.get().scaling = new BABYLON.Vector3(10, 10, 10);
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.add(this.missileStartPosition.clone());
    meshComponent.get().rotate(BABYLON.Axis.X, 1.57, BABYLON.Space.LOCAL);

    if((this.object.getComponentByType(EngineComponent) as EngineComponent).isMySide) {
      meshComponent.get().rotate(BABYLON.Axis.Z, 3.14, BABYLON.Space.LOCAL);
    }

    const particles: ParticlesComponent = await missileObject.registerComponent(ParticlesComponent);
    particles.particlesCapacity = 200;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/flame.jpg", this.object.getWorld().getScene());
    particles.minSize = 3;
    particles.maxSize = 3;

    await missileObject.registerComponent(ProjectileComponent);

    return missileObject;
  }

  private async createDrone(): Promise<GameObject> {
    const droneObject = new GameObject("drone", this.object.getWorld());

    const meshComponent: MeshComponent = await droneObject.registerComponent(MeshComponent);

    this.object.getWorld().stop();
    await meshComponent.loadAsync(Config.paths.missiles, MissileName.DRONE);
    meshComponent.get().isVisible = 0;
    this.object.getWorld().start();

    meshComponent.get().material.subMaterials[0].albedoTexture = new BABYLON.Texture(Config.paths.missiles + MissileName.MISSILE_TEXTURE, this.object.getWorld().getScene(), false, false);
    meshComponent.get().scaling = new BABYLON.Vector3(2, 2, 2);
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.add(this.dronesStartPosition.clone());

    meshComponent.get().isVisible = 1;

    await droneObject.registerComponent(DroneComponent);
    await droneObject.registerComponent(RotationInterpolator);
    await droneObject.registerComponent(DroneWeaponComponent);

    return droneObject;
  }

  private async createLaser(): Promise<GameObject> {
    const laserObject = new GameObject("laser", this.object.getWorld());

    const setShapes: SetShapesComponent = await laserObject.registerComponent(SetShapesComponent);
    setShapes.meshType = MeshType.CYLINDER;

    let meshComponent: MeshComponent = (laserObject.getComponentByType(MeshComponent) as MeshComponent);
    meshComponent.get().scaling = new BABYLON.Vector3(0.25, 5, 0.25);
    meshComponent.get().position = this.laserStartPosition.clone();
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.add(this.laserStartPosition.clone());
    meshComponent.get().material = new BABYLON.StandardMaterial('glow', this.object.getWorld().getScene());
    meshComponent.get().material.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
    meshComponent.get().rotate(BABYLON.Axis.X, 1.57, BABYLON.Space.LOCAL);

    await laserObject.registerComponent(ProjectileComponent);

    return laserObject;
  }

  public async launchMissile(target: GameObject) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position));

    const missileObject = await this.createMissile();

    const projectileComponent: ProjectileComponent = (missileObject.getComponentByType(ProjectileComponent) as ProjectileComponent);
    projectileComponent.animationSpeed = 0.02;
    
    projectileComponent.doneCallback = (this.object.getComponentByType(EngineComponent) as EngineComponent).onAttackDone;
    
    projectileComponent.target = target;
    projectileComponent.initiator = this.object;
    projectileComponent.rotate = true;
  }


  public async launchDrones(target: GameObject) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position));

    const droneObject = await this.createDrone();

    const droneComponent: DroneComponent = (droneObject.getComponentByType(DroneComponent) as DroneComponent);
    droneComponent.animationSpeed = 0.01;
    droneComponent.target = target;
    droneComponent.initiator = this.object;
  }

  public async shootLaser(target: GameObject) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position));


    const laserObject = await this.createLaser();

    const projectileComponent: ProjectileComponent = (laserObject.getComponentByType(ProjectileComponent) as ProjectileComponent);
    projectileComponent.animationSpeed = 0.05;
    
    projectileComponent.doneCallback = (this.object.getComponentByType(EngineComponent) as EngineComponent).onAttackDone;
    
    projectileComponent.target = target;
    projectileComponent.initiator = this.object;
    projectileComponent.rotate = true;
  }
  updateBeforeRender = () => {
  }
  updateAfterRender = () => {
  }

}