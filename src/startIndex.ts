import { MainBattleState } from "./MainBattleState"
import attackDataExample from "./MockData/AttackDataExample";
import environmentDataExample from "./MockData/EnvironmentDataExample";
import { StateTypes } from "./Configs/StateTypes";
import { MainIdleState } from "./MainIdleState";
import { MainDefendState } from "./MainDefendState";
import { MainWarpState } from "./MainWarpState";
import { StateEnvironmentData } from "./Types/StateEnvironmentData";
import idleStateEnvironmentDataExample from "./MockData/idleStateEnvironmentDataExample";
import defendStateEnvironmentDataExample from "./MockData/defendStateEnvironmentDataExample";
import warpEnvironmentDataExample from "./MockData/WarpEnvironmentDataExample";

let main = null;

async function init(stateType: StateTypes) {

  showLoader();

  if (main){
    main.disposeEngine();
  }

  switch (stateType) {
    case StateTypes.IDLE:

      main = new MainIdleState(view);
      await main.setup(onReady);
      await main.setEnvironmentData(idleStateEnvironmentDataExample);
      break;
    case StateTypes.DEFEND:

      main = new MainDefendState(view);
      await main.setup(onReady);
      await main.setEnvironmentData(defendStateEnvironmentDataExample);
      break;
    case StateTypes.WARP:

      main = new MainWarpState(view);
      await main.setup(onReady);
      await main.setEnvironmentData(warpEnvironmentDataExample);
      break;
    case StateTypes.BATTLE:

      main = new MainBattleState(view);
      await main.setup(onReady);
      await main.setEnvironmentData(environmentDataExample);
      break;
    default:
      break;
  }
}

const view = document.getElementById("view") as HTMLCanvasElement;

function onReady() {
  console.log("is ready");
  hideLoader();
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("view").style.display = "block";
  main.getWorld().getEngine().resize();
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("view").style.display = "none";
}

window["onAttack"] = function (attackData) {
  main.setAttackTurn(attackData);
}

window.onmessage = function (event) {
  console.log(event);
};
window["refreshData"] = function (data: Array<StateEnvironmentData>) {
  main.refreshData(data);
};

(async function () {
  await init(StateTypes.WARP);

  setTimeout(async () => {
    await init(StateTypes.IDLE);

    setTimeout(async () => {
      await init(StateTypes.DEFEND);

      setTimeout(async () => {
        await init(StateTypes.BATTLE);
        main.setAttackTurn(attackDataExample);
      }, 10000);
    }, 10000);
  }, 10000);

})();