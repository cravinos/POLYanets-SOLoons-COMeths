export const dictionary: { [key: string]: { type: number; directions?: string[]; colors?: string[] } } = {
    POLYANET: { type: 0 },
    COMETH: { type: 2, directions: ['up', 'down', 'left', 'right'] },
    SOLOON: { type: 1, colors: ['red', 'white', 'blue', 'purple'] },
};

export function determineItemType(typeCode: number): string {
    for (const [key, value] of Object.entries(dictionary)) {
        if (value.type === typeCode) {
            return key.toLowerCase() + 's';
        }
    }
    throw new Error('Unknown item type');
}
