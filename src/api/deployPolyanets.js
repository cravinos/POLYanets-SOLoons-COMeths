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
exports.deployPolyanets = deployPolyanets;
const createPolyanet_1 = require("./createPolyanet");
const verifyDeployment_1 = require("./verifyDeployment");
const getGoalMap_1 = require("./getGoalMap");
function deployPolyanets(candidateId) {
    return __awaiter(this, void 0, void 0, function* () {
        //fetch goal map and start reverse eng of polyanets found 
        const goalMap = yield (0, getGoalMap_1.getGoalMap)(candidateId);
        //grab polyanet coords from goalmap
        const polyanetCoords = extractPolyanetCoords(goalMap);
        //create polyanets at the new coordinates found 
        for (const { row, column } of polyanetCoords) {
            yield (0, createPolyanet_1.createPolyanet)(candidateId, row, column);
        }
        //verify usermap to goalmap
        yield (0, verifyDeployment_1.verifyDeployment)(candidateId);
    });
}
//changed my approach from manually entering the coordinates to reversing it from the goal map
function extractPolyanetCoords(goalMap) {
    const coordinates = [];
    goalMap.goal.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            if (cell === 'POLYANET') {
                coordinates.push({ row: rowIndex, column: columnIndex });
            }
        });
    });
    return coordinates;
}
