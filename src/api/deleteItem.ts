import { CandidateID } from "../types";

export async function deleteItem(candidateId: CandidateID, row: number, column: number, itemType: string): Promise<void> {
    try {
        const response = await fetch(`https://challenge.crossmint.io/api/${itemType}s?row=${row}&column=${column}&candidateId=${candidateId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete ${itemType} at (${row}, ${column}). Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error attempting to delete ${itemType} at (${row}, ${column}):`, error);
        throw error;
    }
}