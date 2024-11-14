import { CandidateID } from "../types";

export async function deleteItem(candidateId: CandidateID, row: number, column: number, type: string): Promise<void> {
    try {
        if (type.includes('polyanet') || type.includes('cometh') || type.includes('soloon')) {
            const baseType = type.replace(/^(.*_)?/, '');
            
            const response = await fetch(`https://challenge.crossmint.io/api/${baseType}s?row=${row}&column=${column}&candidateId=${candidateId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Failed to delete ${type} at (${row}, ${column}). Status: ${response.status}`);
            }
        } else {
            throw new Error(`Unsupported type for deletion: ${type}`);
        }
    } catch (error) {
        console.error(`Error attempting to delete ${type} at (${row}, ${column}):`, error);
        throw error;
    }
}