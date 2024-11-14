import { CandidateID } from "../types";


export async function createEntity(candidateId: CandidateID, row: number, column:number, type:string): Promise<void> {
    let retries = 0;
    while (retries < 5) {
        try {
            let response;
            if(type.includes('POLYANET')) {
                response = await fetch(`https://challenge.crossmint.io/api/${type.toLowerCase()+'s'}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row, column, candidateId}),
                });
            }
            if (type.includes('SOLOON')) {
                const [color, entityType] = type.split('_')
                const lccolor = color.toLowerCase();
                //need this to make the api fetch to soloon to lowercase after the underscore .
                response = await fetch(`https://challenge.crossmint.io/api/${entityType.toLowerCase()+'s'}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row, column, color:lccolor, candidateId}),
                });
            } else if (type.includes('COMETH')) {
                const [direction, entityType] = type.split('_')
                const lcDirection = direction.toLowerCase();
                //same for this, need to adjust & deconstuct the type 
                response = await fetch(`https://challenge.crossmint.io/api/${entityType.toLowerCase()+'s'}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row, column, candidateId, direction:lcDirection}),
                });
            }

            if (response && response.ok) {
                console.log(`Successfully added a ${type} at ROW: ${row}, COLUMN: ${column}`);
                return;
            } else {
                console.error(`Failed to add ${type} at ROW:${row}, COLUMN:${column}. Response status: ${response?.status}`);
                if(response?.status!==429){
                    throw new Error(`${type} POST failed`)
                }
            }
        } catch (error) {
            console.error(`Error attempting to create polyanet:`, error);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        }
    }
    console.error(`Failed to create polyanet at ROW: ${row} COLUMN: ${column} after ${retries} retries`)
    throw new Error('exceeded max retries for polyanet post')
}