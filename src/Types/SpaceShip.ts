import { SpaceShipName } from "../Data/SpaceShipName";

export type SpaceShip = {
  name: SpaceShipName,
  path: string,
  fileName: string,
  textureName: string,
  laserPosition: BABYLON.Vector3,
  missilePosition: BABYLON.Vector3,
  dronesPosition: BABYLON.Vector3,
  scale: number,
}