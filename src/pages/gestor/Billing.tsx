import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Package, TrendingUp, Calendar, Download, Settings, AlertCircle, CheckCircle } from 'lucide-react';

const Billing: React.FC = () => {
  // Mock billing data
  const billingHistory = [
    { id: 1, date: '2024-12-15', amount: 'R$ 239,00', status: 'paid', invoice: 'INV-2024-12-001' },
    { id: 2, date: '2024-11-15', amount: 'R$ 239,00', status: 'paid', invoice: 'INV-2024-11-001' },
    { id: 3, date: '2024-10-15', amount: 'R$ 239,00', status: 'paid', invoice: 'INV-2024-10-001' },
  ];

  const usageStats = {
    inspections: { current: 45, limit: 100 },
    storage: { current: 32, limit: 50 },
    teamMembers: { current: 3, limit: 10 }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planos & Cobrança</h1>
            <p className="text-gray-600 mt-2">
              Gerencie seu plano e acompanhe o uso
            </p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">Profissional</div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <p className="text-xs text-muted-foreground">R$ 239/mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Cobrança</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 Jan</div>
              <p className="text-xs text-muted-foreground">2025 - R$ 239,00</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32GB</div>
              <p className="text-xs text-muted-foreground">de 50GB usados (64%)</p>
              <Progress value={64} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Método de Pagamento</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">•••• 4242</div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground">Visa - Válido até 12/2027</p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Uso do Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Inspeções este mês</span>
                  <span className="text-sm text-gray-600">
                    {usageStats.inspections.current}/{usageStats.inspections.limit}
                  </span>
                </div>
                <Progress value={(usageStats.inspections.current / usageStats.inspections.limit) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Armazenamento</span>
                  <span className="text-sm text-gray-600">
                    {usageStats.storage.current}GB/{usageStats.storage.limit}GB
                  </span>
                </div>
                <Progress value={(usageStats.storage.current / usageStats.storage.limit) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Membros da equipe</span>
                  <span className="text-sm text-gray-600">
                    {usageStats.teamMembers.current}/{usageStats.teamMembers.limit}
                  </span>
                </div>
                <Progress value={(usageStats.teamMembers.current / usageStats.teamMembers.limit) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Recursos do Plano Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Até 100 inspeções por mês</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>50GB de armazenamento</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Até 10 membros na equipe</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Templates personalizados</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Relatórios avançados</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Suporte prioritário</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex gap-3">
                <Button variant="outline">
                  Alterar Plano
                </Button>
                <Button variant="outline">
                  Cancelar Assinatura
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Faturas</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar Todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingHistory.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{bill.invoice}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(bill.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pago
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold">{bill.amount}</div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert for upcoming renewal */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">
                  Renovação Automática Ativada
                </div>
                <div className="text-sm text-blue-700">
                  Sua assinatura será renovada automaticamente em 15 de Janeiro de 2025.
                  Você pode cancelar a qualquer momento.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Billing;