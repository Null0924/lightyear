import { SpaceShipName } from "../Configs/SpaceShipName";

export type StateEnvironmentData = {
  shipId: string,
  shipType: SpaceShipName,
  x: number,
  y: number,
  z: number
}