import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-earth-canvas',
  standalone: true,
  templateUrl: './earth-canvas.component.html',
  styleUrl: './earth-canvas.component.scss'
})
export class EarthCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private earth!: THREE.Mesh;
  private clouds!: THREE.Mesh;
  private stars!: THREE.Points;
  private animationId!: number;
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initThreeJS();
      this.createEarth();
      this.createClouds();
      this.createStars();
      this.setupEventListeners();
      this.animate();
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
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

  private initThreeJS() {
    // Ensure container has dimensions
    const container = this.canvasContainer.nativeElement;
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      // Set default dimensions if container has no size
      container.style.width = '100%';
      container.style.height = '400px';
    }

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.setZ(5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0); // Transparent background

    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private createEarth() {
    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // Earth textures (using procedural approach for now)
    const earthTexture = this.createEarthTexture();
    const bumpTexture = this.createBumpTexture();
    const specularTexture = this.createSpecularTexture();

    // Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.05,
      specularMap: specularTexture,
      specular: new THREE.Color(0x444444),
      shininess: 100
    });

    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.earth.castShadow = true;
    this.earth.receiveShadow = true;
    this.scene.add(this.earth);
  }

  private createClouds() {
    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const cloudTexture = this.createCloudTexture();

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.3
    });

    this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.scene.add(this.clouds);
  }

  private createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);
  }

  private createEarthTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    // Create a simple earth-like texture
    const gradient = context.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#0066cc');
    gradient.addColorStop(0.3, '#003d7a');
    gradient.addColorStop(0.6, '#2d5016');
    gradient.addColorStop(0.8, '#4a7c59');
    gradient.addColorStop(1, '#87ceeb');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);

    // Add some landmass-like shapes
    context.fillStyle = '#8B4513';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = Math.random() * 20 + 5;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  private createBumpTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    context.fillStyle = '#888888';
    context.fillRect(0, 0, 512, 256);

    // Add noise for bump effect
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const brightness = Math.random() * 255;
      context.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      context.fillRect(x, y, 2, 2);
    }

    return new THREE.CanvasTexture(canvas);
  }

  private createSpecularTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    // Water areas should be more reflective
    context.fillStyle = '#000066';
    context.fillRect(0, 0, 512, 256);

    return new THREE.CanvasTexture(canvas);
  }

  private createCloudTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    // Transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, 512, 256);

    // Add white clouds
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = Math.random() * 30 + 10;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  private setupEventListeners() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onMouseMove = (event: MouseEvent) => {
    this.mouseX = (event.clientX - window.innerWidth / 2) / 100;
    this.mouseY = (event.clientY - window.innerHeight / 2) / 100;
  };

  private onWindowResize = () => {
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Smooth mouse interaction
    this.targetX = this.mouseX * 0.001;
    this.targetY = this.mouseY * 0.001;

    // Auto rotation
    if (this.earth) {
      this.earth.rotation.y += 0.005;
      this.earth.rotation.x += this.targetY * 0.5;
      this.earth.rotation.y += this.targetX * 0.5;
    }

    if (this.clouds) {
      this.clouds.rotation.y += 0.007;
      this.clouds.rotation.x += this.targetY * 0.3;
      this.clouds.rotation.y += this.targetX * 0.3;
    }

    if (this.stars) {
      this.stars.rotation.x += 0.0005;
      this.stars.rotation.y += 0.0005;
    }

    this.renderer.render(this.scene, this.camera);
  };
}
