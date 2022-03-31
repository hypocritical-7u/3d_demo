<template>
    <div id="content">
        <canvas id="three"></canvas>
    </div>
</template>

<script setup lang="ts">
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { rackModel } from '../models/rack'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';


function init() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#ccc')
    const light = new THREE.AmbientLight(0xffffff, 1)
    light.position.set(0, 0, 0)
    // light.castShadow = true;

    const canvas: HTMLCanvasElement = document.querySelector('#three')!

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    // 调整渲染器的大小，阴影显示
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    camera.position.set(2, 30, 700)
    camera.lookAt(scene.position)

    const planeGemetry = new THREE.PlaneGeometry(1000, 1000)
    const planeMaterial = new THREE.MeshPhongMaterial({ color: '#666666' })
    const plane = new THREE.Mesh(planeGemetry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(10, -102.5, 0)


    scene.add(plane)
    scene.add(camera)
    scene.add(light)

    interface mydat {
        addrack: Function
        rotationSpeed: number
    }

    let x = -200;

    const controller: mydat = {
        addrack: function () {
            const rackController = new rackModel(new THREE.Vector3(x, 0, 0))
            const rack = rackController.initrack()
            x += 61;
            rack.position.set(0, 0.5, 0)
            createDragControls([rack])
            scene.add(rack)
        },
        rotationSpeed: 0.01
    }
    const gui = new dat.GUI()
    gui.add(controller, 'addrack')
    // gui.add(controller, 'rotationSpeed', 0, 0.5)

    const orbitControls = new OrbitControls(camera, renderer.domElement)

    orbitControls.autoRotate = true
    // 拖拽

    function createDragControls(objects: THREE.Object3D[]) {
        // console.log(objects[0])
        let originX: number, originY: number, originZ: number, arrayY: number[]
        // 初始化拖拽控件
        var dragControls = new DragControls(objects, camera, renderer.domElement);

        // 开始拖拽
        dragControls.addEventListener('dragstart', function (event) {
            originX = event.object.position.x
            originZ = event.object.position.z
            arrayY = objects[0].children.map(item => item.position.y + 40)
            orbitControls.enabled = false;
        });

        // 拖拽过程
        dragControls.addEventListener('drag', function (event) {

            // 给内部模型位置赋值
            for (let i = 0; i < objects[0].children.length; i++) {
                objects[0].children[i].position.y = arrayY[i]
                if (event.object.name != objects[0].children[i].name) {
                    objects[0].children[i].position.x += event.object.position.x - originX;
                    objects[0].children[i].position.z += event.object.position.z - originZ;
                }
            }
            originX = event.object.position.x
            originZ = event.object.position.z

            dragControlsRender();
        });

        // 拖拽结束
        dragControls.addEventListener('dragend', function (event) {
            arrayY.forEach((item, index) => {
                objects[0].children[index].position.y = item - 40
            })
            orbitControls.enabled = true;
        });
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 0.1)
    directionLight.position.set(0, 200, 0).normalize() // 灯光位于正上方
    scene.add(directionLight)


    function dragControlsRender() {
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate)
        // rack.rotation.x += 0.01;
        // rack.rotation.y += 0.02;
        renderer.render(scene, camera)
    }

    animate()
}
onMounted(() => {
    init()
})

</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

#three {
    width: 100%;
    height: 100%;
}
</style>
