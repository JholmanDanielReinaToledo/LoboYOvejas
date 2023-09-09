import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Model from "../clases/Oveja";
import {
  first,
  get,
  groupBy,
  isEmpty,
  map,
  reduce,
  set,
  truncate,
} from "lodash";
import Boat from "../clases/Boat";
import TWEEN from "tween.js";

const styloso = {
  backgroundColor: "#4caf50",
  border: "none",
  color: "white",
  padding: "10px 20px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  margin: "5px",
  cursor: "pointer",
  borderRadius: "4px",
};

export const positions = {
  der: {
    0: {
      x: 0,
      y: 0,
      z: 0,
      busyOveja: false,
      busyLobo: false,
    },
    1: {
      x: 0,
      y: 0,
      z: 100,
      busyOveja: false,
      busyLobo: false,
    },
    2: {
      x: 0,
      y: 0,
      z: 200,
      busyOveja: false,
      busyLobo: false,
    },
  },
  izq: {
    0: {
      x: -1000,
      y: 0,
      z: 0,
      busyOveja: true,
      busyLobo: true,
    },
    1: {
      x: -1000,
      y: 0,
      z: 100,
      busyOveja: true,
      busyLobo: true,
    },
    2: {
      x: -1000,
      y: 0,
      z: 200,
      busyOveja: true,
      busyLobo: true,
    },
  },
};

const coloresModelos = {
  water: {
    dia: 0x0077be,
    noche: 0x000033,
  },
  oveja: {
    dia: 0xc9fffd,
    noche: 0x888888,
  },
  lobo: {
    dia: 0xb06c22,
    noche: 0x333333,
  },
  palmeras: {
    dia: 0x006400,
    noche: 0x334433,
  },
  rocas: {
    dia: 0x999999,
    noche: 0x444444,
  },
  bote: {
    dia: 0xb06c22,
    noche: 0x222222,
  },
  cielo: {
    dia: 0x87ceeb,
    noche: 0x000022,
  },
  arena: {
    dia: 0xeac086,
    noche: 0x654321,
  },
  luz: {
    dia: 0xa4a4a4, // Color de la luz para representar la iluminación diurna
    noche: 0x9c9c9c, // Color oscuro para representar la iluminación nocturna
  },
};

const targetPositions = [
  new THREE.Vector3(1677.410485388354, 1089.349994000424,1490.169577623751),
  new THREE.Vector3( -2662.5294967210593, 666.2069004627567,  1716.9655475727875),
  new THREE.Vector3(  468.8576523154917,  1534.624540226689,  3062.4354627420407),
];

export const positionBoat = {
  der: { x: 0, y: 20, z: 0 },
  izq: { x: -550, y: 20, z: 0 },
};

const initiPositionCamera = {
  x: 600,
  y: 2000,
  z: 1500,
};

