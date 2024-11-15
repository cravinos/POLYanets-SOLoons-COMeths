import { CandidateID } from '../types';
import { APIClient } from './APIClient';
import { Map } from '../models/Map';
import { verifyDeployment } from './verifyDeployment';

export async function deployItem(candidateId: CandidateID): Promise<void> {
    const apiClient = new APIClient(candidateId);
    const goalMapData = await apiClient.getGoalMap();
    const map = new Map(goalMapData);
    const coords = map.extractCoords();

    for (const { row, column, type } of coords) {
        await apiClient.createItem(row, column, type);
    }

    await verifyDeployment(candidateId);
}
