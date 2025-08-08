export const extractTextWithOCRSpace = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('apikey', 'K87844126688957'); // 🔐 replace with your actual API key
  formData.append('language', 'eng');
  formData.append('isOverlayRequired', 'false');

  try {
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const parsedText = result?.ParsedResults?.[0]?.ParsedText;

    if (!parsedText) {
      throw new Error('OCR failed or no text found');
    }

    return parsedText;
  } catch (err) {
    console.error('OCR error:', err);
    throw err;
  }
};
