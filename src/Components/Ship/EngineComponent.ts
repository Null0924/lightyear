import { Component, GameObject, SoundComponent, XmlGUIComponent, SetShapesComponent, MeshType, MeshComponent } from "brix";
import { Config } from "../../Config";
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
  private healthBarObject : GameObject;

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

  public async createHealthBar() {
    this.healthBarObject = new GameObject(this.shipId + "_healthBar", (this.object as GameObject).getWorld());
    let meshBuilder : SetShapesComponent = await this.healthBarObject.registerComponent(SetShapesComponent);
    meshBuilder.meshType = MeshType.PLANE;

    let meshComponent : MeshComponent = (this.healthBarObject.getComponentByType(MeshComponent) as MeshComponent);
    meshComponent.get().billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    meshComponent.get().scaling = new BABYLON.Vector3(Config.healthBarScale, 0.6, 1);
    meshComponent.get().position = BABYLON.Vector3.Zero();

    meshComponent.get().material = new BABYLON.StandardMaterial("billboard", (this.object as GameObject).getWorld().getScene());
    meshComponent.get().material.diffuseColor = BABYLON.Color3.Red();
    meshComponent.get().material.backFaceCulling = false;
    meshComponent.get().material.emissiveColor = BABYLON.Color3.Red();
    meshComponent.get().material.disableLighting = true;

    this.healthBarObject.removeComponentByType(SetShapesComponent);
  }

  public async calculateHealth() {
    this.health -= this.nextDamageHit;

    if(this.health < 0) {
      this.health = 0;
    }

    let healthPercentage = (this.health / this.maxHealth) * 100;
    
    (this.healthBarObject.getComponentByType(MeshComponent) as MeshComponent).get().scaling.x = (Config.healthBarScale * healthPercentage) / 100;
    // (this.object.getComponentByType(GUIComponent) as GUIComponent).get().width = (healthPercentage * 100) + "px";
    ((this.object as GameObject).getWorld().getComponentByName("shipInfo" + this.shipId) as XmlGUIComponent).get().getNodeById("currentHealth").text = this.health.toString();
    (((this.object as GameObject).getWorld()).getComponentByName("missileAudio") as SoundComponent).isPlaying = false;

    let explosionSound: SoundComponent = (((this.object as GameObject).getWorld()).getComponentByName("explosionAudio") as SoundComponent);

    if (this.health <= 0) {
      explosionSound.volume = 4;
      explosionSound.play();
      let explosionParticle: ExplosionParticle = (this.object.getComponentByType(ExplosionParticle) as ExplosionParticle);
      explosionParticle.scale = 30;
      explosionParticle.explode(null);

      this.healthBarObject.dispose();
      this.healthBarObject = null;

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
    
    if(this.healthBarObject && this.healthBarObject.getComponentByType(MeshComponent)) {
      let meshComponent : MeshComponent = (this.healthBarObject.getComponentByType(MeshComponent) as MeshComponent);
      meshComponent.position = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.clone();
      meshComponent.position.y += 15;
    }
  }
  updateAfterRender = () => {
  }
}