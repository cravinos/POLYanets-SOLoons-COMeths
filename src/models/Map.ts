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

    static getAdjacentPositions(row: number, col: number, rows: number, cols: number): [number, number][] {
        const positions: [number, number][] = [];
        if (row > 0) positions.push([row - 1, col]); // up
        if (row < rows - 1) positions.push([row + 1, col]); // down
        if (col > 0) positions.push([row, col - 1]); // left
        if (col < cols - 1) positions.push([row, col + 1]); // right
        return positions;
    }
}
