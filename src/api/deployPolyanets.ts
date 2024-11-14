import { createPolyanet } from "./createPolyanet";
import { verifyDeployment } from "./verifyDeployment";
import { getGoalMap } from "./getGoalMap";
import { CandidateID, GoalMap } from "../types";

export async function deployPolyanets (candidateId: CandidateID): Promise<void>{
    
    //fetch goal map and start reverse eng of polyanets found 
    const goalMap: GoalMap = await getGoalMap(candidateId);

    //grab polyanet coords from goalmap
    const polyanetCoords = extractPolyanetCoords(goalMap);

    //create polyanets at the new coordinates found 
    for (const {row,column} of polyanetCoords){
        await createPolyanet(candidateId, row,column);
    }

    //verify usermap to goalmap
    await verifyDeployment(candidateId);
}
//changed my approach from manually entering the coordinates to reversing it from the goal map
function extractPolyanetCoords(goalMap: GoalMap): Array<{ row: number, column: number }> {
    const coordinates: Array<{row:number, column:number}> = [];

    goalMap.goal.forEach((row,rowIndex)=> {
        row.forEach((cell,columnIndex)=> {
            if(cell === 'POLYANET') {
                coordinates.push({row:rowIndex, column: columnIndex});
            }
        })
    })
    return coordinates;


}