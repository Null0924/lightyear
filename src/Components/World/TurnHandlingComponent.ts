import { Component, GameObject, World, HighlightLayerComponent, MeshComponent } from "brix";
import { AttackData } from "../../Types/AttackData";
import { AttackType } from "../../Types/AttackType";
import { CameraData } from "../../Types/CameraData";
import { DataType } from "../../Types/DataType";
import { WaitData } from "../../Types/WaitData";
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

    ((this.object as unknown as World).getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).removeAll(null);
  }

  private applyAttackTurn = async () => {
    const attackingShip: GameObject = (this.object as unknown as World).getObjectByName((this.currentTurnMoves[this.currentMoveIndex] as AttackData).fromShipId);
    const attackedShip: GameObject = (this.object as unknown as World).getObjectByName((this.currentTurnMoves[this.currentMoveIndex] as AttackData).toShipId);

    if (!attackingShip || !attackedShip) {
      this.currentMoveIndex += 1;
      return;
    }

    ((this.object as unknown as World).getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).add(
      (attackingShip.getComponentByType(MeshComponent) as MeshComponent).get(), BABYLON.Color3.Green()
    );

    ((this.object as unknown as World).getComponentByType(HighlightLayerComponent) as HighlightLayerComponent).add(
      (attackedShip.getComponentByType(MeshComponent) as MeshComponent).get(), BABYLON.Color3.Red()
    );

    this.turnOnGoing = true;

    switch ((this.currentTurnMoves[this.currentMoveIndex] as AttackData).attackType) {
      case AttackType.DRONE:
        await (attackingShip.getComponentByType(ShipWeaponComponent) as ShipWeaponComponent).launchDrones(attackedShip);
        break;
      case AttackType.LASER:
        await (attackingShip.getComponentByType(ShipWeaponComponent) as ShipWeaponComponent).shootLaser(attackedShip);
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
            this.applyAttackTurn();
            this.maxWaitTimer = 50;
            break;
          case DataType.CAMERA:
            break;
          case DataType.WAIT:
            this.maxWaitTimer = (this.currentTurnMoves[this.currentMoveIndex] as WaitData).duration;
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