const Model3D = () => {
  const mountRef = useRef(null);

  const [ovejas, setOvejas] = useState([]);
  const [lobos, setLobos] = useState([]);
  const [cameraObj, setCamera] = useState();
  const [bote, setBote] = useState();
  const [positionsState, setPositionsState] = useState(positions);
  const [dia, setDia] = useState(true);
  const [agua, setAgua] = useState();
  const [rocas, setRocas] = useState([]);
  const [palmeras, setPalmeras] = useState([]);
  const [orillas, setOrillas] = useState([]);
  const [luzL, setLuz] = useState();
  const [sceneState, setSceneState] = useState();
  const [controlState, setControls] = useState();

  const imprimir = () => {
    console.log('Posición actual de la cámara:', cameraObj.position);
console.log('Target actual de la cámara:', cameraObj.target);
  }

  const cargarOvejas = (scene) => {
    let ovejasTemp = [];
    for (var i = 0; i < 3; i++) {
      let newPosition = get(positionsState, ["izq", i]);
      const oveja = new Model(
        "/sheep.stl",
        scene,
        newPosition,
        coloresModelos.oveja.dia,
        null,
        "izq",
        i
      );

      oveja.load({
        x: 29.9,
        y: 0,
        z: 0,
      });

      ovejasTemp.push(oveja);
    }
    setOvejas(ovejasTemp);
  };

  const cargarLobos = (scene) => {
    let lobosTemp = [];
    for (var i = 0; i < 3; i++) {
      let newPosition = get(positionsState, ["izq", i]);
      const lobo = new Model(
        "/fox.stl",
        scene,
        newPosition,
        coloresModelos.lobo.dia,
        null,
        "izq",
        i
      );
      lobo.load({
        x: 29.9,
        y: 0,
        z: 0,
      });

      lobosTemp.push(lobo);
    }
    setLobos(lobosTemp);
  };

  const cargarBote = (scene) => {
    const bote = new Boat(
      "/boat.stl",
      scene,
      get(positionBoat, ["izq"]),
      coloresModelos.bote.dia,
      2
    );
    bote.setLado("izq");
    bote.load({
      x: 0,
      y: 29.85,
      z: 29.85,
    });
    setBote(bote);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update();
  };

  const cargarWater = (scene) => {
    const aguaa = new Model(
      "/water.stl",
      scene,
      { x: -480, y: -180, z: 0 },
      coloresModelos.water.dia,
      55
    );
    aguaa.load({
      x: -1.5708,
      y: 0,
      z: 0,
    });

    setAgua(aguaa);
  };

  const descargarBote = () => {
    if (bote.elemento1) {
      des(bote.elemento1);

      const esOveja = bote.elemento1.ruta.includes("sheep");

      newPosition(
        bote.elemento1.lado,
        bote.elemento1.numeroPosicion,
        true,
        esOveja
      );
      bote.elemento1 = undefined;
    }
    if (bote.elemento2) {
      des(bote.elemento2);

      const esOveja = bote.elemento2.ruta.includes("sheep");
      const elemento2 = bote.elemento2;

      setTimeout(() => {
        newPosition(elemento2.lado, elemento2.numeroPosicion, true, esOveja);
      }, 1000);

      bote.elemento2 = undefined;
    }
  };

  const validarLados = () => {
    const valores = reduce(
      { ovejas, lobos },
      (acum, items, animal) => {
        map(groupBy(items, "lado"), (cantidad, lado) =>
          set(acum, [lado, animal], cantidad.length)
        );
        return acum;
      },
      {
        der: {
          ovejas: 0,
          lobos: 0,
        },
        izq: {
          ovejas: 0,
          lobos: 0,
        },
      }
    );

    if (valores.izq.ovejas < valores.izq.lobos && valores.izq.ovejas !== 0) {
      alert("Ups! ;(, perdiste");
      window.location.reload(false);
    }
    if (valores.der.ovejas < valores.der.lobos && valores.der.ovejas !== 0) {
      alert("Ups! ;(, perdiste");
      window.location.reload(false);
    }
    console.log(valores);
    if (valores.der.ovejas === 3 && valores.der.lobos === 3) {
      alert("Felicitaciones, Has ganado");
    }
  };

  const mover = () => {
    if (bote.elemento1 || bote.elemento2) {
      bote.mover(animate);
      setTimeout(descargarBote, 2000);
      setTimeout(validarLados, 6000);
    } else {
      alert("El bote está vacío");
    }
  };

  const cargarOrillas = (scene) => {
    const orillasTemp = [];

    const material = new THREE.MeshBasicMaterial({
      color: coloresModelos.arena.dia,
    });

    // Crea la geometría de los rectángulos
    const geometry = new THREE.BoxGeometry(500, 100, 1000);

    const rectangulo1 = new THREE.Mesh(geometry, material);
    rectangulo1.position.set(250, -45, 0);
    scene.add(rectangulo1);
    orillasTemp.push(rectangulo1);

    const rectangulo2 = new THREE.Mesh(geometry, material);
    rectangulo2.position.set(-1150, -45, 0);
    scene.add(rectangulo2);
    orillasTemp.push(rectangulo2);

    // Retorna el arreglo de objetos de las orillas
    setOrillas(orillasTemp);
  };

  const newPosition = (lado, posicion, status, esOveja) => {
    const tipo = esOveja ? "busyOveja" : "busyLobo";
    const nuevoState = {
      ...positionsState,
      [lado]: {
        ...positionsState[lado],
        [posicion]: {
          ...positionsState[lado][posicion],
          [tipo]: status,
        },
      },
    };
    setPositionsState(nuevoState);
  };

  const cargar = (tipo) => {
    if (isEmpty(bote.elemento1)) {
      if (tipo === "oveja") {
        for (let oveja of ovejas) {
          if (oveja.lado === bote.lado && bote.elemento2 != oveja) {
            newPosition(oveja.lado, oveja.numeroPosicion, false, true);

            bote.cargar1(oveja, animate, true);
            break;
          }
        }
      } else if (tipo === "lobo") {
        for (let lobo of lobos) {
          if (lobo.lado === bote.lado && bote.elemento2 != lobo) {
            newPosition(lobo.lado, lobo.numeroPosicion, false, false);
            bote.cargar1(lobo, animate, false);
            break;
          }
        }
      }
    } else if (isEmpty(bote.elemento2)) {
      if (tipo === "oveja") {
        for (let oveja of ovejas) {
          if (oveja.lado === bote.lado && bote.elemento1 != oveja) {
            newPosition(oveja.lado, oveja.numeroPosicion, false, true);
            bote.cargar2(oveja, animate, true);
            break;
          }
        }
      } else if (tipo === "lobo") {
        for (let lobo of lobos) {
          if (lobo.lado === bote.lado && bote.elemento1 != lobo) {
            newPosition(lobo.lado, lobo.numeroPosicion, false, false);
            bote.cargar2(lobo, animate, false);
            break;
          }
        }
      }
    } else {
      alert("No hay cupo");
    }
  };

  const des = (elemento) => {
    const posicionFinal = get(positionsState, [
      elemento.lado,
      elemento.numeroPosicion,
    ]);
    elemento.move(posicionFinal, animate);
  };

  const cargarPalmeras = (scene) => {
    const palmerasTemp = [];

    const modelo1 = new Model(
      "/palmera.stl",
      scene,
      { x: 100, y: 0, z: 250 },
      coloresModelos.palmeras.dia,
      2,
      "izq",
      0
    );
    modelo1.load({ x: 29.9, y: 0, z: 0 });
    palmerasTemp.push(modelo1);

    const modelo2 = new Model(
      "/palmera.stl",
      scene,
      { x: 100, y: 0, z: -250 },
      coloresModelos.palmeras.dia,
      2,
      "izq",
      0
    );
    modelo2.load({ x: 29.9, y: 0, z: 0 });
    palmerasTemp.push(modelo2);

    const modelo3 = new Model(
      "/palmera.stl",
      scene,
      { x: -1000, y: 0, z: 250 },
      coloresModelos.palmeras.dia,
      2,
      "izq",
      0
    );
    modelo3.load({ x: 29.9, y: 0, z: 0 });
    palmerasTemp.push(modelo3);

    const modelo4 = new Model(
      "/palmera.stl",
      scene,
      { x: -1000, y: 0, z: -250 },
      coloresModelos.palmeras.dia,
      2,
      "izq",
      0
    );
    modelo4.load({ x: 29.9, y: 0, z: 0 });
    palmerasTemp.push(modelo4);

    const modelo5 = new Model(
      "/palmera.stl",
      scene,
      { x: -1150, y: 0, z: -220 },
      coloresModelos.palmeras.dia,
      2,
      "izq",
      0
    );
    modelo5.load({ x: 29.9, y: 0, z: 0 });
    palmerasTemp.push(modelo5);

    // Retorna el arreglo de modelos de palmeras
    setPalmeras(palmerasTemp);
  };

  const cargarRocas = (scene) => {
    const rocasTemp = [];

    const modelo1 = new Model(
      "/Rocks2.stl",
      scene,
      { x: -1150, y: 0, z: -220 },
      coloresModelos.rocas.dia,
      2,
      "izq",
      0
    );
    modelo1.load({ x: 29.9, y: 0, z: 0 });
    rocasTemp.push(modelo1);

    const modelo2 = new Model(
      "/Rocks2.stl",
      scene,
      { x: -1150, y: 0, z: 220 },
      coloresModelos.rocas.dia,
      2,
      "izq",
      0
    );
    modelo2.load({ x: 29.9, y: 0, z: 0 });
    rocasTemp.push(modelo2);

    const modelo3 = new Model(
      "/Rocks2.stl",
      scene,
      { x: 150, y: 0, z: -220 },
      coloresModelos.rocas.dia,
      2,
      "izq",
      0
    );
    modelo3.load({ x: 29.9, y: 0, z: 0 });
    rocasTemp.push(modelo3);

    const modelo4 = new Model(
      "/Rocks2.stl",
      scene,
      { x: 100, y: 0, z: 220 },
      coloresModelos.rocas.dia,
      2,
      "izq",
      0
    );
    modelo4.load({ x: 29.9, y: 0, z: 0 });
    rocasTemp.push(modelo4);

    // Retorna el arreglo de modelos de rocas
    setRocas(rocasTemp);
  };

  useEffect(() => {
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    const scene = new THREE.Scene();
    setSceneState(scene);
    scene.background = new THREE.Color(coloresModelos.cielo.dia);
    const camera = new THREE.PerspectiveCamera(
      25,
      width / height,
      0.01,
      100000
    );

    setCamera(camera);

    setCamera(camera);
    scene.add(camera);
    camera.position.set(
      initiPositionCamera.x,
      initiPositionCamera.y,
      initiPositionCamera.z
    );
    // Suponiendo que tienes un vector 3D al que quieres que la cámara apunte
    const targetVector = new THREE.Vector3(-500, 100, 100);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    setControls(controls);

    // Desactiva OrbitControls
    controls.enabled = false;

    // Utiliza el método lookAt() de la cámara para que apunte al vector objetivo
    camera.lookAt(targetVector);

    // Reactiva OrbitControls
    controls.enabled = true;
    // controls.enableDamping = true;

    cargarOvejas(scene);
    cargarLobos(scene);
    cargarBote(scene);
    cargarWater(scene);
    cargarOrillas(scene);
    cargarPalmeras(scene);
    cargarRocas(scene);

    const light = new THREE.PointLight(coloresModelos.luz.dia, 4);
    setLuz(light);

    light.position.set(8, 1000, 1000);
    scene.add(light);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  const moveCamera = (index) => {
    // Obtener la posición y el ángulo correspondiente al índice
    const targetPosition = targetPositions[index];
    // const targetAngle = targetAngles[index];

    // Actualizar la posición y el ángulo de la cámara
    cameraObj.position.copy(targetPosition);
    // cameraObj.rotation.copy(targetAngle);

    // Actualizar los controles de órbita para que reflejen los cambios en la cámara
    controlState.update();
  };

  const cambiarLuz = () => {
    const luz = dia ? "noche" : "dia";
    map(ovejas, (oveja) => {
      oveja.mesh.material.color.setHex(coloresModelos.oveja[luz]);
    });

    map(lobos, (lobo) => {
      lobo.mesh.material.color.setHex(coloresModelos.lobo[luz]);
    });

    agua.mesh.material.color.setHex(coloresModelos.water[luz]);

    bote.mesh.material.color.setHex(coloresModelos.bote[luz]);

    map(rocas, (roca) => {
      roca.mesh.material.color.setHex(coloresModelos.rocas[luz]);
    });

    map(palmeras, (palm) => {
      palm.mesh.material.color.setHex(coloresModelos.palmeras[luz]);
    });

    map(orillas, (orilla) => {
      orilla.material.color.setHex(coloresModelos.arena[luz]);
    });
    luzL.color.setHex(coloresModelos.luz[luz]);
    sceneState.background = new THREE.Color(coloresModelos.cielo[luz]);

    setDia(!dia);
  };

  return (
    <>
      <button style={styloso} onClick={() => cargar("oveja")}>
        Cargar oveja
      </button>
      <button style={styloso} onClick={() => cargar("lobo")}>
        Cargar lobo
      </button>
      <button style={styloso} onClick={mover}>
        Mover bote
      </button>
      <button style={styloso} onClick={descargarBote}>
        Descargar bote
      </button>
      <button style={styloso} onClick={cambiarLuz}>
        Cambiar luz
      </button>

      <button style={styloso} onClick={() => moveCamera(0)}>Mover a posición 1</button>
      <button style={styloso} onClick={() => moveCamera(1)}>Mover a posición 2</button>
      <button style={styloso} onClick={() => moveCamera(2)}>Mover a posición 3</button>

      <div ref={mountRef} style={{ width: "100%", height: "100vh" }}></div>
    </>
  );
};

export default Model3D;
