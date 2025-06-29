
import { supabase } from '@/lib/supabase';
import { Inspection, Test, ActiveTest } from '@/types/inspection';
import { withPermission, AuthContext } from '@/utils/serverAuth';
import { ForbiddenError, NotFoundError } from '@/utils/errorHandler';

// Fetch all inspections for the current user
export const getInspections = withPermission(
  async (userId: string): Promise<Inspection[]> => {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching inspections:', error);
      throw error;
    }

    return data as Inspection[];
  },
  'view_inspection',
  (userId) => ({ userId })
);

// Fetch a single inspection by its ID
export const getInspectionById = withPermission(
  async (id: string, userId?: string): Promise<Inspection | null> => {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching inspection:', error);
      throw error;
    }

    if (!data) {
      throw new NotFoundError(`Inspection with ID ${id} not found`);
    }

    return data as Inspection;
  },
  'view_inspection',
  (id, userId) => ({ userId, resourceId: id, resourceType: 'inspection' })
);

// Fetch all tests for a given inspection
export const getTestsForInspection = withPermission(
  async (inspectionId: string, userId?: string): Promise<ActiveTest[]> => {
    // First verify the inspection exists and user has access to it
    const inspection = await getInspectionById(inspectionId, userId);
    
    if (!inspection) {
      throw new NotFoundError(`Inspection with ID ${inspectionId} not found`);
    }
    
    const { data, error } = await supabase
      .from('inspection_tests')
      .select('*, tests(*)')
      .eq('inspection_id', inspectionId);

    if (error) {
      console.error('Error fetching tests for inspection:', error);
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      test: item.tests,
      status: item.status,
      result: item.result,
      observations: item.observations,
      media: item.media,
      startTime: item.start_time,
      endTime: item.end_time,
    })) as ActiveTest[];
  },
  'view_inspection',
  (inspectionId, userId) => ({ userId, resourceId: inspectionId, resourceType: 'inspection' })
);

// Add a test to an inspection
export const addTestToInspection = withPermission(
  async (inspectionId: string, testId: string, userId?: string): Promise<ActiveTest> => {
    // First verify the inspection exists and user has edit access to it
    const inspection = await getInspectionById(inspectionId, userId);
    
    if (!inspection) {
      throw new NotFoundError(`Inspection with ID ${inspectionId} not found`);
    }
    
    // Check if inspection is completed
    if (inspection.status === 'completed') {
      throw new ForbiddenError('Cannot modify a completed inspection');
    }
    
    const { data, error } = await supabase
      .from('inspection_tests')
      .insert({ inspection_id: inspectionId, test_id: testId, status: 'pending' })
      .select('*, tests(*)')
      .single();

    if (error) {
      console.error('Error adding test to inspection:', error);
      throw error;
    }

    return {
      id: data.id,
      test: data.tests,
      status: data.status,
      result: data.result,
      observations: data.observations,
      media: data.media,
      startTime: data.start_time,
      endTime: data.end_time,
    } as ActiveTest;
  },
  'edit_inspection',
  (inspectionId, testId, userId) => ({ userId, resourceId: inspectionId, resourceType: 'inspection' })
);

// Update the status of a test in an inspection
export const updateTestStatus = withPermission(
  async (
    testId: string,
    status: ActiveTest['status'],
    result?: string,
    userId?: string
  ): Promise<ActiveTest> => {
    // First get the test to find its inspection
    const { data: testData, error: testError } = await supabase
      .from('inspection_tests')
      .select('inspection_id')
      .eq('id', testId)
      .single();
    
    if (testError || !testData) {
      throw new NotFoundError(`Test with ID ${testId} not found`);
    }
    
    // Verify user has permission to edit this inspection
    const inspectionId = testData.inspection_id;
    const inspection = await getInspectionById(inspectionId, userId);
    
    if (!inspection) {
      throw new NotFoundError(`Inspection with ID ${inspectionId} not found`);
    }
    
    // Check if inspection is completed
    if (inspection.status === 'completed') {
      throw new ForbiddenError('Cannot modify a completed inspection');
    }
    
    const { data, error } = await supabase
      .from('inspection_tests')
      .update({ status, result, end_time: new Date() })
      .eq('id', testId)
      .select('*, tests(*)')
      .single();

    if (error) {
      console.error('Error updating test status:', error);
      throw error;
    }

    return {
      id: data.id,
      test: data.tests,
      status: data.status,
      result: data.result,
      observations: data.observations,
      media: data.media,
      startTime: data.start_time,
      endTime: data.end_time,
    } as ActiveTest;
  },
  'edit_inspection',
  (testId, status, result, userId) => ({ userId }) // Full context will be determined inside the function
);

// Add an observation to a test
export const addObservationToTest = withPermission(
  async (
    testId: string,
    observation: string,
    media: string[],
    userId?: string
  ): Promise<ActiveTest> => {
    // First get the test to find its inspection
    const { data: testData, error: testError } = await supabase
      .from('inspection_tests')
      .select('inspection_id')
      .eq('id', testId)
      .single();
    
    if (testError || !testData) {
      throw new NotFoundError(`Test with ID ${testId} not found`);
    }
    
    // Verify user has permission to edit this inspection
    const inspectionId = testData.inspection_id;
    const inspection = await getInspectionById(inspectionId, userId);
    
    if (!inspection) {
      throw new NotFoundError(`Inspection with ID ${inspectionId} not found`);
    }
    
    // Check if inspection is completed
    if (inspection.status === 'completed') {
      throw new ForbiddenError('Cannot modify a completed inspection');
    }
    
    const { data, error } = await supabase
      .from('inspection_tests')
      .update({ observations: observation, media })
      .eq('id', testId)
      .select('*, tests(*)')
      .single();

    if (error) {
      console.error('Error adding observation to test:', error);
      throw error;
    }

    return {
      id: data.id,
      test: data.tests,
      status: data.status,
      result: data.result,
      observations: data.observations,
      media: data.media,
      startTime: data.start_time,
      endTime: data.end_time,
    } as ActiveTest;
  },
  'edit_inspection',
  (testId, observation, media, userId) => ({ userId }) // Full context will be determined inside the function
);

// Remove a test from an inspection
export const removeTestFromInspection = withPermission(
  async (testId: string, userId?: string): Promise<void> => {
    // First get the test to find its inspection
    const { data: testData, error: testError } = await supabase
      .from('inspection_tests')
      .select('inspection_id')
      .eq('id', testId)
      .single();
    
    if (testError || !testData) {
      throw new NotFoundError(`Test with ID ${testId} not found`);
    }
    
    // Verify user has permission to edit this inspection
    const inspectionId = testData.inspection_id;
    const inspection = await getInspectionById(inspectionId, userId);
    
    if (!inspection) {
      throw new NotFoundError(`Inspection with ID ${inspectionId} not found`);
    }
    
    // Check if inspection is completed
    if (inspection.status === 'completed') {
      throw new ForbiddenError('Cannot modify a completed inspection');
    }
    
    const { error } = await supabase
      .from('inspection_tests')
      .delete()
      .eq('id', testId);

    if (error) {
      console.error('Error removing test from inspection:', error);
      throw error;
    }
  },
  'edit_inspection',
  (testId, userId) => ({ userId }) // Full context will be determined inside the function
);
