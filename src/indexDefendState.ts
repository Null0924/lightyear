import { MainDefendState } from "./MainDefendState"
import idleStateEnvironmentDataExample from "./MockData/idleStateEnvironmentDataExample";
const view = document.getElementById("view") as HTMLCanvasElement
let main = new MainDefendState(view); 

function onReady() {
  document.getElementById("loader").style.display = "none";
  
  document.getElementById("view").style.display = "block";
  main.getWorld().getEngine().resize();
}

window.onmessage = function(event) {
  console.log(event);
};

(async function() {
  await main.setup(onReady);
  await main.setEnvironmentData(idleStateEnvironmentDataExample);
})();