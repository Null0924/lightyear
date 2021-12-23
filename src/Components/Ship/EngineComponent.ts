import { Component, GameObject, SoundComponent, XmlGUIComponent } from "brix";
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

  public onAttackDone = async () => {

    if (!this.object.getComponentByType(RotationInterpolator)) {
      return;
    }

    (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 3.14));

    if (this.isMySide) {
      (this.object.getComponentByType(RotationInterpolator) as RotationInterpolator).startRotation(BABYLON.Quaternion.Zero());
    }

    if (this.onAttackEndCallback) {
      this.onAttackEndCallback();
    }
  }

  public async calculateHealth() {
    this.health -= this.nextDamageHit;
    let healthPercentage = this.health / this.maxHealth;
    (this.object.getComponentByType(GUIComponent) as GUIComponent).get().width = (healthPercentage * 100) + "px";
    ((this.object as GameObject).getWorld().getComponentByName("shipInfo" + this.shipId) as XmlGUIComponent).get().getNodeById("currentHealth").text = this.health.toString();
    (((this.object as GameObject).getWorld()).getComponentByName("missileAudio") as SoundComponent).isPlaying = false;

    let explosionSound: SoundComponent = (((this.object as GameObject).getWorld()).getComponentByName("explosionAudio") as SoundComponent);

    if (this.health <= 0) {
      explosionSound.volume = 4;
      explosionSound.play();
      let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
      explosionParticle.scale = 30;
      explosionParticle.explode(null);
      (this.object as GameObject).dispose();
    }
  }

  public async onHit() {

    let explosionSound: SoundComponent = (((this.object as GameObject).getWorld()).getComponentByName("explosionAudio") as SoundComponent);
    (((this.object as GameObject).getWorld()).getComponentByName("missileAudio") as SoundComponent).isPlaying = false;


    let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
    explosionSound.volume = 0.5;
    explosionSound.play();
    explosionParticle.scale = 15;
    explosionParticle.explode(null);
  }

  updateBeforeRender = () => {
  }
  updateAfterRender = () => {
  }
}