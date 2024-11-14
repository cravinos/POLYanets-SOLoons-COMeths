"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDeployment = verifyDeployment;
const getGoalMap_1 = require("./getGoalMap");
const createPolyanet_1 = require("./createPolyanet");
const deleteItem_1 = require("./deleteItem");
function verifyDeployment(candidateId_1) {
    return __awaiter(this, arguments, void 0, function* (candidateId, maxRetry = 5) {
        for (let retryCount = 0; retryCount < maxRetry; retryCount++) {
            try {
                const goalMap = yield (0, getGoalMap_1.getGoalMap)(candidateId);
                const response = yield fetch(`https://challenge.crossmint.io/api/map/${candidateId}`);
                if (!response.ok)
                    throw new Error(`Failed to fetch user map: ${response.statusText}`);
                const userMap = yield response.json();
                let hasErrors = false;
                for (let row = 0; row < goalMap.goal.length; row++) {
                    if (goalMap.goal[row].length !== userMap.map.content[row].length) {
                        throw new Error(`Row ${row} lengths do not match.`);
                    }
                    for (let col = 0; col < goalMap.goal[row].length; col++) {
                        if (goalMap.goal[row][col] === 'SPACE') {
                            if (userMap.map.content[row][col] !== null) {
                                // Incorrect item found, attempt to delete it
                                yield (0, deleteItem_1.deleteItem)(candidateId, row, col, 'polyanet');
                                hasErrors = true;
                            }
                        }
                        else if (goalMap.goal[row][col] === 'POLYANET') {
                            const userCell = userMap.map.content[row][col];
                            if (userCell === null || (userCell && userCell.type !== 0)) {
                                // Should be a POLYANET but isn't, attempt to add it
                                yield (0, createPolyanet_1.createPolyanet)(candidateId, row, col);
                                hasErrors = true;
                            }
                        }
                        // If it's not SPACE or POLYANET, we continue (ignore other values)
                    }
                }
                if (!hasErrors) {
                    console.log('Verification complete. Deployment matches goal map.');
                    return;
                }
            }
            catch (error) {
                console.error(`Verification attempt ${retryCount + 1} failed:`, error);
            }
            if (retryCount < maxRetry - 1) {
                console.log(`Retrying verification...`);
            }
        }
        throw new Error("Verification failed after multiple attempts.");
    });
}
