import { CandidateID, GoalMap, UserMap } from '../types';

export class APIClient {
    constructor(private candidateId: CandidateID) {}

    async getGoalMap(): Promise<GoalMap> {
        const response = await fetch(`https://challenge.crossmint.io/api/map/${this.candidateId}/goal`);
        if (!response.ok) {
            throw new Error(`Failed to fetch goal map: ${response.status}`);
        }
        return response.json();
    }

    async getUserMap(): Promise<UserMap> {
        const response = await fetch(`https://challenge.crossmint.io/api/map/${this.candidateId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user map: ${response.status}`);
        }
        return response.json();
    }

    async createItem(row: number, column: number, type: string): Promise<void> {
        let retries = 0;
        while (retries < 5) {
            try {
                let response;
                if (type.includes('POLYANET')) {
                    response = await fetch(`https://challenge.crossmint.io/api/polyanets`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ row, column, candidateId: this.candidateId }),
                    });
                } else if (type.includes('SOLOON')) {
                    const [color, entityType] = type.split('_');
                    response = await fetch(`https://challenge.crossmint.io/api/soloons`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ row, column, color: color.toLowerCase(), candidateId: this.candidateId }),
                    });
                } else if (type.includes('COMETH')) {
                    const [direction, entityType] = type.split('_');
                    response = await fetch(`https://challenge.crossmint.io/api/comeths`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ row, column, direction: direction.toLowerCase(), candidateId: this.candidateId }),
                    });
                }

                if (response && response.ok) {
                    console.log(`Successfully added ${type} at ROW: ${row}, COLUMN: ${column}`);
                    return;
                } else {
                    console.error(`Failed to add ${type} at ROW: ${row}, COLUMN: ${column}. Response status: ${response?.status}`);
                    if (response?.status !== 429) {
                        throw new Error(`${type} POST failed`);
                    }
                }
            } catch (error) {
                console.error(`Error creating item:`, error);
                retries++;
                await new Promise(resolve => setTimeout(resolve, 2000 * retries));
            }
        }
        throw new Error(`Exceeded max retries for ${type} at ROW: ${row}, COLUMN: ${column}`);
    }

    async deleteItem(row: number, column: number, type: string): Promise<void> {
        try {
            const baseType = type.replace(/^(.*_)?/, '');
            const response = await fetch(
                `https://challenge.crossmint.io/api/${baseType.toLowerCase()}s?row=${row}&column=${column}&candidateId=${this.candidateId}`,
                { method: 'DELETE' }
            );
            if (!response.ok) {
                throw new Error(`Failed to delete ${type} at (${row}, ${column}). Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error deleting ${type} at (${row}, ${column}):`, error);
            throw error;
        }
    }
}
