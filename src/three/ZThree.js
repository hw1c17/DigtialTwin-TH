import * as THREE from 'three';
// 引入gui.js库
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

export default class ZThree {
    constructor(id) {
        this.id = id;
        this.el = document.getElementById(id);
}

initThree() {
    let width = this.el.offsetWidth;
    let height = this.el.offsetHeight;
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(30, 30, 30);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
     });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.el.append(this.renderer.domElement);

    this.gui = new GUI();

    window.addEventListener('resize', () => {
        this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
        if (this.cssRenderer) {
            this.cssRenderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
        }
    });
}

initLight() {
    const ambientLight = new THREE.AmbientLight( 0x404040 ); 
    this.scene.add( ambientLight );
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    directionalLight.position.set( 300, 300, 300 );
    directionalLight.castShadow = true;
    this.scene.add( directionalLight );

    directionalLight.shadow.mapSize.width = 1024; 
    directionalLight.shadow.mapSize.height = 1024; 
    directionalLight.shadow.camera.near = 10; 
    directionalLight.shadow.camera.far = 900; 
    directionalLight.shadow.camera.top = 400;
    directionalLight.shadow.camera.bottom = -400;
    directionalLight.shadow.camera.left = 400;
    directionalLight.shadow.camera.right = -400;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.shadow.bias = 0.05;


    const helper = new THREE.CameraHelper( directionalLight.shadow.camera);
    this.scene.add( helper );
}

initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
}
initOrbitControls() {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.enablePan = true;

    this.controls = controls;
}

loaderModel(option) {
    switch (option.type) {
        case 'gltf':
        case 'glb':
            if (!this.gltfLoader) {
                this.gltfLoader = new GLTFLoader();
                let dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath('draco/');
                this.gltfLoader.setDRACOLoader(dracoLoader);
            }
            this.gltfLoader.load(option.url, option.onLoad, option.onProgress, option.onError);
            break;
    
        default:
            break;
    }
}

iterateLoad(objFileList, onProgress, onAllLoad) {
    let fileIndex = 0;
    let that = this;

    function iterateLoadForIt() {
        that.loaderModel({
            type: objFileList[fileIndex].type,
            url: objFileList[fileIndex].url,
            onLoad: function (object) {
                if (objFileList[fileIndex].onLoad) {
                    objFileList[fileIndex].onLoad(object);
                }
                fileIndex++;
                if (fileIndex < objFileList.length) {
                    iterateLoadForIt();
                } else {
                    if (onAllLoad) {
                        onAllLoad();
                    }
                }
            },
            onProgress: function (xhr) {
                if (objFileList[fileIndex].onProgress) {
                    objFileList[fileIndex].onProgress(xhr, fileIndex);
                }
                if (onProgress) {
                    onProgress(xhr, fileIndex);
                }
            },

        });
    }
    iterateLoadForIt();
}

getModelWorldPostion(model) {
  this.scene.updateMatrixWorld(true);
  const worldPosition = new THREE.Vector3();
  model.getWorldPosition(worldPosition);
  return worldPosition;
}

flyTo(option) {
    option.position = option.position || []; // 相机新的位置
    option.controls = option.controls || []; // 控制器新的中心点位置(围绕此点旋转等)
    option.duration = option.duration || 1000; // 飞行时间
    option.easing = option.easing || TWEEN.Easing.Linear.None;
    const curPosition = this.camera.position;
    const controlsTar = this.controls.target;
    const tween = new TWEEN.Tween({
      x1: curPosition.x, // 相机当前位置x
      y1: curPosition.y, // 相机当前位置y
      z1: curPosition.z, // 相机当前位置z
      x2: controlsTar.x, // 控制当前的中心点x
      y2: controlsTar.y, // 控制当前的中心点y
      z2: controlsTar.z // 控制当前的中心点z
    })
      .to(
        {
          x1: option.position[0], // 新的相机位置x
          y1: option.position[1], // 新的相机位置y
          z1: option.position[2], // 新的相机位置z
          x2: option.controls[0], // 新的控制中心点位置x
          y2: option.controls[1], // 新的控制中心点位置x
          z2: option.controls[2] // 新的控制中心点位置x
        },
        option.duration
      )
      .easing(TWEEN.Easing.Linear.None); // TWEEN.Easing.Cubic.InOut //匀速
    tween.onUpdate(() => {
      this.controls.enabled = false;
      this.camera.position.set(tween._object.x1, tween._object.y1, tween._object.z1);
      this.controls.target.set(tween._object.x2, tween._object.y2, tween._object.z2);
      this.controls.update();
      if (option.update instanceof Function) {
        option.update(tween);
      }
    });
    tween.onStart(() => {
      this.controls.enabled = false;
      if (option.start instanceof Function) {
        option.start();
      }
    });
    tween.onComplete(() => {
      this.controls.enabled = true;
      if (option.done instanceof Function) {
        option.done();
      }
    });
    tween.onStop(() => (option.stop instanceof Function ? option.stop() : ''));
    tween.start();
    TWEEN.add(tween);
    return tween;
}

render(callback) {
    callback();
    this.frameId = requestAnimationFrame(() => this.render(callback));
        }      
        
    }
