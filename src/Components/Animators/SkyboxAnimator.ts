import { Component, GameObject, CubeSkyBoxComponent } from "brix";

export class SkyboxAnimator extends Component {

  private rotationAxis: BABYLON.Axis;
  private rotationSpeed: number;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.rotationAxis = BABYLON.Axis.Y;
    this.rotationSpeed = 0.001;

  }

  updateBeforeRender = () => {
    if(this.object.getComponentByType(CubeSkyBoxComponent)) {
      (this.object.getComponentByType(CubeSkyBoxComponent) as CubeSkyBoxComponent).get().rotate(this.rotationAxis, this.rotationSpeed, BABYLON.Space.LOCAL);
    }
  }
  updateAfterRender = () => { }
}