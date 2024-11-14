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
exports.createPolyanet = createPolyanet;
function createPolyanet(candidateId, row, column) {
    return __awaiter(this, void 0, void 0, function* () {
        let retries = 0;
        while (retries < 5) {
            try {
                const response = yield fetch(`https://challenge.crossmint.io/api/polyanets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row, column, candidateId }),
                });
                if (response.ok) {
                    console.log(`successfully added a POLYANET at ROW: ${row} COLUMN: ${column}`);
                    return;
                }
                else {
                    console.error(`Failed to add polyanet at ROW:${row}, COLUMN: ${column}.  res status is: ${response.status}`);
                    throw new Error('polyanet post failed');
                }
            }
            catch (error) {
                console.error(`Error attempting to create polyanet: `, error);
                retries++;
                yield new Promise(resolve => setTimeout(resolve, 2000 * retries));
            }
        }
        console.error(`Failed to create polyanet at ROW: ${row} COLUMN: ${column} after ${retries} retries`);
        throw new Error('exceeded max retries for polyanet post');
    });
}
