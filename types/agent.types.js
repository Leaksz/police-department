"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortStrings = exports.AgentRole = void 0;
var AgentRole;
(function (AgentRole) {
    AgentRole[AgentRole["Officer"] = 0] = "Officer";
    AgentRole[AgentRole["Detective"] = 1] = "Detective";
    AgentRole[AgentRole["Captain"] = 2] = "Captain";
    AgentRole[AgentRole["Chief"] = 3] = "Chief";
})(AgentRole || (exports.AgentRole = AgentRole = {}));
var SortStrings;
(function (SortStrings) {
    SortStrings[SortStrings["incorporationDate"] = 0] = "incorporationDate";
    SortStrings[SortStrings["-incorporationDate"] = 1] = "-incorporationDate";
})(SortStrings || (exports.SortStrings = SortStrings = {}));
