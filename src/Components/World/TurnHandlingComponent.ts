import { Component, GameObject, World, HighlightLayerComponent, MeshComponent, XmlGUIComponent } from "@ludum_studios/brix-core";
import { Config } from "../../Config";
import { AttackData } from "../../Types/AttackData";
import { AttackType } from "../../Types/AttackType";
import { CameraData } from "../../Types/CameraData";
import { DataType } from "../../Types/DataType";
import { WaitData } from "../../Types/WaitData";
import { CameraAnimator } from "../Animators/CameraAnimator";
import { EngineComponent } from "../Ship/EngineComponent";
import { ShipWeaponComponent } from "../Ship/ShipWeaponComponent";

export class TurnHandlingComponent extends Component {

  private allTurnMoves: Array<Array<CameraData | WaitData | AttackData>>;
  private currentTurnMoves: Array<CameraData | WaitData | AttackData>;
  private currentMoveIndex: number;
  private started: boolean;
  private turnOnGoing: boolean;
  private currentTimer: number;
  public maxWaitTimer: number;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.allTurnMoves = [];
    this.currentTurnMoves = [];
    this.currentMoveIndex = 0;
    this.started = false;
    this.turnOnGoing = false;
    this.currentTimer = 0;
    this.maxWaitTimer = 50;
  }

  public setTurnData(turnData: Array<CameraData | WaitData | AttackData>) {
    this.allTurnMoves.push(turnData);
    this.started = true;
  }

  public onShipAttackEnd = () => {
    this.turnOnGoing = false;

    (this.object.getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).removeAll();

    const attackingShip: GameObject = (this.object  as World).getObjectByName((this.currentTurnMoves[this.currentMoveIndex - 1] as AttackData).fromShipId);
    const attackedShip: GameObject = (this.object  as World).getObjectByName((this.currentTurnMoves[this.currentMoveIndex - 1] as AttackData).toShipId);

    let shipId = (attackingShip.getComponentByType(EngineComponent) as EngineComponent).shipId;
    (this.object.getComponentByName("shipInfo" + shipId) as XmlGUIComponent).get().getNodeById("shipInfo").thickness = 1;
    (this.object.getComponentByName("shipInfo" + shipId) as XmlGUIComponent).get().getNodeById("shipInfo").background = "#00111855";

    shipId = (attackedShip.getComponentByType(EngineComponent) as EngineComponent).shipId;
    (this.object.getComponentByName("shipInfo" + shipId) as XmlGUIComponent).get().getNodeById("shipInfo").thickness = 1;
    (this.object.getComponentByName("shipInfo" + shipId) as XmlGUIComponent).get().getNodeById("shipInfo").background = "#00111855";

  }

  private applyStaticAnimation(attackingShip: GameObject) {
    let position = (attackingShip.getComponentByType(MeshComponent) as MeshComponent).position.clone();

    position.y += Config.staticCameraAnimation.yDistance;

    if (!(attackingShip.getComponentByType(EngineComponent) as EngineComponent).isMySide) {
      position.z += Config.staticCameraAnimation.zDistance;
    } else {
      position.z -= Config.staticCameraAnimation.zDistance;
    }

    ((this.object as World).getComponentByType(CameraAnimator) as CameraAnimator).animate(Config.staticCameraAnimation.speed, position);
  }

  private applyAttackTurn = async () => {
    const attackingShip: GameObject = (this.object as World).getObjectByName((this.currentTurnMoves[this.currentMoveIndex] as AttackData).fromShipId);
    const attackedShip: GameObject = (this.object as World).getObjectByName((this.currentTurnMoves[this.currentMoveIndex] as AttackData).toShipId);

    if (!attackingShip || !attackedShip) {
      this.currentMoveIndex += 1;
      return;
    }

    ((this.object as World).getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).add(
      (attackingShip.getComponentByType(MeshComponent) as MeshComponent).get(), BABYLON.Color3.White()
    );

    ((this.object as World).getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).add(
      (attackedShip.getComponentByType(MeshComponent) as MeshComponent).get(), BABYLON.Color3.Red()
    );

    this.turnOnGoing = true;

    if (Config.staticCameraAnimation.active) {
      this.applyStaticAnimation(attackingShip);
    }

    let myShipId = (attackingShip.getComponentByType(EngineComponent) as EngineComponent).shipId;
    let otherShipId = (attackedShip.getComponentByType(EngineComponent) as EngineComponent).shipId;

    ((this.object as World).getComponentByName("shipInfo" + myShipId) as XmlGUIComponent).get().getNodeById("shipInfo").thickness = 2;
    ((this.object as World).getComponentByName("shipInfo" + myShipId) as XmlGUIComponent).get().getNodeById("shipInfo").background = "#77777755";

    ((this.object as World).getComponentByName("shipInfo" + otherShipId) as XmlGUIComponent).get().getNodeById("shipInfo").thickness = 2;
    ((this.object as World).getComponentByName("shipInfo" + otherShipId) as XmlGUIComponent).get().getNodeById("shipInfo").background = "#ff1c1c55";

    switch ((this.currentTurnMoves[this.currentMoveIndex] as AttackData).attackType) {
      case AttackType.DRONE:
        await (attackingShip.getComponentByType(ShipWeaponComponent) as ShipWeaponComponent).performDroneAttack(attackedShip, (this.currentTurnMoves[this.currentMoveIndex] as AttackData).count);
        break;
      case AttackType.LASER:
        await (attackingShip.getComponentByType(ShipWeaponComponent) as ShipWeaponComponent).performLaserAttack(attackedShip);
        break;
      case AttackType.MISSILE:
        await (attackingShip.getComponentByType(ShipWeaponComponent) as ShipWeaponComponent).launchMissile(attackedShip);
        break;
    }
    (attackedShip.getComponentByType(EngineComponent) as EngineComponent).nextDamageHit = (this.currentTurnMoves[this.currentMoveIndex] as AttackData).damageOnHP;
    (attackingShip.getComponentByType(EngineComponent) as EngineComponent).onAttackEndCallback = this.onShipAttackEnd;
  }

  updateBeforeRender = async () => {
    if (this.started) {
      if (!this.turnOnGoing) {

        if (this.currentTimer < this.maxWaitTimer) {
          this.currentTimer += 1;
          return;
        }

        if (this.allTurnMoves.length > 0 && this.currentMoveIndex === 0) {
          this.currentTurnMoves = this.allTurnMoves.shift();
        } else if (this.allTurnMoves.length === 0 && this.currentTurnMoves.length - 1 === this.currentMoveIndex) {
          this.started = false;
          this.turnOnGoing = false;
          return;
        }

        if (this.currentMoveIndex > this.currentTurnMoves.length - 1) {
          this.currentMoveIndex = 0;
          return;
        }

        switch (this.currentTurnMoves[this.currentMoveIndex].dataType) {

          case DataType.ATTACK:
            await this.applyAttackTurn();
            this.maxWaitTimer = 50;
            break;
          case DataType.CAMERA:
            ((this.object  as World).getComponentByType(CameraAnimator) as CameraAnimator).animate(Config.staticCameraAnimation.speed, new BABYLON.Vector3((this.currentTurnMoves[this.currentMoveIndex] as CameraData).x, (this.currentTurnMoves[this.currentMoveIndex] as CameraData).y, (this.currentTurnMoves[this.currentMoveIndex] as CameraData).z));
            break;
          case DataType.WAIT:
            this.maxWaitTimer = (this.currentTurnMoves[this.currentMoveIndex] as WaitData).duration * 60;
            break;
        }

        this.currentMoveIndex += 1;
        this.currentTimer = 0;
      }
    }
  }
  updateAfterRender(): void {
  }
}