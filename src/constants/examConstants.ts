import { ExamType, ExamStatus } from "../enums";

export const EXAM_TYPE_LABELS: Record<string, string> = {
    [ExamType.Quiz]: "Quiz",
    [ExamType.Final]: "Final",
};

export const EXAM_STATUS_LABELS: Record<string, string> = {
    [ExamStatus.Draft]: "Draft",
    [ExamStatus.Published]: "Published",
    [ExamStatus.Archived]: "Archived",
};

export const EXAM_TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    [ExamType.Quiz]: { 
        bg: "var(--type-quiz-bg)", 
        border: "var(--type-quiz-border)", 
        text: "var(--type-quiz-text)" 
    },
    [ExamType.Final]: { 
        bg: "var(--type-final-bg)", 
        border: "var(--type-final-border)", 
        text: "var(--type-final-text)" 
    },
};

export const EXAM_STATUS_COLORS = {
    published: {
        bg: "var(--status-published-bg)",
        border: "var(--status-published-border)",
        text: "var(--status-published-text)",
    },
    draft: {
        bg: "var(--status-draft-bg)",
        border: "var(--status-draft-border)",
        text: "var(--status-draft-text)",
    }
};
