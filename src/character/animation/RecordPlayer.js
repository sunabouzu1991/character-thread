import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, SkinnedMesh } from "three";

/**
 * @typedef {import('./states.js').bodyPart} bodyPart
*/

/** 
 * @class
 * @property {RecordPlayer} player
 * @property {string} action
 * @property {number} timeScale
 * @method setAction - указываем настройки для проигрывания анимации
 */
class PartBodyAnimation {
	/**@type {RecordPlayer} */
	player;
	/**@type {string} */
	action;
	/**@type {number} */
	timeScale;

	/**@param {RecordPlayer} player  */
	constructor (player) {
		this.player = player;
	}

	/**
	 * @param {string} name @param {boolean} once @param {number} timeScale 
	 * @param {number} duration @param {number} [weight=1] */
	setAction (name, once, timeScale, duration, weight = 1) {
		if (name === this.action && this.timeScale === timeScale) return;

		const previousAction = this.player.getActionByName(this.action);
		const action = this.player.getActionByName(name);

		this.timeScale = timeScale;
		this.action = name;

		//проигрывание с остановкой на последнем кадре
		if (once === true) {
			action.clampWhenFinished = true;
			action.loop = LoopOnce;
		}

		if ( previousAction !== undefined ) 
			previousAction.fadeOut( duration );

		if ( action !== undefined && weight !== 0)
			action.reset()
				.setEffectiveTimeScale( timeScale )
				.setEffectiveWeight( weight )
				.fadeIn( duration )
				.play();
	}

	clear () {
		this.player = undefined;
		this.action = undefined;
		this.timeScale = undefined;
	}
}


/**
 * @class
 * @method fadeToAction - посылаем настройки подсостояния для проигрывания анимации
 */
export default class RecordPlayer {
	/**@type {AnimationMixer}*/
	#mixer;
	/** @type {Object.<string, AnimationAction>} */
	#actions = {};

	/** @type {Function} */
	#callback;

	/** @type {setInterval} */
	#interval;

	/** @type {number} */
	#duration;

	/** @type {Map<string, PartBodyAnimation>} */
	#bodyActions = new Map ([
		['spine_' , undefined],
		['hands_' , undefined],
		['legs_' , undefined]
	]);

	/** @param {SkinnedMesh} object  @param {AnimationClip[]} animations  @param {Function} callback */
	constructor (object, animations, callback) {
		//объект с анимациями
		this.#mixer = new AnimationMixer(object);

		//заполняем массив клипами
	    for (var i = 0; i < animations.length; i ++) {
	        var clip = animations[i];
	        var action = this.#mixer.clipAction(clip);
	        this.#actions[clip.name] = action;
	    }

		this.#callback = callback;

		for ( const [key, value] of this.#bodyActions )
			this.#bodyActions.set( key, new PartBodyAnimation(this) );
	}

	/**
	 * @param {string} name  @param {bodyPart} bodyPart  @param {boolean} once  
	 * @param {number} [timeScale=1]  @param {number} [duration=0.4]
	*/
    fadeToAction (name, bodyPart, once, timeScale = 1, duration = 0.4) {
		if (this.#interval === undefined) {
			this.#interval = setInterval(this.#callback, duration*1000);
			this.#duration = duration;
		}
		else if (this.#duration !== duration) {
			clearInterval(this.#interval);
			this.#interval = setInterval(this.#callback, duration*1000);
			this.#duration = duration;
		}

		if (bodyPart)
			for ( const [key, value] of this.#bodyActions ) {
				if (bodyPart[key] !== undefined) 
					value.setAction(key+name, once, timeScale, duration, bodyPart[key]);
			}
		else
			for ( const [key, value] of this.#bodyActions ) {
				value.setAction(key+name, once, timeScale, duration);
			}
    }

	/**
	 * @param {string} value 
	 * @return {AnimationAction}
	 */
	getActionByName (value) {
		if(this.#actions[value] === undefined) {
			console.error(this.constructor.name ,`Анимация: ${value} отсутствует`);
			return undefined;
		}

		return this.#actions[value];
	}

	update (dt) {
		this.#mixer.update(dt);
	}

	clear () {
		for ( const [key, value] of this.#bodyActions ) value.clear();

		this.#mixer = undefined;
		this.#actions = undefined;
		this.#bodyActions = undefined;
		this.#callback = undefined;
		this.#interval = undefined;
		this.#duration = undefined;
	}
}