"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasValidationErrors;
function hasValidationErrors(errors) {
    return Object.keys(errors).length > 0;
}
