"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERoomStatus = exports.EUserRole = exports.EAction = void 0;
var EAction;
(function (EAction) {
    EAction["add"] = "add";
    EAction["delete"] = "delete";
    EAction["update"] = "update";
    EAction["start"] = "start";
    EAction["end"] = "end";
    EAction["save"] = "save";
    EAction["vote"] = "vote";
    EAction["reset"] = "reset";
    EAction["updateStatus"] = "updateStatus";
})(EAction = exports.EAction || (exports.EAction = {}));
var EUserRole;
(function (EUserRole) {
    EUserRole["regularUser"] = "regularUser";
    EUserRole["admin"] = "admin";
})(EUserRole = exports.EUserRole || (exports.EUserRole = {}));
var ERoomStatus;
(function (ERoomStatus) {
    ERoomStatus["initial"] = "initial";
    ERoomStatus["edit"] = "edit";
})(ERoomStatus = exports.ERoomStatus || (exports.ERoomStatus = {}));
