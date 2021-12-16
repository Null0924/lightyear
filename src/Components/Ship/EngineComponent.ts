import { Component, GameObject, MeshComponent, MeshType, ParticlesComponent, SetShapesComponent, VolumeScatteringPostProcessComponent } from "brix";
import { ExplosionParticle } from "../Particles/ExplosionParticle";
import { GUIComponent } from "./GUIComponent";
import { RotationInterpolator } from "./RotationInterpolator";

export class EngineComponent extends Component {

  private animatingAttack: boolean;
  private animationWeight: number;
  private animationStep: number;
  public isMySide: boolean;
  public onAttackEndCallback: Function;
  // private rotation: number;


  public health: number;
  public maxHealth: number;
  public nextDamageHit: number;
  

  constructor(gameObject: GameObject, name: string) {
    super(gameObject, name);

    this.isMySide = false;
    this.animatingAttack = false;
  }

 
  public onAttackDone = async() => {

    if(!this.object.getComponentByType(RotationInterpolator)) {
      return;
    } 

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation(BABYLON.Quaternion.Zero());

    if(this.isMySide) {
      (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 3.14));
    }    

    if(this.onAttackEndCallback) {
      this.onAttackEndCallback();
    }
  }

  public async onHit() {

    let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
    explosionParticle.scale = 1;
    explosionParticle.explode(null);

    this.health -= this.nextDamageHit;
    let healthPercentage = this.health / this.maxHealth;
    (this.object.getComponentByType(GUIComponent) as GUIComponent).get().width = (healthPercentage * 100) + "px";

    if(this.health <= 0) {
      let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
      explosionParticle.scale = 5;
      explosionParticle.explode(null);
      this.object.dispose();
    }
  }


  updateBeforeRender = () => {
  }
  updateAfterRender = () => {
  }
}