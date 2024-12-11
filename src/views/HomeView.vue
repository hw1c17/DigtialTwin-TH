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
      

      controls = app.controls;
      let instance = new cssRender(CSS3DRenderer, app);
      app.cssRenderer = instance.cssRenderer;
      app.instance = instance;

      clock = new THREE.Clock();

      camera = app.camera;
      scene = app.scene;
      renderer = app.renderer;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      console.log(app);

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
