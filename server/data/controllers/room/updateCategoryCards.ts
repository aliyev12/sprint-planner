import { IAddCardResult, EAction } from "../../models";
import { isNumOrFloat } from "../../../utils";
import { Rooms } from "../../Rooms";

export function updateCategoryCards(
  this: Rooms,
  roomId: string,
  categoryId: string,
  unit: number,
  action: EAction
): IAddCardResult {
  const result: IAddCardResult = {
    room: null,
    error: null,
  };

  if (!isNumOrFloat(unit) || unit.toString().length > 5) {
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

  if (action === EAction.add) {
    const foundUnit = foundCategory.units.find((u) => u.unit === unit);
    if (foundUnit) {
      result.error = `Unit ${unit} ${foundCategory.singular}${
        unit === 1 ? "" : "s"
      } already exists`;
      return result;
    }
    foundCategory.units.push({ unit });
  } else if (action === EAction.delete) {
    const index = foundCategory.units.findIndex((u) => u.unit === unit);
    if (index === -1) {
      result.error = `Unit ${unit} ${foundCategory.singular}${
        unit === 1 ? "" : "s"
      } does not exist`;
      return result;
    }
    foundCategory.units.splice(index, 1);
  }

  this.sortUnitsInCategory(foundCategory.units);
  return result;
}
