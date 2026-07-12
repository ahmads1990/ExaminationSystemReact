export interface StartExamAttemptRequest {
    examId: number;
}

export interface SubmitAnswerRequest {
    questionId: number;
    choiceId: number;
}
