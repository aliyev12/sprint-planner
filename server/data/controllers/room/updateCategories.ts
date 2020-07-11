import uniqid from "uniqid";
import {
  IAddCardResult,
  IUpdateCatArgs,
  EAction,
  ICategory,
} from "../../models";
import { Rooms } from "../../Rooms";

export function updateCategories(
  this: Rooms,
  args: IUpdateCatArgs
): IAddCardResult {
  const { roomId, action } = args;

  const result: IAddCardResult = {
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

  if (action === EAction.add) {
    const newCategory: ICategory = {
      id: uniqid(),
      name: "",
      singular: "",
      units: [],
    };
    result.room.categories.push(newCategory);
  } else {
    const { categoryId, values } = args;
    if (!categoryId) {
      result.error = "Category ID has not been provided.";
      return result;
    }

    if (action === EAction.update) {
      if (
        !values ||
        !values.name ||
        !values.singular ||
        values.name.length > 50 ||
        values.singular.length > 30
      ) {
        result.error =
          "Category name or singular values are missing or in a wrong format.";
      }

      const foundCategory = result.room.categories.find(
        (c) => c.id === categoryId
      );

      if (!foundCategory) {
        result.error = "Category with provided ID does not exist";
        return result;
      }
      foundCategory.name = values.name;
      foundCategory.singular = values.singular;
    } else if (action === EAction.delete) {
      const index = result.room.categories.findIndex(
        (c) => c.id === categoryId
      );
      if (index === -1) {
        result.error = `Category does not exist`;
        return result;
      }
      result.room.categories.splice(index, 1);
    }
  }

  return result;
}
