import { Component, GameObject, MeshComponent } from "brix";

export class RotationInterpolator extends Component {

  private oldRotationY: any;
  private newRotationY: number;
  private rotationWeight: number;
  private rotationLerpStep: number;
  private rotating: boolean;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.rotating = false;
    this.manualDependencies.push(MeshComponent);
  }

  public getLookAtRotation(target: BABYLON.Vector3, rotateY: boolean = false) {

    let yValue = (rotateY) ? 3.14 : 0;

    target = target.subtract((this.object.getComponentByType(MeshComponent) as MeshComponent).position);
    const newQuart = BABYLON.Quaternion.RotationYawPitchRoll(-Math.atan2(target.z, target.x) - Math.PI / 2, yValue, 0);
    return newQuart;
  }

  public startRotation(newRotation: BABYLON.Quaternion) {
    
    this.rotationWeight = 0;
    if ((this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion) {
      this.oldRotationY = (this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion.toEulerAngles().y;
    } else {
      this.oldRotationY = (this.object.getComponentByType(MeshComponent) as MeshComponent).rotation.y;
    }

    this.newRotationY = newRotation.toEulerAngles().y;

    this.rotationLerpStep = 0.075;
    this.rotating = true;
  }

  private rotate() {
    if (this.rotationWeight < 1) {

      this.rotationWeight += Math.abs(this.rotationLerpStep);

      if (this.rotationWeight > 1) {
        this.rotationWeight = 1;
        this.rotating = false;
      }

      const oldQuart = BABYLON.Quaternion.RotationYawPitchRoll(this.oldRotationY, 0, 0);
      const newQuart = BABYLON.Quaternion.RotationYawPitchRoll(this.newRotationY, 0, 0);

      const rotationOutput = BABYLON.Quaternion.Slerp(oldQuart, newQuart, this.rotationWeight);
      (this.object.getComponentByType(MeshComponent) as MeshComponent).rotationQuaternion = rotationOutput;
    }
  }

  updateBeforeRender = () => {

    if(this.rotating) {
      this.rotate();
    }
  }

  updateAfterRender(): void {
  }
}