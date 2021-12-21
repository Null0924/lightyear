import { AttackType } from "./AttackType";
import { DataType } from "./DataType";

export type AttackData = {
  dataType: DataType,
  fromShipId: string,
  toShipId: string,
  attackType: AttackType,
  damageOnHP: number
}