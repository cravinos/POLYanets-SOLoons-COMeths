import { CandidateID } from "../types";


export async function createPolyanet(candidateId: CandidateID, row: number, column:number): Promise<void> {
    let retries = 0;
    while (retries < 5 ) {
        try {
            const response = await fetch(`https://challenge.crossmint.io/api/polyanets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, column, candidateId }),
            });
            if( response.ok ) {
                console.log(`successfully added a POLYANET at ROW: ${row} COLUMN: ${column}`)
                return;
            } else {
                console.error(`Failed to add polyanet at ROW:${row}, COLUMN: ${column}.  res status is: ${response.status}`)
                throw new Error ('polyanet post failed')
            }
        } catch (error){
            console.error(`Error attempting to create polyanet: `, error);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 2000*retries))
        }
    }
    console.error(`Failed to create polyanet at ROW: ${row} COLUMN: ${column} after ${retries} retries`)
    throw new Error('exceeded max retries for polyanet post')
}