<template>
  <div class="container">
    <form>
      <label v-for="(item, index) in controls" @click="activeFun(item, index)">
        <input type="radio" name="radio" :checked="index === activeVar" />
        <span>{{ item.name }}</span>
      </label>
    </form>
    <!-- 楼层返回 -->
    <div class="back animated fadeIn" @click="backFloorBase" v-if="isShowFloorBack">
      <img src="./../assets/image/back.png" alt="" />
      <p>返回</p>
    </div>
    <!-- 楼层ui -->
    <layer
      :layers="layerData"
      :active="currentLayer"
      :styles="{ top: '55%', left: '72%', height: '400px' }"
      @change="changeLayer"
      v-if="isShowFloorBack"
    ></layer>
    <tooltip
      :style="{
        visibility: roomTooltipStyle.show ? 'visible' : 'hidden',
        left: roomTooltipStyle.x + 'px',
        top: roomTooltipStyle.y + 'px'
      }"
      :data="roomTooltipStyle"
    ></tooltip>
  </div>
</template>

<script>
  import {loaderFloorManage, setModelLayer} from "@/three/floorManage";
  import { destroyControlGroup, setModelDefaultMatrial } from '@/three/loaderModel';
  import layer from '@/components/layer';
  import tooltip from '@/components/tooltip';
  import { cameraUrls } from '@/assets/mock/mock';

  export default {
    name: '',
    components: {
      layer,
      tooltip
    },
    props: {},
    data() {
      return {
        roomTooltipStyle: {
          show: false,
          x: 0,
          y: 0,
          name: ''
        },
        isShowFloorBack: false,
        layerData: [],
        currentLayer: '总览',
        curFloorModel: null,
        controls: [
          {
            name: '园区总览',
            goFunction: () => {
              window.app.flyTo({
                position: app.cameraPosition,
                controls: app.controlsTarget,
                duration: 1000
              });
            },
            backFunction: () => {}
          },
          {
            name: '办公区域',
            goFunction: () => {
              loaderFloorManage(window.app);
            },
            backFunction: () => {
              destroyControlGroup(window.app, 'floorText-3d');
              this.isShowFloorBack = false;
              this.roomTooltipStyle.show = false;
              if (this.curFloorModel && this.currentLayer !== '总览') {
                this.currentLayer = '总览';
                setModelLayer(
                  window.app,
                  this.curFloorModel,
                  this.currentLayer,
                  this.layerData,
                  () => {
                    setModelDefaultMatrial(window.app);
                    this.curFloorModel = null;
                  }
                );
              } else {
                setModelDefaultMatrial(window.app);
              }
            }
          },
          {
            name: '生产区域',
            goFunction: () => {
            
            },
            backFunction: () => {
    
            }
          }
          
         
        ],
        activeVar: 0
      };
    },
     watch: {
      activeVar(newVal, oldVal) {
        const oldControl = this.controls.filter((item) => item.name === this.controls[oldVal].name);
        oldControl[0].backFunction();
        const newControl = this.controls.filter((item) => item.name === this.controls[newVal].name);
        newControl[0].goFunction();
      }
    },
    methods: {
      activeFun(item, index) {
        this.activeVar = index;
      },

      backFloorBase() {
        this.isShowFloorBack = false;
        this.roomTooltipStyle.show = false;

        if (this.curFloorModel && this.currentLayer !== '总览') {
          this.currentLayer = '总览';
          setModelLayer(window.app, this.curFloorModel, this.currentLayer, this.layerData, () => {
            setModelDefaultMatrial(window.app);
            loaderFloorManage(window.app);
            this.curFloorModel = null;
          });
        } else {
          setModelDefaultMatrial(window.app);
          loaderFloorManage(window.app);
        }
      },
      changeLayer(layer) {
        this.currentLayer = layer;
        setModelLayer(window.app, this.curFloorModel, layer, this.layerData);
      },

    },
    mounted() {
      this.$EventBus.$on('changeFloorUI', (obj) => {
        this.isShowFloorBack = obj.isShowFloorBack;
        this.curFloorModel = obj.model;
        const layerNames = obj.model.children
          .filter((item) => item.name.indexOf('F') > -1)
          .map((item) => item.name);
        this.layerData = [this.currentLayer].concat(layerNames);
      });

      this.$EventBus.$on('changeRoomTooltip', (obj) => {
        
       
          this.roomTooltipStyle = Object.assign(
            {
              摄像头: obj.name,
              视频: cameraUrls[obj.name]
            },
            obj
          );
      });
    }
  };
</script>

<style lang="less" scoped>
  .back {
    width: 48px;
    position: fixed;
    bottom: 4%;
    left: 25%;
    z-index: 3;
    cursor: pointer;
    font-size: 18px;
    img {
      width: 100%;
    }
    p {
      color: #fff;
      text-align: center;
    }
  }
  .container form {
    display: flex;
    flex-wrap: wrap;
  }

  .container label {
    display: flex;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.375em;
  }

  .container label input {
    position: absolute;
    left: -9999px;
  }

  .container label input:checked + span {
    background-color: #414181;
    color: white;
  }

  .container label input:checked + span:before {
    box-shadow: inset 0 0 0 0.4375em #00005c;
  }

  .container label span {
    display: flex;
    align-items: center;
    padding: 0.375em 0.75em 0.375em 0.375em;
    border-radius: 99em;
    transition: 0.25s ease;
    color: #414181;
  }

  .container label span:hover {
    background-color: #d6d6e5;
  }

  .container label span:before {
    display: flex;
    flex-shrink: 0;
    content: '';
    background-color: #fff;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    margin-right: 0.375em;
    transition: 0.25s ease;
    box-shadow: inset 0 0 0 0.125em #00005c;
  }


</style>
