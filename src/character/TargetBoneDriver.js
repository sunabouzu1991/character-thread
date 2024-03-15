import { Vector3, Group, Object3D } from "three";

var vec3 = new Vector3;

/** @typedef { import ('./Character.js').HandObject } HandObject*/

/** управление таргетовыми костями в коробке.
 * @class
 * @property {Vector3} lookAt - указывает точку в пространтсве куда направлена коробка(boneBox)
 * @property {Object3D} object - добавление предмета в коробку 
 */
export default class TargetBoneDriver {
    /**@type {Bone}- точка крепления для Object3D*/
    #aimShoulder;
    /** @type {Vector3} - смещение от точки крепления*/
    #aimShoulderShift;

    /** @type {Group} - коробка для таргетовых костей*/
    #boneBox;

    /** @type {Object3D} - Родительское пространство для коробки(boneBox)*/
    #space;
    /** @type {Object3D} - объект для крепления в коробку*/
    #interactionObject;

    /** @type {Object} - настройки для TargetBoneDriver*/
    #spaceSetting;
    /** @type {Object} - настройки для таргетовых костей*/
    #IOSetting;

    /** @type {Map<string, Object3D>} - список таргетовых костей*/
    #targetBones = new Map ([
		['forend', undefined],
		['hilt', undefined],
		['head', undefined]
	]);

    constructor ( model ) {
        this.#spaceSetting = model.handSettings;
        this.#boneBox = new Group(); //контейнер под оружие
        this.#space = model.mesh;
        this.#space.add(this.#boneBox);
        this.#aimShoulder = model.mesh.getObjectByName(this.#spaceSetting.aimShoulder);
        this.#aimShoulderShift = this.#spaceSetting.aimShoulderShift.clone();

        for ( const [key, value] of this.#targetBones ) {
            const bone = this.#space.getObjectByName( this.#spaceSetting[key] );
			this.#targetBones.set( key, bone );
            this.#boneBox.add( bone );
        }
    }

    #activation () {
        for ( const [key, value] of this.#targetBones ) {
            value.position.copy(this.#IOSetting[key].position);
            value.rotation.setFromVector3(this.#IOSetting[key].rotation);
        }
    }

    update () {
        vec3.setScalar(0);
        this.#aimShoulder.localToWorld(vec3);
        this.#space.worldToLocal(vec3);

        this.#boneBox.position.copy(vec3);
        this.#boneBox.position.add(this.#aimShoulderShift);

        this.#boneBox.updateMatrixWorld(true);
    }

    //удаление предмета из коробки
    #removeObject () {
        if (!this.#interactionObject) return;

        this.#boneBox.remove(this.#interactionObject.mesh);
        this.#interactionObject = undefined;
        this.#IOSetting = undefined;
    }

    clear () {
        this.#aimShoulder = undefined;
        this.#boneBox = undefined;
        this.#space = undefined;
        this.#interactionObject = undefined;
        this.#spaceSetting = undefined;
        this.#IOSetting = undefined;
        this.#targetBones = undefined;
        this.#aimShoulderShift = undefined;
    }

    /**@param {HandObject} value*/
    set object (value) {
        this.#removeObject();

        this.#interactionObject = value.mesh;
        this.#IOSetting = value.handSettings;

        this.#boneBox.add(value.mesh);
        this.#activation();
    }

    /** @param {Vector3} value */
    set lookAt (value) {
        this.#boneBox.lookAt(value);
    }
}