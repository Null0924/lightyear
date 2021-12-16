import { SpaceShipName } from "../Configs/SpaceShipName";
import { EnvironmentData } from "../Types/EnvironmentData";

const environmentDataExample : Array<EnvironmentData> = [
  {
    shipId: "1",
    shipType: SpaceShipName.ASTEROID_MINER,
    x: 0,
    y: 0,
    z: -50,
    isMySide: true,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 2,
    radiusOfFluctuation: 0.5
  },
  {
    shipId: "2",
    shipType: SpaceShipName.BATTLESHIP,
    x: 30,
    y: 0,
    z: -50,
    isMySide: true,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.7
  },
  {
    shipId: "3",
    shipType: SpaceShipName.CRAWLER,
    x: -30,
    y: 0,
    z: -50,
    isMySide: true,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.2
  },
  {
    shipId: "4",
    shipType: SpaceShipName.HEAVY_FIGHTER,
    x: -60,
    y: 0,
    z: -50,
    isMySide: true,
    initialHP: 120,
    maxHP: 120,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.3
  },
  {
    shipId: "5",
    shipType: SpaceShipName.DEMOLISHER,
    x: 0,
    y: 0,
    z: 50,
    isMySide: false,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.2
  },
  {
    shipId: "6",
    shipType: SpaceShipName.DESTROYER,
    x: 30,
    y: 0,
    z: 50,
    isMySide: false,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.4
  },
  {
    shipId: "7",
    shipType: SpaceShipName.PLANET_BOMBER,
    x: -30,
    y: 0,
    z: 50,
    isMySide: false,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.5
  },
  {
    shipId: "8",
    shipType: SpaceShipName.REAPER,
    x: -60,
    y: 0,
    z: 50,
    isMySide: false,
    initialHP: 120,
    maxHP: 120,
    frequencyOfFluctuaction: 1,
    radiusOfFluctuation: 0.6
  },
]

export default environmentDataExample;