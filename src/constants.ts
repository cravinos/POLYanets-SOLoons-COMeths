export const CANDIDATE_ID = "2aa7ea31-3958-410a-ba41-a3025a960821";

export const dictionary: { [key: string]: { type: number; directions?: string[]; colors?: string[] } } = {
    POLYANET: { type: 0 },
    COMETH: { type: 2, directions: ['up', 'down', 'left', 'right'] },
    SOLOON: { type: 1, colors: ['red', 'white', 'blue', 'purple'] },
};