"use strict";
/**
 * get goal map,
 * /api/map/[candidateId]/goal, where [candidateId] is your candidate ID.
 *
 */
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
exports.getGoalMap = getGoalMap;
function getGoalMap(candidateId) {
    return __awaiter(this, void 0, void 0, function* () {
        //fetch and parse goal map 
        //return obj of GoalMap Type
        const response = yield fetch(`https://challenge.crossmint.io/api/map/${candidateId}/goal`);
        if (!response.ok) {
            throw new Error(`fetch response was not ok: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    });
}
