import { CameraController, Component, GameObject } from "brix";

export class CameraAnimator extends Component {

  private totalFrames: number;
  private animating: boolean;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.totalFrames = 30;
    this.animating = false;
  }

  public animate(speed: number = 10, offset: number) {

    let camera = (this.object.getComponentByType(CameraController) as CameraController).getCamera();

    BABYLON.Animation.CreateAndStartAnimation(
      'anim', // anim name
      camera, // mesh
      'heightOffset', // animatable property
      speed, // yep, speed
      this.totalFrames, // arcoss how many frames
      camera.heightOffset, // starting at this color
      offset, // finish at this color
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