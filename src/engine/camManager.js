import { PerspectiveCamera, OrthographicCamera } from "three";

export default class CamManager {
    #camera;

    constructor () {
        this.#camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100 );
    }

    get camera () {
        return this.#camera;
    }
}