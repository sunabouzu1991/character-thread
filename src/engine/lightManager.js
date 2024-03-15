import { AmbientLight, HemisphereLight } from "three";

export default class LightManager {
    #light;

    constructor () {
        this.#light = new HemisphereLight(0xffffff, 8);
        this.#light.position.set( 0, 20, 0 );
    }

    get light () {
        return this.#light;
    }
}