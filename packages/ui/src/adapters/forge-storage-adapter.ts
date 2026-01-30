import { API_URLS } from '../config/api-constants';

export interface StorageAdapter {
  upload: (file: File) => Promise<{ url: string; key: string }>;
  delete: (key: string) => Promise<void>;
  getUrl: (key: string) => Promise<string>;
}

export const forgeStorageAdapter: StorageAdapter = {
  upload: async (file: File) => {
    console.log('Starting TUS upload for:', file.name, 'to', `${API_URLS.FORGE}/files`);
    
    // Create TUS upload
    const response = await fetch(`${API_URLS.FORGE}/files`, {
      method: 'POST',
      headers: {
        'Upload-Length': file.size.toString(),
        'Upload-Metadata': `filename ${btoa(file.name)},filetype ${btoa(file.type)}`,
        'Tus-Resumable': '1.0.0',
      },
    });

    console.log('TUS create response:', response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text();
      console.error('TUS create failed:', text);
      throw new Error(`Failed to create upload: ${response.status} ${text}`);
    }

    const location = response.headers.get('Location');
    if (!location) {
      throw new Error('No upload location returned');
    }

    // Extract the file ID and build correct URL
    const fileId = location.split('/').pop();
    const uploadUrl = `${API_URLS.FORGE}/files/${fileId}`;
    console.log('Upload URL:', uploadUrl);

    // Upload file content
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Tus-Resumable': '1.0.0',
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      console.error('Upload failed:', text);
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    const key = uploadUrl.split('/').pop() || '';
    console.log('Upload complete. Key:', key, 'URL:', uploadUrl);
    
    return {
      url: uploadUrl,
      key,
    };
  },

  delete: async (key: string) => {
    const response = await fetch(`${API_URLS.FORGE}/files/${key}`, {
      method: 'DELETE',
      headers: {
        'Tus-Resumable': '1.0.0',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  },

  getUrl: async (key: string) => {
    return `${API_URLS.FORGE}/${key}`;
  },
};
