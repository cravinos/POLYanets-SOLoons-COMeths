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
exports.deleteItem = deleteItem;
function deleteItem(candidateId, row, column, itemType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://challenge.crossmint.io/api/${itemType}s?row=${row}&column=${column}&candidateId=${candidateId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Failed to delete ${itemType} at (${row}, ${column}). Status: ${response.status}`);
            }
        }
        catch (error) {
            console.error(`Error attempting to delete ${itemType} at (${row}, ${column}):`, error);
            throw error;
        }
    });
}
