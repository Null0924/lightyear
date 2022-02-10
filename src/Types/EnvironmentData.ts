import { SpaceShipName } from "../Configs/SpaceShipName";

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



