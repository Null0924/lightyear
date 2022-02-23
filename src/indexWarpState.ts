import { MainWarpState } from "./MainWarpState";
import environmentDataExample from "./MockData/WarpEnvironmentDataExample";
import { StateEnvironmentData } from "./Types/StateEnvironmentData";

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

window["refreshData"] = function(data: Array<StateEnvironmentData>) {
  main.refreshData(data);
};

(async function() {
  await main.setup(onReady);
  await main.setEnvironmentData(environmentDataExample);
})();