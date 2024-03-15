import { CCDIKSolver } from 'three/addons/animation/CCDIKSolver.js';
import { Object3D, Quaternion, Vector3 } from 'three';

/**
 * @typedef {import('../state_separator.js').ParameterizedCharacter} ParameterizedCharacter

 * @typedef Link - 
 * @type {object}
 * @property {number} index — Связывающая кость.
 * @property {Vector3} limitation — (опционально) Ось вращения. По умолчанию не определено.
 * @property {Vector3 | undefined} rotationMin — (необязательно) Минимальный предел вращения. По умолчанию не определено.
 * @property {Vector3 | undefined} rotationMax — (необязательно) Максимальный предел вращения. По умолчанию не определено.
 * @property {boolean | true} enabled — (необязательно) Значение по умолчанию — true.

 * @typedef boneNode - 
 * @type {object}
 * @property {number} target — Целевая кость. 
 * @property {number} effector — Эффекторная кость.
 * @property {Link[]} links — Массив Link, определяющих кости ссылок.
 * @property {number} iteration — (необязательно) Номер итерации расчета. Меньше — быстрее, но менее точно. По умолчанию — 1.
 * @property {number} minAngle — (необязательно) Минимальный угол поворота за шаг. По умолчанию не определено.
 * @property {number} maxAngle — (необязательно) Максимальный угол поворота за шаг. По умолчанию не определено.

 * @typedef { boneNode[] } iks - Массив boneNode, определяющий параметр IK.target, effector и link-index — это целые числа индекса в .skeleton.bones. 
    Отношение костей должно быть «links[n],links[n-1],...,links[0], effector» в порядке от родителя к дочернему элементу.
*/

const qSourceWorld = new Quaternion();
const qDestParentWorld = new Quaternion();


/**
 * @class
 */
class IKSolver extends CCDIKSolver {

    /** @param {Object3D} mesh  @param {iks} iks */
    constructor ( mesh, iks ) {
        super( mesh, iks )
    }

    /** @param {*} ik  */
    updateOne ( ik ) {
        if (ik.off === true) return;

        super.updateOne( ik );
        
        const bones = this.mesh.skeleton.bones; // for reference overhead reduction in loop
        const effector = bones[ ik.effector ];
        const target = bones[ ik.target ]; // don't use getWorldPosition() here for the performance

        //update effector rotation
        target.getWorldQuaternion(qSourceWorld);
        effector.parent.getWorldQuaternion(qDestParentWorld);
        effector.quaternion.multiplyQuaternions( qDestParentWorld.invert(), qSourceWorld);
    }

    clear () {
        for ( const key of Object.entries(this) )
            this[key] = undefined;
    }
}


export default class CCDIKManager {
    #engine;
    #iks;

    constructor (skinnedMesh, iks) {
        this.#iks = iks;
        this.#engine = new IKSolver( skinnedMesh, this.#iks );
    }

    iksSwitch (arr) {
        this.#iks.forEach(ik => ik.off = false);

        if ( Array.isArray(arr) === false ) return;

        if (arr[0] === 'all') this.#iks.forEach(ik => ik.off = true);
        else arr.forEach(name => {
            this.#iks.forEach(ik => {
                if(name === ik.name) ik.off = true;
            });
        });
    }

    update() {
        this.#engine.update();
    }

    clear() {
        this.#engine.clear();
        this.#engine = undefined;
        this.#iks = undefined;
    }
}