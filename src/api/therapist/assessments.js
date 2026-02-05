/**
 * Therapist Assessments API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get assessments list
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'all'|'draft'|'published'} [filters.status='all'] - Assessment status filter
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Assessments list with pagination
 * @example
 * const result = await getAssessments(therapistId, { status: 'published', page: 1 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     assessments: [{
 * //       id: "assessment_001",
 * //       title: "Anxiety Assessment",
 * //       description: "Comprehensive anxiety evaluation",
 * //       category: "Mental Health",
 * //       questionCount: 15,
 * //       status: "published",
 * //       createdAt: "2025-10-20T10:00:00Z"
 * //     }],
 * //     pagination: { currentPage: 1, totalPages: 2, totalItems: 25 }
 * //   }
 * // }
 */
export const getAssessments = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/assessments', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get assessment details by ID
 * @param {string} assessmentId - Assessment ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Assessment details with complete question set
 * @example
 * const result = await getAssessmentById(assessmentId, therapistId);
 * // Returns full assessment with questions array, scoring criteria, and metadata
 */
export const getAssessmentById = async (assessmentId, therapistId) => {
    const response = await APIInstance.get(`/th/assessments/${assessmentId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Create new assessment
 * @param {Object} assessmentData - Assessment details
 * @param {string} assessmentData.therapist_id - Therapist ID
 * @param {string} assessmentData.title - Assessment title
 * @param {string} assessmentData.description - Assessment description
 * @param {string} assessmentData.category - Assessment category (e.g., "Mental Health", "Anxiety")
 * @param {Array<Object>} assessmentData.questions - Array of question objects
 * @param {string} assessmentData.questions[].text - Question text
 * @param {'multiple_choice'|'rating'|'text'} assessmentData.questions[].type - Question type
 * @param {Array<string>} [assessmentData.questions[].options] - Options for multiple choice
 * @param {number} [assessmentData.questions[].min] - Min value for rating
 * @param {number} [assessmentData.questions[].max] - Max value for rating
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Created assessment
 * @example
 * const result = await createAssessment({
 *   therapist_id: therapistId,
 *   title: "Anxiety Assessment",
 *   description: "Comprehensive anxiety evaluation",
 *   category: "Mental Health",
 *   questions: [
 *     {
 *       text: "How often do you feel anxious?",
 *       type: "multiple_choice",
 *       options: ["Never", "Sometimes", "Often", "Always"]
 *     },
 *     {
 *       text: "Rate your anxiety level",
 *       type: "rating",
 *       min: 1,
 *       max: 10
 *     }
 *   ]
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Assessment created successfully",
 * //   data: { assessmentId: "assessment_001" }
 * // }
 */
export const createAssessment = async (assessmentData) => {
    const response = await APIInstance.post('/th/assessments', assessmentData);
    return response.data;
};

/**
 * Update assessment
 * @param {string} assessmentId - Assessment ID
 * @param {Object} updateData - Update details (same fields as createAssessment)
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated assessment
 */
export const updateAssessment = async (assessmentId, updateData) => {
    const response = await APIInstance.put(`/th/assessments/${assessmentId}`, updateData);
    return response.data;
};

/**
 * Delete assessment
 * @param {string} assessmentId - Assessment ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Deletion confirmation
 */
export const deleteAssessment = async (assessmentId, therapistId) => {
    const response = await APIInstance.delete(`/th/assessments/${assessmentId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Assign assessment to client
 * @param {string} assessmentId - Assessment ID
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Assignment confirmation
 * @example
 * const result = await assignAssessment(assessmentId, clientId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Assessment assigned successfully",
 * //   data: {
 * //     assignmentId: "assignment_001",
 * //     clientId: "client_123",
 * //     dueDate: "2025-10-30"
 * //   }
 * // }
 */
export const assignAssessment = async (assessmentId, clientId, therapistId) => {
    const response = await APIInstance.post(`/th/assessments/${assessmentId}/assign`, {
        therapist_id: therapistId,
        clientId
    });
    return response.data;
};

/**
 * Submit assessment results
 * @param {string} assessmentId - Assessment ID
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @param {Object} results - Assessment results data
 * @param {Array<Object>} results.answers - Array of answers
 * @param {string} results.answers[].questionId - Question ID
 * @param {any} results.answers[].answer - Answer value
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Submission confirmation with score
 * @example
 * const result = await submitAssessmentResults(assessmentId, clientId, therapistId, {
 *   answers: [
 *     { questionId: "q1", answer: "Often" },
 *     { questionId: "q2", answer: 7 }
 *   ]
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Assessment results submitted successfully",
 * //   data: {
 * //     resultId: "result_001",
 * //     score: 75,
 * //     interpretation: "Moderate anxiety level",
 * //     submittedAt: "2025-10-23T16:00:00Z"
 * //   }
 * // }
 */
export const submitAssessmentResults = async (assessmentId, clientId, therapistId, results) => {
    const response = await APIInstance.post(`/th/assessments/${assessmentId}/results`, {
        therapist_id: therapistId,
        clientId,
        results
    });
    return response.data;
};
