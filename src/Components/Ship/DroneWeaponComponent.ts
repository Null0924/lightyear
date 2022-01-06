import { Component, GameObject, MeshComponent, MeshType, ParticlesComponent, SetShapesComponent, SoundComponent } from "@ludum_studios/brix-core";
import { Config } from "../../Config";
import { ProjectileComponent } from "../Attacks/ProjectileComponent";
import { DroneComponent } from "../Attacks/DroneComponent";
import { EngineComponent } from "./EngineComponent";
import { RotationInterpolator } from "./RotationInterpolator";


export class DroneWeaponComponent extends Component {


  constructor(object: GameObject, name: string) {
    super(object, name);
  }


  private async createBullet(): Promise<GameObject> {
    const bulletObject = new GameObject("bullet", (this.object as GameObject).getWorld());

    const setShapes: SetShapesComponent = await bulletObject.registerComponent(SetShapesComponent);
    setShapes.meshType = MeshType.SPHERE;

    let meshComponent: MeshComponent = (bulletObject.getComponentByType(MeshComponent) as MeshComponent);
    // meshComponent.get().visibility = 0;
    meshComponent.get().scaling = new BABYLON.Vector3(0.002, 0.002, 0.002);
    meshComponent.get().position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.clone();

    const particles: ParticlesComponent = await bulletObject.registerComponent(ParticlesComponent);
    particles.particlesCapacity = 200;
    particles.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/smoke.jpg", (this.object as GameObject).getWorld().getScene());

    await bulletObject.registerComponent(ProjectileComponent);

    return bulletObject;
  }

  

  public async shootBullet(target: GameObject) {

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation((this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).getLookAtRotation((target.getComponentByType(MeshComponent) as MeshComponent).position));

    const missileObject = await this.createBullet();

    const projectileComponent: ProjectileComponent = (missileObject.getComponentByType(ProjectileComponent) as ProjectileComponent);
    projectileComponent.animationSpeed = Config.droneInfo.shootingAnimationSpeed;
    
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