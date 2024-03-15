import StateSeparator from "./state_separator.js";
import FPVControll from "./FPVControll.js";
import TargetBoneDriver from "./TargetBoneDriver.js";
import { Object3D } from "three";


/**
 * @typedef { import('./state_separator.js').ParameterizedCharacter } ParameterizedCharacter
 * @typedef { import('../gaming-model/HandObject.js').HandObject } HandObject
*/

/**класс Посредник
 * @class
 * @property {Boolean} isCharacter
 * @property {HandObject | undefined} handObject
 * @property {Object3D} FPVcam - добавляем камеру для вида от первого лица
 * @method setState(value) - устанавливаем состояние
 * @method setSubState(value) - устанавливаем подсостояние
 * @method camRotate - вращение коробкой для FPV камеры, указанием пиксельных координат
*/
export default class Character {
    isCharacter = true;

    #stateSeparator;
    #FPVControll;
    #targetBoneDriver;

    /** @param {ParameterizedCharacter} model  @param {AnimationClip[]} animations  @param {Function} callback */
    constructor (model, animations, callback) {
        this.#stateSeparator = new StateSeparator(model, animations, callback);
        this.#FPVControll = new FPVControll(model);
        this.#targetBoneDriver = new TargetBoneDriver(model);
    }

    /** @param {string} value  */
    setState (value) {
        this.#stateSeparator.setState(value);
    }

    /** @param {string} value  */
    setSubState (value) {
        this.#stateSeparator.setSubState(value);
    }

    /**@param {number} x  @param {number} y */
    camRotate (x, y) {
        this.#FPVControll.camRotate(x, y);
    }

    /**@param {number} dt*/
    update (dt) {
        let targetVec = this.#FPVControll.aimPoint;
        this.#targetBoneDriver.lookAt = targetVec;

        this.#stateSeparator.update(dt);
        this.#targetBoneDriver.update();
        this.#FPVControll.update();
    }

    clear () {
        this.#targetBoneDriver.clear();
        this.#stateSeparator.clear();

        this.isCharacter = undefined;
        this.#stateSeparator = undefined;
        this.#FPVControll = undefined;
        this.#targetBoneDriver = undefined;
    }

    /**@param {HandObject | undefined} value*/
    set handObject (value) {
        this.#targetBoneDriver.object = value;
    }

    /**@param {Object3D} value*/
    set FPVcam (value) {
        return this.#FPVControll.camera = value;
    }
}