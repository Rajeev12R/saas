import * as THREE from 'three';

export interface UVBounds {
  front: {
    min: [number, number];
    max: [number, number];
  };
  back: {
    min: [number, number];
    max: [number, number];
  };
}

export class ModelAnalyzer {
  static analyzeUVCoordinates(scene: THREE.Group): UVBounds {
    const bounds: UVBounds = {
      front: { min: [1, 1], max: [0, 0] },
      back: { min: [1, 1], max: [0, 0] }
    };

    let frontCount = 0;
    let backCount = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry;
        const positionAttribute = geometry.getAttribute('position');
        const uvAttribute = geometry.getAttribute('uv');

        if (!positionAttribute || !uvAttribute) return;

        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const z = positionAttribute.getZ(i);
          const u = uvAttribute.getX(i);
          const v = uvAttribute.getY(i);

          // More accurate front/back detection for t-shirt
          // Front typically faces positive Z direction
          const isFront = z >= 0;

          if (isFront) {
            bounds.front.min[0] = Math.min(bounds.front.min[0], u);
            bounds.front.min[1] = Math.min(bounds.front.min[1], v);
            bounds.front.max[0] = Math.max(bounds.front.max[0], u);
            bounds.front.max[1] = Math.max(bounds.front.max[1], v);
            frontCount++;
          } else {
            bounds.back.min[0] = Math.min(bounds.back.min[0], u);
            bounds.back.min[1] = Math.min(bounds.back.min[1], v);
            bounds.back.max[0] = Math.max(bounds.back.max[0], u);
            bounds.back.max[1] = Math.max(bounds.back.max[1], v);
            backCount++;
          }
        }
      }
    });

    console.log(`Analyzed UVs - Front: ${frontCount} vertices, Back: ${backCount} vertices`);
    console.log('Front UV bounds:', bounds.front);
    console.log('Back UV bounds:', bounds.back);

    return bounds;
  }

  // Updated for better alignment with T-shirt images
  static getTShirtUVAreas(): UVBounds {
    return {
      front: {
        min: [0.25, 0.25] as [number, number],  // Perfectly centered on front
        max: [0.75, 0.75] as [number, number]
      },
      back: {
        min: [0.25, 0.25] as [number, number],  // Perfectly centered on back
        max: [0.75, 0.75] as [number, number]
      }
    };
  }
}