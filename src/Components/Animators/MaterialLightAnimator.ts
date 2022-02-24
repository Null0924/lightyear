import { MeshComponent,Component,GameObject } from "@ludum_studios/brix-core";

export class MaterialLightAnimator extends Component {

  private threshhold: number;
  private timeIndex: number;
  private color1: BABYLON.Color3;
  private color2: BABYLON.Color3;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.threshhold = 60 * 0.5;
    this.timeIndex = 0;
    this.color1 = new BABYLON.Color3(0,0,0);
    this.color2 = new BABYLON.Color3(1,1,1);
  }

  set flickerRate(newFlickerRate: number) {
    if (newFlickerRate < 0 || newFlickerRate > 1) {
      newFlickerRate = 0.5;
    }
    this.threshhold = 60 * newFlickerRate;
  }

  private changeColor(color: BABYLON.Color3){
    (this.object.getComponentByType(MeshComponent) as MeshComponent).get().material.subMaterials[0].emissiveColor = color;
  }

  updateBeforeRender = () => { 

    this.timeIndex++; 

    if(this.timeIndex === this.threshhold) {

      this.changeColor(this.color1);
    }else if (this.timeIndex === 60){

      this.timeIndex = 0;
      this.changeColor(this.color2);
    }
  }

  updateAfterRender = () => {
 }
 
}