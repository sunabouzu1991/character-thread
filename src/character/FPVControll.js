import { Euler, Vector3, Object3D } from 'three';

const vec3 = new Vector3;
const _PI_2 = Math.PI / 2;
const _euler = new Euler( 0, 0, 0, 'YXZ' );

/**управление поворотом FPV камеры
 * @class
 * @property {number} minPolarAngle - минимальный угол поворота по оси X
 * @property {number} maxPolarAngle - максимальный угол поворота по оси X
 * @property {number} pointerSpeed - коэффициэнт скорости вращения
 * @method camRotate - вращение FPV камеры по экранным координатам
 * @method aimPoint - точка находящаяся в направление взгляда камеры
 * @method update - обновление свойств Класса
*/
export default class FPVControll {
	// Установите ограничение наклона камеры. Диапазон от 0 до радиан Math.PI.
	minPolarAngle = (30/180)*Math.PI; // radians
	maxPolarAngle = (150/180)*Math.PI; // radians
	pointerSpeed = 1.0;

	/**@type {Object3D} - коробка для камеры*/
	#camBox
	/**@type {Object3D} - точка в направление взгляда камеры*/
	#point;
	/**@type {Object3D} - объект для позиционирования камеры*/
	#attach;
	/**@type {Object3D} - Родительское пространство камеры*/
	#box;


	/** @param {ParameterizedCharacter} model*/
    constructor (model) {
		this.#camBox = new Object3D;
		this.#camBox.name = 'FPVControll.camBox';
		this.#box = model.mesh;
		this.#attach = model.mesh.getObjectByName(model.cameraSetting.bone);
		this.#box.add(this.#camBox);
		this.#targetPoint();
    }

	#targetPoint () {
		this.#point = new Object3D;
		this.#camBox.add(this.#point);
		this.#point.name = 'FPVControll.point';

		this.#getCameraDirection(vec3);
		vec3.multiplyScalar(10);
		this.#point.position.copy(vec3);
	}

	/** @param {Vector3} v  @return {Vector3} v  */
	#getCameraDirection( v ) {
		return v.set( 0, 0, - 1 ).applyQuaternion( this.#camBox.quaternion );
	}

	/**@param {number} x  @param {number} y */
	camRotate (x, y) {
		const camera = this.#camBox;
		_euler.setFromQuaternion( camera.quaternion );

		_euler.y -= x * 0.002 * this.pointerSpeed;
		_euler.x -= y * 0.002 * this.pointerSpeed;

		_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

		camera.quaternion.setFromEuler( _euler );
	}

    update () {
		vec3.setScalar(0);
		this.#attach.localToWorld(vec3);
		this.#box.worldToLocal(vec3);

		this.#camBox.position.copy(vec3);
    }

	/**@return {Vector3}*/
	get aimPoint () {
		return vec3.setFromMatrixPosition(this.#point.matrixWorld);
	}

	/**@param {Object3D} value  */
	set camera (value) {
		if (this.#camBox.children.length > 0)
			this.#camBox.children.forEach(child => {
				if (child.name !== 'FPVControll.point') child.removeFromParent()
			});
		this.#camBox.add(value)
	}
}