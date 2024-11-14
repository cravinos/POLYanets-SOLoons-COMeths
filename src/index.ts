import { CANDIDATE_ID } from './constants';
import { deployItem } from "./api/deployItem";


async function main(){ 
    try {
       await deployItem(CANDIDATE_ID);
    } catch ( error ){
        console.error("an error occured", error);
    }
}
main();