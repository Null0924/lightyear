import { Component, GameObject, GUIContainerComponent, MeshComponent } from "@ludum_studios/brix-core";


export class GUIComponent extends Component {

  protected gui: BABYLON.GUI.Rectangle ;
  public linkOffsetY: number;
  public linkOffsetX: number;

  constructor(object, name) {
    super(object, name);
    
    this.gui = new BABYLON.GUI.Rectangle("healthBar");
    this.gui.widthInPixels = 100;
    this.gui.heightInPixels = 5;
    this.gui.background = "green";
    this.gui.thickness = 0;
    this.gui.cornerRadius = 100;
    this.gui.alpha = 0.9;

    ((this.object as GameObject).getWorld().getComponentByType(GUIContainerComponent) as GUIContainerComponent).get().addControl(this.gui);

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