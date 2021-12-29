import { AttackType } from "./AttackType";
import { DataType } from "./DataType";

export type AttackData = {
  dataType: DataType, // Defines the data type
  fromShipId: string, // attacking ship
  toShipId: string, // attacked ship
  attackType: AttackType, // attack type ( drone, missile, laser )
  damageOnHP: number, // damange inflicted
  count: number // For drone
}