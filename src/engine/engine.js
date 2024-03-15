import { Scene, Color } from "three";
import { Timer } from 'three/addons/misc/Timer.js';

import LightManager from "./lightManager";
import RenderManager from "./renderManager";
import CamManager from "./camManager";


export default class Engine {
    scene;
    camManager;
    lightManager;
    renderManager;

    #models = [];
    #timer;

    constructor () {
        this.scene = new Scene();
        this.#timer = new Timer();

        this.lightManager = new LightManager();
        this.renderManager = new RenderManager( () => this.#loop() );
        this.camManager = new CamManager();

        window.addEventListener( 'resize', () => this.#onWindowResize(), false );
    }

    #onWindowResize() {
        this.renderManager.resize( window.innerWidth, window.innerHeight );
    }

    #loop (timestamp) {
        // timestamp is optional
        this.#timer.update( timestamp );

        const delta = this.#timer.getDelta()

        if (this.#models.length > 0) 
            this.#models.forEach( model => model.update(delta) );
    }

//#region Facade
    create (domElement) {
        this.scene.background = new Color( 0xe0e0e0 );
        this.renderManager.camera = this.camManager.camera;
        this.renderManager.scene = this.scene;
        domElement.appendChild( this.renderManager.domElement );
        this.scene.add(this.lightManager.light);

        this.renderManager.start();
    }

    addModel (model) {
        this.#models.push(model);
    }
//#endregion Facade

    changeViewCam (camera) {
        if (camera) this.renderManager.camera = camera;
        else this.renderManager.camera = this.camManager.camera;
    }
}