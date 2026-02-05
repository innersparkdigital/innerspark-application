/**
 * Therapist Assessments Manager
 * Handles assessments API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import {
    getAssessments,
    getAssessmentById,
    createAssessment as createAssessmentAPI,
    updateAssessment as updateAssessmentAPI,
    deleteAssessment,
    assignAssessment as assignAssessmentAPI,
    submitAssessmentResults as submitResultsAPI,
} from '../api/therapist/assessments';

/**
 * Load assessments list from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadAssessments = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('📋 Loading assessments from API with filter:', filters);
        const response = await getAssessments(therapistId, filters);

        if (response.success && response.data) {
            const assessments = response.data.assessments || [];
            console.log('📊 Assessments count:', assessments.length);
            return { success: true, assessments };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format', assessments: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading assessments:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 GET /th/assessments endpoint returns 404');
            return { success: false, error: 'No assessments available', isEmpty: true, assessments: [] };
        }

        return { success: false, error: error?.message || 'Failed to load assessments', assessments: [] };
    }
};

/**
 * Load assessment details by ID
 */
export const loadAssessmentDetails = async (assessmentId: string, therapistId: string) => {
    try {
        console.log('📋 Loading assessment details for ID:', assessmentId);
        const response = await getAssessmentById(assessmentId, therapistId);

        if (response.success && response.data) {
            return { success: true, assessment: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading assessment details:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Assessment not found' };
        }

        return { success: false, error: error?.message || 'Failed to load assessment details' };
    }
};

/**
 * Create a new assessment
 */
export const createAssessment = async (assessmentData: any) => {
    try {
        console.log('📋 Creating new assessment');
        const response = await createAssessmentAPI(assessmentData);

        if (response.success) {
            console.log('✅ Assessment created successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to create assessment' };
        }
    } catch (error: any) {
        console.log('❌ Error creating assessment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Create assessment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to create assessment' };
    }
};

/**
 * Update an assessment
 */
export const updateAssessment = async (assessmentId: string, updateData: any) => {
    try {
        console.log('📋 Updating assessment:', assessmentId);
        const response = await updateAssessmentAPI(assessmentId, updateData);

        if (response.success) {
            console.log('✅ Assessment updated successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update assessment' };
        }
    } catch (error: any) {
        console.log('❌ Error updating assessment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update assessment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update assessment' };
    }
};

/**
 * Delete an assessment
 */
export const deleteAssessmentById = async (assessmentId: string, therapistId: string) => {
    try {
        console.log('📋 Deleting assessment:', assessmentId);
        const response = await deleteAssessment(assessmentId, therapistId);

        if (response.success) {
            console.log('✅ Assessment deleted successfully');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to delete assessment' };
        }
    } catch (error: any) {
        console.log('❌ Error deleting assessment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Delete assessment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to delete assessment' };
    }
};

/**
 * Assign assessment to a client
 */
export const assignAssessment = async (assessmentId: string, clientId: string, therapistId: string) => {
    try {
        console.log('📋 Assigning assessment to client:', clientId);
        const response = await assignAssessmentAPI(assessmentId, clientId, therapistId);

        if (response.success) {
            console.log('✅ Assessment assigned successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to assign assessment' };
        }
    } catch (error: any) {
        console.log('❌ Error assigning assessment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Assign assessment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to assign assessment' };
    }
};

/**
 * Submit assessment results
 */
export const submitAssessmentResults = async (assessmentId: string, clientId: string, therapistId: string, results: any) => {
    try {
        console.log('📋 Submitting assessment results');
        const response = await submitResultsAPI(assessmentId, clientId, therapistId, results);

        if (response.success) {
            console.log('✅ Assessment results submitted');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to submit results' };
        }
    } catch (error: any) {
        console.log('❌ Error submitting results:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Submit results endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to submit results' };
    }
};
