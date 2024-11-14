import { GoalMap, CandidateID } from "../types";
import { getGoalMap } from "./getGoalMap";
import { createItem } from "./createItem";
import { deleteItem } from "./deleteItem";

export interface UserMap {
    map: {
        _id: string;
        content: Array<Array<null | { type: number; direction?: string; color?: string }>>;
        candidateId: string;
        phase: number;
        __v: number;
    };
}

const dictionary: { [key: string]: { type: number; directions?: string[]; colors?: string[] } } = {
    POLYANET: { type: 0 },
    COMETH: { type: 2, directions: ['up','down','left','right'] },
    SOLOON: { type: 1, colors: ['red','white','blue','purple'] }
};

export async function verifyDeployment(candidateId: string, maxRetry: number = 5): Promise<void> {
    let retryCount = 0;

    while (retryCount < maxRetry) {
        try {
            const goalMap: GoalMap = await getGoalMap(candidateId);
            const response = await fetch(`https://challenge.crossmint.io/api/map/${candidateId}`);
            if (!response.ok) throw new Error(`Failed to fetch user map: ${response.statusText}`);
            const userMap: UserMap = await response.json();

            let hasErrors = false;

            for (let row = 0; row < goalMap.goal.length; row++) {
                for (let col = 0; col < goalMap.goal[row].length; col++) {
                    const goalCell = goalMap.goal[row][col];
                    const userCell = userMap.map.content[row][col];

                    if (goalCell === 'SPACE') {
                        if (userCell !== null) {
                            await deleteItem(candidateId, row, col, determineItemType(userCell.type));
                            hasErrors = true;
                        }
                        continue;
                    }

                    const parts = goalCell.split('_');
                    let attribute: string | null = null;
                    let entityType: string;

                    if (parts.length === 2) {
                        [attribute, entityType] = parts;
                    } else if (parts.length === 1) {
                        entityType = parts[0];
                    } else {
                        throw new Error(`Invalid goal cell format: ${goalCell}`);
                    }

                    const expectedTypeInfo = dictionary[entityType];

                    if (userCell === null) {
                        await createItem(candidateId, row, col, goalCell);
                        hasErrors = true;
                        continue;
                    }

                    if (userCell.type !== expectedTypeInfo.type) {
                        await createItem(candidateId, row, col, goalCell);
                        hasErrors = true;
                        continue;
                    }

                    if (entityType === 'COMETH' && userCell.direction !== attribute?.toLowerCase()) {
                        await createItem(candidateId, row, col, goalCell);
                        hasErrors = true;
                        continue;
                    }

                    if (entityType === 'SOLOON') {
                        if (userCell.color !== attribute?.toLowerCase()) {
                            await createItem(candidateId, row, col, goalCell);
                            hasErrors = true;
                            continue;
                        }

                        const adjacentPositions = getAdjacentPositions(row, col, goalMap.goal.length, goalMap.goal[row].length);
                        let hasAdjacentPolyanet = false;

                        for (const [adjRow, adjCol] of adjacentPositions) {
                            const adjUserCell = userMap.map.content[adjRow][adjCol];
                            if (adjUserCell && adjUserCell.type === dictionary['POLYANET'].type) {
                                hasAdjacentPolyanet = true;
                                break;
                            }
                        }

                        if (!hasAdjacentPolyanet) {
                            await deleteItem(candidateId, row, col, 'soloons');
                            hasErrors = true;
                            continue;
                        }
                    }
                }
            }

            if (hasErrors) {
                console.log(`Corrected mismatches.`);
            } else {
                console.log('Verification complete. Deployment matches goal map.');
                return;
            }
        } catch (error) {
            console.error(`Verification attempt ${retryCount + 1} failed:`, error);
        }

        retryCount++;
        if (retryCount < maxRetry) {
            console.log(`Retrying verification...`);
        }
    }
    throw new Error("Verification failed after multiple attempts.");
}

function determineItemType(typeCode: number): string {
    for (const [key, value] of Object.entries(dictionary)) {
        if (value.type === typeCode) {
            return key.toLowerCase() + 's';
        }
    }
    throw new Error("Unknown item type");
}

function getAdjacentPositions(row: number, col: number, rows: number, cols: number): [number, number][] {
    const positions: [number, number][] = [];
    if (row > 0) positions.push([row - 1, col]); // up
    if (row < rows - 1) positions.push([row + 1, col]); // down
    if (col > 0) positions.push([row, col - 1]); // left
    if (col < cols - 1) positions.push([row, col + 1]); // right
    return positions;
}
