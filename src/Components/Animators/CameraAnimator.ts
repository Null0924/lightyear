import { CameraController, Component, GameObject } from "brix";

export class CameraAnimator extends Component {

  private totalFrames: number;
  private animating: boolean;
  private currentAnimation;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.totalFrames = 30;
    this.animating = false;
  }

  public animate(speed: number = 10, newPosition: BABYLON.Vector3) {

    let camera = (this.object.getComponentByType(CameraController) as CameraController).getCamera();

    if(this.currentAnimation) {
      this.currentAnimation.stop();
    }

    this.currentAnimation = BABYLON.Animation.CreateAndStartAnimation(
      'anim', // anim name
      camera, // mesh
      'position', // animatable property
      speed, // yep, speed
      this.totalFrames, // arcoss how many frames
      camera.position, // starting at this position
      newPosition, // finish at this position
      0,
      null,
      () => {
        this.animating = false;
      }
    );
    this.animating = true;
  }

  public isAnimating(): boolean {
    return this.animating;
  }

  public setAnimating(animating: boolean): void {
    this.animating = animating;
  }

  updateBeforeRender = () => { }
  updateAfterRender = () => { }
}