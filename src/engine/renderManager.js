import { WebGLRenderer } from "three";

export default class RenderManager {
    #render;
    #scene;
    #camera;
    #engineLoop;
    #tanFOV;
    #windowHeight;


    constructor (engineLoop) {
        this.#engineLoop = engineLoop;
        this.#render = new WebGLRenderer( { antialias: true, logarithmicDepthBuffer: true } );
        this.#render.setPixelRatio( window.devicePixelRatio );
        this.#render.setSize( window.innerWidth, window.innerHeight );
    }

    resize (width, height) {
        this.#render.setSize( width, height );

        this.#camera.aspect = width / height;
        // корректируем поле зрения
        this.#camera.fov = ( 360 / Math.PI ) * Math.atan( this.#tanFOV * ( height / this.#windowHeight ) );
        this.#camera.updateProjectionMatrix();
    }

    #loop () {
        this.#engineLoop();
        this.#render.render( this.#scene, this.#camera );
        this.#render.setAnimationLoop( () => this.#loop() );
    }

    start () {
        this.#loop();
    }

    set scene (value) {
        this.#scene = value;
    }

    set camera (value) {
        this.#camera = value;
        
        // запомните эти начальные значения
        this.#tanFOV = Math.tan( ( ( Math.PI / 180 ) * this.#camera.fov / 2 ) );
        this.#windowHeight = window.innerHeight;
    }

    get domElement () {
        return this.#render.domElement;
    }
}