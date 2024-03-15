import './style.css';
import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import Engine from './src/engine/engine.js';
import Stats from 'three/addons/libs/stats.module.js';

import ParameterizedCharacter from './src/gaming-model/ParameterizedCharacter.js';
import Ground3D from './src/gaming-model/ground.js';
import Animation3D from './src/gaming-model/animations.js';
import HandObject from './src/gaming-model/HandObject.js';

import KeyboardAndMouseForCharacter from './src/model-control/KeyboardAndMouseForCharacter.js';

import { MediatorThreadCharacter } from './src/character/MediatorThread.js';


var data = document.getElementById('data');
var viewWindow = document.getElementById('app');
var onPointerLockClick = document.getElementById('onPointerLockClick');

[ParameterizedCharacter, Animation3D, HandObject].forEach( item => item.load() );

function initialize () {
	var soldier = new ParameterizedCharacter();
	var animations = new Animation3D();
	var akms = new HandObject();

	var engine = new Engine();
	var stats = new Stats();
	viewWindow.appendChild( stats.dom );
	engine.addModel(stats);
	engine.create(viewWindow);

	var transformControls = new TransformControls( engine.camManager.camera, engine.renderManager.domElement );
	transformControls.size = .5;
	transformControls.space = 'world';
	// настройка положения коробки для ИК
	// отключить орбитальные элементы управления при использовании TransformControls
	transformControls.addEventListener( 'mouseDown', () => orbitControls.enabled = false );
	transformControls.addEventListener( 'mouseUp', () => orbitControls.enabled = true );
	engine.scene.add(transformControls);

	var orbitControls = new OrbitControls( engine.camManager.camera, engine.renderManager.domElement );
	orbitControls.minDistance = .3;
	orbitControls.maxDistance = 5;
	orbitControls.enableDamping = true;
	engine.camManager.camera.position.y = 3;
	engine.addModel(orbitControls);

	const ground = new Ground3D;
	engine.scene.add(ground.mesh);

	const userControll = new KeyboardAndMouseForCharacter(soldier, animations.mesh, viewWindow);
	onPointerLockClick.addEventListener( 'click', function (e) {
		userControll.lock();
	} );
	const character = userControll.character;
	engine.addModel(character);
	engine.scene.add(soldier.mesh);
	character.handObject = akms;
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 100 );
	character.FPVcam = camera;
	const helperCam = new THREE.CameraHelper( camera );
	engine.scene.add(helperCam);

	const panel = new GUI( { width: 310 } );
	const weaponShift = {'position X': 0, 'position Y': 0, 'position Z': 0,};
	const weaponShiftVec3 = character.weaponShift;
	const weaponDriverFolder = panel.addFolder( 'WeaponDriver' );
	weaponDriverFolder.add( weaponShift, 'position X', -10, 10, 0.01 ).listen().onChange( size => weaponShiftVec3.x = size );
	weaponDriverFolder.add( weaponShift, 'position Y', -10, 10, 0.01 ).listen().onChange( size => weaponShiftVec3.y = size );
	weaponDriverFolder.add( weaponShift, 'position Z', -10, 10, 0.01 ).listen().onChange( size => weaponShiftVec3.z = size );
	weaponDriverFolder.open();

	//Объявление глобальных переменных для отладки
	window.soldier = soldier;
	window.engine = engine;
	window.character = character;
	window.THREE = THREE;
	window.scene = engine.scene;
	window.akms = akms;
	window.transformControls = transformControls;
	window.animations = animations;
	window.headCam = character.camera;
	window.MediatorThreadCharacter = MediatorThreadCharacter;
}

setTimeout(initialize, 1000);