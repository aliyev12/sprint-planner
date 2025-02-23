"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryCards = updateCategoryCards;
const models_1 = require("../../models");
const utils_1 = require("../../../utils");
function updateCategoryCards(roomId, categoryId, unit, action) {
    const result = {
        room: null,
        error: null,
    };
    if (!(0, utils_1.isNumOrFloat)(unit) || unit.toString().length > 5) {
        result.error =
            "Wrong format. Make sure that numbers have no more than 2 digits on each side of a decimal point.";
    }
    result.room = this.rooms.find((r) => r.id === roomId);
    if (!result.room) {
        result.error = `Room with provided ID ${roomId} does not exist. Please refresh your page.`;
        return result;
    }
    const foundCategory = result.room.categories.find((c) => c.id === categoryId);
    if (!foundCategory) {
        result.error = "Category with provided ID does not exist";
        return result;
    }
    if (action === models_1.EAction.add) {
        const foundUnit = foundCategory.units.find((u) => u.unit === unit);
        if (foundUnit) {
            result.error = `Unit ${unit} ${foundCategory.singular}${unit === 1 ? "" : "s"} already exists`;
            return result;
        }
        foundCategory.units.push({ unit });
    }
    else if (action === models_1.EAction.delete) {
        const index = foundCategory.units.findIndex((u) => u.unit === unit);
        if (index === -1) {
            result.error = `Unit ${unit} ${foundCategory.singular}${unit === 1 ? "" : "s"} does not exist`;
            return result;
        }
        foundCategory.units.splice(index, 1);
    }
    this.sortUnitsInCategory(foundCategory.units);
    return result;
}
//# sourceMappingURL=updateCategoryCards.js.map