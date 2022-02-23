import { SpaceShipName } from "../Configs/SpaceShipName";
import { StateEnvironmentData } from "../Types/StateEnvironmentData";

const defendStateEnvironmentDataExample : Array<StateEnvironmentData> = [
  {
    shipId: "1",
    shipType: SpaceShipName.ASTEROID_MINER,
    x: 160,
    y: 10,
    z: -15,
  },
  {
    shipId: "2",
    shipType: SpaceShipName.BATTLESHIP,
    x: 150,
    y: 0,
    z: -10,
  },
  {
    shipId: "3",
    shipType: SpaceShipName.CRAWLER,
    x: 170,
    y: 0,
    z: -25,
  },
  {
    shipId: "5",
    shipType: SpaceShipName.SPACE_STATION,
    x: 90,
    y: 0,
    z: -70,
  }
]

export default defendStateEnvironmentDataExample;