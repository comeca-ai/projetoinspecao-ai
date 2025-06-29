import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider, 
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RouteGuard } from '@/components/RouteGuard';
import { PermissionGuard, ActionGuard } from '@/components/PermissionGuard';
import { InspectionActions } from '@/components/InspectionActions';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getInspectionById, 
  getTestsForInspection, 
  addTestToInspection, 
  updateTestStatus,
  removeTestFromInspection 
} from '@/services/inspectionService';
import { Inspection, ActiveTest } from '@/types/inspection';

/**
 * Page component for viewing and managing a single inspection
 */
const InspectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [tests, setTests] = useState<ActiveTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch inspection data
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch inspection details
        const inspectionData = await getInspectionById(id);
        setInspection(inspectionData);
        
        // Fetch tests for this inspection
        const testsData = await getTestsForInspection(id);
        setTests(testsData);
      } catch (err: any) {
        console.error('Error fetching inspection data:', err);
        
        // Handle different error types
        if (err.statusCode === 403) {
          setError('Você não tem permissão para visualizar esta inspeção.');
        } else if (err.statusCode === 404) {
          setError('Inspeção não encontrada.');
        } else {
          setError('Ocorreu um erro ao carregar os dados da inspeção.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);
  
  // Handle adding a new test
  const handleAddTest = async (testId: string) => {
    if (!id || !user) return;
    
    try {
      const newTest = await addTestToInspection(id, testId);
      setTests(prev => [...prev, newTest]);
    } catch (err: any) {
      console.error('Error adding test:', err);
      
      if (err.statusCode === 403) {
        setError('Você não tem permissão para adicionar testes a esta inspeção.');
      } else {
        setError('Ocorreu um erro ao adicionar o teste.');
      }
    }
  };
  
  // Handle updating test status
  const handleUpdateTestStatus = async (testId: string, status: ActiveTest['status'], result?: string) => {
    try {
      const updatedTest = await updateTestStatus(testId, status, result);
      setTests(prev => prev.map(test => test.id === testId ? updatedTest : test));
    } catch (err: any) {
      console.error('Error updating test status:', err);
      
      if (err.statusCode === 403) {
        setError('Você não tem permissão para atualizar o status deste teste.');
      } else {
        setError('Ocorreu um erro ao atualizar o status do teste.');
      }
    }
  };
  
  // Handle removing a test
  const handleRemoveTest = async (testId: string) => {
    try {
      await removeTestFromInspection(testId);
      setTests(prev => prev.filter(test => test.id !== testId));
    } catch (err: any) {
      console.error('Error removing test:', err);
      
      if (err.statusCode === 403) {
        setError('Você não tem permissão para remover testes desta inspeção.');
      } else {
        setError('Ocorreu um erro ao remover o teste.');
      }
    }
  };
  
  // Handle navigation to edit page
  const handleEdit = () => {
    navigate(`/inspections/${id}/edit`);
  };
  
  // Handle deletion of inspection
  const handleDelete = () => {
    // Implementation would go here
    navigate('/inspections');
  };
  
  // Handle sharing inspection
  const handleShare = () => {
    // Implementation would go here
  };
  
  // Handle printing report
  const handlePrint = () => {
    // Implementation would go here
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando inspeção...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/inspections')}
          >
            Voltar para Inspeções
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!inspection) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Inspeção não encontrada.</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/inspections')}
          >
            Voltar para Inspeções
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <RouteGuard permission="view_dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {inspection.title}
          </Typography>
          
          <InspectionActions 
            inspection={inspection}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
            onPrint={handlePrint}
          />
        </Box>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Detalhes da Inspeção</Typography>
            <Chip 
              label={inspection.status === 'completed' ? 'Finalizada' : 'Em andamento'} 
              color={inspection.status === 'completed' ? 'success' : 'primary'} 
            />
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2">Local</Typography>
              <Typography variant="body1">{inspection.location}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2">Data</Typography>
              <Typography variant="body1">
                {new Date(inspection.date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2">Responsável</Typography>
              <Typography variant="body1">{inspection.responsible}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2">Tipo</Typography>
              <Typography variant="body1">{inspection.type}</Typography>
            </Box>
          </Box>
        </Paper>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Testes ({tests.length})</Typography>
          
          <ActionGuard
            action="edit_inspection"
            actionContext={{ inspectionId: inspection.id, status: inspection.status }}
            hideIfUnauthorized
          >
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              disabled={inspection.status === 'completed'}
            >
              Adicionar Teste
            </Button>
          </ActionGuard>
        </Box>
        
        {tests.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              Nenhum teste adicionado a esta inspeção.
            </Typography>
            
            <PermissionGuard
              action="edit_inspection"
              actionContext={{ inspectionId: inspection.id, status: inspection.status }}
            >
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                sx={{ mt: 2 }}
                disabled={inspection.status === 'completed'}
              >
                Adicionar Primeiro Teste
              </Button>
            </PermissionGuard>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {tests.map((test) => (
              <Paper key={test.id} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{test.test.name}</Typography>
                  
                  <Chip 
                    label={
                      test.status === 'pending' ? 'Pendente' :
                      test.status === 'in_progress' ? 'Em andamento' :
                      test.status === 'passed' ? 'Aprovado' :
                      test.status === 'failed' ? 'Reprovado' : 'Desconhecido'
                    }
                    color={
                      test.status === 'pending' ? 'default' :
                      test.status === 'in_progress' ? 'primary' :
                      test.status === 'passed' ? 'success' :
                      test.status === 'failed' ? 'error' : 'default'
                    }
                  />
                </Box>
                
                <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                  {test.test.description}
                </Typography>
                
                <ActionGuard
                  action="edit_inspection"
                  actionContext={{ inspectionId: inspection.id, status: inspection.status }}
                  hideIfUnauthorized
                >
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {test.status === 'pending' && (
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => handleUpdateTestStatus(test.id, 'in_progress')}
                      >
                        Iniciar Teste
                      </Button>
                    )}
                    
                    {test.status === 'in_progress' && (
                      <>
                        <Button 
                          variant="outlined" 
                          color="success"
                          size="small"
                          onClick={() => handleUpdateTestStatus(test.id, 'passed', 'Aprovado')}
                        >
                          Aprovar
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="small"
                          onClick={() => handleUpdateTestStatus(test.id, 'failed', 'Reprovado')}
                        >
                          Reprovar
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="outlined" 
                      color="error"
                      size="small"
                      onClick={() => handleRemoveTest(test.id)}
                    >
                      Remover
                    </Button>
                  </Box>
                </ActionGuard>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </RouteGuard>
  );
};

export default InspectionPage;
