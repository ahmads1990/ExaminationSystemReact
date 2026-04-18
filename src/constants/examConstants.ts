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
        bg: "var(--color-primary-50)", 
        border: "var(--color-primary-500)", 
        text: "var(--color-primary-700)" 
    },
    [ExamType.Final]: { 
        bg: "var(--surface-bg)", 
        border: "var(--color-info)", 
        text: "var(--color-secondary-800)" 
    },
};

export const EXAM_STATUS_COLORS = {
    published: {
        bg: "var(--color-primary-50)",
        border: "var(--color-primary-100)",
        text: "var(--color-primary-700)",
    },
    draft: {
        bg: "#FFFBEB", // or a warning light tone from index.css if exists
        border: "#FEF3C7",
        text: "var(--color-accent-700)",
    }
};
