import { Object3D } from "three";
import LoadManager from "../loadManager";

const uuidSearch = (uuid, array) => {
    for (const [key, value] of array) 
        if (uuid === value) return true;
    return false;
}

export default class ModelSetting { //Abstract
    /** @type {Object3D} - загруженная 3Д модель*/
	static mesh;
    /**@type {string} - указываем расширения файла */
    static fileType;
    /** @type {string} - указываем путь к файлу */
    static fileSource;
	static type3D = 'mesh';

	constructor() {
		if(this.constructor === ModelSetting)
			throw new Error("Класс ModelSetting имеет абстрактный тип и не может быть создан.");
		this.#checkMethod();

		// если имеется анимация (this.constructor.mesh обращение к static mesh)
        this.mesh = this.type3D === 'mesh' ? this.constructor.mesh.clone() : this.constructor.mesh;

        //заменяем материал на более упрощённый
        // const materials = [];
        // this.mesh.traverse(obj3D => {
        //     if (obj3D.name.indexOf('collider') > -1) obj3D.visible = false;
        //     if ( obj3D.material !== undefined && uuidSearch(obj3D.material.uuid, materials) === false ) {
        //         const material = new MeshLambertMaterial;
        //         for (const key in material) 
        //             if (obj3D.material[key] !== undefined && key !== 'type') material[key] = obj3D.material[key];
        //         obj3D.material = material;
        //         materials.push(material.uuid);
        //     }
        // });
	}

	#checkMethod () {
		// if(this.settings === undefined)
		// 	throw new Error("Метод settings не реализован")
    }

    static load(type, source) {
        const loader = LoadManager.getInstance();
		const fileType = type === undefined ? this.fileType : type;
		const fileSource = source === undefined ? this.fileSource : source;

        loader.load(fileType, fileSource, 
            (url, model) => {
				var object = this.type3D === 'mesh' ? model.scene.children[0] : model.animations;
                loader.caching( url, object );
                this.mesh = object;
            },
            (xhr) => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ), 
            () => console.error('ошибка загрузки модели солдат')
        );
    }
}