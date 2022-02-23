import { SpaceShipName } from "../Configs/SpaceShipName";
import { StateEnvironmentData } from "../Types/StateEnvironmentData";

const defendState1EnvironmentDataExample : Array<StateEnvironmentData> = [
  {
    shipId: "2",
    shipType: SpaceShipName.BATTLESHIP,
    x: 150,
    y: 0,
    z: -10,
  },
  {
    shipId: "5",
    shipType: SpaceShipName.SPACE_STATION,
    x: 90,
    y: 0,
    z: -70,
  }
]

export default defendState1EnvironmentDataExample;