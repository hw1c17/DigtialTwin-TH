import * as THREE from 'three';

export function loaderModel(app) {
    return new Promise(resolve => {
        app.controlGroup = new THREE.Group();
        app.scene.add(app.controlGroup);
        app.modelMaterials = {};
        let urls = [
            {
                type: 'glb',
                url:'model/model_2.glb',
                onLoad: (object) => {
                    console.log(object);
                    app.scene.add(object.scene);

                    app.model = object.scene;
                    const receiveModels = ['Base_crossing', 'Base_roadline', 'Base', 'baseEast_eastnorth','baseEast_office','baseEast_south','baseEast_west','baseEast_westsouth','baseEast_workshop_2','baseEast_workshop_4'];
                    app.model.traverse((obj) => {
                        if (obj.material) {
                            app.modelMaterials[obj.name] = {
                            material: obj.material
                            };
                        }

                        // 将模型的坐标也储存一份，在做楼层动画使用
                        let { x, y, z } = obj.position;
                        obj.position_tmp = { x, y, z };


                        if (receiveModels.includes(obj.name)) {
                          obj.receiveShadow = true;
                        } else {
                           obj.castShadow = true;
                           obj.receiveShadow = false;  
                        } 
                    });

                }
            }
        ];
        console.log(app.modelMaterials);
        app.iterateLoad(urls, null, () => {});


        resolve();
})
}

export function setModelDefaultMatrial(app) {
  app.model.traverse((obj) => {
    if (obj.material) {
      obj.material = app.modelMaterials[obj.name].material;
    }
  });
}

export function destroyControlGroupText(app, className) {
  const textDoms = document.getElementsByClassName(className);
  for (let i = 0; i < textDoms.length; i++) {
    const textDom = textDoms[i];
    textDom.onclick = null;
  }
  app.instance.removeAll(app.controlGroup);
}

export function destroyControlGroup(app, className) {
  if (app?.controlGroup?.children?.length === 0) {
    return;
  }
  if (className) {
    destroyControlGroupText(app, className);
  }
  for (let i = app.controlGroup.children.length - 1; i > -1; i--) {
    const obj = app.controlGroup.children[i];
    if (obj.isMesh) {
      obj.geometry.dispose();
      obj.material.dispose();
      app.controlGroup.remove(obj);
    }
  }
}