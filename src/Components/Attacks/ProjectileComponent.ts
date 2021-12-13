import { Component, GameObject, MeshComponent } from "brix";
import { EngineComponent } from "../Ship/EngineComponent";

export class ProjectileComponent extends Component {

  public target: GameObject;
  public initiator: GameObject;
  private startingPosition;
  private lerpWeight;
  public animationSpeed;
  public rotate: boolean;
  public doneCallback: Function;

  constructor(gameObject: GameObject, name: string) {
    super(gameObject, name);

    if(gameObject.getComponentByType(MeshComponent)) {
      this.startingPosition = (gameObject.getComponentByType(MeshComponent) as MeshComponent).position.clone();
    }

    this.rotate = false;
    this.lerpWeight = 0;
    this.animationSpeed = 0.015;
  }

  private interpolate = () => {

    this.lerpWeight += this.animationSpeed;
    let newPosition = BABYLON.Vector3.Lerp(this.startingPosition, (this.target.getComponentByType(MeshComponent) as MeshComponent).position, this.lerpWeight);
    
    if((this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion && this.rotate) {
      (this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll((this.initiator.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion.toEulerAngles().y, 1.57, 0);

    }

    (this.object.getComponentByType(MeshComponent) as MeshComponent).get().position = newPosition;
  } 


  updateBeforeRender = async () => {

    if(this.target && this.initiator ) {
      if(this.lerpWeight >= 1) {
        this.object.dispose();
        if(this.doneCallback) {
          this.doneCallback();
        }

        await (this.initiator.getComponentByType(EngineComponent) as EngineComponent).onAttackDone();
        await (this.target.getComponentByType(EngineComponent) as EngineComponent).onHit();
        
        return;
      } else {
        this.interpolate();
      }
    }
  }
  updateAfterRender(): void {
  }
}