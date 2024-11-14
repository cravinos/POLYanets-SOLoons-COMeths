/**
 * get goal map, 
 * /api/map/[candidateId]/goal, where [candidateId] is your candidate ID.
 * 
 */

import {GoalMap, CandidateID} from '../types';

export async function getGoalMap(candidateId: CandidateID): Promise<GoalMap> {
    //fetch and parse goal map 
    //return obj of GoalMap Type
    const response = await fetch(`https://challenge.crossmint.io/api/map/${candidateId}/goal`);
    if(!response.ok){
        throw new Error (`fetch response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
    
}

