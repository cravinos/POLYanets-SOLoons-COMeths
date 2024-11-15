import { dictionary } from '../constants';

export function determineItemType(typeCode: number): string {
    for (const [key, value] of Object.entries(dictionary)) {
        if (value.type === typeCode) {
            return key.toLowerCase() + 's';
        }
    }
    throw new Error('Unknown item type');
}

export function getAdjacentPositions(row: number, col: number, rows: number, cols: number): [number, number][] {
    const positions: [number, number][] = [];
    if (row > 0) positions.push([row - 1, col]); // up
    if (row < rows - 1) positions.push([row + 1, col]); // down
    if (col > 0) positions.push([row, col - 1]); // left
    if (col < cols - 1) positions.push([row, col + 1]); // right
    return positions;
}