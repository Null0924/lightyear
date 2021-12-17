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
    attackType: AttackType.DRONE,
    fromShipId: "2",
    toShipId: "5",
    damageOnHP: 12
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "3",
    toShipId: "7",
    damageOnHP: 7
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "4",
    toShipId: "8",
    damageOnHP: 10
  },
  {
    attackType: AttackType.DRONE,
    fromShipId: "5",
    toShipId: "2",
    damageOnHP: 10
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "6",
    toShipId: "3",
    damageOnHP: 12
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "7",
    toShipId: "1",
    damageOnHP: 70
  },
  {
    attackType: AttackType.MISSILE,
    fromShipId: "8",
    toShipId: "4",
    damageOnHP: 18
  },
]

export default attackDataExample;