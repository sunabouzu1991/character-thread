import Model3DSetting from "./ModelSetting.js";
import { Vector3 } from "three";

/** @typedef {HandObject} HandObject */

/**
 * @class
 * @method settings - возвращает настройки модели
*/
export default class HandObject extends Model3DSetting {
    static fileType = 'gltf';
    static fileSource = '../../models/akms/akms.gltf';

    #handDriver = {
        //положения для крепления таргетовых костей IKSolver
        forend: {// крепление под цевьё
            position: new Vector3( .04, -.06, .57 ),
            rotation: new Vector3( -1.5, .9, 2.04 )
        },
        hilt: {// крепление под рукоять
            position: new Vector3( -.04, -.09, .205 ),
            rotation: new Vector3( 2.8, 1.46, -1.68 )
        },
        head: {// крепление под голову
            position: new Vector3(),
            rotation: new Vector3( .02, .17, .26 )
        }
    };

    constructor() {
        super();
    }

    get handSettings () {
        return this.#handDriver;
    }
}