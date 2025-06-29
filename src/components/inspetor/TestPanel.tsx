import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  X, 
  Clock, 
  FileText, 
  Camera,
  Trash2,
  AlertCircle,
  GripVertical
} from 'lucide-react';

interface Test {
  id: string;
  name: string;
  category: string;
  description: string;
  required: boolean;
  estimated_time: number;
  instructions: string[];
}

interface ActiveTest {
  id: string;
  test: Test;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  observations?: string;
  media?: string[];
  startTime?: Date;
  endTime?: Date;
}

interface TestPanelProps {
  activeTests: ActiveTest[];
  onTestStatusChange: (testId: string, status: ActiveTest['status'], result?: string) => void;
  onAddObservation: (testId: string) => void;
  onRemoveTest: (testId: string) => void;
}

const TestPanel: React.FC<TestPanelProps> = ({
  activeTests,
  onTestStatusChange,
  onAddObservation,
  onRemoveTest
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#f26522]', 'bg-orange-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#f26522]', 'bg-orange-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#f26522]', 'bg-orange-50');
    
    try {
      const testData = e.dataTransfer.getData('application/json');
      if (testData) {
        const test = JSON.parse(testData);
        // This would be handled by the parent component through onTestDrop
        console.log('Test dropped:', test);
      }
    } catch (error) {
      console.error('Error parsing dropped test data:', error);
    }
  };

  const getStatusBadge = (status: ActiveTest['status']) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      in_progress: { label: 'Em Andamento', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      failed: { label: 'Falhou', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (activeTests.length === 0) {
    return (
      <Card 
        className="min-h-96 border-2 border-dashed border-gray-300 flex items-center justify-center transition-all duration-200"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center text-gray-500">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Área de Execução de Testes</h3>
          <p className="text-sm mb-2">
            Arraste testes da biblioteca para começar a inspeção
          </p>
          <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded inline-block">
            💡 Você também pode clicar nos testes da biblioteca para adicioná-los
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop zone indicator when dragging */}
      <Card 
        className="border-2 border-dashed border-gray-200 p-4 text-center text-gray-400 transition-all duration-200"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-sm">
          ⬇️ Solte aqui para adicionar novo teste
        </div>
      </Card>

      {activeTests.map((activeTest, index) => (
        <Card key={activeTest.id} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{activeTest.test.name}</CardTitle>
                  {getStatusBadge(activeTest.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{activeTest.test.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <Badge variant="outline">{activeTest.test.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activeTest.test.estimated_time}min estimado
                  </div>
                  {activeTest.test.required && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      Obrigatório
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveTest(activeTest.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Instructions */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Instruções:</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                {activeTest.test.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">
                      {idx + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            {/* Test Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTest.status === 'pending' && (
                <Button
                  onClick={() => onTestStatusChange(activeTest.id, 'in_progress')}
                  className="bg-[#f26522] hover:bg-[#e55a1f]"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar Teste
                </Button>
              )}
              
              {activeTest.status === 'in_progress' && (
                <>
                  <Button
                    onClick={() => onTestStatusChange(activeTest.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => onTestStatusChange(activeTest.id, 'failed')}
                    variant="destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reprovar
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => onAddObservation(activeTest.id)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Observação
              </Button>

              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Foto
              </Button>
            </div>

            {/* Result Input for In Progress Tests */}
            {activeTest.status === 'in_progress' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Resultado do Teste:</label>
                <Textarea
                  placeholder="Descreva o resultado do teste..."
                  value={activeTest.result || ''}
                  onChange={(e) => onTestStatusChange(activeTest.id, 'in_progress', e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* Show Results for Completed Tests */}
            {(activeTest.status === 'completed' || activeTest.status === 'failed') && activeTest.result && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Resultado:</h4>
                <p className="text-sm text-gray-700">{activeTest.result}</p>
              </div>
            )}

            {/* Show Observations */}
            {activeTest.observations && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Observações:</h4>
                <p className="text-sm text-gray-700">{activeTest.observations}</p>
              </div>
            )}

            {/* Timing Information */}
            {(activeTest.startTime || activeTest.endTime) && (
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                {activeTest.startTime && (
                  <span>Iniciado: {formatTime(activeTest.startTime)}</span>
                )}
                {activeTest.endTime && (
                  <span>Finalizado: {formatTime(activeTest.endTime)}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TestPanel;