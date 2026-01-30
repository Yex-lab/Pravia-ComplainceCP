export interface FileTypeConfig {
  icon: string;
  gradient: string;
  label: string;
}

export const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
  // Documents
  pdf: {
    icon: 'solar:document-outline',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
    label: 'PDF',
  },
  doc: {
    icon: 'solar:document-text-outline',
    gradient: 'linear-gradient(135deg, #4DABF7 0%, #1971C2 100%)',
    label: 'Word',
  },
  docx: {
    icon: 'solar:document-text-outline',
    gradient: 'linear-gradient(135deg, #4DABF7 0%, #1971C2 100%)',
    label: 'Word',
  },
  // Spreadsheets
  xls: {
    icon: 'solar:document-outline',
    gradient: 'linear-gradient(135deg, #51CF66 0%, #2F9E44 100%)',
    label: 'Excel',
  },
  xlsx: {
    icon: 'solar:document-outline',
    gradient: 'linear-gradient(135deg, #51CF66 0%, #2F9E44 100%)',
    label: 'Excel',
  },
  csv: {
    icon: 'solar:document-outline',
    gradient: 'linear-gradient(135deg, #51CF66 0%, #2F9E44 100%)',
    label: 'CSV',
  },
  // Presentations
  ppt: {
    icon: 'solar:document-outline',
    gradient: 'linear-gradient(135deg, #FF922B 0%, #E8590C 100%)',
    label: 'PowerPoint',
  },
  pptx: {
    icon: 'solar:document-outline',
    gradient: 'linear-gradient(135deg, #FF922B 0%, #E8590C 100%)',
    label: 'PowerPoint',
  },
  // Text files
  txt: {
    icon: 'solar:document-text-outline',
    gradient: 'linear-gradient(135deg, #ADB5BD 0%, #495057 100%)',
    label: 'Text',
  },
  md: {
    icon: 'solar:document-text-outline',
    gradient: 'linear-gradient(135deg, #868E96 0%, #343A40 100%)',
    label: 'Markdown',
  },
  // Code files
  json: {
    icon: 'solar:code-file-outline',
    gradient: 'linear-gradient(135deg, #FCC419 0%, #F59F00 100%)',
    label: 'JSON',
  },
  xml: {
    icon: 'solar:code-file-outline',
    gradient: 'linear-gradient(135deg, #FF8787 0%, #FA5252 100%)',
    label: 'XML',
  },
  // Images
  jpg: {
    icon: 'solar:gallery-outline',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    label: 'Image',
  },
  jpeg: {
    icon: 'solar:gallery-outline',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    label: 'Image',
  },
  png: {
    icon: 'solar:gallery-outline',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    label: 'Image',
  },
  gif: {
    icon: 'solar:gallery-outline',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    label: 'Image',
  },
  // Archives
  zip: {
    icon: 'solar:archive-outline',
    gradient: 'linear-gradient(135deg, #94D82D 0%, #66A80F 100%)',
    label: 'Archive',
  },
  rar: {
    icon: 'solar:archive-outline',
    gradient: 'linear-gradient(135deg, #94D82D 0%, #66A80F 100%)',
    label: 'Archive',
  },
  // Default
  default: {
    icon: 'solar:file-outline',
    gradient: 'linear-gradient(135deg, #CED4DA 0%, #868E96 100%)',
    label: 'File',
  },
};

export function getFileTypeConfig(mimeType: string, filename?: string): FileTypeConfig {
  // Try to get extension from filename first
  if (filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext && FILE_TYPE_CONFIGS[ext]) {
      return FILE_TYPE_CONFIGS[ext];
    }
  }

  // Try to match by mime type
  if (mimeType) {
    if (mimeType.includes('pdf')) return FILE_TYPE_CONFIGS.pdf;
    if (mimeType.includes('word') || mimeType.includes('document')) return FILE_TYPE_CONFIGS.docx;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FILE_TYPE_CONFIGS.xlsx;
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return FILE_TYPE_CONFIGS.pptx;
    if (mimeType.includes('text')) return FILE_TYPE_CONFIGS.txt;
    if (mimeType.includes('json')) return FILE_TYPE_CONFIGS.json;
    if (mimeType.includes('xml')) return FILE_TYPE_CONFIGS.xml;
    if (mimeType.includes('image')) {
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return FILE_TYPE_CONFIGS.jpg;
      if (mimeType.includes('png')) return FILE_TYPE_CONFIGS.png;
      if (mimeType.includes('gif')) return FILE_TYPE_CONFIGS.gif;
    }
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return FILE_TYPE_CONFIGS.zip;
  }

  return FILE_TYPE_CONFIGS.default;
}
