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