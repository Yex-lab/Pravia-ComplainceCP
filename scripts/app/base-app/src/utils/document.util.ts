import { fluxServices } from 'src/api';

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, mimetype: string): Blob {
  const byteCharacters = atob(base64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimetype });
}

/**
 * View document in new tab
 */
export async function viewDocument(submissionId: string): Promise<void> {
  try {
    const result =
      await fluxServices.documentUrls.getDocumentUrlsSubmissionBySubmissionId(submissionId);

    if (result.documentUrl) {
      window.open(result.documentUrl, '_blank');
    } else if (result.documentData) {
      const blob = base64ToBlob(result.documentData.base64, result.documentData.mimetype);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    throw error;
  }
}

/**
 * Download document
 */
export async function downloadDocument(
  submissionId: string,
  fallbackFilename?: string
): Promise<void> {
  try {
    const result =
      await fluxServices.documentUrls.getDocumentUrlsSubmissionBySubmissionId(submissionId);

    if (result.documentUrl) {
      const link = document.createElement('a');
      link.href = result.documentUrl;
      link.download = fallbackFilename || `document-${submissionId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (result.documentData) {
      const blob = base64ToBlob(result.documentData.base64, result.documentData.mimetype);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.documentData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
}
