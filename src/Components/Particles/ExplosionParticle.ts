import { Component, GameObject, MeshComponent } from "brix";
import { Config } from "../../Config";

export class ExplosionParticle extends Component {

  private fireBlast;
  public scale: number;
  public onAnimationEndCallback: Function;
  

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.scale = 1;
    this.manualDependencies.push(MeshComponent);
  }

  
  public explode(onAnimationEnd: Function) {
    
    // if(!this.emitter) {
      // this.emitter = (this.object.getComponentByType(MeshComponent) as MeshComponent).position;
    // }
    
    // this.emitter.scaling = new BABYLON.Vector3(this.scale, this.scale, this.scale);
    this.fireBlast = BABYLON.ParticleHelper.CreateDefault((this.object.getComponentByType(MeshComponent) as MeshComponent).get().position, 100);
    
    // Emitter
    const fireBlastHemisphere = this.fireBlast.createHemisphericEmitter(.2 * this.scale, 0);

    // Set emission rate
    this.fireBlast.emitRate = 100;

    // Start size
    this.fireBlast.minSize = 6 ;
    this.fireBlast.maxSize = 12;

    this.fireBlast.minEmitBox.scaleInPlace(this.scale);
    this.fireBlast.maxEmitBox.scaleInPlace(this.scale);

  
    // Lifetime
    this.fireBlast.minLifeTime = 0.5;
    this.fireBlast.maxLifeTime = 1.5;

    // Emission power
    this.fireBlast.minEmitPower = 5;
    this.fireBlast.maxEmitPower = 10;

    // Limit velocity over time
    this.fireBlast.addLimitVelocityGradient(0, 40);
    this.fireBlast.addLimitVelocityGradient(0.120, 12.983);
    this.fireBlast.addLimitVelocityGradient(0.445, 1.780);
    this.fireBlast.addLimitVelocityGradient(0.691, 0.502);
    this.fireBlast.addLimitVelocityGradient(0.930, 0.05);
    this.fireBlast.addLimitVelocityGradient(1.0, 0);

    this.fireBlast.limitVelocityDamping = 0.9;

    console.log((this.object.getComponentByType(MeshComponent) as MeshComponent).get().getBoundingInfo().boundingBox);

    // this.fireBlast.minEmitBox = (this.object.getComponentByType(MeshComponent) as MeshComponent).get().getBoundingInfo().boundingBox.minimum.scale(0.00001);
    // this.fireBlast.maxEmitBox = (this.object.getComponentByType(MeshComponent) as MeshComponent).get().getBoundingInfo().boundingBox.maximum.scale(0.00001);
    
    // Start rotation
    this.fireBlast.minInitialRotation = -Math.PI / 2;
    this.fireBlast.maxInitialRotation = Math.PI / 2;

    // Texture
    this.fireBlast.particleTexture = new BABYLON.Texture(Config.paths.textures + "particles/explosion.png", (this.object as GameObject).getWorld().getScene());
    this.fireBlast.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD; 

    // Color over life
    this.fireBlast.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0));
    this.fireBlast.addColorGradient(0.1, new BABYLON.Color4(1, 1, 1, 1));
    this.fireBlast.addColorGradient(0.9, new BABYLON.Color4(1, 1, 1, 1));
    this.fireBlast.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));

    // // Defines the color ramp to apply
    this.fireBlast.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
    this.fireBlast.addRampGradient(0.09, new BABYLON.Color3(209/255, 204/255, 15/255));
    this.fireBlast.addRampGradient(0.18, new BABYLON.Color3(221/255, 120/255, 14/255));
    this.fireBlast.addRampGradient(0.28, new BABYLON.Color3(200/255, 43/255, 18/255));
    this.fireBlast.addRampGradient(0.47, new BABYLON.Color3(115/255, 22/255, 15/255));
    this.fireBlast.addRampGradient(0.88, new BABYLON.Color3(14/255, 14/255, 14/255));
    this.fireBlast.addRampGradient(1.0, new BABYLON.Color3(14/255, 14/255, 14/255));
    this.fireBlast.useRampGradients = true;

    // Defines the color remapper over time
    this.fireBlast.addColorRemapGradient(0, 0, 0.1);
    this.fireBlast.addColorRemapGradient(0.2, 0.1, 0.8);
    this.fireBlast.addColorRemapGradient(0.3, 0.2, 0.85);
    this.fireBlast.addColorRemapGradient(0.35, 0.4, 0.85);
    this.fireBlast.addColorRemapGradient(0.4, 0.5, 0.9);
    this.fireBlast.addColorRemapGradient(0.5, 0.95, 1.0);
    this.fireBlast.addColorRemapGradient(1.0, 0.95, 1.0);

    // Particle system start
    this.fireBlast.start(30);
    this.fireBlast.targetStopDuration = .4;

    this.fireBlast.onAnimationEnd = this.particleEnd;
    
  
    // Animation update speed
    this.fireBlast.updateSpeed = 1/30;   
  }

  particleEnd = () => {
    
    this.fireBlast.dispose(true);
    // this.emitter.dispose();
    
    if(this.onAnimationEndCallback) {
      this.onAnimationEndCallback();
    }
  }

  unregister() {
    super.unregister();
  }

  updateBeforeRender = () => { }
  updateAfterRender = () => { }
}