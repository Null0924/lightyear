import { Component, GameObject, World } from "brix";
import { AttackData } from "../../Types/AttackData";
import { AttackType } from "../../Types/AttackType";
import { EngineComponent } from "../Ship/EngineComponent";
import { WeaponComponent } from "../Ship/WeaponComponent";

export class TurnHandlingComponent extends Component {

  private currentTurnMoves: Array<AttackData>
  private currentMoveIndex: number;
  private started: boolean;
  private attackOnGoing: boolean;
  private currentTimer: number;
  public maxWaitTimer: number;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.currentTurnMoves = [];
    this.currentMoveIndex = 0;
    this.started = false;
    this.attackOnGoing = false;
    this.currentTimer = 0;
    this.maxWaitTimer = 50;
  }

  public setTurnData(attackTurnData: Array<AttackData>) {
    this.currentTurnMoves = attackTurnData;
    this.started = true;
  }

  public onShipAttackEnd = () => {
    this.attackOnGoing = false;
  }

  updateBeforeRender = async () => {
    if(this.started) {
      if(!this.attackOnGoing) {

        if(this.currentTimer < this.maxWaitTimer) {
          this.currentTimer += 1;
          return;
        }

        if(this.currentMoveIndex > this.currentTurnMoves.length - 1) {
          this.started = false;
          this.attackOnGoing = false;
          return;
        }

        const attackingShip: GameObject = (this.object as unknown as World).getObjectByName(this.currentTurnMoves[this.currentMoveIndex].fromShipId);
        const attackedShip: GameObject = (this.object as unknown as World).getObjectByName(this.currentTurnMoves[this.currentMoveIndex].toShipId);

        if(!attackingShip || !attackingShip) {
          this.currentMoveIndex += 1;
          return;
        }

        this.attackOnGoing = true;

        switch(this.currentTurnMoves[this.currentMoveIndex].attackType) {
          case AttackType.DRONE:
            await (attackingShip.getComponentByType(WeaponComponent) as WeaponComponent).launchDrones(attackedShip);
          break;
          case AttackType.LASER:
            await (attackingShip.getComponentByType(WeaponComponent) as WeaponComponent).shootLaser(attackedShip);
          break;
          case AttackType.MISSILE:
            await (attackingShip.getComponentByType(WeaponComponent) as WeaponComponent).launchMissile(attackedShip);
          break;
        }
        (attackedShip.getComponentByType(EngineComponent) as EngineComponent).nextDamageHit = this.currentTurnMoves[this.currentMoveIndex].damageOnHP;
        (attackingShip.getComponentByType(EngineComponent) as EngineComponent).onAttackEndCallback = this.onShipAttackEnd;
        this.currentMoveIndex += 1;
        this.currentTimer = 0;
      }
    }
  }
  updateAfterRender(): void {
  }
}