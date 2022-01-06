import { Component, GameObject, MeshComponent } from "@ludum_studios/brix-core";
import { DroneWeaponComponent } from "../Ship/DroneWeaponComponent";
import { EngineComponent } from "../Ship/EngineComponent";

export class DroneComponent extends Component {

  public target: GameObject;
  public initiator: GameObject;
  private startingPosition;
  private lerpWeight;
  public animationSpeed;
  public rotate: boolean;
  public doneCallback: Function;
  public stopDistance: number;
  public stopPosition: BABYLON.Vector3;
  public step: number;

  constructor(gameObject: GameObject, name: string) {
    super(gameObject, name);

    if (gameObject.getComponentByType(MeshComponent)) {
      this.startingPosition = (gameObject.getComponentByType(MeshComponent) as MeshComponent).position.clone();
    }

    this.rotate = false;
    this.lerpWeight = 0;
    this.animationSpeed = 0.015;
    this.stopDistance = 40;
    this.step = 0;
  }

  private interpolate = () => {

    this.lerpWeight += this.animationSpeed;
    let targetPosition;
    let startPosition;
    if (this.step < 2) {
      targetPosition = (this.target.getComponentByType(MeshComponent) as MeshComponent).position.clone();
      targetPosition.y = this.startingPosition.y;
      startPosition = this.startingPosition;
    } else {
      targetPosition = (this.initiator.getComponentByType(MeshComponent) as MeshComponent).position.clone();
      targetPosition.y = this.startingPosition.y;
      startPosition = this.stopPosition;
    }

    let newPosition = BABYLON.Vector3.Lerp(startPosition, targetPosition, this.lerpWeight);

    if ((this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion && this.rotate) {
      (this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll((this.initiator.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion.toEulerAngles().y, 1.57, 0);
    }

    (this.object.getComponentByType(MeshComponent) as MeshComponent).get().position = newPosition;
  }

  public onAttackDone = () => {
    this.step = 2;
  }

  updateBeforeRender = async () => {

    if (this.target && this.initiator) {
      if (this.target.getComponentByType(MeshComponent) && BABYLON.Vector3.Distance((this.target.getComponentByType(MeshComponent) as MeshComponent).position, (this.object.getComponentByType(MeshComponent) as MeshComponent).position) < this.stopDistance && this.step < 2) {
        if (this.step === 0) {
          this.lerpWeight = 0;
          this.stopPosition = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.clone();
          (this.object.getComponentByType(DroneWeaponComponent) as DroneWeaponComponent).shootBullet(this.target);
          this.step = 1;
        }
      } else if (this.step === 2 && this.lerpWeight > 1) {
        (this.object as GameObject).dispose();
        if (this.doneCallback) {
          this.doneCallback();
        }
      } else if(this.step !== 1){
        this.interpolate();
      }
    }
  }
  updateAfterRender(): void {
  }
}