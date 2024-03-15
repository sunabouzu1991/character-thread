import MainThread from "../webworker/ThreadManager";
import Character from "./Character";



/** Посредник для ThreadCharacter в основном потоке
 * @class
*/
class MediatorThreadCharacter extends MainThread {

    constructor () {
        super('ThreadCharacter', undefined, (data) => this.#callThreadMethod(data));
    }

    /** функция слушатель для события message у Worker
     * @param {ThreadData} data
    */
    #callThreadMethod (data) {
        console.log(data);
    }

    clear() {
        super.clear();
    }

    /** @param {ParameterizedCharacter} model  @param {AnimationClip[]} animations  @param {Function} callback*/
    create (model, animations, callback) {

    }
}



/** Управление Character в паралельном потоке. Pattern Singleton
 * @class
*/
class ThreadCharacter {
    /** @type {ThreadCharacter} - Singleton*/
    static #instance = null;

    constructor () {
        // проверяем что значение #instance не равно null (т.е. уже что-то присвоено), и прерываем инструкцию.
        if (ThreadCharacter.#instance) return ThreadCharacter.#instance;
        ThreadCharacter.#instance = this;
    }
}


export {MediatorThreadCharacter, ThreadCharacter}