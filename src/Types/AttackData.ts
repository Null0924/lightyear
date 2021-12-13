import { AttackType } from "./AttackType";

export type AttackData = {
  fromShipId: string,
  toShipId: string,
  attackType: AttackType,
  damageOnHP: number
}