// Logo loader utility - converts image to base64 for PDF embedding
let cachedLogoData: string | null = null;

export const loadLogoAsBase64 = async (): Promise<string | null> => {
  if (cachedLogoData) {
    return cachedLogoData;
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}logo.avif`);
    const blob = await response.blob();

    // Create an image element to draw on canvas
    const img = new Image();
    const imageUrl = URL.createObjectURL(blob);

    return new Promise((resolve) => {
      img.onload = () => {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Convert to PNG base64 (jsPDF supports PNG)
          cachedLogoData = canvas.toDataURL('image/png');
          resolve(cachedLogoData);
        } else {
          resolve(null);
        }

        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = () => {
        console.error('Failed to load logo');
        URL.revokeObjectURL(imageUrl);
        resolve(null);
      };

      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error loading logo:', error);
    return null;
  }
};

// Preload the logo when the module is imported
loadLogoAsBase64();
