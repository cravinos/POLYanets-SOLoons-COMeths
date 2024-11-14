import { GoalMap, CandidateID } from "../types";
import { getGoalMap } from "./getGoalMap";
import { createPolyanet } from "./createPolyanet";
import { deleteItem } from "./deleteItem";

export interface UserMap {
    map: {
        _id: string;
        content: Array<Array<null | { type: number }>>;
        candidateId: string;
        phase: number;
        __v: number;
    };
}

export async function verifyDeployment(candidateId: string, maxRetry: number = 5): Promise<void> {
    for (let retryCount = 0; retryCount < maxRetry; retryCount++) {
        try {
            const goalMap: GoalMap = await getGoalMap(candidateId);

            const response = await fetch(`https://challenge.crossmint.io/api/map/${candidateId}`);
            if (!response.ok) throw new Error(`Failed to fetch user map: ${response.statusText}`);

            const userMap: UserMap = await response.json();

            let hasErrors = false;

            for (let row = 0; row < goalMap.goal.length; row++) {
                if (goalMap.goal[row].length !== userMap.map.content[row].length) {
                    throw new Error(`Row ${row} lengths do not match.`);
                }
                for (let col = 0; col < goalMap.goal[row].length; col++) {
                    if (goalMap.goal[row][col] === 'SPACE') {
                        if (userMap.map.content[row][col] !== null) {
                            // Incorrect item found, attempt to delete it
                            await deleteItem(candidateId, row, col, 'polyanet');
                            hasErrors = true;
                        }
                    } else if (goalMap.goal[row][col] === 'POLYANET') {
                        const userCell = userMap.map.content[row][col];
                        if (userCell === null || (userCell && userCell.type !== 0)) {
                            // Should be a POLYANET but isn't, attempt to add it
                            await createPolyanet(candidateId, row, col);
                            hasErrors = true;
                        }
                    }
                    // If it's not SPACE or POLYANET, we continue (ignore other values)
                }
            }

            if (!hasErrors) {
                console.log('Verification complete. Deployment matches goal map.');
                return; 
            }
        } catch (error) {
            console.error(`Verification attempt ${retryCount + 1} failed:`, error);
        }

        if (retryCount < maxRetry - 1) {
            console.log(`Retrying verification...`);
        }
    }
    throw new Error("Verification failed after multiple attempts.");
}