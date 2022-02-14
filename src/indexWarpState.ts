import { MainWarpState } from "./MainWarpState";
import environmentDataExample from "./MockData/WarpEnvironmentDataExample";

const view = document.getElementById("view") as HTMLCanvasElement
let main = new MainWarpState(view);

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
  await main.setEnvironmentData(environmentDataExample);
})();