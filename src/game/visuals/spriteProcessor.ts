import Phaser from 'phaser';

/**
 * Removes outer white background from raster sprites loaded into Phaser,
 * preserving internal white details (e.g. white crest on banners, skull teeth, shiny highlights).
 */
export function removeSpriteBackground(
  scene: Phaser.Scene,
  sourceKey: string,
  targetKey: string = sourceKey,
  threshold: number = 238
): void {
  if (!scene.textures.exists(sourceKey)) return;

  const texture = scene.textures.get(sourceKey);
  const srcImg = texture.getSourceImage() as HTMLImageElement;
  if (!srcImg || !srcImg.width || !srcImg.height) return;

  const width = srcImg.width;
  const height = srcImg.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(srcImg, 0, 0);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Pre-clear margin text from concept sheets if applicable
  if (sourceKey.includes('aldren')) {
    // Clear top-right speech text
    for (let y = 0; y < Math.floor(height * 0.25); y++) {
      for (let x = Math.floor(width * 0.72); x < width; x++) {
        data[(y * width + x) * 4 + 3] = 0;
      }
    }
  } else if (sourceKey.includes('grukk')) {
    // Clear top-left header text
    for (let y = 0; y < Math.floor(height * 0.15); y++) {
      for (let x = 0; x < Math.floor(width * 0.32); x++) {
        data[(y * width + x) * 4 + 3] = 0;
      }
    }
  }

  // Track visited boundary-connected pixels
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  const isBackgroundPixel = (idx: number) => {
    const a = data[idx * 4 + 3];
    if (a < 20) return true; // Already transparent
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];

    // White / near-white background
    if (r >= threshold && g >= threshold && b >= threshold) return true;

    // Parchment / light beige background from concept art sheets
    if (r >= 205 && g >= 190 && b >= 165 && Math.abs(r - g) <= 40 && r >= b) return true;

    return false;
  };

  // Seed boundary edges
  for (let x = 0; x < width; x++) {
    const top = x;
    const bottom = (height - 1) * width + x;
    if (isBackgroundPixel(top) && !visited[top]) {
      visited[top] = 1;
      queue.push(top);
    }
    if (isBackgroundPixel(bottom) && !visited[bottom]) {
      visited[bottom] = 1;
      queue.push(bottom);
    }
  }

  for (let y = 0; y < height; y++) {
    const left = y * width;
    const right = y * width + (width - 1);
    if (isBackgroundPixel(left) && !visited[left]) {
      visited[left] = 1;
      queue.push(left);
    }
    if (isBackgroundPixel(right) && !visited[right]) {
      visited[right] = 1;
      queue.push(right);
    }
  }

  // Fast BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = (curr / width) | 0;

    if (cx > 0) {
      const left = curr - 1;
      if (!visited[left] && isBackgroundPixel(left)) {
        visited[left] = 1;
        queue.push(left);
      }
    }
    if (cx < width - 1) {
      const right = curr + 1;
      if (!visited[right] && isBackgroundPixel(right)) {
        visited[right] = 1;
        queue.push(right);
      }
    }
    if (cy > 0) {
      const up = curr - width;
      if (!visited[up] && isBackgroundPixel(up)) {
        visited[up] = 1;
        queue.push(up);
      }
    }
    if (cy < height - 1) {
      const down = curr + width;
      if (!visited[down] && isBackgroundPixel(down)) {
        visited[down] = 1;
        queue.push(down);
      }
    }
  }

  // Turn visited pixels transparent
  for (let i = 0; i < visited.length; i++) {
    if (visited[i] === 1) {
      data[i * 4 + 3] = 0; // Alpha = 0
    }
  }

  // 1-pixel soft antialiasing boundary
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (visited[idx] === 0) {
        const hasTransparentNeighbor =
          visited[idx - 1] === 1 ||
          visited[idx + 1] === 1 ||
          visited[idx - width] === 1 ||
          visited[idx + width] === 1;

        if (hasTransparentNeighbor) {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          if (r > 200 && g > 200 && b > 200) {
            const brightness = (r + g + b) / 3;
            const factor = Math.max(0, Math.min(1, (255 - brightness) / 55));
            data[idx * 4 + 3] = Math.round(data[idx * 4 + 3] * factor);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Update in texture cache
  if (scene.textures.exists(targetKey)) {
    scene.textures.remove(targetKey);
  }
  scene.textures.addCanvas(targetKey, canvas);
}
