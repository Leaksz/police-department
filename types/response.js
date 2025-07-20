"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryResponse = void 0;
var RepositoryResponse;
(function (RepositoryResponse) {
    RepositoryResponse[RepositoryResponse["NotFound"] = 0] = "NotFound";
    RepositoryResponse[RepositoryResponse["Failed"] = 1] = "Failed";
    RepositoryResponse[RepositoryResponse["Success"] = 2] = "Success";
})(RepositoryResponse || (exports.RepositoryResponse = RepositoryResponse = {}));
