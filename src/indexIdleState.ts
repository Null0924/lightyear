import { MainIdleState } from "./MainIdleState"
import idleStateEnvironmentDataExample from "./MockData/idleStateEnvironmentDataExample";
const view = document.getElementById("view") as HTMLCanvasElement
let main = new MainIdleState(view); 

function onReady() {
  console.log("is ready Idle State Usecase");
  document.getElementById("loader").style.display = "none";
  
  document.getElementById("view").style.display = "block";
  main.getWorld().getEngine().resize();
  //main.setAttackTurn(attackDataExample);
}

window.onmessage = function(event) {
  console.log(event);
  // main.setAttackTurn(event.data);
};

(async function() {
  await main.setup(onReady);
  await main.setEnvironmentData(idleStateEnvironmentDataExample);
})();