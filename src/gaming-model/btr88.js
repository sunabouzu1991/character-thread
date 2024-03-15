import AbstractModelSetting from "./abstractSetting";
import LoadManager from "../loadManager";

export default class Btr883D extends AbstractModelSetting {

    constructor() {
        super();
    }

    loadModel () {
        const loader = LoadManager.getInstance();
        const value = loader.load('gltf', '../../models/btr88/btr88.gltf', 
            (url, model) => {
                loader.caching(url, model.scene.children[0]);
                this.settings(model.scene.children[0]);
            },
            (xhr) => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ), 
            () => console.error('ошибка загрузки модели солдат')
        );
        if (value) this.settings(value);
    }

    settings (model) {
        this.model = model;
    }
}