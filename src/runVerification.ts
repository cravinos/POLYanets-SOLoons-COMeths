import { verifyDeployment } from './api/verifyDeployment';
import { CANDIDATE_ID } from './constants';

async function main() {
    try {
        await verifyDeployment(CANDIDATE_ID);
        console.log("Verification completed successfully.");
    } catch (error) {
        console.error("An error occurred during verification:", error);
    }
}

main();