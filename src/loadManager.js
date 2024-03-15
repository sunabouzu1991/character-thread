import { Cache } from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class LoadManager {
    instance;
    #cache;
    #fbx;
    #gltf;

    constructor () {
        this.#cache = Cache;
        this.#fbx = new FBXLoader();
        this.#gltf = new GLTFLoader ();
    }

    static getInstance() {
        if (!this.instance) this.instance = new LoadManager();

        return this.instance;
    }

    load (type, url, load = ()=> {}, progress = ()=>{}, error = ()=>{}) {
        let value = this.#cache.get(url);

        if ( value === undefined ) {
            if (type === 'fbx') {
                this.#fbx.load(url, (file) => load(url, file), progress, error);
            }
            if ( type === 'gltf' ) {
                this.#gltf.load(url, (file) => load(url, file), progress, error);
            }
        }

        else return value;
    }

    caching (key, file) {
        if ( !this.#cache.get(key) )
            this.#cache.add(key, file);
    }

    clear () {
        this.#cache.clear();
        this.#fbx = undefined;
    }
}