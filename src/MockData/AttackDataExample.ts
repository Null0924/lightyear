import { AttackData } from "../Types/AttackData";
import { AttackType } from "../Types/AttackType";
import { CameraData } from "../Types/CameraData";
import { DataType } from "../Types/DataType";
import { WaitData } from "../Types/WaitData";

const attackDataExample: Array<CameraData | WaitData | AttackData> = [
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.LASER,
    fromShipId: "1",
    toShipId: "6",
    damageOnHP: 10
  },
  {
    dataType: DataType.WAIT,
    duration: 100
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.DRONE,
    fromShipId: "2",
    toShipId: "5",
    damageOnHP: 12
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.MISSILE,
    fromShipId: "3",
    toShipId: "7",
    damageOnHP: 7
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.MISSILE,
    fromShipId: "4",
    toShipId: "8",
    damageOnHP: 10
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.DRONE,
    fromShipId: "5",
    toShipId: "2",
    damageOnHP: 10
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.MISSILE,
    fromShipId: "6",
    toShipId: "3",
    damageOnHP: 12
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.MISSILE,
    fromShipId: "7",
    toShipId: "1",
    damageOnHP: 70
  },
  {
    dataType: DataType.ATTACK,
    attackType: AttackType.MISSILE,
    fromShipId: "8",
    toShipId: "4",
    damageOnHP: 18
  },
]

export default attackDataExample;