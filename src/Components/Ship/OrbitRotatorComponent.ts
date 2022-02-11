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
        this.rotateAroundTargetAngle = 0;
        this.centerAxis = new BABYLON.Vector3(Math.sin(Math.PI/180), Math.cos(Math.PI/180) , 0); 
        this.speed = 0.008;
        this.radius = (this.object.getComponentByType(MeshComponent) as MeshComponent).position.x;

    }

    updateBeforeRender = () => {
        if (this.rotateAroundTarget){
            const meshComponent = (this.object.getComponentByType(MeshComponent) as MeshComponent);
            meshComponent.position.x = this.radius * Math.sin(this.rotateAroundTargetAngle);
            meshComponent.position.z = this.radius * Math.cos(this.rotateAroundTargetAngle);
            
            let forward = new BABYLON.Vector3(0, 1, 0);
            let fin = new BABYLON.Vector3(0, 0, -1);
            
            let nextForward = new BABYLON.Vector3(meshComponent.position.x, 0, meshComponent.position.z).normalize();
            let orientation = forward;

            fin = BABYLON.Vector3.Cross(forward, nextForward);
            forward = nextForward;
            orientation = BABYLON.Vector3.RotationFromAxis(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), fin);
            meshComponent.get().rotation = orientation;

            this.rotateAroundTargetAngle += this.speed;
        }
        if (this.rotateAroundSelf) { 
            (this.object.getComponentByType(MeshComponent) as MeshComponent).get().rotate(this.centerAxis, this.rotateAroundSelfAngle, BABYLON.Space.WORLD);
        }
    }
    
    updateAfterRender(): void {
    }
}