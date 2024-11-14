import { GoalMap, CandidateID } from "../types";
import { getGoalMap } from "./getGoalMap";
import { createEntity } from "./createItem";
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

const dictionary = {
    POLYANET: 0,
    COMETH:2,
    SOLOON:1

}

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
                if (goalMap.goal[row].length !== userMap.map.content[row].length) {
                    throw new Error(`Row ${row} lengths do not match.`);
                }
                for (let col = 0; col < goalMap.goal[row].length; col++) {
                    const goalCell = goalMap.goal[row][col];
                    const userCell = userMap.map.content[row][col];

                    if (goalCell === 'SPACE') {
                        if (userCell !== null) {
                            const type = determineItemType(userCell.type);
                            await deleteItem(candidateId, row, col, type);
                            hasErrors = true;
                        }
                        continue;
                    }
                    
                    if (userCell === null || (userCell && userCell.type !== dictionary[goalCell])) {
                        let type = goalCell;
                        await createEntity(candidateId, row, col, type);
                        hasErrors = true;
                    }

                    function determineItemType(typeCode: number): string {
                        for (const[key, value] of Object.entries(dictionary)) {
                            if (value === typeCode) {
                                return key.toLowerCase()+'s';
                            }
                        }
                        throw new Error("Unknown item type");
                    }
                }
            }

            if (!hasErrors) {
                console.log('Verification complete. Deployment matches goal map.');
                return; 
            }
        } catch (error) {
            console.error(`Verification attempt ${retryCount + 1} failed:`, error);
            retryCount++;
        }

        if (retryCount < maxRetry) {
            console.log(`Retrying verification...`);
        }
    }
    throw new Error("Verification failed after multiple attempts.");
}
