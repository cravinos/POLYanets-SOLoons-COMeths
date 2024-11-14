/**
 * Designing my types for polyanet
 * polyanet has a row coordinate
 * polyanet has a column coordinate
 * 
 * 
 * goal is goal.txt that holds the keys coordinate string and values are POLYANET 
 */


export type CellType = 'SPACE' | 'POLYANET';

export type Row = CellType[];

export type GoalMap = {
    goal: Row[];
}
export type CandidateID = string;
