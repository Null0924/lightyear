import { AttackData } from "../Types/AttackData";
import { AttackType } from "../Types/AttackType";

const attackDataExample: Array<AttackData> = [
  {
    attackType: AttackType.LASER,
    fromShipId: "1",
    toShipId: "6",
    damageOnHP: 10
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "2",
    toShipId: "6",
    damageOnHP: 12
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "3",
    toShipId: "6",
    damageOnHP: 77
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "4",
    toShipId: "6",
    damageOnHP: 180
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "5",
    toShipId: "2",
    damageOnHP: 100
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "6",
    toShipId: "3",
    damageOnHP: 120
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "7",
    toShipId: "1",
    damageOnHP: 700
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "8",
    toShipId: "4",
    damageOnHP: 180
  },
]

export default attackDataExample;