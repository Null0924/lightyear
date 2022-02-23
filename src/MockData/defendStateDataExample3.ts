import { SpaceShipName } from "../Configs/SpaceShipName";
import { StateEnvironmentData } from "../Types/StateEnvironmentData";

const defendState3EnvironmentDataExample : Array<StateEnvironmentData> = [
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