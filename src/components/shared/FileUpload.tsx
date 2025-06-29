import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  X, 
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  uploadProgress?: { [key: string]: number };
  uploadStatus?: { [key: string]: 'uploading' | 'success' | 'error' };
}

interface FileWithPreview extends File {
  preview?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onFileRemove,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  multiple = true,
  disabled = false,
  className = '',
  showPreview = true,
  uploadProgress = {},
  uploadStatus = {}
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ file, errors }) => {
        const error = errors[0];
        if (error.code === 'file-too-large') {
          return `${file.name}: Arquivo muito grande (máximo ${formatFileSize(maxSize)})`;
        }
        if (error.code === 'file-invalid-type') {
          return `${file.name}: Tipo de arquivo não suportado`;
        }
        return `${file.name}: ${error.message}`;
      });
      setErrors(newErrors);
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const filesWithPreview = acceptedFiles.map(file => {
        const fileWithPreview = file as FileWithPreview;
        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }
        return fileWithPreview;
      });

      const newFiles = multiple 
        ? [...selectedFiles, ...filesWithPreview].slice(0, maxFiles)
        : filesWithPreview.slice(0, 1);

      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  }, [selectedFiles, maxFiles, maxSize, multiple, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple,
    disabled
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileRemove?.(index);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (fileName: string) => {
    const status = uploadStatus[fileName];
    const progress = uploadProgress[fileName];

    if (status === 'uploading') {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (status === 'success') {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (status === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-blue-600">Solte os arquivos aqui...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-1">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Máximo {maxFiles} arquivo{maxFiles > 1 ? 's' : ''}, até {formatFileSize(maxSize)} cada
            </p>
          </div>
        )}
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File list */}
      {selectedFiles.length > 0 && showPreview && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos selecionados:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {/* File preview or icon */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  
                  {/* Upload progress */}
                  {uploadProgress[file.name] !== undefined && (
                    <div className="mt-1">
                      <Progress value={uploadProgress[file.name]} className="h-1" />
                    </div>
                  )}
                </div>

                {/* Status and actions */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(file.name)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File count indicator */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{selectedFiles.length} de {maxFiles} arquivos</span>
          {selectedFiles.length === maxFiles && (
            <Badge variant="secondary">Limite atingido</Badge>
          )}
        </div>
      )}
    </div>
  );
};