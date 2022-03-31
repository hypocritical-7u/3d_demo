import * as THREE from 'three'
import { TextureLoader } from 'three'
import doorRightPic from '../assets/door_left.png'
import ceilTexture from '../assets/ceil.png'
import backTexture from '../assets/back.png'

type Position = {
    x: number,
    y: number,
    z: number
}

const getTexture = (jpg: string) => new TextureLoader().load(jpg)

export class rackModel {

    position: THREE.Vector3;

    constructor(position?: THREE.Vector3) {
        this.position = position || new THREE.Vector3(0, 0, 0);
    }

    // 创建玻璃门
    createSingleDoor(position: Position, name: string) {
        const GlassDoorGeometry = new THREE.BoxGeometry(60, 205, 0)
        GlassDoorGeometry.translate(-30, 0, 0)
        const GlassDoorMaterial = new THREE.MeshBasicMaterial({
            map: getTexture(doorRightPic),
            color: 0xffffff
        })
        GlassDoorMaterial.opacity = 0.7
        GlassDoorMaterial.transparent = true
        const GlassDoor = new THREE.Mesh(GlassDoorGeometry, GlassDoorMaterial)
        GlassDoor.position.set(position.x, position.z, position.y)
        GlassDoor.name = name
        GlassDoor.rotation.y = Math.PI
        return GlassDoor
    }


    createPlane(length: number, width: number, position: Position, name: string, rotation?: Position, material?: string) {
        const planeGemetry = new THREE.PlaneGeometry(width, length)
        const planeMaterial = new THREE.MeshPhongMaterial({ color: material ? material : 0x444444, side: THREE.DoubleSide })
        const plane = new THREE.Mesh(planeGemetry, planeMaterial)
        plane.position.set(position.x, position.y, position.z)
        rotation ? plane.rotation.set(rotation.x, rotation.y, rotation.z) : ''
        plane.name = name
        return plane
    }

    createTexture(length: number, width: number, position: Position, name: string, material: string, rotation?: Position) {
        const planeGemetry = new THREE.PlaneGeometry(width, length)
        const planeMaterial = new THREE.MeshLambertMaterial({ map: getTexture(material), side: THREE.DoubleSide })
        const plane = new THREE.Mesh(planeGemetry, planeMaterial)
        plane.position.set(position.x, position.y, position.z)
        rotation ? plane.rotation.set(rotation.x, rotation.y, rotation.z) : ''
        plane.name = name
        return plane
    }


    initrack() {
        let rack = new THREE.Object3D();
        // rack.add(this.initrackBody());
        const door = this.createSingleDoor({ x: this.position.x + 0, y: this.position.y + 102.5, z: this.position.z + 0 }, 'door')
        const ceil = this.createTexture(120, 60, { x: this.position.x + 30, y: this.position.y + 102.5, z: this.position.z + 45 }, 'ceil', ceilTexture, { x: -0.5 * Math.PI, y: 0, z: 0 })
        const footer = this.createPlane(120, 60, { x: this.position.x + 30, y: this.position.y - 101.5, z: this.position.z + 45 }, 'footer', { x: -0.5 * Math.PI, y: 0, z: 0 })
        const left = this.createPlane(120, 205, { x: this.position.x + 0, y: this.position.y, z: this.position.z + 45 }, 'left', { x: 0, y: 0.5 * Math.PI, z: 0.5 * Math.PI })
        const right = this.createPlane(120, 205, { x: this.position.x + 60, y: this.position.y, z: this.position.z + 45 }, 'right', { x: 0, y: 0.5 * Math.PI, z: 0.5 * Math.PI })
        const back = this.createTexture(205, 60, { x: this.position.x + 30, y: this.position.y, z: this.position.z - 15 }, 'back', backTexture, { x: 0, y: 0, z: 0 })
        rack.add(door)
        rack.add(ceil)
        rack.add(footer)
        rack.add(left)
        rack.add(right)
        rack.add(back)
        return rack;
    }
}