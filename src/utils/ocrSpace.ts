export const extractTextWithOCRSpace = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('apikey', 'K87844126688957'); // ✅ Replace if needed
  formData.append('language', 'eng');
  formData.append('isOverlayRequired', 'false');

  try {
    console.log(`Sending ${file.name} to OCR.Space...`);

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('OCR response:', JSON.stringify(result, null, 2));

    if (result?.IsErroredOnProcessing) {
      throw new Error(result?.ErrorMessage || 'OCR processing error');
    }

    const parsedText = result?.ParsedResults?.[0]?.ParsedText;
    if (!parsedText || parsedText.trim() === '') {
      console.log('ParsedText:', parsedText);
      throw new Error('No text found in OCR result.');
    }

    return parsedText;
  } catch (err) {
    console.error('OCR error:', err);
    throw err;
  }
};
