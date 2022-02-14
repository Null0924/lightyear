import { Component, GameObject, MeshComponent } from "@ludum_studios/brix-core";

export class WarpComponentTest extends Component {

  private time: number;
  private shaderMaterial: BABYLON.ShaderMaterial;

  constructor(object: GameObject, name: string) {
    super(object, name);

    this.manualDependencies.push(MeshComponent);

    this.time = 0;
    this.setupShader();
  }

  private setupShader() {
    BABYLON.Effect.ShadersStore["customVertexShader"] = "precision highp float;\r\n" +

      "// Attributes\r\n" +
      "attribute vec3 position;\r\n" +
      "attribute vec3 normal;\r\n" +
      "attribute vec2 uv;\r\n" +

      "// Uniforms\r\n" +
      "uniform mat4 worldViewProjection;\r\n" +

      "// Varying\r\n" +
      "varying vec4 vPosition;\r\n" +
      "varying vec3 vNormal;\r\n" +

      "void main() {\r\n" +

      "    vec4 p =  vec4( position, 1. );\r\n" +

      "    vPosition = p;\r\n" +
      "    vNormal = normal;\r\n" +

      "    gl_Position = worldViewProjection * p;\r\n" +

      "}\r\n";

    BABYLON.Effect.ShadersStore["customFragmentShader"] = "precision highp float;\r\n" +

      "uniform mat4 worldView;\r\n" +

      "varying vec4 vPosition;\r\n" +
      "varying vec3 vNormal;\r\n" +

      "uniform sampler2D textureSampler;\r\n" +
      "uniform sampler2D refSampler;\r\n" +
      "uniform vec3 iResolution;\r\n" +

      "const float tau = 6.28318530717958647692;\r\n" +

      "// Gamma correction\r\n" +
      "#define GAMMA (2.2)\r\n" +

      "vec3 ToLinear( in vec3 col )\r\n" +
      "{\r\n" +
      "	// simulate a monitor, converting colour values into light values\r\n" +
      "	return pow( col, vec3(GAMMA) );\r\n" +
      "}\r\n" +

      "vec3 ToGamma( in vec3 col )\r\n" +
      "{\r\n" +
      "	// convert back into colour values, so the correct light will come out of the monitor\r\n" +
      "	return pow( col, vec3(1.0/GAMMA) );\r\n" +
      "}\r\n" +

      "vec4 Noise( in ivec2 x )\r\n" +
      "{\r\n" +
      "	return texture2D( refSampler, (vec2(x)+0.5)/256.0, -100.0 );\r\n" +
      "}\r\n" +

      "vec4 Rand( in int x )\r\n" +
      "{\r\n" +
      "	vec2 uv;\r\n" +
      "	uv.x = (float(x)+0.5)/256.0;\r\n" +
      "	uv.y = (floor(uv.x)+0.5)/256.0;\r\n" +
      "	return texture2D( refSampler, uv, -100.0 );\r\n" +
      "}\r\n" +

      "uniform float time;\r\n" +

      "void main(void) {\r\n" +

      "    vec3 ray;\r\n" +
      "	ray.xy = .2*(vPosition.xy-vec2(.5));\r\n" +
      "	ray.z = 1.;\r\n" +

      "	float offset = time*.5;	\r\n" +
      "	float speed2 = (cos(offset)+1.0)*2.0;\r\n" +
      "	float speed = speed2+.1;\r\n" +
      "	offset += sin(offset)*.96;\r\n" +
      "	offset *= 2.0;\r\n" +
      "	\r\n" +
      "	\r\n" +
      "	vec3 col = vec3(0.);\r\n" +
      "	\r\n" +
      "	vec3 stp = ray/max(abs(ray.x),abs(ray.y));\r\n" +
      "	\r\n" +
      "	vec3 pos = 2.0*stp+.5;\r\n" +
      "	for ( int i=0; i < 8; i++ )\r\n" +
      "	{\r\n" +
      "		float speed1  = speed+10.0;\r\n" +
      "		float z = Noise(ivec2(pos.xy)).x;\r\n" +
      "		z = fract(z-offset);\r\n" +
      "		float d = 50.0*z-pos.z;\r\n" +
      "		float w = pow(max(0.0,1.0-8.0*length(fract(pos.xy)-.5)),2.0);\r\n" +
      "		vec3 c = max(vec3(0),vec3(1.0-abs(d+speed2*.5)/speed1,1.0-abs(d)/speed1,1.0-abs(d-speed2*.5)/speed1));\r\n" +
      "		col += 1.5*(1.0-z)*c*w;\r\n" +
      "		pos += stp;\r\n" +
      "	}\r\n" +
      "	\r\n" +
      "	gl_FragColor = vec4(ToGamma(col),1.);\r\n" +

      "}\r\n";
  }

  setShader() {
    this.shaderMaterial = new BABYLON.ShaderMaterial("shader", (this.object as GameObject).getWorld().getScene(), {
      vertex: "custom",
      fragment: "custom",
    },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
      });

    const refTexture = new BABYLON.Texture("http://i.imgur.com/HP1V7TJ.png", (this.object as GameObject).getWorld().getScene());

    this.shaderMaterial.setTexture("refSampler", refTexture);
    this.shaderMaterial.setFloat("time", 2);
    this.shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
    this.shaderMaterial.backFaceCulling = false;
    
    const meshComponent = (this.object.getComponentByType(MeshComponent) as MeshComponent);
    meshComponent.get().material = this.shaderMaterial;

    this.time = 0;
  }


  updateBeforeRender = () => { 
    if(this.shaderMaterial){
      this.shaderMaterial.setFloat("time", this.time);
      this.time += 0.02;
      this.shaderMaterial.setVector3("cameraPosition", (this.object as GameObject).getWorld().getScene().activeCamera.position);
    }
  }
  updateAfterRender = () => { }
}