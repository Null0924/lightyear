import { SpaceShipName } from "../Configs/SpaceShipName";
import { EnvironmentData } from "../Types/EnvironmentData";

const warpEnvironmentDataExample : Array<EnvironmentData> = [
  {
    shipId: "1",
    shipType: SpaceShipName.ASTEROID_MINER,
    x: 50,
    y: 15,
    z: 30,
    isMySide: true,
    initialHP: 100,
    frequencyOfFluctuaction: 2,
    radiusOfFluctuation: 0.5
  },
  {
    shipId: "2",
    shipType: SpaceShipName.BATTLESHIP,
    x: 20,
    y: 10,
    z: 10,
    isMySide: true,
    initialHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.7
  },
  {
    shipId: "3",
    shipType: SpaceShipName.CRAWLER,
    x: -35,
    y: 15,
    z: 20,
    isMySide: true,
    initialHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.2
  },
  {
    shipId: "4",
    shipType: SpaceShipName.HEAVY_CARGO,
    x: -10,
    y: 20,
    z: 20,
    isMySide: true,
    initialHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.2
  },
]

export default warpEnvironmentDataExample;