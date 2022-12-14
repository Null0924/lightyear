import { MainBattleState } from "./MainBattleState"
import attackDataExample from "./MockData/AttackDataExample";
import environmentDataExample from "./MockData/EnvironmentDataExample";

const view = document.getElementById("view") as HTMLCanvasElement
let main = new MainBattleState(view);

function onReady() {
  console.log("is ready");
  document.getElementById("loader").style.display = "none";
  
  document.getElementById("view").style.display = "block";
  main.getWorld().getEngine().resize();
  main.setAttackTurn(attackDataExample);
}

window["onAttack"] = function(attackData) {
  main.setAttackTurn(attackData);
}

window.onmessage = function(event) {
  console.log(event);
};

(async function() {
  await main.setup(onReady);
  await main.setEnvironmentData(environmentDataExample);
})();