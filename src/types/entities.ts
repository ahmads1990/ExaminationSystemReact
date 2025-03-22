export interface Choice {
    id: number;
    body: string;
}

export interface Question {
    id: number;
    body: string;
    score: number;
    questionLevel: number;
    answerOrder: number;
    choices: Choice[];
}
