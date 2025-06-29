import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Mic, 
  Camera, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TestLibrary from '@/components/inspetor/TestLibrary';
import TestPanel from '@/components/inspetor/TestPanel';
import VoiceAssistant from '@/components/inspetor/VoiceAssistant';
import ObservationModal from '@/components/inspetor/ObservationModal';

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

const InspectionExecution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTests, setActiveTests] = useState<ActiveTest[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [selectedTestForObservation, setSelectedTestForObservation] = useState<string | null>(null);

  // Mock inspection data
  const inspection = {
    id: id || '1',
    title: 'Inspeção Elétrica - Painel Principal',
    project: 'Edifício Comercial Centro',
    location: 'São Paulo - SP',
    dueDate: '2024-01-15',
    assignedBy: 'João Silva'
  };

  const handleTestDrop = (test: Test) => {
    const newActiveTest: ActiveTest = {
      id: `active-${Date.now()}`,
      test,
      status: 'pending'
    };
    setActiveTests(prev => [...prev, newActiveTest]);
  };

  const handleTestStatusChange = (testId: string, status: ActiveTest['status'], result?: string) => {
    setActiveTests(prev => prev.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            status, 
            result,
            endTime: status === 'completed' || status === 'failed' ? new Date() : test.endTime
          }
        : test
    ));
  };

  const handleAddObservation = (testId: string) => {
    setSelectedTestForObservation(testId);
    setIsObservationModalOpen(true);
  };

  const handleSaveObservation = (observation: string, media: string[]) => {
    if (selectedTestForObservation) {
      setActiveTests(prev => prev.map(test => 
        test.id === selectedTestForObservation 
          ? { ...test, observations: observation, media }
          : test
      ));
    }
    setIsObservationModalOpen(false);
    setSelectedTestForObservation(null);
  };

  const getProgress = () => {
    if (activeTests.length === 0) return 0;
    const completedTests = activeTests.filter(test => 
      test.status === 'completed' || test.status === 'failed'
    ).length;
    return Math.round((completedTests / activeTests.length) * 100);
  };

  const getStatusCounts = () => {
    return {
      completed: activeTests.filter(t => t.status === 'completed').length,
      failed: activeTests.filter(t => t.status === 'failed').length,
      in_progress: activeTests.filter(t => t.status === 'in_progress').length,
      pending: activeTests.filter(t => t.status === 'pending').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{inspection.title}</h1>
              <p className="text-gray-600">{inspection.project} • {inspection.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              <Mic className="mr-2 h-4 w-4" />
              Assistente
            </Button>
            <Button className="bg-[#f26522] hover:bg-[#e55a1f]">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Progresso da Inspeção</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {statusCounts.completed} Concluídos
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  {statusCounts.failed} Falharam
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="mr-1 h-3 w-3" />
                  {statusCounts.in_progress + statusCounts.pending} Restantes
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Geral</span>
                <span className="font-medium">{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-3" />
              <div className="text-xs text-gray-500">
                {statusCounts.completed + statusCounts.failed} de {activeTests.length} testes concluídos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Test Library - Left Sidebar */}
          <div className="lg:col-span-1">
            <TestLibrary onTestDrop={handleTestDrop} />
          </div>

          {/* Test Execution Panel - Main Area */}
          <div className="lg:col-span-3">
            <TestPanel
              activeTests={activeTests}
              onTestStatusChange={handleTestStatusChange}
              onAddObservation={handleAddObservation}
              onRemoveTest={(testId) => 
                setActiveTests(prev => prev.filter(test => test.id !== testId))
              }
            />
          </div>
        </div>

        {/* Voice Assistant Modal */}
        <VoiceAssistant
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          onCommand={(command) => {
            console.log('Voice command:', command);
            // Handle voice commands here
          }}
        />

        {/* Observation Modal */}
        <ObservationModal
          isOpen={isObservationModalOpen}
          onClose={() => setIsObservationModalOpen(false)}
          onSave={handleSaveObservation}
          testName={
            selectedTestForObservation 
              ? activeTests.find(t => t.id === selectedTestForObservation)?.test.name || ''
              : ''
          }
        />
      </div>
    </AppLayout>
  );
};

export default InspectionExecution;