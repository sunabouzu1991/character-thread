/** 
 * @typedef { {spine_: number, hands_: number, legs_: number} } bodyPart - анимации разбитые по частям, number это вес проигываемой части тела 0-1
 * @typedef { string[] } ikOff - список отключяемых ИК связей, указывается ParameterizedCharacter.#iks[0].name связи 
 * @typedef { {name: string, once: Boolean, timeScale: number, bodyPart: bodyPart, ikOff: ikOff} } substate - подсостояние
 * @typedef {State} State
*/


/** State - Абстрактный класс
 * @class
 * @method getSubstate - возвращает подсостояние
*/
class State {
	constructor() {
		if(this.constructor === State)
			throw new Error("Класс State имеет абстрактный тип и не может быть создан.");
		this.#checkMethod();
	}

	#checkMethod () {
		//if(this.Enter == undefined)
			//throw new Error("Метод Enter должен быть реализован")
	}

	/**@param {string} value  @return {substate}*/
	getSubstate (value) {
		let anim;
		if(value === '')
			anim = this.default; //idle
		else
			anim = this[value];

		if (anim)
			return anim;
		else
			console.error(this.constructor.name, value, 'подсостояние не указанно либо отсутствует')
	}
}

// если не указываем bodyPart то анимация проигрывается по имени на всё тело

class Stand extends State {
	walk_forward = { name: "stand_forward_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_backward = { name: "stand_backward_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_left = { name: "stand_left_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_right = { name: "stand_right_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };

	walk_forwardleft = {name: "stand_forwardLeft_walk_rifle"};
	walk_forwardright = {name: "stand_forwardRight_walk_rifle"};
	walk_backwardleft = {name: "stand_backwardLeft_walk_rifle"};
	walk_backwardright = {name: "stand_backwardRight_walk_rifle"};

	run_forward = {name: "stand_forward_quickWalk_rifle"};
	run_backward = {name: "stand_backward_quickWalk_rifle"};
	run_left = {name: "stand_left_quickWalk_rifle"};
	run_right = {name: "stand_right_quickWalk_rifle"};

	run_forwardleft = {name: "stand_forwardLeft_quickWalk_rifle"};
	run_forwardright = {name: "stand_forwardRight_quickWalk_rifle"};
	run_backwardleft = {name: "stand_backwardLeft_quickWalk_rifle"};
	run_backwardright = {name: "stand_backwardRight_quickWalk_rifle"};

	sprint_forward = {name: "stand_forward_sprint_rifle", ikOff: ['spine']};
	sprint_forwardleft = { };
	sprint_forwardright = { };

	jump = { }

	default = { name:"idle_rifle", bodyPart: { spine_: 1, hands_: .2, legs_: 1}, ikOff: ['spine'] }

	constructor() {
		super();
	}
}

class Crouch extends State {
	walk_forward = {name: "crouch_forward_walk_rifle", };
	walk_backward = {name: "crouch_backward_walk_rifle", };
	walk_left = {name: "crouch_left_walk_rifle", };
	walk_right = {name: "crouch_right_walk_rifle", };

	walk_forwardleft = {name: "crouch_forwardLeft_walk_rifle", };
	walk_forwardright = {name: "crouch_forwardRight_walk_rifle", };
	walk_backwardleft = {name: "crouch_backwardLeft_walk_rifle", };
	walk_backwardright = {name: "crouch_backwardRight_walk_rifle", };

	run_forward = {name: "crouch_forward_quickWalk_rifle", };
	run_backward = {name: "crouch_backward_quickWalk_rifle", };
	run_left = {name: "crouch_left_quickWalk_rifle", };
	run_right = {name: "crouch_right_quickWalk_rifle", };

	run_forwardleft = {name: "crouch_forwardLeft_quickWalk_rifle", };
	run_forwardright = {name: "crouch_forwardRight_quickWalk_rifle", };
	run_backwardleft = {name: "crouch_backwardLeft_quickWalk_rifle", };
	run_backwardright = {name: "crouch_backwardRight_quickWalk_rifle", };

	sprint_forward = {name: "stand_forward_sprint_rifle", };

	default = {name:"crouch_idle_rifle", };

	constructor() {
		super();
	}
}

class Prone extends State {
	walk_forward = {name: "prone_forward_walk_rifle",  ikOff: ['spine', 'left_hand']}
	walk_backward = {name: "prone_forward_walk_rifle", timeScale: -1, ikOff: ['spine', 'left_hand']}
	walk_left = {name:"prone_left_walk_rifle",  ikOff: ['spine', 'left_hand']}
	walk_right = {name:"prone_right_walk _rifle",  ikOff: ['spine', 'left_hand']}

	sprint_forward = {name: "prone_forward_sprint_rifle",  ikOff: ['spine', 'left_hand']};

	default = {name:"prone_idle_rifle",  ikOff: ['spine']}

	constructor() {
		super();
	}
}

class Death extends State {
	stand = {once: true,  }
	crouch = {once: true,  }
	prone = {once: true,  }
	drive = {once: true,  }

	default = {once: true,  }

	constructor() {
		super();
	}
}

class Interaction extends State {
	crouch_working = { }

	default = false

	constructor() {
		super();
	}
}

class PosesBehindTheObject extends State {
	ptrk = { }
	ags = { }
	dshk = { }
	bussol = {}
	gaubica = { }
	minomet = { }
	driving = {}
	passenger = {}

	default = {}

	constructor() {
		super();
	}
}

class Transitions extends State {
	crouch_stand = {name:"idle_rifle", once: true}
	crouch_prone = {name:"crouch_to_prone_rifle", once: true, ikOff: ['spine']}

	prone_crouch = {name:"prone_to_crouch_rifle", once: true, ikOff: ['spine']}
	prone_stand = {name:"prone_to_crouch_rifle", once: true, ikOff: ['spine']}

	stand_crouch = {name:"crouch_idle_rifle", once: true, ikOff: ['spine']}
	stand_prone = {name:"crouch_to_prone_rifle", once: true, ikOff: ['spine']}

	constructor() {
		super();
	}
}


/** @type {Object.<keyof, State>} */
const states = {
    stand: Stand,
    crouch: Crouch,
    prone: Prone,
    death: Death,
    interaction: Interaction,
    forVehicle: PosesBehindTheObject,
    posechange: Transitions
};

export default states