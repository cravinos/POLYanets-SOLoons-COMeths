import { GoalMap, CandidateID } from "../types";

export async function verifyDeploment(candidateId:CandidateID, goalMap:GoalMap): Promise<void> {
    const response = await fetch (`https://challenge.crossmint.io/api/map/${candidateId}`);
    if(!response.ok) throw new Error ('Failed to fetch userMap')
    
    const userMap: GoalMap = await response.json();

    const errors:string[] = [];
    for(let row =0;row<goalMap.goal.length;row++){
        for(let col = 0; col < goalMap.goal[row].length;col++){
            if(goalMap.goal[row][col] === 'POLYANET' && userMap.goal[row][col] !== 'POLYANET'){
                errors.push(`Expected polyanet at (${row} ${col}), ${userMap.goal[row][col]} in position `)
            }
        }
    }
    if(errors.length >0){
        console.error("verification failed:")
        errors.forEach(console.error);
        throw new Error("Error");
    } else {
        console.log('Verification complete userMap matches goalMap')
    }
}