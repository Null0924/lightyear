import { SpaceShipName } from "../Configs/SpaceShipName";
import { PlanetName } from "../Configs/PlanetName";

export type EnvironmentData = {
  shipId: string,
  shipType: SpaceShipName,
  x: number,
  y: number,
  z: number,
  isMySide: boolean,
  radiusOfFluctuation: number,
  frequencyOfFluctuaction: number,
  initialHP
}