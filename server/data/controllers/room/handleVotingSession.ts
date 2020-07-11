import uniqid from "uniqid";
import {
  IAddCardResult,
  IUpdateCatArgs,
  EAction,
  ICategory,
  ISession,
  ICurrentSession,
} from "../../models";
import { Rooms } from "../../Rooms";

export function handleVotingSession(this: Rooms, args: any): any {
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

  if (action === EAction.start) {
    // Check if there currently is an active session
    if (result.room.currentSession.active) {
      result.error =
        "Voting is currently in progress. Please, end the current voting session before starting a new one.";
      return result;
    }

    const { categoryId } = args;

    // Check if the category ID has been passed
    if (!categoryId) {
      result.error = "Category ID has not been provided.";
      return result;
    }

    const newSessionCategory = {
      categoryId,
      votes: [],
    };

    const newSession: ISession = {
      id: uniqid(),
      sessionCategories: [newSessionCategory],
    };

    result.room.currentSession.active = true;
    result.room.currentSession.activeCategoryId = categoryId;
    result.room.currentSession.session = newSession;
  } else if (action === EAction.end) {
    result.room.currentSession.active = false;
    result.room.currentSession.activeCategoryId = "";
    result.room.currentSession.session = null;
  }

  return result;
}
