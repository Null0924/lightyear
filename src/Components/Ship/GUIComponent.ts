import { Control } from "babylonjs-gui/2D/controls/control";
import { Component, GUIContainerComponent, MeshComponent } from "brix";


export class GUIComponent extends Component {

  protected gui: BABYLON.GUI.Rectangle ;
  public linkOffsetY: number;
  public linkOffsetX: number;

  constructor(object, name) {
    super(object, name);
    
    this.gui = new BABYLON.GUI.Rectangle("healthBar");
    this.gui.widthInPixels = 100;
    this.gui.heightInPixels = 5;
    this.gui.background = "red";
    this.gui.thickness = 0;
    this.gui.cornerRadius = 100;
    this.gui.alpha = 0.9;

    (this.object.getWorld().getComponentByType(GUIContainerComponent) as GUIContainerComponent).getAdvanceTexture().addControl(this.gui as unknown as Control);

    this.gui.linkWithMesh((this.object.getComponentByType(MeshComponent) as MeshComponent).get());
    this.linkOffsetX = 0;
    this.gui.linkOffsetYInPixels = -60;
  }

  public unregister() {
    super.unregister();
    this.gui.dispose();
    delete this.gui;
    this.gui = null;
  }

  public get() {
    return this.gui;
  }


  updateBeforeRender: () => void;
  updateAfterRender: () => void;
}