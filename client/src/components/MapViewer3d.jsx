import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Package, Calendar, MapPin } from 'lucide-react';

const MapViewer3D = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const characterRef = useRef(null);
  const terrainRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const textureCanvasRef = useRef(null);
  const joystickRef = useRef(null);
  const joystickHandleRef = useRef(null);
  const foodModelsRef = useRef([]);
  const raycasterRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const popupSpriteRef = useRef(null);
  
  const [position, setPosition] = useState({ lat: 1.3521, lng: 103.8198 });
  const [isMoving, setIsMoving] = useState(false);
  const [heading, setHeading] = useState(0);
  const [joystickActive, setJoystickActive] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      title: 'Fresh Vegetables',
      description: 'Assorted fresh vegetables from local farm',
      quantity: '5 kg',
      location: 'Marina Bay, Singapore',
      position: { x: 5, z: 8 },
      expiryDate: '2024-12-20',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
    },
    {
      id: 2,
      title: 'Cooked Rice',
      description: 'Freshly cooked white rice, ready to eat',
      quantity: '10 servings',
      location: 'Orchard Road, Singapore',
      position: { x: -8, z: -5 },
      expiryDate: '2024-12-14',
      imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400'
    },
    {
      id: 3,
      title: 'Bread Loaves',
      description: 'Whole wheat bread, baked this morning',
      quantity: '3 loaves',
      location: 'Chinatown, Singapore',
      position: { x: -3, z: 10 },
      expiryDate: '2024-12-15',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
    },
    {
      id: 4,
      title: 'Fresh Fruits',
      description: 'Bananas, apples, and oranges',
      quantity: '2 kg',
      location: 'Sentosa, Singapore',
      position: { x: 12, z: -8 },
      expiryDate: '2024-12-18',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'
    }
  ]);
  
  const velocityRef = useRef({ x: 0, z: 0 });
  const worldOffsetRef = useRef({ x: 0, z: 0 });
  const joystickPositionRef = useRef({ x: 0, y: 0 });
  const collisionCooldownRef = useRef(0);

  const createFallbackCharacter = (scene) => {
    const characterGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b6b,
      roughness: 0.7,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.position.y = 0.8;
    characterGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd93d,
      roughness: 0.6,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.castShadow = true;
    head.position.y = 1.5;
    characterGroup.add(head);
    
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 1.55, 0.2);
    characterGroup.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 1.55, 0.2);
    characterGroup.add(rightEye);
    
    characterGroup.userData = { 
      animationTime: 0,
      bobAmount: 0.05,
      bobSpeed: 12
    };
    
    scene.add(characterGroup);
    characterRef.current = characterGroup;
  };

  const createFoodModels = (scene) => {
    foodModelsRef.current.forEach(model => {
      scene.remove(model);
    });
    foodModelsRef.current = [];

    foodItems.forEach((foodItem) => {
      const foodGroup = new THREE.Group();
      foodGroup.position.set(foodItem.position.x, 0, foodItem.position.z);
      
      const pinGroup = new THREE.Group();
      const pinColor = 0xFF6B6B;
      
      const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.3
      });
      const headMesh = new THREE.Mesh(headGeometry, headMaterial);
      headMesh.position.y = 1.0;
      headMesh.castShadow = true;
      pinGroup.add(headMesh);
      
      const stickGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8);
      const stickMaterial = new THREE.MeshStandardMaterial({
        color: pinColor,
        roughness: 0.6,
        metalness: 0.2
      });
      const stickMesh = new THREE.Mesh(stickGeometry, stickMaterial);
      stickMesh.position.y = 0.5;
      stickMesh.castShadow = true;
      pinGroup.add(stickMesh);
      
      const pointGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
      const pointMaterial = new THREE.MeshStandardMaterial({
        color: pinColor,
        roughness: 0.6,
        metalness: 0.2
      });
      const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      pointMesh.position.y = 0;
      pointMesh.rotation.x = Math.PI;
      pointMesh.castShadow = true;
      pinGroup.add(pointMesh);
      
      foodGroup.add(pinGroup);
      
      foodGroup.userData = {
        foodItem: foodItem,
        animationTime: Math.random() * Math.PI * 2,
        baseY: 0,
        isFood: true,
        collisionRadius: 0.8
      };
      
      scene.add(foodGroup);
      foodModelsRef.current.push(foodGroup);
    });
  };

  const drawPopupCanvas = (ctx, canvas, food) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 20;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    const radius = 20;
    
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    ctx.beginPath();
    ctx.roundRect(padding, padding, width, height - 40, radius);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - padding);
    ctx.lineTo(canvas.width / 2 - 20, canvas.height - padding - 40);
    ctx.lineTo(canvas.width / 2 + 20, canvas.height - padding - 40);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(food.title, padding + 20, padding + 50);
    
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    const maxWidth = width - 40;
    wrapText(ctx, food.description, padding + 20, padding + 90, maxWidth, 28);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`📦 ${food.quantity}`, padding + 20, padding + 180);
    
    if (food.expiryDate) {
      ctx.fillText(`📅 ${new Date(food.expiryDate).toLocaleDateString()}`, padding + 20, padding + 215);
    }
    
    ctx.fillText(`📍 ${food.location}`, padding + 20, padding + 250);
  };
  
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const createMapTerrain = (scene) => {
    const terrainSize = 50;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 64, 64);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    textureCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#B8E994';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#6BCF7F';
    ctx.lineWidth = 3;
    for (let i = 0; i < canvas.width; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.9,
      metalness: 0
    });
    
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);
    terrainRef.current = terrain;
    
    loadMapImage();
  };
  
  const loadMapImage = () => {
    if (!textureCanvasRef.current) return;
    
    const canvas = textureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.4);
        data[i + 1] = Math.min(255, data[i + 1] * 1.4);
        data[i + 2] = Math.min(255, data[i + 2] * 1.4);
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      if (terrainRef.current?.material.map) {
        terrainRef.current.material.map.needsUpdate = true;
      }
    };
    
    img.onerror = () => {};
    img.src = '/map.png';
  };

  useEffect(() => {
    if (!containerRef.current) return;

    document.body.style.overflow = 'hidden';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xB8E6F5);
    scene.fog = new THREE.Fog(0xB8E6F5, 20, 50);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.5, 4);
    camera.lookAt(0, 1.5, -2);
    cameraRef.current = camera;

    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      return { width, height };
    };
    
    const { width, height } = updateSize();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 15, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    raycasterRef.current = new THREE.Raycaster();

    const createPopupSprite = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      
      popupSpriteRef.current = {
        canvas: canvas,
        context: canvas.getContext('2d'),
        sprite: null
      };
    };
    createPopupSprite();

    const textureLoader = new THREE.TextureLoader();
    const modelTexture = textureLoader.load('/texture.png');
    
    const loader = new OBJLoader();
    loader.load(
      '/user.obj',
      (object) => {
        object.scale.set(2.5, 2.5, 2.5);
        object.position.set(0, 0, 0);
        
        const meshParts = {
          leftArm: null,
          rightArm: null,
          leftLeg: null,
          rightLeg: null,
          body: null
        };
        
        let meshCount = 0;
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++;
            child.castShadow = true;
            child.receiveShadow = true;
            
            child.material = new THREE.MeshStandardMaterial({
              map: modelTexture,
              roughness: 0.7,
              metalness: 0.1
            });
            
            const name = child.name.toLowerCase();
            
            if ((name.includes('left') || name.includes('l_') || name.includes('_l')) && 
                (name.includes('arm') || name.includes('hand') || name.includes('shoulder'))) {
              meshParts.leftArm = child;
            } 
            else if ((name.includes('right') || name.includes('r_') || name.includes('_r')) && 
                     (name.includes('arm') || name.includes('hand') || name.includes('shoulder'))) {
              meshParts.rightArm = child;
            }
            else if ((name.includes('left') || name.includes('l_') || name.includes('_l')) && 
                     (name.includes('leg') || name.includes('foot') || name.includes('thigh'))) {
              meshParts.leftLeg = child;
            }
            else if ((name.includes('right') || name.includes('r_') || name.includes('_r')) && 
                     (name.includes('leg') || name.includes('foot') || name.includes('thigh'))) {
              meshParts.rightLeg = child;
            }
            
            if (!child.userData.originalRotation) {
              child.userData.originalRotation = child.rotation.clone();
            }
          }
        });
        
        object.userData = { 
          animationTime: 0,
          bobAmount: 0.1,
          bobSpeed: 12,
          meshParts: meshParts,
          isSingleMesh: meshCount === 1
        };
        
        scene.add(object);
        characterRef.current = object;
      },
      undefined,
      () => {
        createFallbackCharacter(scene);
      }
    );

    createMapTerrain(scene);
    createFoodModels(scene);

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (characterRef.current) {
        const userData = characterRef.current.userData;
        
        if (isMoving) {
          userData.animationTime += 0.016;
          const bobOffset = Math.sin(userData.animationTime * userData.bobSpeed) * userData.bobAmount;
          
          characterRef.current.position.y = bobOffset;
          
          const walkSpeed = userData.bobSpeed;
          const armSwing = Math.sin(userData.animationTime * walkSpeed) * 1.2;
          const legSwing = Math.sin(userData.animationTime * walkSpeed) * 0.8;
          
          if (userData.meshParts) {
            if (userData.meshParts.leftArm) {
              userData.meshParts.leftArm.rotation.x = -armSwing;
              userData.meshParts.leftArm.rotation.z = armSwing * 0.3;
            }
            if (userData.meshParts.rightArm) {
              userData.meshParts.rightArm.rotation.x = armSwing;
              userData.meshParts.rightArm.rotation.z = -armSwing * 0.3;
            }
            
            if (userData.meshParts.leftLeg) {
              userData.meshParts.leftLeg.rotation.x = legSwing;
            }
            if (userData.meshParts.rightLeg) {
              userData.meshParts.rightLeg.rotation.x = -legSwing;
            }
          }
          
          const hasAnyParts = userData.meshParts && (
            userData.meshParts.leftArm || userData.meshParts.rightArm ||
            userData.meshParts.leftLeg || userData.meshParts.rightLeg
          );
          
          if (!hasAnyParts || userData.isSingleMesh) {
            const tiltAmount = 0.08;
            const rotateAmount = 0.03;
            
            characterRef.current.rotation.z = Math.sin(userData.animationTime * walkSpeed) * tiltAmount;
            characterRef.current.rotation.x = Math.abs(Math.sin(userData.animationTime * walkSpeed * 0.5)) * rotateAmount;
          }
        } else {
          characterRef.current.position.y = 0;
          
          if (userData.meshParts) {
            if (userData.meshParts.leftArm) {
              userData.meshParts.leftArm.rotation.x *= 0.9;
              userData.meshParts.leftArm.rotation.z *= 0.9;
            }
            if (userData.meshParts.rightArm) {
              userData.meshParts.rightArm.rotation.x *= 0.9;
              userData.meshParts.rightArm.rotation.z *= 0.9;
            }
            if (userData.meshParts.leftLeg) {
              userData.meshParts.leftLeg.rotation.x *= 0.9;
            }
            if (userData.meshParts.rightLeg) {
              userData.meshParts.rightLeg.rotation.x *= 0.9;
            }
          }
          
          characterRef.current.rotation.z *= 0.9;
          characterRef.current.rotation.x *= 0.9;
        }
      }
      
      foodModelsRef.current.forEach((foodGroup) => {
        const userData = foodGroup.userData;
        userData.animationTime += 0.01;
        
        foodGroup.position.y = userData.baseY + Math.sin(userData.animationTime) * 0.1;
        foodGroup.rotation.y += 0.005;
        
        if (terrainRef.current) {
          foodGroup.position.x = userData.foodItem.position.x - worldOffsetRef.current.x;
          foodGroup.position.z = userData.foodItem.position.z - worldOffsetRef.current.z;
        }
        
        if (characterRef.current && collisionCooldownRef.current <= 0) {
          const charPos = characterRef.current.position;
          const foodPos = foodGroup.position;
          
          const dx = charPos.x - foodPos.x;
          const dz = charPos.z - foodPos.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          if (distance < userData.collisionRadius && !selectedFood) {
            setSelectedFood(userData.foodItem);
            collisionCooldownRef.current = 180;
          }
        }
      });
      
      if (collisionCooldownRef.current > 0) {
        collisionCooldownRef.current--;
      }
      
      foodModelsRef.current.forEach((foodGroup) => {
        const food = foodGroup.userData.foodItem;
        
        if (!foodGroup.userData.popupSprite) {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          
          const ctx = canvas.getContext('2d');
          drawPopupCanvas(ctx, canvas, food);
          
          const texture = new THREE.CanvasTexture(canvas);
          const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            depthTest: true
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(3, 2.5, 1);
          
          foodGroup.userData.popupSprite = sprite;
          foodGroup.userData.popupCanvas = canvas;
          foodGroup.userData.popupContext = ctx;
          
          sceneRef.current.add(sprite);
        }
        
        const sprite = foodGroup.userData.popupSprite;
        sprite.position.copy(foodGroup.position);
        sprite.position.y = foodGroup.position.y + 2.5;
      });
      
      if (terrainRef.current && (velocityRef.current.x !== 0 || velocityRef.current.z !== 0)) {
        const moveSpeed = 0.05;
        
        worldOffsetRef.current.x += velocityRef.current.x * moveSpeed;
        worldOffsetRef.current.z += velocityRef.current.z * moveSpeed;
        
        terrainRef.current.position.x = -worldOffsetRef.current.x;
        terrainRef.current.position.z = -worldOffsetRef.current.z;
        
        if (terrainRef.current.material.map) {
          const texScale = 0.0008;
          terrainRef.current.material.map.offset.x = worldOffsetRef.current.x * texScale;
          terrainRef.current.material.map.offset.y = -worldOffsetRef.current.z * texScale;
        }
        
        if (animationRef.current && Math.floor(Date.now() / 100) % 10 === 0) {
          const gpsSpeed = 0.000008;
          setPosition(prev => ({
            lat: prev.lat - velocityRef.current.z * gpsSpeed,
            lng: prev.lng + velocityRef.current.x * gpsSpeed
          }));
        }
      }
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      document.body.style.overflow = '';
      
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMoving]);

  useEffect(() => {
    const joystick = joystickRef.current;
    const handle = joystickHandleRef.current;
    if (!joystick || !handle) return;

    let isDragging = false;
    const joystickRadius = 50;
    const handleRadius = 20;

    const updateJoystick = (clientX, clientY) => {
      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = joystickRadius - handleRadius;

      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxDistance;
        deltaY = Math.sin(angle) * maxDistance;
      }

      handle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      
      joystickPositionRef.current = { x: normalizedX, y: normalizedY };

      const speed = 1;
      velocityRef.current = { 
        x: normalizedX * speed, 
        z: normalizedY * speed 
      };
      
      setIsMoving(Math.abs(normalizedX) > 0.1 || Math.abs(normalizedY) > 0.1);

      if (Math.abs(normalizedX) > 0.1 || Math.abs(normalizedY) > 0.1) {
        const angle = Math.atan2(normalizedX, normalizedY);
        setHeading(angle);
        if (characterRef.current) {
          characterRef.current.rotation.y = angle;
        }
      }
    };

    const handleStart = (e) => {
      isDragging = true;
      setJoystickActive(true);
      const touch = e.touches ? e.touches[0] : e;
      updateJoystick(touch.clientX, touch.clientY);
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches ? e.touches[0] : e;
      updateJoystick(touch.clientX, touch.clientY);
    };

    const handleEnd = () => {
      isDragging = false;
      setJoystickActive(false);
      handle.style.transform = 'translate(0px, 0px)';
      joystickPositionRef.current = { x: 0, y: 0 };
      velocityRef.current = { x: 0, z: 0 };
      setIsMoving(false);
    };

    joystick.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    joystick.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      joystick.removeEventListener('mousedown', handleStart);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      joystick.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (!containerRef.current || !cameraRef.current || !raycasterRef.current) return;
      
      if (joystickRef.current && joystickRef.current.contains(event.target)) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      const intersects = raycasterRef.current.intersectObjects(
        foodModelsRef.current.map(group => group.children[0])
      );
      
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const foodGroup = foodModelsRef.current.find(group => 
          group.children.includes(clickedMesh)
        );
        
        if (foodGroup && foodGroup.userData.foodItem) {
          setSelectedFood(foodGroup.userData.foodItem);
        }
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
      return () => {
        container.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-900 flex flex-col">
      <div ref={containerRef} className="flex-1 w-full" style={{ height: 'calc(100vh - 80px)' }} />
      
      <div 
        ref={joystickRef}
        className="absolute left-8 bg-white/30 backdrop-blur-sm rounded-full shadow-2xl cursor-pointer touch-none"
        style={{ 
          bottom: '120px',
          width: '100px', 
          height: '100px',
          border: '3px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <div 
          ref={joystickHandleRef}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
            joystickActive ? 'bg-blue-500' : 'bg-white/80'
          }`}
          style={{ 
            width: '40px', 
            height: '40px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.8)'
          }}
        />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bg-green-400 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-bold uppercase tracking-wider"
            style={{ bottom: '120px' }}>
        Walk into a location to learn more about available food
      </div>
      
      {selectedFood && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <div 
            className="relative pointer-events-auto bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            style={{
              transform: 'translateY(-120px)'
            }}
          >
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white"></div>
            
            <button 
              onClick={() => {
                setSelectedFood(null);
                collisionCooldownRef.current = 60;
              }}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <span className="text-gray-600 font-bold">×</span>
            </button>
            
            {selectedFood.imageUrl && (
              <img 
                src={selectedFood.imageUrl} 
                alt={selectedFood.title}
                className="w-full h-40 object-cover"
              />
            )}
            
            <div className="p-5 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 pr-8">{selectedFood.title}</h2>
              
              <p className="text-sm text-gray-600">{selectedFood.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">{selectedFood.quantity}</span>
                </div>
                
                {selectedFood.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">{new Date(selectedFood.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-gray-700">{selectedFood.location}</span>
              </div>
              
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-medium transition-colors text-sm"
                onClick={() => {
                  setSelectedFood(null);
                  alert('Seller notified!');
                }}>
                Request Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer3D;