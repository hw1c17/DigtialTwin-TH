<template>
  <div class="main">
    <big-control class="control"></big-control>
    <div id="screen" class="screen"></div>
  </div>
</template>

<script>
import ZThree from '@/three/ZThree.js';
import * as THREE from 'three';
import { loaderModel } from '@/three/loaderModel';
import bigControl from '@/components/bigControl.vue';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { cssRender } from '@/three/cssRender';

let app, camera, scene, renderer, controls, clock;
export default {
  name: 'HomeView',
  components: {
    bigControl},
  methods: {
    async initZThree() {
      app = new ZThree('screen');
      app.initThree();
      app.initHelper();
      app.initOrbitControls();
      app.initLight();
      window.app = app;
      //设置初始相机的初始位置，在控制台输入app.camera.position和app.controls.target获取
      app.cameraPosition = [30.31, 70.72, 171];
      app.controlsTarget = [93.48, 5.17, 85.36];
      

      controls = app.controls;
      controls.target.set(...app.controlsTarget);
      let instance = new cssRender(CSS3DRenderer, app);
      app.cssRenderer = instance.cssRenderer;
      app.instance = instance;

      clock = new THREE.Clock();

      camera = app.camera;
      camera.position.set(...app.cameraPosition);
      scene = app.scene;
      renderer = app.renderer;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      

      await loaderModel(app);



      app.render(() => {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render(scene, camera);
        app.cssRenderer.render(scene, camera);
        TWEEN.update();
      })

  },
},
  mounted() {
    this.initZThree();
  }
}
</script>

<style lang="less">

  .main {
    width: 100%;
    height: 100%;
    background-color: #000000;
    overflow: hidden;
   }
   .screen {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
   }

    .control {
    height: 10%;
    position: fixed;
    bottom: 5%;
    left: 28%;
    z-index: 3;
    float: left;
    font-size: 30px;
  }

</style>
