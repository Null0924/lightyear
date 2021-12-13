import { Component, GameObject, MeshComponent } from "brix";

export class ShipAnimator extends Component {

  public floatingRange;
  public floatingFrequency;
  public animating: boolean;
  private startingPosition;
  private defaultPosition;
  private toAnimatePosition;
  private lerpWeight;
  public animationSpeed;

  constructor(gameObject: GameObject, name: string) {
    super(gameObject, name);

    if(gameObject.getComponentByType(MeshComponent)) {
      this.startingPosition = (gameObject.getComponentByType(MeshComponent) as MeshComponent).position.clone();
      this.defaultPosition = this.startingPosition.clone();
    }

    this.lerpWeight = 0;
    this.animationSpeed = 0.015;
    this.floatingRange = 0;
    this.floatingFrequency = 0;
    this.animating = false;
    this.toAnimatePosition = this.generateRandomPosition();
  }

  private getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private generateRandomPosition(): BABYLON.Vector3 {
    let x = this.getRandomArbitrary(this.defaultPosition.x, this.defaultPosition.x + this.floatingRange);
    let y = this.getRandomArbitrary(this.defaultPosition.y, this.defaultPosition.y + this.floatingRange);
    let z = this.getRandomArbitrary(this.defaultPosition.z, this.defaultPosition.z + this.floatingRange);

    return new BABYLON.Vector3(x, y, z);
  }

  private interpolate() {

    this.lerpWeight += this.animationSpeed;
    let newPosition = BABYLON.Vector3.Lerp(this.startingPosition, this.toAnimatePosition, this.lerpWeight);
    (this.object.getComponentByType(MeshComponent) as MeshComponent).get().position = newPosition;
  } 


  updateBeforeRender = () => {

    if(this.animating && this.floatingRange > 0) {
      if(this.lerpWeight >= 1) {
        this.startingPosition = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.clone();
        this.toAnimatePosition = this.generateRandomPosition();
        this.lerpWeight = 0;
      }
      this.interpolate();
    }
  }
  updateAfterRender(): void {
  }
}