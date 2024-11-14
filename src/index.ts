import { CANDIDATE_ID } from './constants';
import { deployPolyanets } from "./api/deployPolyanets";


async function main(){ 
    try {
       await deployPolyanets(CANDIDATE_ID);
    } catch ( error ){
        console.error("an error occured", error);
    }
}
main();