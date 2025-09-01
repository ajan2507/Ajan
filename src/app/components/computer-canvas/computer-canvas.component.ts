import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-computer-canvas',
  standalone: true,
  templateUrl: './computer-canvas.component.html',
  styleUrl: './computer-canvas.component.scss'
})
export class ComputerCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private computer!: THREE.Group;
  private controls!: OrbitControls;
  private animationId!: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    console.log('ComputerCanvas ngOnInit - Platform check:', isPlatformBrowser(this.platformId));
  }

  ngAfterViewInit() {
    console.log('ComputerCanvas ngAfterViewInit - Platform check:', isPlatformBrowser(this.platformId));
    if (isPlatformBrowser(this.platformId)) {
      // Add a slight delay to ensure DOM is fully rendered
      setTimeout(() => {
        console.log('Initializing Three.js...');
        try {
          this.initThreeJS();
          this.createComputer();
          this.setupLighting();
          this.setupControls();
          this.animate();
          console.log('Three.js initialization complete');
        } catch (error) {
          console.error('Error initializing Three.js:', error);
        }
      }, 100);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
      if (this.controls) {
        this.controls.dispose();
      }
    }
  }

  private initThreeJS() {
    console.log('initThreeJS called');
    const container = this.canvasContainer.nativeElement;
    console.log('Container element:', container);
    console.log('Container dimensions:', container.clientWidth, 'x', container.clientHeight);
    
    // Create scene
    this.scene = new THREE.Scene();
    console.log('Scene created');

        // Create camera positioned much closer for huge laptop
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(8, 4, 8); // Closer to see the huge laptop
    this.camera.lookAt(0, 0, 0);
    console.log('Camera created at position:', this.camera.position);

    // Create renderer with shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    console.log('Renderer created, appending to container');
    container.appendChild(this.renderer.domElement);
    console.log('Canvas appended to DOM');
  }

  private createComputer() {
    console.log('Creating realistic laptop model...');
    this.computer = new THREE.Group();

    // Laptop Base (bottom part) - bigger and brighter
    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 3);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x5a6c7d, // Lighter color
      shininess: 200,
      emissive: 0x1a1a1a // Slight glow
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, -0.85, 0);

    // Laptop Screen (top part) - bigger and brighter
    const screenGeometry = new THREE.BoxGeometry(4, 2.5, 0.15);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6c7a89, // Lighter color
      shininess: 200,
      emissive: 0x1a1a1a // Slight glow
    });
    const screenBack = new THREE.Mesh(screenGeometry, screenMaterial);
    screenBack.position.set(0, 0, -1.3);
    screenBack.rotation.x = -0.1; // Slight tilt

    // Screen Display (the actual screen) - brighter
    const displayGeometry = new THREE.PlaneGeometry(3.6, 2.1);
    const displayMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      emissive: 0x444444 // Much brighter screen
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 0, -1.2);
    display.rotation.x = -0.1;

    // Keyboard area - bigger
    const keyboardGeometry = new THREE.PlaneGeometry(3.4, 2.2);
    const keyboardMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2c3e50 
    });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, -0.78, 0.9);
    keyboard.rotation.x = -Math.PI / 2;

    // Individual keys (simplified grid) - bigger keys
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const keyGeometry = new THREE.BoxGeometry(0.2, 0.03, 0.2);
        const keyMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x34495e 
        });
        const key = new THREE.Mesh(keyGeometry, keyMaterial);
        key.position.set(
          (col - 5.5) * 0.25,
          -0.75,
          (row - 1.5) * 0.25 + 0.4
        );
        this.computer.add(key);
      }
    }

    // Trackpad - bigger
    const trackpadGeometry = new THREE.PlaneGeometry(1.2, 0.8);
    const trackpadMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a252f 
    });
    const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
    trackpad.position.set(0, -0.77, 1.6);
    trackpad.rotation.x = -Math.PI / 2;

    // Apple logo (simple circle) - bigger
    const logoGeometry = new THREE.CircleGeometry(0.2, 16);
    const logoMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x999999,
      emissive: 0x333333
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0.8, -1.15);
    logo.rotation.x = -0.1;

    // Hinges - bigger
    const hingeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 4);
    const hingeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2c3e50 
    });
    const hinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
    hinge.position.set(0, -0.77, -1.3);
    hinge.rotation.z = Math.PI / 2;

    this.computer.add(base, screenBack, display, keyboard, trackpad, logo, hinge);
    
    // HUGE scaling to make it very visible
    this.computer.scale.setScalar(3.5); // Much bigger!
    this.computer.position.set(0, -0.5, 0); // Move down slightly
    this.computer.rotation.set(0, 0.3, 0); // Slight angle for better view

    this.scene.add(this.computer);
    console.log('Realistic laptop model created and added to scene');
  }

  private setupLighting() {
    console.log('Setting up professional lighting...');
    
    // Ambient light (soft overall illumination)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (like sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Fill light (softer from opposite side)
    const fillLight = new THREE.DirectionalLight(0x8ec5ff, 0.3);
    fillLight.position.set(-3, 2, 3);
    this.scene.add(fillLight);

    // Key light (spotlight for dramatic effect)
    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(0, 8, 4);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    this.scene.add(spotLight);

    console.log('Professional lighting setup complete');
  }

  private setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5; // Slower, more elegant rotation
    this.controls.enableZoom = false; // Disable zoom for cleaner UX
    this.controls.enablePan = false; // Disable panning
    this.controls.minPolarAngle = Math.PI / 6; // Limit vertical rotation
    this.controls.maxPolarAngle = Math.PI / 2;
    console.log('Professional controls setup complete');
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
