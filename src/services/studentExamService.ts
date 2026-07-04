import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { AvailableExamDto } from "../api/responses/StudentExamResponses";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.STUDENT_EXAMS;

const StudentExamService = {
    getAvailableExams: async (): Promise<ApiResponse<AvailableExamDto[]>> => {
        const response = await api.get<ApiResponse<AvailableExamDto[]>>(`${serviceEndpoint}/available`);
        return response.data;
    }
};

export default StudentExamService;
