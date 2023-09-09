import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { Tween } from "tween.js";

class Model {
  constructor(ruta, scene, position, color, scale, lado, numeroPosicion) {
    this.ruta = ruta;
    this.scene = scene;
    this.position = position;
    this.color = color;
    this.scale = scale;
    this.lado = lado;
    this.numeroPosicion = numeroPosicion;
  }

  load(grados) {
    const loader = new STLLoader();
    loader.load(this.ruta, (geometry) => {
      const material = new THREE.MeshPhongMaterial({ color: this.color });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.rotateX(grados.x);
      mesh.rotateY(grados.y);
      mesh.rotateZ(grados.z);

      if (this.scale) {
        mesh.scale.set(this.scale, this.scale, this.scale);
      }
  
      mesh.position.set(this.position?.x, this.position?.y, this.position?.z);
      this.mesh = mesh;
      this.scene.add(mesh);
    });
  }

  move(position, animate) {
    new Tween(this.mesh.position)
      .to(position, 2000)
      .onUpdate(() => {
        this.mesh.position.x = this.mesh.position.x;
        this.mesh.position.y = this.mesh.position.y;
        this.mesh.position.z = this.mesh.position.z;
      })
      .start();
    animate();
  }
}

export default Model;