import { Component, GameObject, MeshComponent } from "@ludum_studios/brix-core";

export class OrbitRotatorComponent extends Component {

    public rotateAroundSelf: Boolean;
    public rotateAroundTarget: Boolean;
    public rotateAroundSelfAngle : number;
    public rotateAroundTargetAngle : number;
    private centerAxis: BABYLON.Vector3;
    public speed : number;
    public radius : number;
    

    constructor(object: GameObject, name: string,) {
        super(object, name,);
      
        this.manualDependencies.push(MeshComponent);

        this.rotateAroundSelf = true;
        this.rotateAroundTarget = false;
        this.rotateAroundSelfAngle = 0.010;
        this.rotateAroundTargetAngle = 0;
        this.centerAxis = new BABYLON.Vector3(Math.sin(Math.PI/180), Math.cos(Math.PI/180) , 0); 
        this.speed = 0.02;
        this.radius = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.x;

    }

    updateBeforeRender = () => {
        if (this.rotateAroundSelf) {
            (this.object.getComponentByType(MeshComponent) as MeshComponent).get().rotate(this.centerAxis, this.rotateAroundSelfAngle, BABYLON.Space.WORLD);
        }
        if (this.rotateAroundTarget){
            const meshComponent = (this.object.getComponentByType(MeshComponent) as MeshComponent);
            meshComponent.position.x = this.radius * Math.sin(this.rotateAroundTargetAngle);
            meshComponent.position.z = this.radius * Math.cos(this.rotateAroundTargetAngle);
            this.rotateAroundTargetAngle += this.speed;
        }
    }
    
    updateAfterRender(): void {
    }
}