import { GoalMap, CandidateID } from "../types";
import { getGoalMap } from "./getGoalMap";

export interface UserMap {
    map: {
        _id: string;
        content: Array<Array<null | { type: number }>>;
        candidateId: string;
        phase: number;
        __v: number;
    };
}

export async function verifyDeployment(candidateId: string): Promise<void> {
    try {
        const goalMap: GoalMap = await getGoalMap(candidateId);

        const response = await fetch(`https://challenge.crossmint.io/api/map/${candidateId}`);
        if (!response.ok) throw new Error(`Failed to fetch user map: ${response.statusText}`);

        const userMap: UserMap = await response.json();


        for (let row = 0; row < goalMap.goal.length; row++) {
            if (goalMap.goal[row].length !== userMap.map.content[row].length) {
                throw new Error(`Row ${row} lengths do not match.`);
            }
            for (let col = 0; col < goalMap.goal[row].length; col++) {
                if (goalMap.goal[row][col] === 'SPACE') {
                    if (userMap.map.content[row][col] !== null) {
                        throw new Error(`Expected space at (${row}, ${col}), but found ${JSON.stringify(userMap.map.content[row][col])}`);
                    }
                } else if (goalMap.goal[row][col] === 'POLYANET') {
                    const userCell = userMap.map.content[row][col];
                    if (userCell === null || (userCell && userCell.type !== 0)) {
                        throw new Error(`Expected POLYANET at (${row}, ${col}), found ${JSON.stringify(userCell)} instead`);
                    }
                }
            }
        }

        console.log('Verification complete. Deployment matches goal map.');
    } catch (error) {
        console.error("Verification failed:", error);
        throw error; 
    }
}