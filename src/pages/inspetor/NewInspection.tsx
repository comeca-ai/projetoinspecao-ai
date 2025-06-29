import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Save, 
  Plus,
  Calendar,
  MapPin,
  User,
  Building,
  FileText,
  Clock,
  Zap,
  Wind,
  Sun,
  Shield,
  Settings
} from 'lucide-react';

interface Test {
  id: string;
  name: string;
  category: string;
  description: string;
  required: boolean;
  estimated_time: number;
}

interface NewInspectionData {
  title: string;
  client_name: string;
  client_email: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  scheduled_date: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  selectedTests: Test[];
}

const NewInspection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inspectionData, setInspectionData] = useState<NewInspectionData>({
    title: '',
    client_name: '',
    client_email: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    scheduled_date: '',
    type: '',
    priority: 'medium',
    description: '',
    selectedTests: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock test library - same as execution page
  const availableTests: Test[] = [
    // Elétrica
    {
      id: '1',
      name: 'Teste de Continuidade',
      category: 'Elétrica',
      description: 'Verificação da continuidade dos condutores',
      required: true,
      estimated_time: 15
    },
    {
      id: '2',
      name: 'Medição de Isolamento',
      category: 'Elétrica',
      description: 'Teste de resistência de isolamento',
      required: true,
      estimated_time: 20
    },
    {
      id: '3',
      name: 'Verificação de Aterramento',
      category: 'Elétrica',
      description: 'Teste do sistema de aterramento',
      required: true,
      estimated_time: 25
    },
    // HVAC
    {
      id: '4',
      name: 'Teste de Pressão',
      category: 'HVAC',
      description: 'Verificação da pressão do sistema',
      required: false,
      estimated_time: 30
    },
    {
      id: '5',
      name: 'Análise de Fluxo de Ar',
      category: 'HVAC',
      description: 'Medição do fluxo de ar nos dutos',
      required: false,
      estimated_time: 45
    },
    // Solar
    {
      id: '6',
      name: 'Medição de Irradiação',
      category: 'Solar',
      description: 'Teste de eficiência dos painéis solares',
      required: false,
      estimated_time: 20
    },
    // Segurança
    {
      id: '7',
      name: 'Teste de Alarme',
      category: 'Segurança',
      description: 'Verificação do sistema de alarme',
      required: true,
      estimated_time: 15
    },
    // Automação
    {
      id: '8',
      name: 'Teste de Sensores',
      category: 'Automação',
      description: 'Verificação dos sensores automatizados',
      required: false,
      estimated_time: 35
    }
  ];

  const categories = [
    { id: 'Elétrica', icon: Zap, color: 'text-yellow-600' },
    { id: 'HVAC', icon: Wind, color: 'text-blue-600' },
    { id: 'Solar', icon: Sun, color: 'text-orange-600' },
    { id: 'Segurança', icon: Shield, color: 'text-red-600' },
    { id: 'Automação', icon: Settings, color: 'text-purple-600' }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = availableTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (field: keyof NewInspectionData, value: string) => {
    setInspectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTest = (test: Test) => {
    const isAlreadySelected = inspectionData.selectedTests.some(t => t.id === test.id);
    if (isAlreadySelected) {
      toast({
        title: "Teste já adicionado",
        description: `${test.name} já está na lista de testes`,
        variant: "destructive"
      });
      return;
    }

    setInspectionData(prev => ({
      ...prev,
      selectedTests: [...prev.selectedTests, test]
    }));

    toast({
      title: "Teste adicionado",
      description: `${test.name} foi adicionado à inspeção`,
    });
  };

  const handleRemoveTest = (testId: string) => {
    setInspectionData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.filter(t => t.id !== testId)
    }));
  };

  const getTotalEstimatedTime = () => {
    return inspectionData.selectedTests.reduce((total, test) => total + test.estimated_time, 0);
  };

  const handleSubmit = async () => {
    // Validation
    if (!inspectionData.title || !inspectionData.client_name || !inspectionData.location || !inspectionData.scheduled_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (inspectionData.selectedTests.length === 0) {
      toast({
        title: "Testes obrigatórios",
        description: "Adicione pelo menos um teste à inspeção",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Inspeção criada com sucesso!",
        description: `${inspectionData.title} foi criada e está pronta para execução`,
      });

      // Navigate to the new inspection (mock ID)
      const newInspectionId = `insp-${Date.now()}`;
      navigate(`/inspections/${newInspectionId}/execute`);
      
    } catch (error) {
      toast({
        title: "Erro ao criar inspeção",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/inspections');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nova Inspeção</h1>
              <p className="text-gray-600">Configure os detalhes e testes para a nova inspeção</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#f26522] hover:bg-[#e55a1f]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Inspeção
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Testes Selecionados</p>
                  <p className="font-medium">{inspectionData.selectedTests.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tempo Estimado</p>
                  <p className="font-medium">{getTotalEstimatedTime()} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{inspectionData.client_name || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Data Agendada</p>
                  <p className="font-medium">
                    {inspectionData.scheduled_date ? 
                      new Date(inspectionData.scheduled_date).toLocaleDateString('pt-BR') : 
                      'Não agendada'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form - Left side (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Inspeção *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Inspeção Elétrica - Painel Principal"
                      value={inspectionData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Inspeção</Label>
                    <Select value={inspectionData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eletrica">Elétrica</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="solar">Solar</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                        <SelectItem value="estrutural">Estrutural</SelectItem>
                        <SelectItem value="preventiva">Preventiva</SelectItem>
                        <SelectItem value="corretiva">Corretiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_date">Data Agendada *</Label>
                    <Input
                      id="scheduled_date"
                      type="datetime-local"
                      value={inspectionData.scheduled_date}
                      onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={inspectionData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva os objetivos e detalhes desta inspeção..."
                    value={inspectionData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">Nome do Cliente *</Label>
                    <Input
                      id="client_name"
                      placeholder="Ex: Empresa ABC Ltda"
                      value={inspectionData.client_name}
                      onChange={(e) => handleInputChange('client_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_email">Email do Cliente</Label>
                    <Input
                      id="client_email"
                      type="email"
                      placeholder="contato@empresa.com"
                      value={inspectionData.client_email}
                      onChange={(e) => handleInputChange('client_email', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Nome do Local *</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Edifício Comercial Centro, Sala 1205"
                    value={inspectionData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, complemento"
                      value={inspectionData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={inspectionData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      value={inspectionData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Testes Selecionados ({inspectionData.selectedTests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {inspectionData.selectedTests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 mb-2" />
                    <p>Nenhum teste selecionado</p>
                    <p className="text-sm">Use a biblioteca ao lado para adicionar testes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inspectionData.selectedTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{test.name}</h4>
                            <Badge variant="secondary">{test.category}</Badge>
                            {test.required && (
                              <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{test.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {test.estimated_time} min
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTest(test.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Test Library - Right side (1 column) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Biblioteca de Testes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <Input
                  placeholder="Buscar testes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Todos
                  </Button>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-1"
                      >
                        <Icon className={`h-3 w-3 ${category.color}`} />
                        {category.id}
                      </Button>
                    );
                  })}
                </div>

                {/* Test List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTests.map((test) => {
                    const isSelected = inspectionData.selectedTests.some(t => t.id === test.id);
                    return (
                      <div
                        key={test.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-green-50 border-green-200' 
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                        onClick={() => !isSelected && handleAddTest(test)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{test.name}</h4>
                              {test.required && (
                                <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{test.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">{test.category}</Badge>
                              <span className="text-xs text-gray-500">
                                <Clock className="inline h-3 w-3 mr-1" />
                                {test.estimated_time}min
                              </span>
                            </div>
                          </div>
                          {isSelected ? (
                            <Badge variant="default" className="text-xs">Adicionado</Badge>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredTests.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Nenhum teste encontrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewInspection;