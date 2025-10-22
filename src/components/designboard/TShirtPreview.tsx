"use client"
import React, { useState, useRef, useEffect } from 'react';
import { UVBounds, ModelAnalyzer } from '../../utils/ModelAnalyzer';

interface TShirtPreviewProps {
  onTextPlacement: (position: [number, number], area: 'front' | 'back') => void;
  onAddText: () => void;
}

const TShirtPreview: React.FC<TShirtPreviewProps> = ({ onTextPlacement, onAddText }) => {
  const [activeArea, setActiveArea] = useState<'front' | 'back'>('front');
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // More accurate UV mapping based on T-shirt image dimensions
  const getUVAreas = (): UVBounds => {
    return {
      front: {
        min: [0.25, 0.25] as [number, number],
        max: [0.75, 0.75] as [number, number]
      },
      back: {
        min: [0.25, 0.25] as [number, number],
        max: [0.75, 0.75] as [number, number]
      }
    };
  };

  const uvAreas: UVBounds = getUVAreas();

  // Load and draw T-shirt images with perfect grid alignment
  useEffect(() => {
    const frontImg = new Image();
    const backImg = new Image();
    
    let loadedCount = 0;
    
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setImagesLoaded(true);
        drawTShirtPreview('front', frontImg);
        drawTShirtPreview('back', backImg);
      }
    };
    
    frontImg.onload = checkAllLoaded;
    backImg.onload = checkAllLoaded;
    
    frontImg.src = '/images/tshirt-front.png';
    backImg.src = '/images/tshirt-back.png';
  }, []);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>, area: 'front' | 'back') => {
    const canvas = area === 'front' ? frontCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Convert canvas coordinates to UV coordinates
    const areaBounds = uvAreas[area];
    const uvX = areaBounds.min[0] + ((x / canvas.width) * (areaBounds.max[0] - areaBounds.min[0]));
    const uvY = areaBounds.min[1] + ((y / canvas.height) * (areaBounds.max[1] - areaBounds.min[1]));

    console.log(`Placing text at UV: [${uvX.toFixed(3)}, ${uvY.toFixed(3)}] on ${area}`);
    onTextPlacement([uvX, uvY], area);
  };

  // Draw T-shirt preview with perfect grid alignment
  const drawTShirtPreview = (area: 'front' | 'back', image?: HTMLImageElement) => {
    const canvas = area === 'front' ? frontCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw T-shirt image if provided
    if (image) {
      // Draw image with proper aspect ratio and centering
      const imgAspect = image.width / image.height;
      const canvasAspect = width / height;
      
      let renderWidth = width;
      let renderHeight = height;
      let offsetX = 0;
      let offsetY = 0;
      
      if (imgAspect > canvasAspect) {
        renderHeight = width / imgAspect;
        offsetY = (height - renderHeight) / 2;
      } else {
        renderWidth = height * imgAspect;
        offsetX = (width - renderWidth) / 2;
      }
      
      ctx.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
    }

    // Get placement area bounds
    const areaBounds = uvAreas[area];
    const placementX = width * areaBounds.min[0];
    const placementY = height * areaBounds.min[1];
    const placementWidth = width * (areaBounds.max[0] - areaBounds.min[0]);
    const placementHeight = height * (areaBounds.max[1] - areaBounds.min[1]);

    // Draw semi-transparent overlay for the entire placement area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(placementX, placementY, placementWidth, placementHeight);

    // Draw border around placement area
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeRect(placementX, placementY, placementWidth, placementHeight);

    // Draw precise grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    
    // Vertical grid lines - perfectly spaced
    const verticalSpacing = placementWidth / 4;
    for (let i = 1; i < 4; i++) {
      const x = placementX + (verticalSpacing * i);
      ctx.beginPath();
      ctx.moveTo(x, placementY);
      ctx.lineTo(x, placementY + placementHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines - perfectly spaced
    const horizontalSpacing = placementHeight / 4;
    for (let i = 1; i < 4; i++) {
      const y = placementY + (horizontalSpacing * i);
      ctx.beginPath();
      ctx.moveTo(placementX, y);
      ctx.lineTo(placementX + placementWidth, y);
      ctx.stroke();
    }

    // Center crosshair with precise positioning
    const centerX = placementX + placementWidth / 2;
    const centerY = placementY + placementHeight / 2;
    
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    // Crosshair lines
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 20);
    ctx.stroke();
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.stroke();

    // Corner markers for precise alignment
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.lineWidth = 2;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(placementX, placementY);
    ctx.lineTo(placementX + 15, placementY);
    ctx.moveTo(placementX, placementY);
    ctx.lineTo(placementX, placementY + 15);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(placementX + placementWidth, placementY);
    ctx.lineTo(placementX + placementWidth - 15, placementY);
    ctx.moveTo(placementX + placementWidth, placementY);
    ctx.lineTo(placementX + placementWidth, placementY + 15);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(placementX, placementY + placementHeight);
    ctx.lineTo(placementX + 15, placementY + placementHeight);
    ctx.moveTo(placementX, placementY + placementHeight);
    ctx.lineTo(placementX, placementY + placementHeight - 15);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(placementX + placementWidth, placementY + placementHeight);
    ctx.lineTo(placementX + placementWidth - 15, placementY + placementHeight);
    ctx.moveTo(placementX + placementWidth, placementY + placementHeight);
    ctx.lineTo(placementX + placementWidth, placementY + placementHeight - 15);
    ctx.stroke();

    // Add area label with background for better readability
    const labelText = `${area === 'front' ? 'Front' : 'Back'} Design Area`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(width / 2 - 85, height - 40, 170, 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, width / 2, height - 25);

    // Add coordinates display
    const coordText = `Grid: ${Math.round(placementWidth)}×${Math.round(placementHeight)}px`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(width / 2 - 70, height - 80, 140, 20);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Arial';
    ctx.fillText(coordText, width / 2, height - 70);
  };

  // Redraw when active area changes
  useEffect(() => {
    if (imagesLoaded) {
      const frontImg = new Image();
      const backImg = new Image();
      
      frontImg.onload = () => drawTShirtPreview('front', frontImg);
      backImg.onload = () => drawTShirtPreview('back', backImg);
      
      frontImg.src = '/images/tshirt-front.png';
      backImg.src = '/images/tshirt-back.png';
    }
  }, [activeArea, imagesLoaded]);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">T-Shirt Design Preview</h3>
        <button
          onClick={onAddText}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
          title="Add Text"
        >
          <span className="text-xl">+</span>
          Add Text
        </button>
      </div>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveArea('front')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex-1 ${
            activeArea === 'front' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Front View
        </button>
        <button
          onClick={() => setActiveArea('back')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex-1 ${
            activeArea === 'back' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Back View
        </button>
      </div>

      <div className="space-y-4">
        <div className={`${activeArea === 'front' ? 'block' : 'hidden'}`}>
          <div className="flex justify-center bg-gray-50 rounded-xl p-4 border border-gray-200">
            <canvas
              ref={frontCanvasRef}
              width={500}
              height={600}
              className="max-w-full h-auto cursor-crosshair rounded-lg shadow-md"
              onClick={(e) => handleCanvasClick(e, 'front')}
              title="Click to place text on front - Red crosshair shows center"
            />
          </div>
        </div>

        <div className={`${activeArea === 'back' ? 'block' : 'hidden'}`}>
          <div className="flex justify-center bg-gray-50 rounded-xl p-4 border border-gray-200">
            <canvas
              ref={backCanvasRef}
              width={500}
              height={600}
              className="max-w-full h-auto cursor-crosshair rounded-lg shadow-md"
              onClick={(e) => handleCanvasClick(e, 'back')}
              title="Click to place text on back - Red crosshair shows center"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 text-center font-medium">
          💡 Click anywhere in the blue grid area to place text precisely
        </p>
        <p className="text-xs text-blue-600 text-center mt-1">
          Red crosshair marks the center • Corner markers show boundaries
        </p>
      </div>
    </div>
  );
};

export default TShirtPreview;