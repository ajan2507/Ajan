import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-computer-canvas',
  standalone: true,
  templateUrl: './computer-canvas.component.html',
  styleUrl: './computer-canvas.component.scss'
})
export class ComputerCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private computer!: THREE.Group;
  private controls!: OrbitControls;
  private animationId!: number;
  private isMobile: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
      setTimeout(() => this.init(), 100);
    }
  }

  private checkMobile() {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    this.isMobile = mediaQuery.matches;
    
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      this.isMobile = event.matches;
      this.updateCameraForMobile();
    };
    
    mediaQuery.addEventListener("change", handleMediaQueryChange);
  }

  private init() {
    const container = this.canvasContainer.nativeElement;
    
    // Scene
    this.scene = new THREE.Scene();

    // Camera - exact same as JSX
    this.camera = new THREE.PerspectiveCamera(
      this.isMobile ? 50 : 25,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    if (this.isMobile) {
      this.camera.position.set(0, 0, 20);
    } else {
      this.camera.position.set(20, 3, 5);
    }

    // Renderer - exact same settings as JSX
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.loadComputerModel();
    this.setupLighting();
    this.setupControls();
    this.animate();
    this.handleResize();
  }

  private loadComputerModel() {
    const loader = new GLTFLoader();
    
    // Try to load the GLTF model (same as JSX)
    loader.load(
      './assets/desktop_pc/scene.gltf', // You'll need to add this model file
      (gltf) => {
        this.computer = gltf.scene;
        
        // Apply exact same settings as JSX
        if (this.isMobile) {
          this.computer.scale.setScalar(0.75);
          this.computer.position.set(0, -3, 0);
          this.computer.rotation.set(0, 0, 0);
        } else {
          this.computer.scale.setScalar(0.75);
          this.computer.position.set(0, -3.25, -1.5);
          this.computer.rotation.set(-0.01, -0.2, -0.1);
        }
        
        this.scene.add(this.computer);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLTF model:', error);
        // Fallback to basic geometry if model fails to load
        this.createFallbackLaptop();
      }
    );
  }

  private createFallbackLaptop() {
    // Fallback laptop model if GLTF fails
    this.computer = new THREE.Group();

    const screenGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 1.25;
    screen.rotation.x = -0.1;
    screen.castShadow = true;

    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 2.8);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.1;
    base.castShadow = true;

    this.computer.add(screen, base);
    this.computer.scale.setScalar(1.5);
    this.computer.position.y = -1;
    this.scene.add(this.computer);
  }

  private setupLighting() {
    // Exact same lighting as JSX
    
    // Hemisphere light (like hemisphereLight in JSX)
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.15);
    this.scene.add(hemisphereLight);

    // Spot light (exact same as JSX)
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-20, 50, 10);
    spotLight.angle = 0.12;
    spotLight.penumbra = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);

    // Point light (exact same as JSX)
    const pointLight = new THREE.PointLight(0xffffff, 1);
    this.scene.add(pointLight);
  }

  private setupControls() {
    // Only setup controls for non-mobile (like JSX)
    if (!this.isMobile) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false;
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minPolarAngle = Math.PI / 2;
      this.controls.autoRotate = true;
      this.controls.enableDamping = true;
    }
  }

  private updateCameraForMobile() {
    if (this.camera) {
      if (this.isMobile) {
        this.camera.fov = 50;
        this.camera.position.set(0, 0, 20);
      } else {
        this.camera.fov = 25;
        this.camera.position.set(20, 3, 5);
      }
      this.camera.updateProjectionMatrix();
    }
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Mobile rotation (like useFrame in JSX)
    if (this.computer && this.isMobile) {
      this.computer.rotation.y += 0.01; // delta * 0.5 equivalent
    }
    
    if (this.controls) {
      this.controls.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize() {
    window.addEventListener('resize', () => {
      const container = this.canvasContainer.nativeElement;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.animationId) cancelAnimationFrame(this.animationId);
      if (this.controls) this.controls.dispose();
      if (this.renderer) this.renderer.dispose();
    }
  }
}
