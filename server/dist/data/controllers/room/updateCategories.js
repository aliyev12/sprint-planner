"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategories = updateCategories;
const uniqid_1 = __importDefault(require("uniqid"));
const models_1 = require("../../models");
function updateCategories(args) {
    const { roomId, action } = args;
    const result = {
        room: null,
        error: null,
    };
    if (!roomId) {
        result.error = "Room ID has not been provided.";
        return result;
    }
    result.room = this.rooms.find((r) => r.id === roomId);
    if (!result.room) {
        result.error = `Room with provided ID ${roomId} does not exist. Please refresh your page.`;
        return result;
    }
    if (action === models_1.EAction.add) {
        const newCategory = {
            id: (0, uniqid_1.default)(),
            name: "",
            singular: "",
            units: [],
        };
        result.room.categories.push(newCategory);
    }
    else if (action === models_1.EAction.updateStatus) {
        const { status } = args;
        if (!status) {
            result.error = "New room status has not been provided.";
        }
        result.room.status = status;
    }
    else {
        const { categoryId, values } = args;
        if (!categoryId) {
            result.error = "Category ID has not been provided.";
            return result;
        }
        if (action === models_1.EAction.update) {
            if (!values ||
                !values.name ||
                !values.singular ||
                values.name.length > 50 ||
                values.singular.length > 30) {
                result.error =
                    "Category name or singular values are missing or in a wrong format.";
            }
            const foundCategory = result.room.categories.find((c) => c.id === categoryId);
            if (!foundCategory) {
                result.error = "Category with provided ID does not exist";
                return result;
            }
            foundCategory.name = values.name;
            foundCategory.singular = values.singular;
        }
        else if (action === models_1.EAction.delete) {
            const index = result.room.categories.findIndex((c) => c.id === categoryId);
            if (index === -1) {
                result.error = `Category does not exist`;
                return result;
            }
            result.room.categories.splice(index, 1);
        }
    }
    return result;
}
//# sourceMappingURL=updateCategories.js.map