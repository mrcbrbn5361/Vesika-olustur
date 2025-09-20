/**
 * Converts a File object to a Base64 encoded string, without the data URI prefix.
 * This is the format required by the Gemini API's `inlineData.data` field.
 * @param file The file to convert.
 * @returns A promise that resolves with the Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strips the "data:image/jpeg;base64," part
      const base64 = result.split(',')[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error("Could not extract Base64 data from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a File object to a data URL string, including the URI prefix.
 * This is useful for displaying image previews in `<img>` tags.
 * @param file The file to convert.
 * @returns A promise that resolves with the data URL string.
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


/**
 * Creates a single image sheet containing multiple copies of the input image arranged in a grid.
 * @param singleImageDataUrl The data URL of the image to be duplicated.
 * @param count The number of times to duplicate the image.
 * @returns A promise that resolves with the data URL of the generated image sheet.
 */
export const createImageSheet = (singleImageDataUrl: string, count: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = singleImageDataUrl;

    img.onload = () => {
      const padding = 20; // Padding between images and around the canvas
      const photoWidth = img.width;
      const photoHeight = img.height;

      // Determine grid layout - max 4 columns
      const cols = count <= 2 ? count : (count <= 8 ? 4 : 4);
      const rows = Math.ceil(count / cols);

      // Calculate canvas dimensions
      const canvasWidth = cols * photoWidth + (cols + 1) * padding;
      const canvasHeight = rows * photoHeight + (rows + 1) * padding;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error("Could not get canvas context."));
      }
      
      // A light grey background for the sheet to distinguish it from the page
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      let imageCounter = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (imageCounter >= count) break;

          const x = padding + c * (photoWidth + padding);
          const y = padding + r * (photoHeight + padding);
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
          
          imageCounter++;
        }
      }
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (error) => {
        console.error("Image failed to load for canvas creation:", error);
        reject(new Error("Image could not be loaded to create the sheet."));
    }
  });
};