"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResponse = transformResponse;
exports.addToStructure = addToStructure;
function transformResponse(response) {
    return response.map(({ fileUrl }) => fileUrl);
}
function addToStructure(structure, parts) {
    if (parts.length === 1) {
        structure.push(parts[0]);
    }
    else {
        const current = parts[0];
        const remained = parts.slice(1);
        let objectWithSameKey = structure.find((item) => typeof item === "object" && item.hasOwnProperty(current));
        if (!objectWithSameKey) {
            objectWithSameKey = { [current]: [] };
            structure.push(objectWithSameKey);
        }
        addToStructure(objectWithSameKey[current], remained);
    }
}
