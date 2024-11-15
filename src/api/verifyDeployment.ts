import { CandidateID } from '../types';
import { APIClient } from './APIClient';
import { Map } from '../models/Map';
import { determineItemType, getAdjacentPositions } from '../utils/entityUtils';
import { dictionary } from '../constants';


export async function verifyDeployment(candidateId: CandidateID, maxRetry: number = 5): Promise<void> {
    const apiClient = new APIClient(candidateId);
    let retryCount = 0;

    while (retryCount < maxRetry) {
        try {
            const goalMapData = await apiClient.getGoalMap();
            const userMapData = await apiClient.getUserMap();

            const goalMap = goalMapData.goal;
            const userMap = userMapData.map.content;

            let hasErrors = false;

            for (let row = 0; row < goalMap.length; row++) {
                for (let col = 0; col < goalMap[row].length; col++) {
                    const goalCell = goalMap[row][col];
                    const userCell = userMap[row][col];

                    if (goalCell === 'SPACE') {
                        if (userCell !== null) {
                            const itemType = determineItemType(userCell.type);
                            await apiClient.deleteItem(row, col, itemType);
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
                        await apiClient.createItem(row, col, goalCell);
                        hasErrors = true;
                        continue;
                    }

                    if (userCell.type !== expectedTypeInfo.type) {
                        await apiClient.createItem(row, col, goalCell);
                        hasErrors = true;
                        continue;
                    }

                    if (entityType === 'COMETH' && userCell.direction !== attribute?.toLowerCase()) {
                        await apiClient.createItem(row, col, goalCell);
                        hasErrors = true;
                        continue;
                    }

                    if (entityType === 'SOLOON') {
                        if (userCell.color !== attribute?.toLowerCase()) {
                            await apiClient.createItem(row, col, goalCell);
                            hasErrors = true;
                            continue;
                        }

                        const adjacentPositions = getAdjacentPositions(row, col, goalMap.length, goalMap[row].length);
                        let hasAdjacentPolyanet = false;

                        for (const [adjRow, adjCol] of adjacentPositions) {
                            const adjUserCell = userMap[adjRow][adjCol];
                            if (adjUserCell && adjUserCell.type === dictionary['POLYANET'].type) {
                                hasAdjacentPolyanet = true;
                                break;
                            }
                        }

                        if (!hasAdjacentPolyanet) {
                            await apiClient.deleteItem(row, col, 'soloons');
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
    throw new Error('Verification failed after multiple attempts.');
}
