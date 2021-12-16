import { MissileName } from "../Configs/MissileName";
import { SpaceShipName } from "../Configs/SpaceShipName";

export type SpaceShip = {
  name: SpaceShipName,
  path: string,
  fileName: string,
  textureName: string,
  laserPosition: BABYLON.Vector3,
  missilePosition: BABYLON.Vector3,
  dronesPosition: BABYLON.Vector3,
  jetFirePosition: BABYLON.Vector3,
  missileName: MissileName,
  scale: number,
}