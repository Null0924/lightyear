import { SpaceShipName } from "../Data/SpaceShipName";
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
    frequencyOfFluctuaction: 10,
    radiusOfFluctuation: 5
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
    frequencyOfFluctuaction: 2,
    radiusOfFluctuation: 7
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
    frequencyOfFluctuaction: 4,
    radiusOfFluctuation: 2
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
    frequencyOfFluctuaction: 8,
    radiusOfFluctuation: 3
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
    frequencyOfFluctuaction: 12,
    radiusOfFluctuation: 2
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
    frequencyOfFluctuaction: 6,
    radiusOfFluctuation: 4
  },
  {
    shipId: "7",
    shipType: SpaceShipName.LIGHT_CRAFT,
    x: -30,
    y: 0,
    z: 50,
    isMySide: false,
    initialHP: 100,
    maxHP: 100,
    frequencyOfFluctuaction: 7,
    radiusOfFluctuation: 5
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
    frequencyOfFluctuaction: 20,
    radiusOfFluctuation: 6
  },
]

export default environmentDataExample;