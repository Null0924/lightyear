import { ArcRotateCameraController, Component, GameObject, MeshComponent } from "@ludum_studios/brix-core";
export class FollowOrbitCameraComponent extends Component {
    
  private speed: number;
  private cameraComponent: ArcRotateCameraController;

  constructor(object: GameObject, name: String) {
    super(object, name);

    this.automaticDependencies.push(ArcRotateCameraController);
    this.speed = 0.009;
  }

  public setCameraSpeed(customSpeed){
    this.speed = customSpeed;
  }

  private setupCamera() {
    this.cameraComponent = (this.object.getComponentByType(ArcRotateCameraController) as ArcRotateCameraController);
    this.cameraComponent.getCamera().radius = 120;
    this.cameraComponent.getCamera().lowerRadiusLimit = 120;
    this.cameraComponent.getCamera().upperRadiusLimit = 120;

    this.cameraComponent.getCamera().alpha = 3/4 * Math.PI;
    this.cameraComponent.getCamera().lowerAlphaLimit =  this.cameraComponent.getCamera().alpha - (1/4 * Math.PI);
    this.cameraComponent.getCamera().upperAlphaLimit =  this.cameraComponent.getCamera().alpha + (1/2 * Math.PI);

    this.cameraComponent.getCamera().lockedTarget = (this.object.getComponentByType(MeshComponent) as MeshComponent).get();
  }

  updateBeforeRender = () => {
    if(this.object.getComponentByType(ArcRotateCameraController)) {
      if(!this.cameraComponent) {
        this.setupCamera();
      }
      
      this.cameraComponent.getCamera().alpha -= this.speed;
      this.cameraComponent.getCamera().lowerAlphaLimit -= this.speed;
      this.cameraComponent.getCamera().upperAlphaLimit -= this.speed;
    }
  }
  updateAfterRender(): void {
  }
}