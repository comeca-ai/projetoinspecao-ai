import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Zap, 
  Thermometer, 
  Sun, 
  Settings, 
  Shield, 
  Home,
  Clock,
  AlertCircle
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

interface TestLibraryProps {
  onTestDrop: (test: Test) => void;
}

const mockTests: Test[] = [
  // Electrical Tests
  {
    id: 'elec-001',
    name: 'Teste de Continuidade',
    category: 'Elétrica',
    description: 'Verificação da continuidade dos condutores',
    required: true,
    estimated_time: 15,
    instructions: [
      'Desligue a energia do circuito',
      'Configure o multímetro para continuidade',
      'Teste cada condutor individualmente'
    ]
  },
  {
    id: 'elec-002',
    name: 'Medição de Isolamento',
    category: 'Elétrica',
    description: 'Teste de resistência de isolamento',
    required: true,
    estimated_time: 20,
    instructions: [
      'Use megôhmetro calibrado',
      'Aplique tensão de teste adequada',
      'Registre valores de resistência'
    ]
  },
  {
    id: 'elec-003',
    name: 'Verificação de Aterramento',
    category: 'Elétrica',
    description: 'Teste do sistema de aterramento',
    required: true,
    estimated_time: 25,
    instructions: [
      'Meça resistência de terra',
      'Verifique continuidade do condutor PE',
      'Teste equipotencialização'
    ]
  },
  // HVAC Tests
  {
    id: 'hvac-001',
    name: 'Teste de Pressão',
    category: 'HVAC',
    description: 'Verificação de pressão do sistema',
    required: true,
    estimated_time: 30,
    instructions: [
      'Conecte manômetros',
      'Pressurize o sistema',
      'Verifique vazamentos'
    ]
  },
  {
    id: 'hvac-002',
    name: 'Medição de Temperatura',
    category: 'HVAC',
    description: 'Controle de temperatura ambiente',
    required: false,
    estimated_time: 10,
    instructions: [
      'Use termômetro calibrado',
      'Meça em pontos estratégicos',
      'Compare com especificações'
    ]
  },
  // Solar Tests
  {
    id: 'solar-001',
    name: 'Teste de Tensão CC',
    category: 'Solar',
    description: 'Medição de tensão dos painéis',
    required: true,
    estimated_time: 20,
    instructions: [
      'Use multímetro para CC',
      'Meça tensão em circuito aberto',
      'Verifique polaridade'
    ]
  },
  {
    id: 'solar-002',
    name: 'Inspeção Visual',
    category: 'Solar',
    description: 'Verificação visual dos painéis',
    required: true,
    estimated_time: 15,
    instructions: [
      'Verifique danos físicos',
      'Inspecione conexões',
      'Documente anomalias'
    ]
  },
  // Security Tests
  {
    id: 'sec-001',
    name: 'Teste de Alarme',
    category: 'Segurança',
    description: 'Verificação do sistema de alarme',
    required: true,
    estimated_time: 20,
    instructions: [
      'Teste sensores de movimento',
      'Verifique sirenes',
      'Teste comunicação central'
    ]
  },
  // Automation Tests
  {
    id: 'auto-001',
    name: 'Teste de Automação',
    category: 'Automação',
    description: 'Verificação de sistemas automatizados',
    required: false,
    estimated_time: 25,
    instructions: [
      'Teste programação',
      'Verifique sensores',
      'Teste comunicação'
    ]
  }
];

const TestLibrary: React.FC<TestLibraryProps> = ({ onTestDrop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Settings },
    { id: 'Elétrica', name: 'Elétrica', icon: Zap },
    { id: 'HVAC', name: 'HVAC', icon: Thermometer },
    { id: 'Solar', name: 'Solar', icon: Sun },
    { id: 'Segurança', name: 'Segurança', icon: Shield },
    { id: 'Automação', name: 'Automação', icon: Home },
  ];

  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const categoryConfig = categories.find(c => c.id === category);
    return categoryConfig?.icon || Settings;
  };

  const handleDragStart = (e: React.DragEvent, test: Test) => {
    e.dataTransfer.setData('application/json', JSON.stringify(test));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(5deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up after drag
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleTestClick = (test: Test) => {
    onTestDrop(test);
  };

  return (
    <Card className="h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Biblioteca de Testes</CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar testes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                <Icon className="mr-1 h-3 w-3" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded">
          💡 <strong>Dica:</strong> Arraste os testes para o painel de execução ou clique para adicionar
        </div>
        
        {filteredTests.map((test) => {
          const Icon = getCategoryIcon(test.category);
          return (
            <div
              key={test.id}
              draggable
              onDragStart={(e) => handleDragStart(e, test)}
              onClick={() => handleTestClick(test)}
              className="p-3 border rounded-lg cursor-move hover:bg-gray-50 hover:border-[#f26522] transition-all duration-200 hover:shadow-md"
              title="Arraste para o painel ou clique para adicionar"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">{test.name}</span>
                </div>
                {test.required && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                    <AlertCircle className="mr-1 h-2 w-2" />
                    Obrigatório
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{test.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {test.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {test.estimated_time}min
                </div>
              </div>
            </div>
          );
        })}

        {filteredTests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Settings className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">Nenhum teste encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestLibrary;