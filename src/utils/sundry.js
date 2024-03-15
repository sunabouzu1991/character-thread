import { Quaternion, Euler } from "three";

var quanternion = new Quaternion;
var euler = new Euler;
var order = ['x', 'y', 'z']

export function minMaxRotByClips (clips, bones, step = 4) {
    let result = [];
    
    for (let k = 0; k < bones.length; k++) {
        let minVec = [0,0,0];
        let maxVec = [0,0,0];

        for (let i = 0; i < clips.length; i++) {
            let clip = clips[i];

            for (let j = 0; j < clip.tracks.length; j++) {
                let track = clip.tracks[j];

                if (track.name === bones[k]) {
                    for(let l = 0; l < track.values.length; l += step) {
                        quanternion.set(track.values[l], track.values[l+1], track.values[l+2], track.values[l+3]);
                        euler.setFromQuaternion(quanternion);

                        for (let m = 0; m < 3; m++) {
                            let value = euler[order[m]];
                            if (value > maxVec[m]) maxVec[m] = value;
                            if (value < minVec[m]) minVec[m] = value;
                        }
                    }
                }

            }
        }

        result.push({ name: bones[k], min: minVec, max: maxVec})
    }

    return result;
}