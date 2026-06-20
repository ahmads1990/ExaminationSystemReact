export enum UserType
{
    Student = "student",
    Instructor = "instructor"
}
export enum LevelOptions
{
    HighSchool = "HighSchool",
    Bachelor = "Bachelor",
    Master = "Master"
}

export enum ExamType { Quiz = "Quiz", Final = "Final" }
export enum QuestionLevel { Easy = 0, Medium = 1, Hard = 2 }

export const QuestionLevelInfo: Record<string | number, { label: string; color: string }> = {
    [QuestionLevel.Easy]: { label: "Easy", color: "success" },
    "Easy": { label: "Easy", color: "success" },
    [QuestionLevel.Medium]: { label: "Medium", color: "warning" },
    "Medium": { label: "Medium", color: "warning" },
    [QuestionLevel.Hard]: { label: "Hard", color: "danger" },
    "Hard": { label: "Hard", color: "danger" }
};
export enum SortingDirection { Ascending = 0, Descending = 1 }
export enum ExamStatus {
    Draft = "Draft",
    Published = "Published",
    Archived = "Archived"
}
