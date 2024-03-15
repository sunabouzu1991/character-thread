import { Group ,Mesh, PlaneGeometry, MeshPhongMaterial, GridHelper } from "three";

export default class Ground3D {
    #group;

    constructor () {
        this.#group = new Group;

	    const ground = new Mesh( new PlaneGeometry( 2000, 2000, 20, 20 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
        ground.rotation.x = - Math.PI / 2;
        this.#group.add(ground);
        
        const grid = new GridHelper( 200, 40, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.#group.add(grid);
    }

    get mesh () {
        return this.#group;
    }
}