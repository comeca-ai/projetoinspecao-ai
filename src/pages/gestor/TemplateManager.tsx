import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  LayoutTemplate,
  Copy,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Clock,
  Users
} from 'lucide-react';
import TemplateEditor from '@/components/gestor/TemplateEditor';
import TemplateLibrary from '@/components/gestor/TemplateLibrary';

interface Template {
  id: string;
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

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Inspeção Elétrica Residencial',
    description: 'Template completo para inspeção elétrica em residências',
    category: 'Elétrica',
    testsCount: 12,
    estimatedTime: 90,
    isPublic: true,
    isStarred: true,
    createdBy: 'João Silva',
    createdAt: '2023-12-01',
    lastModified: '2024-01-10',
    usageCount: 45,
    rating: 4.8,
    tags: ['residencial', 'básico', 'padrão']
  },
  {
    id: '2',
    name: 'Verificação HVAC Comercial',
    description: 'Template para sistemas de climatização em edifícios comerciais',
    category: 'HVAC',
    testsCount: 18,
    estimatedTime: 120,
    isPublic: false,
    isStarred: false,
    createdBy: 'Maria Santos',
    createdAt: '2023-11-15',
    lastModified: '2024-01-05',
    usageCount: 23,
    rating: 4.6,
    tags: ['comercial', 'avançado', 'climatização']
  },
  {
    id: '3',
    name: 'Inspeção Solar Básica',
    description: 'Template para inspeção de sistemas fotovoltaicos pequenos',
    category: 'Solar',
    testsCount: 8,
    estimatedTime: 60,
    isPublic: true,
    isStarred: true,
    createdBy: 'Carlos Lima',
    createdAt: '2023-10-20',
    lastModified: '2023-12-15',
    usageCount: 67,
    rating: 4.9,
    tags: ['solar', 'básico', 'fotovoltaico']
  }
];

const TemplateManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const categories = ['all', 'Elétrica', 'HVAC', 'Solar', 'Segurança', 'Estrutural', 'Automação'];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handleCloneTemplate = (template: Template) => {
    console.log('Cloning template:', template.name);
    // Here you would create a copy of the template
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Deleting template:', templateId);
    // Here you would delete the template
  };

  const handleSaveTemplate = (templateData: any) => {
    console.log('Saving template:', templateData);
    setIsEditorOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciador de Templates
            </h1>
            <p className="text-gray-600 mt-2">
              Crie e gerencie templates de inspeção para sua equipe
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button 
              className="bg-[#f26522] hover:bg-[#e55a1f]"
              onClick={handleCreateTemplate}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTemplates.length}</div>
              <p className="text-xs text-muted-foreground">Criados pela equipe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">Inspeção Solar Básica</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Melhor Avaliado</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">Média das avaliações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">90</div>
              <p className="text-xs text-muted-foreground">Minutos por inspeção</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isStarred && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      {template.isPublic ? (
                        <Badge className="bg-green-100 text-green-800">Público</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Privado</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Template Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-[#f26522]">{template.testsCount}</div>
                    <div className="text-xs text-gray-600">Testes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{template.estimatedTime}min</div>
                    <div className="text-xs text-gray-600">Duração</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{template.usageCount}</div>
                    <div className="text-xs text-gray-600">Usos</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avaliação:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(template.rating)}
                    <span className="text-sm font-medium ml-1">{template.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Criado por: {template.createdBy}</div>
                  <div>Modificado: {formatDate(template.lastModified)}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCloneTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum template encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando seu primeiro template.'
              }
            </p>
            <div className="mt-6">
              <Button 
                className="bg-[#f26522] hover:bg-[#e55a1f]"
                onClick={handleCreateTemplate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Template
              </Button>
            </div>
          </div>
        )}

        {/* Template Editor Modal */}
        <TemplateEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveTemplate}
          template={selectedTemplate}
        />
      </div>
    </AppLayout>
  );
};

export default TemplateManager;