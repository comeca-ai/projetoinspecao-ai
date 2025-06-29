import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Mic, 
  FileText, 
  Upload,
  X,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';

interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (observation: string, media: string[]) => void;
  testName: string;
}

const ObservationModal: React.FC<ObservationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  testName
}) => {
  const [observation, setObservation] = useState('');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('info');
  const [attachedMedia, setAttachedMedia] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleSave = () => {
    if (observation.trim()) {
      onSave(observation, attachedMedia);
      setObservation('');
      setAttachedMedia([]);
      setSeverity('info');
    }
  };

  const handleClose = () => {
    setObservation('');
    setAttachedMedia([]);
    setSeverity('info');
    onClose();
  };

  const handleTakePhoto = () => {
    // Simulate taking a photo
    const photoId = `photo-${Date.now()}`;
    setAttachedMedia(prev => [...prev, photoId]);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      const audioId = `audio-${Date.now()}`;
      setAttachedMedia(prev => [...prev, audioId]);
    }, 3000);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileId = `file-${Date.now()}`;
    setAttachedMedia(prev => [...prev, fileId]);
  };

  const removeMedia = (mediaId: string) => {
    setAttachedMedia(prev => prev.filter(id => id !== mediaId));
  };

  const getSeverityConfig = (sev: string) => {
    const config = {
      info: { 
        label: 'Informação', 
        color: 'bg-blue-100 text-blue-800', 
        icon: Info 
      },
      warning: { 
        label: 'Atenção', 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: AlertTriangle 
      },
      critical: { 
        label: 'Crítico', 
        color: 'bg-red-100 text-red-800', 
        icon: AlertTriangle 
      }
    };
    return config[sev as keyof typeof config];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Adicionar Observação
          </DialogTitle>
          {testName && (
            <p className="text-sm text-gray-600">Para o teste: {testName}</p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Severity Selection */}
          <div className="space-y-2">
            <Label>Nível de Severidade</Label>
            <div className="flex gap-2">
              {(['info', 'warning', 'critical'] as const).map((sev) => {
                const config = getSeverityConfig(sev);
                const Icon = config.icon;
                return (
                  <Button
                    key={sev}
                    variant={severity === sev ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSeverity(sev)}
                    className={severity === sev ? config.color : ''}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Observation Text */}
          <div className="space-y-2">
            <Label htmlFor="observation">Descrição da Observação</Label>
            <Textarea
              id="observation"
              placeholder="Descreva a observação detalhadamente..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Media Capture Options */}
          <div className="space-y-3">
            <Label>Anexar Mídia</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTakePhoto}
              >
                <Camera className="mr-2 h-4 w-4" />
                Tirar Foto
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartRecording}
                disabled={isRecording}
                className={isRecording ? 'bg-red-50 border-red-200' : ''}
              >
                <Mic className={`mr-2 h-4 w-4 ${isRecording ? 'animate-pulse text-red-600' : ''}`} />
                {isRecording ? 'Gravando...' : 'Gravar Áudio'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFileUpload}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Arquivo
              </Button>
            </div>
          </div>

          {/* Attached Media */}
          {attachedMedia.length > 0 && (
            <div className="space-y-2">
              <Label>Arquivos Anexados</Label>
              <div className="space-y-2">
                {attachedMedia.map((mediaId) => (
                  <div key={mediaId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      {mediaId.startsWith('photo') && <Camera className="h-4 w-4 text-gray-600" />}
                      {mediaId.startsWith('audio') && <Mic className="h-4 w-4 text-gray-600" />}
                      {mediaId.startsWith('file') && <FileText className="h-4 w-4 text-gray-600" />}
                      <span className="text-sm text-gray-700">
                        {mediaId.startsWith('photo') && 'Foto capturada'}
                        {mediaId.startsWith('audio') && 'Áudio gravado'}
                        {mediaId.startsWith('file') && 'Arquivo anexado'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(mediaId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Templates */}
          <div className="space-y-2">
            <Label>Templates Rápidos</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Equipamento funcionando corretamente',
                'Necessita manutenção preventiva',
                'Problema identificado - requer reparo',
                'Não conforme com especificações'
              ].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  onClick={() => setObservation(template)}
                  className="text-left justify-start h-auto p-2"
                >
                  <span className="text-xs">{template}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!observation.trim()}
            className="bg-[#f26522] hover:bg-[#e55a1f]"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Salvar Observação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ObservationModal;