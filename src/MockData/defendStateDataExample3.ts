import { SpaceShipName } from "../Configs/SpaceShipName";
import { IdleStateEnvironmentData } from "../Types/idleStateEnvironmentData";

const defendState3EnvironmentDataExample : Array<IdleStateEnvironmentData> = [
  {
    shipId: "1",
    shipType: SpaceShipName.ASTEROID_MINER,
    x: 160,
    y: 10,
    z: -15,
  },
  {
    shipId: "5",
    shipType: SpaceShipName.SPACE_STATION,
    x: 90,
    y: 0,
    z: -70,
  }
]

export default defendState3EnvironmentDataExample;