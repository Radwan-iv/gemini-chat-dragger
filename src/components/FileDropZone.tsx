import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileDropZoneProps {
  onFilesDrop: (files: File[]) => void;
}

export const FileDropZone = ({ onFilesDrop }: FileDropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    if (validFiles.length > 0) {
      onFilesDrop(validFiles);
    }
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
        hover:border-primary/50 hover:bg-primary/5`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Upload className="w-8 h-8" />
        <p>Drag & drop images or PDFs here, or click to select files</p>
      </div>
    </div>
  );
};