import * as THREE from 'three';
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { floorBaseMaterial } from './material';
import EventBus from '@/bus';
import { destroyControlGroupText } from '@/three/loaderModel';


export function loaderFloorManage(app) {
    app.flyTo({
        position:[133.02, 55.42, 153.19],
        controls:[58.48, -59.79, 11.60],
        done: () => {
            createFloorText(app);
        }
    })

}

export function createFloorText(app) {
    app.model.traverse((obj) => {
        if (obj.name.indexOf('楼顶') > -1) {
            const name = obj.parent.name;
            const position = Object.values(app.getModelWorldPostion(obj));
            const html = `<div class="floorText-3d animated fadeIn" id="${name}"><p class="text">${name}</p></div>`;
            app.instance.add({
              parent: app.controlGroup,
              cssObject: CSS3DSprite,
              name,
              element: html,
              position,
              scale: [0.05, 0.05, 0.05]
            });
        }
    });

    const textDoms = document.getElementsByClassName('floorText-3d');
    for (let i = 0; i < textDoms.length; i++) {
        const textDom = textDoms[i];
        textDom.onclick = () => {
            for (let i = 0; i < app.model.children.length; i++) {
                const obj = app.model.children[i];
                if (obj.name === textDom.id) {
                    EventBus.$emit('changeFloorUI', {
                        isShowFloorBack: true,
                        model: obj
                    });
                    const centerPosition = Object.values(app.getModelWorldPostion(obj));

                    app.flyTo({
                        position: [centerPosition[0] - 20, centerPosition[1] + 60 , centerPosition[2] + 40],
                        controls: centerPosition
                        });

                    // 恢复点击模型组的材质
                    obj.traverse((childrenObj) => {
                        if (childrenObj.material) {
                            childrenObj.material = app.modelMaterials[childrenObj.name].material;
                        }
                    });
                }  else {
                    // 设置除点击模型的组以外的基础色
                    obj.traverse((childrenObj) => {
                        if (childrenObj.material) {
                             childrenObj.material = floorBaseMaterial;
                        }
                    });
                }
            }
            destroyControlGroupText(app, 'floorText-3d');
        };
    }

}

export function setModelLayer(app, model, layerName, layerData, callback) {
  // 清除当前楼层文本
  const currentLayer = Number(layerName.substring(0, layerName.indexOf('F')));
  for (let i = 0; i < model.children.length; i++) {
    let mesh = model.children[i];
    let name = mesh.name;
    let num;

    // 对楼顶特殊处理
    if (name.indexOf('楼顶') > -1) {
      num = layerData.length + 1;
    } else {
      num = Number(name.substring(0, name.indexOf('F')));
    }

    let value = num - currentLayer;
    let position = mesh.position;
    let position_tmp = mesh.position_tmp;
    let toPosition;

    if (layerName === '全楼') {
      // 点击全部楼层时执行
      toPosition = [position_tmp.x, position_tmp.y, position_tmp.z];
    } else {
      if (value >= 1) {
        toPosition = [position_tmp.x, position_tmp.y + value * 20, position_tmp.z];
      } else {
        toPosition = [position_tmp.x, position_tmp.y, position_tmp.z];
      }
    }

    app.modelMove(
      {
        fromPosition: [position.x, position.y, position.z],
        toPosition,
        duration: 300,
         done: () => {
          if (layerName === '全楼') {
            if (callback) {
              callback();
              return;
            }
            const centerPosition = Object.values(app.getModelWorldPostion(model));
            app.flyTo({
              position: [centerPosition[0] + 40, centerPosition[1] + 50, centerPosition[2] + 40],
              controls: centerPosition
            });
            return;
        } else {
          if (mesh.name.indexOf(layerName) > -1) {
            if (callback) {
              callback();
              return;
            }
            // 计算当前点击模型的中心点
            const centerPosition = Object.values(app.getModelWorldPostion(mesh));
            app.flyTo({
              position: [centerPosition[0] + 15, centerPosition[1] + 20, centerPosition[2] + 15],
              controls: centerPosition,
              done: () => {
                createRoomText(app, mesh);
              }
            });
            }
        }
        }
      },
      mesh
    );
  }
}

