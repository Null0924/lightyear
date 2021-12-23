import { Component, GameObject, MeshComponent, MeshType, ParticlesComponent, SetShapesComponent, SoundComponent, VolumeScatteringPostProcessComponent } from "brix";
import { Config } from "../../Config";
import { ProjectileComponent } from "../Attacks/ProjectileComponent";
import { DroneComponent } from "../Attacks/DroneComponent";
import { EngineComponent } from "./EngineComponent";
import { RotationInterpolator } from "./RotationInterpolator";
import { MissileName } from "../../Configs/MissileName";


export class DroneWeaponComponent extends Component {


  constructor(object: GameObject, name: string) {
    super(object, name);
  }


  private async createBullet(): Promise<GameObject> {
    const bulletObject = new GameObject("bullet", (this.object as GameObject).getWorld());

    const setShapes: SetShapesComponent = await bulletObject.registerComponent(SetShapesComponent);
    setShapes.meshType = MeshType.BOX;

    let meshComponent: MeshComponent = (bulletObject.getComponentByType(MeshComponent) as MeshComponent);
    meshComponent.get().visibility = 0;
    meshComponent.get().scaling = new BABYLON.Vector3(10, 10, 10);
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.clone();

    const particles: ParticlesComponent = await bulletObject.registerComponent(ParticlesComponent);
    particles.particlesCapacity = 200;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/flame.jpg", (this.object as GameObject).getWorld().getScene());

    await bulletObject.registerComponent(ProjectileComponent);

    return bulletObject;
  }

  

  public async shootBullet(target: GameObject) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position));

    const missileObject = await this.createBullet();

    const projectileComponent: ProjectileComponent = (missileObject.getComponentByType(ProjectileComponent) as ProjectileComponent);
    projectileComponent.animationSpeed = 0.04;
    
    if(this.object.getComponentByType(EngineComponent)) {
      projectileComponent.doneCallback = (this.object.getComponentByType(EngineComponent) as EngineComponent).onAttackDone;
    } else {
      projectileComponent.doneCallback = (this.object.getComponentByType(DroneComponent) as DroneComponent).onAttackDone;
    }
    
    projectileComponent.target = target;
    projectileComponent.initiator = (this.object as GameObject);
    projectileComponent.rotate = false;

    (((this.object as GameObject).getWorld()).getComponentByName("droneAudio") as SoundComponent).play();
  }

 
  updateBeforeRender = () => {
  }
  updateAfterRender = () => {
  }

}