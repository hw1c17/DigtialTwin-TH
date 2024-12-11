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
            console.log(5);
            createFloorText(app);
        }
    })

}

export function createFloorText(app) {
    app.model.traverse((obj) => {
        if (obj.name.indexOf('屋顶') > -1) {
            console.log(obj);
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

