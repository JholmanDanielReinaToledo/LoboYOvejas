import { get } from "lodash";
import Model from "./Oveja";
import { Tween } from "tween.js";

const positionBoat = {
  der: { x: 0, y: 20, z: 0 },
  izq: { x: -550, y: 20, z: 0 },
};

class Boat extends Model {
  setLado(lado) {
    this.lado = lado;
  }

  cargar1(elemento1, animate, esOveja) {
    this.elemento1 = elemento1;
    let positionFinal = this.mesh.position;
    if (esOveja) {
      positionFinal = {
        x: this.mesh.position.x - 50,
        y: this.mesh.position.y,
        z: this.mesh.position.z + 60,
      };
    } else {
      positionFinal = {
        x: this.mesh.position.x - 140,
        y: this.mesh.position.y,
        z: this.mesh.position.z + 140,
      };
    }
    new Tween(elemento1.mesh.position)
      .to(positionFinal, 2000)
      .onUpdate(() => {
        elemento1.mesh.position.x = elemento1.mesh.position.x;
        elemento1.mesh.position.y = elemento1.mesh.position.y;
        elemento1.mesh.position.z = elemento1.mesh.position.z;
      })
      .start();
    animate();
  }

  cargar2(elemento2, animate, esOveja) {
    this.elemento2 = elemento2;
    let positionFinal = this.mesh.position;
    if (esOveja) {
      positionFinal = {
        x: this.mesh.position.x - 170,
        y: this.mesh.position.y,
        z: this.mesh.position.z + 60,
      };
    } else {
      positionFinal = {
        x: this.mesh.position.x - 300,
        y: this.mesh.position.y,
        z: this.mesh.position.z + 140,
      };
    }
    new Tween(elemento2.mesh.position)
      .to(positionFinal, 2000)
      .onUpdate(() => {
        elemento2.mesh.position.x = elemento2.mesh.position.x;
        elemento2.mesh.position.y = elemento2.mesh.position.y;
        elemento2.mesh.position.z = elemento2.mesh.position.z;
      })
      .start();
    animate();
  }

  moverElemento(elemento, posicionFinal) {
    new Tween(elemento.mesh.position)
      .to(posicionFinal, 2000)
      .onUpdate(() => {
        elemento.mesh.position.x = elemento.mesh.position.x;
        elemento.mesh.position.y = elemento.mesh.position.y;
        elemento.mesh.position.z = elemento.mesh.position.z;
      })
      .start();
  }

  mover(animate) {
    if (this.lado === "izq") {
      new Tween(this.mesh.position)
        .to(positionBoat.der, 2000)
        .onUpdate(() => {
          this.mesh.position.x = this.mesh.position.x;
          this.mesh.position.y = this.mesh.position.y;
          this.mesh.position.z = this.mesh.position.z;
        })
        .start();

      if (this.elemento1) {
        let final = {};
        const esOveja = this.elemento1.ruta.includes("sheep");
        if (esOveja) {
          final = {
            x: positionBoat.der.x - 170,
            y: positionBoat.der.y,
            z: positionBoat.der.z + 60,
          };
        } else {
          final = {
            x: positionBoat.der.x - 300,
            y: positionBoat.der.y,
            z: positionBoat.der.z + 140,
          };
        }
        this.moverElemento(this.elemento1, final);
        this.elemento1.lado = "der";
      }
      if (this.elemento2) {
        let final = {};
        const esOveja = this.elemento2.ruta.includes("sheep");
        if (esOveja) {
          final = {
            x: positionBoat.der.x - 170,
            y: positionBoat.der.y,
            z: positionBoat.der.z + 60,
          };
        } else {
          final = {
            x: positionBoat.der.x - 300,
            y: positionBoat.der.y,
            z: positionBoat.der.z + 140,
          };
        }
        this.moverElemento(this.elemento2, final);
        this.elemento2.lado = "der";
      }

      this.lado = "der";
    } else {
      new Tween(this.mesh.position)
        .to(positionBoat.izq, 2000)
        .onUpdate(() => {
          this.mesh.position.x = this.mesh.position.x;
          this.mesh.position.y = this.mesh.position.y;
          this.mesh.position.z = this.mesh.position.z;
        })
        .start();

      if (this.elemento1) {
        let final = {};
        const esOveja = this.elemento1.ruta.includes("sheep");
        if (esOveja) {
          final = {
            x: positionBoat.izq.x - 170,
            y: positionBoat.izq.y,
            z: positionBoat.izq.z + 60,
          };
        } else {
          final = {
            x: positionBoat.izq.x - 300,
            y: positionBoat.izq.y,
            z: positionBoat.izq.z + 140,
          };
        }
        this.moverElemento(this.elemento1, final);
        this.elemento1.lado = "izq";
      }
      if (this.elemento2) {
        let final = {};
        const esOveja = this.elemento2.ruta.includes("sheep");
        if (esOveja) {
          final = {
            x: positionBoat.izq.x - 170,
            y: positionBoat.izq.y,
            z: positionBoat.izq.z + 60,
          };
        } else {
          final = {
            x: positionBoat.izq.x - 300,
            y: positionBoat.izq.y,
            z: positionBoat.izq.z + 140,
          };
        }
        this.moverElemento(this.elemento2, final);
        this.elemento2.lado = "izq";
      }

      this.lado = "izq";
    }
    animate(); // Llamas a la función animate aquí
  }
}

export default Boat;
