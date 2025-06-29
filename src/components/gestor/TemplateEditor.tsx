import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical,
  Clock,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';

interface Test {
  id: string;
  name: string;
  category: string;
  description: string;
  required: boolean;
  estimatedTime: number;
  instructions: string[];
}

interface Template {
  id?: string;
  name: string;
  description: string;
  category: string;
  testsCount: number;
  estimatedTime: number;
  isPublic: boolean;
  isStarred: boolean;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  usageCount: number;
  rating: number;
  tags: string[];
}

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: any) => void;
  template?: Template | null;
}

const mockAvailableTests: Test[] = [
  {
    id: 'elec-001',
    name: 'Teste de Continuidade',
    category: 'Elétrica',
    description: 'Verificação da continuidade dos condutores',
    required: true,
    estimatedTime: 15,
    instructions: ['Desligue a energia', 'Configure o multímetro', 'Teste cada condutor']
  },
  {
    id: 'elec-002',
    name: 'Medição de Isolamento',
    category: 'Elétrica',
    description: 'Teste de resistência de isolamento',
    required: true,
    estimatedTime: 20,
    instructions: ['Use megôhmetro calibrado', 'Aplique tensão adequada', 'Registre valores']
  },
  {
    id: 'hvac-001',
    name: 'Teste de Pressão',
    category: 'HVAC',
    description: 'Verificação de pressão do sistema',
    required: true,
    estimatedTime: 30,
    instructions: ['Conecte manômetros', 'Pressurize o sistema', 'Verifique vazamentos']
  }
];

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  template
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isPublic: false,
    tags: [] as string[]
  });

  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [newTag, setNewTag] = useState('');
  const [draggedTest, setDraggedTest] = useState<Test | null>(null);

  const categories = ['Elétrica', 'HVAC', 'Solar', 'Segurança', 'Estrutural', 'Automação'];

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        isPublic: template.isPublic,
        tags: template.tags
      });
      // In a real app, you'd load the template's tests here
      setSelectedTests(mockAvailableTests.slice(0, 2));
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        isPublic: false,
        tags: []
      });
      setSelectedTests([]);
    }
  }, [template]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addTestToTemplate = (test: Test) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(prev => [...prev, test]);
    }
  };

  const removeTestFromTemplate = (testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId));
  };

  const moveTest = (fromIndex: number, toIndex: number) => {
    const newTests = [...selectedTests];
    const [movedTest] = newTests.splice(fromIndex, 1);
    newTests.splice(toIndex, 0, movedTest);
    setSelectedTests(newTests);
  };

  const getTotalEstimatedTime = () => {
    return selectedTests.reduce((total, test) => total + test.estimatedTime, 0);
  };

  const handleSave = () => {
    const templateData = {
      ...formData,
      tests: selectedTests,
      testsCount: selectedTests.length,
      estimatedTime: getTotalEstimatedTime()
    };
    onSave(templateData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      isPublic: false,
      tags: []
    });
    setSelectedTests([]);
    setNewTag('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Template' : 'Criar Novo Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Template Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template *</Label>
                  <Input
                    id="name"
                    placeholder="Nome do template"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o propósito do template"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublic">Template Público</Label>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Template Stats */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total de Testes:</span>
                    <span className="font-medium">{selectedTests.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tempo Estimado:</span>
                    <span className="font-medium">{getTotalEstimatedTime()}min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Testes Obrigatórios:</span>
                    <span className="font-medium">
                      {selectedTests.filter(t => t.required).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Tests */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Testes Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {mockAvailableTests.map((test) => (
                  <div
                    key={test.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-[#f26522] transition-colors"
                    onClick={() => addTestToTemplate(test)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{test.name}</span>
                      {test.required && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                          <AlertCircle className="mr-1 h-2 w-2" />
                          Obrigatório
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs">{test.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.estimatedTime}min
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Selected Tests */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Testes do Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {selectedTests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Nenhum teste selecionado</p>
                    <p className="text-xs">Clique nos testes disponíveis para adicionar</p>
                  </div>
                ) : (
                  selectedTests.map((test, index) => (
                    <div
                      key={test.id}
                      className="p-3 border rounded-lg bg-blue-50 border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-sm">{test.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestFromTemplate(test.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="outline" className="text-xs">{test.category}</Badge>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          {test.estimatedTime}min
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedTests.length} testes • {getTotalEstimatedTime()} minutos estimados
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || !formData.category || selectedTests.length === 0}
              className="bg-[#f26522] hover:bg-[#e55a1f]"
            >
              <Save className="mr-2 h-4 w-4" />
              {template ? 'Atualizar' : 'Criar'} Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditor;