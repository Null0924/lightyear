import { Component, World } from "@ludum_studios/brix-core";

export class LightSpeedComponent extends Component{
    
    public dropCount : number;
    public maxDropSize : number
    public area : number
    public altitude : number;
    public minSpeed: number;
    public maxSpeed: number;

    private drops: Array<Array<BABYLON.Vector3>>;
    private speeds: Array<number>;
    private colors: Array<Array<BABYLON.Color4>>;
    private max: number;
    
    private rain: BABYLON.LinesMesh;

    constructor(object: World, name: string){
        super(object, name);

        this.dropCount = 1000;
        this.maxDropSize = 48.0;
        this.area = 150.0;
        this.altitude = 1000.0;
        this.minSpeed = 6.0;
        this.maxSpeed = 15.0;
        
        this.drops = [];
        this.speeds = [];
        this.colors = [];
        this.max = this.area * 0.5;
        
        this.setup();
    }
    
    private setup(){
        
        const color1 = new BABYLON.Color4(0.99, 0.99, 0.99);
        const color2 = new BABYLON.Color4(0.03, 0.18, 0.85, 0.7);

        for (let index = 0; index < this.dropCount; index++) {
            const x = Math.random() * this.area - this.max;
            const alt = this.max - (this.max - this.altitude) * Math.random();
            const y = alt - this.maxDropSize * Math.random();
            const z = Math.random() * this.area - this.max;
            
            const point1 = new BABYLON.Vector3(x, alt, z);
            const point2 = new BABYLON.Vector3(x, y, z);
            
            this.drops.push([point1, point2]);
            this.colors.push([color1, color2]);
            this.speeds.push(this.minSpeed + (this.maxSpeed - this.minSpeed) * Math.random());
        }
        this.rain = BABYLON.MeshBuilder.CreateLineSystem("rain", {lines: this.drops, updatable: true, useVertexAlpha: true, colors: this.colors}, (this.object as World).getScene());
        this.rain.alwaysSelectAsActiveMesh = true;
    }
    
    private crateRainDrops(){

        let drop: Array<BABYLON.Vector3>;

        for (var index = 0; index < this.dropCount; index++) {

            drop = this.drops[index];
            drop[0].y -= this.speeds[index];
            drop[1].y -= this.speeds[index];
            
            if (drop[1].y < - this.max) {

                const alt = this.max - (this.max - this.altitude) * Math.random();
                const y = alt - this.maxDropSize * Math.random();
                drop[1].y = y;
                drop[0].y = alt;
            }  
        }
    }

    updateBeforeRender = () => {
      this.crateRainDrops();
      let linesMesh = BABYLON.MeshBuilder.CreateLineSystem(null, {lines: this.drops, instance: this.rain}, (this.object as World).getScene());
      linesMesh.rotation.z = Math.PI;
    }
    updateAfterRender(): void {
        
    }
    
}