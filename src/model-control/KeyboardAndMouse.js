export default class KeyboardAndMouse {//Abstract class
	domElement;
	isLocked = false;

    constructor (domElement) {
		if(this.constructor === KeyboardAndMouse)
			throw new Error("Класс KeyboardAndMouse имеет абстрактный тип и не может быть создан.");
		this.#checkMethod();

		this.domElement = domElement;

		this._onMouseMove = Mouse.bind( this );
		this._onMouseDown = Mouse.bind( this );
		this._onMouseUp = Mouse.bind( this );
		this._onKeyDown = Keyboard.bind( this );
		this._onKeyUp = Keyboard.bind( this );
		this._onPointerlockChange = Pointerlock.bind( this );
		this._onPointerlockError = Pointerlock.bind( this );

		this.#connect();
    }

	#checkMethod () {
		if(this._KeyDown == undefined)
			throw new Error("Метод _KeyDown должен быть реализован")
		
		if(this._KeyUp == undefined)
			throw new Error("Метод _KeyUp должен быть реализован")
		
		if(this._MouseMove == undefined)
			throw new Error("Метод _MouseMove должен быть реализован")
		
		if(this._MouseDown == undefined)
			throw new Error("Метод _MouseDown должен быть реализован")
		
		if(this._MouseUp == undefined)
			throw new Error("Метод _MouseUp должен быть реализован")
	}

	#connect () {
		this.domElement.ownerDocument.addEventListener( 'mousemove', this._onMouseMove );
		this.domElement.ownerDocument.addEventListener( 'mousedown', this._onMouseDown );
		this.domElement.ownerDocument.addEventListener( 'mouseup', this._onMouseUp );
		this.domElement.ownerDocument.addEventListener( 'keydown', this._onKeyDown );
		this.domElement.ownerDocument.addEventListener( 'keyup', this._onKeyUp );
		this.domElement.ownerDocument.addEventListener( 'pointerlockchange', this._onPointerlockChange );
		this.domElement.ownerDocument.addEventListener( 'pointerlockerror', this._onPointerlockError );
	}

	disconnect () {
		this.domElement.ownerDocument.removeEventListener( 'mousemove', this._onMouseMove );
		this.domElement.ownerDocument.removeEventListener( 'mousedown', this._onMouseDown );
		this.domElement.ownerDocument.removeEventListener( 'mouseup', this._onMouseUp );
		this.domElement.ownerDocument.removeEventListener( 'keydown', this._onKeyDown );
		this.domElement.ownerDocument.removeEventListener( 'keyup', this._onKeyUp );
		this.domElement.ownerDocument.removeEventListener( 'pointerlockchange', this._onPointerlockChange );
		this.domElement.ownerDocument.removeEventListener( 'pointerlockerror', this._onPointerlockError );
	}

	lock() {
		this.domElement.requestPointerLock();
	}

	unlock() {
		this.domElement.ownerDocument.exitPointerLock();
	}

	pointerlockChange () {
		this.isLocked = this.domElement.ownerDocument.pointerLockElement === this.domElement;
	}

	pointerlockError() {
		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );
	}
}



function Keyboard (event) {
	if ( this.isLocked === false ) return;

	if (event.type === 'keydown') this._KeyDown(event);
	else if (event.type === 'keyup') this._KeyUp(event);
}

function Mouse (event) {
	if ( this.isLocked === false ) return;

	if (event.type === 'mousemove') this._MouseMove(event);
	else if (event.type === 'mousedown') this._MouseDown(event)
	else if (event.type === 'mouseup') this._MouseUp(event)
}

function Pointerlock (event) {
	if (event.type === 'pointerlockchange') this.pointerlockChange();
	else if (event.type === 'pointerlockerror') this.pointerlockError();
}