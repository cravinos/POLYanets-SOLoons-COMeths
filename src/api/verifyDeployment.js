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
function verifyDeployment(candidateId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const goalMap = yield (0, getGoalMap_1.getGoalMap)(candidateId);
            const response = yield fetch(`https://challenge.crossmint.io/api/map/${candidateId}`);
            if (!response.ok)
                throw new Error(`Failed to fetch user map: ${response.statusText}`);
            const userMap = yield response.json();
            for (let row = 0; row < goalMap.goal.length; row++) {
                if (goalMap.goal[row].length !== userMap.map.content[row].length) {
                    throw new Error(`Row ${row} lengths do not match.`);
                }
                for (let col = 0; col < goalMap.goal[row].length; col++) {
                    if (goalMap.goal[row][col] === 'SPACE') {
                        if (userMap.map.content[row][col] !== null) {
                            throw new Error(`Expected space at (${row}, ${col}), but found ${JSON.stringify(userMap.map.content[row][col])}`);
                        }
                    }
                    else if (goalMap.goal[row][col] === 'POLYANET') {
                        const userCell = userMap.map.content[row][col];
                        if (userCell === null || (userCell && userCell.type !== 0)) {
                            throw new Error(`Expected POLYANET at (${row}, ${col}), found ${JSON.stringify(userCell)} instead`);
                        }
                    }
                }
            }
            console.log('Verification complete. Deployment matches goal map.');
        }
        catch (error) {
            console.error("Verification failed:", error);
            throw error;
        }
    });
}
