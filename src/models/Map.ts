import { GoalMap } from '../types';

export class Map {
    constructor(public goalMap: GoalMap) {}

    extractCoords(): Array<{ row: number, column: number, type: string }> {
        const coordinates: Array<{ row: number, column: number, type: string }> = [];

        this.goalMap.goal.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                if (cell.includes('_') || cell === 'POLYANET') {
                    coordinates.push({ row: rowIndex, column: columnIndex, type: cell });
                }
            });
        });

        return coordinates;
    }

}
