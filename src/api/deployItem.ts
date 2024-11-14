import { createEntity } from "./createEntity";
import { verifyDeployment } from "./verifyDeployment";
import { getGoalMap } from "./getGoalMap";
import { CandidateID, GoalMap } from "../types";


export async function deployItem (candidateId: CandidateID): Promise<void>{
    
    //fetch goal map and start reverse eng of  found 
    const goalMap: GoalMap = await getGoalMap(candidateId);

    //grab  coords from goalmap
    const coords = extractCoords(goalMap);

    //create  at the new coordinates found 
    //editing switch 
    for (const {row,column,type} of coords){
        if(type===null){
            await createEntity(candidateId, row,column,type);
        }
        if(type !==null){
            await createEntity(candidateId,row,column,type);
        }
    }

    //verify usermap to goalmap
    await verifyDeployment(candidateId);
}
//changed to switch approach.. 
function extractCoords(goalMap: GoalMap): Array<{ row: number, column: number, type:string }> {
    const coordinates: Array<{row:number, column:number, type:string }> = [];

    goalMap.goal.forEach((row,rowIndex)=> {
        row.forEach((cell,columnIndex)=> {
           if(cell.includes('_')){
            coordinates.push({row:rowIndex, column: columnIndex, type:cell});
           }
            if(cell === 'POLYANET') {
                coordinates.push({row:rowIndex, column: columnIndex, type:cell});
            }
        })
    })
    return coordinates;


}