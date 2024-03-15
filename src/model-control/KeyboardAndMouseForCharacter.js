import KeyboardAndMouse from './KeyboardAndMouse.js';
import Character from '../character/Character.js';

export default class KeyboardAndMouseForCharacter extends KeyboardAndMouse {
	#keyboard = {
		87: 'forward',//w
		83: 'backward',//s
		65: 'left',//a
		68: 'right',//d
		16: 'sprint',//shift
		90: 'prone',//z
		88: 'crouch',//x
		67: 'stand',//c
	};

    constructor (model, animations, domElement) {
        super (domElement);
		
		this.driven = new CharacterControll(model, animations);
    }

	_MouseMove (event) {
		const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		this.driven.camRotate(movementX, movementY);
	}

    _MouseDown(event) {}
    
    _MouseUp(event) {}

	_KeyDown (event) {
		var action = this.#keyboard[event.keyCode];

		switch (action) {
			case 'forward':
				this.driven.y = 1;
				break;
			case 'backward':
				this.driven.y = -1;
				break;
			case 'left':
				this.driven.x = -1;
				break;
			case 'right':
				this.driven.x = 1;
				break;

			case 'sprint':
				this.driven.sprint = true;
				break;

			default:
    			console.log('down keyCode', event.keyCode);
		}
	}

	_KeyUp (event) {
		var action = this.#keyboard[event.keyCode];

		switch (action) {
			case 'forward':
			case 'backward':
				this.driven.y = 0;
				break;
			case 'left':
			case 'right':
				this.driven.x = 0;
				break;

			case 'sprint':
				this.driven.sprint = false;
				break;

			case 'prone':
				this.driven.prone();
				break;

			case 'crouch':
				this.driven.crouch();
				break;

			case 'stand':
				this.driven.stand();
				break;

			default:
    			console.log('up keyCode', event.keyCode);
		}
	}

	get character () {
		return this.driven.character;
	}
}


class CharacterControll {
	camera;
	targetPoint;

	#controll;

	#speed; //walk, run, sprint
	#dir = {x: 0, y: 0};
	#pose = {
		stand: true, 
		crouch: false, 
		prone: false
	};

	constructor (model, animations) {
		this.callback = () => this.updateState();

		this.#controll = new Character( model, animations, this.callback );
		this.#controll.setState('stand');
		this.#controll.setSubState('default');
	}

	#setState (pose) {
		if (this.#pose[pose] === true) return

		for( const key in this.#pose )
			this.#pose[key] = false
		this.#pose[pose] = true;
	}

	#subState () {
		var dir = '';
		if (this.#dir.y > 0) dir += 'forward';
		else if (this.#dir.y < 0) dir += 'backward';
		if (this.#dir.x > 0) dir += 'right';
		else if (this.#dir.x < 0) dir += 'left';

		var action;
		if (dir === '') action = 'default';
		else action = 'walk_'+dir;

		return action;
	}

	updateState () {
		let pose; 
		for( const [key, value] of Object.entries(this.#pose) )
			if (value === true) pose = key;
		this.#controll.setState(pose);

		const action = this.#subState();
		this.#controll.setSubState(action);
	}

//#region keyboard&mouse inputs
	set x (value) {
		if (value !== this.#dir.x)
			this.#dir.x = value;

			//this.updateState();
	}

	set y (value) {
		if (value !== this.#dir.y)
			this.#dir.y = value;

			//this.updateState();
	}

	set sprint (value) {// boolean
		this.#speed = value;

		//this.updateState();
	}

	stand () {
		this.#setState('stand');

		//this.updateState();
	}

	crouch () {
		this.#setState('crouch');

		//this.updateState();
	}

	prone () {
		this.#setState('prone');

		//this.updateState();
	}

	camRotate (x, y) {//mousemove
		this.#controll.camRotate(x, y);
	}
//#endregion keyboard&mouse inputs

	get character() {
		return this.#controll;
	}
}