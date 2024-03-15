import ModelSetting from "./ModelSetting.js";
import { Vector3 } from "three";

function getBoneIndex(object, skeleton, name){
    var bone = object.getObjectByName(name);
    return skeleton.bones.indexOf(bone);
}


/** @typedef {ParameterizedCharacter} ParameterizedCharacter */

/** параметризованный персонаж
 * @class
 * @property {Object} ikSettings - настройки для Инверсной кинематики
 * @property {Object} handSettings - настройки для контроллера таргетовыми костями
*/
export default class ParameterizedCharacter extends ModelSetting {
    static fileType = 'gltf';
    static fileSource = '../../models/soldier/soldier.gltf';

/*  target — Target bone.
    effector — Effector bone.
    links — An array of Object specifying link bones.
        index — Link bone.
        limitation — (optional-new Vector3( 1, 0, 0 )) Rotation axis. Default is undefined.
        rotationMin — (optional) Rotation minimum limit. Default is undefined.
        rotationMax — (optional) Rotation maximum limit. Default is undefined.
        enabled — (optional) Default is true.
    iteration — (optional) Iteration number of calculation. Smaller is faster but less precise. Default is 1.
    minAngle — (optional) Minimum rotation angle in a step. Default is undefined.
    maxAngle — (optional) Maximum rotation angle in a step. Default is undefined.*/
    #iks = [
        // {
		//     name: 'spine',
        //     target: "mixamorigtarget_spine",
        //     effector: "mixamorigHead",
        //     links: [
        //         {
        //             index: "mixamorigSpine2",
        //             rotationMax: new Vector3( 0, 0, 0 ),
        //             rotationMin: new Vector3( -.32, 0, 0 )
        //         },
        //         {
        //             index: "mixamorigSpine1",
        //             rotationMax: new Vector3( 1, .0062, .6015 ),
        //             rotationMin: new Vector3( 0, -.0062, -.6015 )
        //         }
        //     ],
        //     iteration: 10,
        //     minAngle: 0.0,
        //     maxAngle: .25,
        // },
        {
            name: 'left_hand',
            target: "mixamorigtarget_hand_l",
            effector: "mixamorigLeftHand",
            links: [
                {
                    index: "mixamorigLeftShoulder",
                    rotationMax: new Vector3( 1.46, .3, -.66 ),
                    rotationMin: new Vector3( -.7, -.3, -1.91 )
                },
                {
                    index: "mixamorigLeftArm",
                    rotationMax: new Vector3( 1.61, .4, 1.44 ),
                    rotationMin: new Vector3( 1.32, -.5, -.75 )
                },
                {
                    index: "mixamorigLeftForeArm",
                    rotationMax: new Vector3( .37, .75, 2.56 ),
                    rotationMin: new Vector3( -.45, -.8, -.24 )
                },
            ],
            iteration: 10,
            minAngle: 0.0,
            maxAngle: .25,
        },
        {
            name: 'right_hand',
            target: "mixamorigtarget_hand_r",
            effector: "mixamorigRightHand",
            links: [
                {
                    index: "mixamorigRightShoulder",
                    rotationMax: new Vector3(1.47, .09, 1.99),
                    rotationMin: new Vector3(1.39, -.73, 1.2)
                },
                {
                    index: "mixamorigRightArm",
                    rotationMax: new Vector3( 1.54, .15, .8 ),
                    rotationMin: new Vector3( .08, -.24, -1.72 )
                },
                {
                    index: "mixamorigRightForeArm",
                    rotationMax: new Vector3( .29, 1.4, .1 ),
                    rotationMin: new Vector3( -.18, -.82, -2.56 )
                },
            ],
            iteration: 10,
            minAngle: 0.0,
            maxAngle: .25,
        }
    ];

    #handDriver = {
        headBone: 'mixamorigHead',          // для вращения головы на точку взгляда
        forend: 'mixamorigtarget_hand_l',    // под цевьё
        hilt: 'mixamorigtarget_hand_r',     // под рукоять
        head: 'mixamorigtarget_spine',     // под голову
        aimShoulder: 'shoulder_weapon',  //прицелиться
        aimShoulderShift: new Vector3,
        //fromTheHip: , //от бедра
    };

    cameraSetting = {
        bone: 'bone_camera'
    }

    constructor () {
        super();

        this.settings();
    }

    settings () {
        this.mesh.traverse(obj3D => {
            if (obj3D.name.indexOf('collider') > -1) obj3D.visible = false;
        });


        let skinnedMesh = this.mesh.getObjectByName("shevron_1");
        this.#iks.forEach(item => {
            item.target = getBoneIndex(this.mesh, skinnedMesh.skeleton, item.target);
            item.effector = getBoneIndex(this.mesh, skinnedMesh.skeleton, item.effector);
            item.links.forEach( link => link.index = getBoneIndex(this.mesh, skinnedMesh.skeleton, link.index) );
        });
        this.skinnedMesh = skinnedMesh;
    }

    get ikSettings () {
        return this.#iks;
    }

    get handSettings () {
        return this.#handDriver;
    }
}