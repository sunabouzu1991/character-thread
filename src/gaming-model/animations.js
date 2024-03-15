import { AnimationClip } from "three";

import AbstractModelSetting from "./ModelSetting";

export default class Animation3D extends AbstractModelSetting {
    static fileType = 'gltf';
    static fileSource = '../../animation/animation.glb';
	static type3D = 'animation';

    constructor() {
        super();
        this.#divideIntoGroups();
    }

    // Разделение анимационных клипов по группам костей(частей тела), основной клип(full body) остаётся
    #divideIntoGroups() {
        let groupClips = [];

        
        this.mesh.forEach(clip => 
            groupClips.push(
                this.#createToClip(clip, 'spine_', ['Spine', 'Spine1', 'Spine2', 'Neck', 'Head']), 
                this.#createToClip(clip, 'hands_', ['Shoulder', 'Arm', 'ForeArm', 'Hand']), 
                this.#createToClip(clip, 'legs_', ['Armature', 'Hips', 'UpLeg', 'Leg', 'Foot', 'ToBase']), 
            )
        );

        this.mesh = groupClips;
    }

    #createToClip (clip, groupName, boneNames) {//AnimationClip, string, []strings
        let tracks = [];

        boneNames.forEach(name => {
            clip.tracks.forEach(track => {
                if (track.name.indexOf(name) > -1)
                    if ( !this.#findByName(tracks, track.name) ) tracks.push(track);
            })
        });

        return new AnimationClip( groupName+clip.name, clip.duration, tracks );
    }

    #findByName (array, name) {
        for (const item of array)
            if (item.name === name) return true;

        return false;
    }
}