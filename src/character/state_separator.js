import RecordPlayer from "./animation/RecordPlayer.js";
import CCDIKManager from "./animation/CCDIKManager.js";
import states from './animation/states.js';

/** 
 * @typedef { import('./animation/states.js').State } State
 * @typedef { import('./animation/states.js').substate } substate
 * @typedef { import('../gaming-model/ParameterizedCharacter.js').ParameterizedCharacter } ParameterizedCharacter
*/


/** StateSeparator класс Посредник
 * @class
 * @property #state - запоминает текущее состояние
 * @property #player - Плэер для проигрывания subState
 * @property #iksolver - Инверсная кинематика Cyclic Coordinate Descent Inverse Kynematic(CCD IK)
 * @property #substate -
*/
export default class StateSeparator {
    /**@type {State} */
    #state;
    /**@type {RecordPlayer} */
    #player;
    /**@type {CCDIKManager} */
    #iksoler;

    /**@type {substate} */
    #subState;

    /**@param {ParameterizedCharacter} model  @param {AnimationClip[]} animations  @param {Function} callback */
    constructor (model, animations, callback) {
        //нужен объект с анимациями и скелетом
        this.#player = new RecordPlayer( model.skinnedMesh, animations, callback );
        this.#iksoler = new CCDIKManager( model.skinnedMesh, model.ikSettings );
    }

    /**@param {string} value*/
    setState (value) {
        this.#state = new states[value];
    }

    /**@param {string} value  */
    setSubState (value) {
        this.#subState = this.#state.getSubstate(value);
        this.#play();
    }

    #play () {
        this.#player.fadeToAction( this.#subState.name, this.#subState.bodyPart, this.#subState.once, this.#subState.timeScale );
        this.#iksoler.iksSwitch( this.#subState.ikOff );
    }

    /**@param {number} dt*/
    update(dt) {
        this.#player.update(dt);
        this.#iksoler.update();
    }

    clear () {
        this.#player.clear();
        this.#iksoler.clear();
        
        this.#state = undefined;
        this.#player = undefined;
        this.#iksoler = undefined;
        this.#subState = undefined;
    }
}