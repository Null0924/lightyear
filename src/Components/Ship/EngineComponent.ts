import { Component, GameObject, XmlGUIComponent } from "brix";
import { MissileName } from "../../Configs/MissileName";
import { ExplosionParticle } from "../Particles/ExplosionParticle";
import { GUIComponent } from "./GUIComponent";
import { RotationInterpolator } from "./RotationInterpolator";

export class EngineComponent extends Component {

  public isMySide: boolean;
  public missileName: MissileName;
  public onAttackEndCallback: Function;


  public health: number;
  public maxHealth: number;
  public nextDamageHit: number;
  public shipId: string;

  constructor(gameObject: GameObject, name: string) {
    super(gameObject, name);

    this.isMySide = false;
  }
 
  public onAttackDone = async() => {

    if(!this.object.getComponentByType(RotationInterpolator)) {
      return;
    } 

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 3.14));

    if(this.isMySide) {
      (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation(BABYLON.Quaternion.Zero());
    }    

    if(this.onAttackEndCallback) {
      this.onAttackEndCallback();
    }
  }

  public async onHit() {

    this.health -= this.nextDamageHit;
    let healthPercentage = this.health / this.maxHealth;
    (this.object.getComponentByType(GUIComponent) as GUIComponent).get().width = (healthPercentage * 100) + "px";
    (this.object.getWorld().getComponentByName("shipInfo" + this.shipId) as XmlGUIComponent).get().getNodeById("currentHealth").text = this.health.toString();


    if(this.health <= 0) {
      let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
      explosionParticle.scale = 30;
      explosionParticle.explode(null);
      this.object.dispose();
    } else {
      let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
      explosionParticle.scale = 15;
      explosionParticle.explode(null);
    }
  }

  updateBeforeRender = () => {
  }
  updateAfterRender = () => {
  }
}