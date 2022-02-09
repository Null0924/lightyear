import { Component, GameObject, MeshComponent } from "@ludum_studios/brix-core";

export class OrbitMovementComponent extends Component {

    public rotateAroundSelf: Boolean;
    public rotateAroundTarget: Boolean;
    public angle : number;
    private centerAxis: BABYLON.Vector3;

    constructor(object: GameObject, name: string,) {
        super(object, name,);
      
        this.rotateAroundSelf = true;
        this.rotateAroundTarget = false;
        this.angle = 0.005;
        this.centerAxis = new BABYLON.Vector3(Math.sin(Math.PI/180), Math.cos(Math.PI/180) , 0); 
    }

    updateBeforeRender = () => {
        (this.object.getComponentByType(MeshComponent) as MeshComponent).get().rotate(this.centerAxis, this.angle, BABYLON.Space.WORLD);
    }
    
    updateAfterRender(): void {
    }
}