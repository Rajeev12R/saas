import * as THREE from 'three';

export class ModelScreenshot {
  static async generateFrontBackImages(scene: THREE.Group): Promise<{ front: string; back: string }> {
    return new Promise((resolve) => {
      // Create a temporary renderer
      const renderer = new THREE.WebGLRenderer({ 
        preserveDrawingBuffer: true,
        antialias: true 
      });
      renderer.setSize(512, 512);
      
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      const sceneCopy = scene.clone();

      // Generate front view
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      renderer.render(sceneCopy, camera);
      const frontImage = renderer.domElement.toDataURL();

      // Generate back view  
      camera.position.set(0, 0, -5);
      camera.lookAt(0, 0, 0);
      renderer.render(sceneCopy, camera);
      const backImage = renderer.domElement.toDataURL();

      // Clean up
      renderer.dispose();
      
      resolve({ front: frontImage, back: backImage });
    });
  }
}