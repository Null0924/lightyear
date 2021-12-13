import { Main } from "./Main"
import attackDataExample from "./MockData/AttackDataExample";
import environmentDataExample from "./MockData/EnvironmentDataExample";

const view = document.getElementById("view") as HTMLCanvasElement
let main = new Main(view);

function onReady() {
  document.getElementById("loader").style.display = "none";
  main.setAttackTurn(attackDataExample);
}

(async function() {
  await main.setup(onReady);
  await main.setEnvironmentData(environmentDataExample);
})();