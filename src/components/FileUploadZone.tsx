import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PaperclipIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as pdfjsLib from 'pdfjs-dist';

interface FileUploadZoneProps {
  onFileProcess: (content: string) => void;
  disabled: boolean;
}

export const FileUploadZone = ({ onFileProcess, disabled }: FileUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processPdfFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Read the PDF content
      const pdfData = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdfData.numPages; i++) {
        const page = await pdfData.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  };

  const processFile = async (file: File) => {
    try {
      if (file.type.includes('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target?.result as string;
          onFileProcess(`Analyze this image: ${base64String}`);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        const pdfText = await processPdfFile(file);
        onFileProcess(`Analyze this PDF content:\n${pdfText}`);
        toast({
          title: "PDF processed",
          description: "PDF content has been extracted and is ready for analysis",
        });
      } else if (file.type.includes('powerpoint')) {
        const text = await file.text();
        onFileProcess(`Analyze this ${file.type} content: ${text}`);
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFiles = async (files: File[]) => {
    const supportedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    const validFiles = files.filter(file => supportedTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast({
        title: "Unsupported file type",
        description: "Please upload images (JPEG, PNG, GIF), PDF, or PPTX files.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Files received",
      description: `Processing ${validFiles.length} file(s)`,
    });

    for (const file of validFiles) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        accept="image/*,.pdf,.pptx"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <PaperclipIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </Button>
    </>
  );
};