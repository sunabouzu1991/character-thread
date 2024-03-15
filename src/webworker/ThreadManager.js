import { MathUtils } from "three/src/math/MathUtils";

/** 
 *  @typedef {{uuid: string, callback: Function}} classInfo - информация о классе в потоке
*/
const _THREAD_LIMIT = navigator.hardwareConcurrency;


/** Создаёт поток.
 * @class
 * @method createClass - Создаёт класс в потоке, callback возвращает uuid(key) класса в потоке и index потока
 * @method removeClass - Удаляет класс из потока и связанные с ним настройки из списка #uuids
 * @method classMethod - Вызывает метод класса в потоке
 * @method clear - очищает свойства класса и удаляет Worker
 */
class Thread {
    /**@type {Worker} */
    #worker;
    /** @type {classInfo{}} - для обращения к классу по ключу в потоке*/
    #uuids;
    /** @type {number} - индекс в списке родителя*/
    index;

    /** @param {number} index  */
    constructor (index) {
        this.#worker = new Worker( new URL('./Thread.js', import.meta.url), { type: 'module' } );
        this.#uuids = {};
        this.index = index;

        this.#worker.addEventListener( "error", (event) => console.error('from Thread:', event) );

        this.#worker.addEventListener( "messageerror", (event) => console.error(`Error receiving message from worker: ${event}`) );
    }

    /** создаёт класс в потоке
     *  @param {string} className - название класса
     *  @param {Object} params - параметры для класса
     *  @param {Function} initialize - возвращаем uuid и index клиенту так как в потоке задача выполняется без привязки к слушателю,
     *  и определить результат для клиента возможно только по uuid(ключу)
     *  @param {Function} callback - функция по которой возвращается результат с паралельного потока
    */
    createClass (className, params, initialize, callback) {
        const classInfo = { uuid: MathUtils.generateUUID(), callback: (e) => callback(e.data) };

        initialize(this.index, classInfo.uuid);
        this.#uuids[classInfo.uuid] = classInfo;
        this.#worker.postMessage({ action: 'CreateClass', className, params, uuid: classInfo.uuid });

        // создаём слушателя, для ожидания данных с потока
        this.#worker.addEventListener( "message", classInfo.callback );
    }

    /** @param {string} uuid */
    removeClass (uuid) {
        const classInfo = this.#uuids[uuid];
        delete this.#uuids[uuid];

        this.#worker.removeEventListener( "message", classInfo.callback );
        this.#worker.postMessage( { action: 'RemoveClass', uuid } );
    }

    /**
     *  @param {string} uuid 
     *  @param {string} method 
     *  @param {Object} params */
    classMethod (uuid, method, params) {
        this.#worker.postMessage( { action: 'classMethod', uuid, method, params } );
    }

    clear () {
        this.#worker.terminate();

        this.#worker =  undefined;
        this.#uuids = undefined;
        this.index = undefined;
    }

    get classCnt () {
        return Object.keys(this.#uuids).length;
    }
}



/** Управляет созданием worker-ов и количеством созданных в нём классов. Реализация паттерна Одиночка(Singleton)
 *  @class
 *  @method createClass - создаёт класс в Worker
 *  @method removeClass - удаляет класс из Worker по ключу и индексу
 *  @method classMethod - вызывает метод класса в Worker
*/
export default class ThreadManager {
    /** @type {ThreadManager} - сохранить значения присвоенные при первой инициации Singleton*/
    static #instance = null;
    /** @type {Thread[]} - список потоков*/
    #threads = [];

    constructor () {
        // проверяем что значение #instance не равно null (т.е. уже что-то присвоено), и прерываем инструкцию,
        // чтобы в соответствии с принципом Singleton сохранить значения присвоенные при первой инициации.
        if (ThreadManager.#instance) return ThreadManager.#instance;
        ThreadManager.#instance = this;
    }

    #addThread () {
        if (_THREAD_LIMIT <= this.#threads.length) return;

        const thread = new Thread(this.#threads.length);
        this.#threads.push( thread );
    }

    /** создаёт класс в паралельном потоке
     * @param {string} className - название класса
     * @param {Object} params - параметры для класса
     * @param {Function} initialize - функция для обратного вызова при создании
     * @param {Function} callback - функция обратного вызова на слушателя в Worker для события message
    */
    createClass (className, params, initialize, callback) {
        this.#addThread();

        let thread = this.#threads[0];
        let cnt = thread.classCnt;

        //выбираем поток с наименьшим количеством классов
        this.#threads.forEach( item => { 
            if(cnt > item.classCnt) {
                cnt = item.classCnt;
                thread = item;
            }
        });

        thread.createClass(className, params, initialize, callback);
    }

    /** удаление класса в другом потоке
     * @param {number} index - индекс webworker в массиве ThreadManager 
     * @param {string} uuid - ключ по которому обращаемся к классу в webworker
    */
    removeClass (index, uuid) {
        const thread = this.#threads[index];
        thread.removeClass( uuid );
        if (thread.classCnt < 1) {
            thread.clear();
            this.#threads.splice(thread.index, 1);
        }
    }

    /** обращение к методу класса в паралельном потоке
     * @param {number} index - индекс webworker в массиве ThreadManager
     * @param {string} uuid - ключ по которому обращаемся к классу в webworker
     * @param {string} method - метод класса
     * @param {Object} params - параметры для метода
     */
    classMethod (index, uuid, method, params) {
        const thread = this.#threads[index];
        thread.classMethod( uuid, method, params );
    }
}