import uniqid from "uniqid";
import {
  EAction,
  IAddCardResult,
  IHandleSessionArgs,
  ISession,
  IIsue,
} from "../../models";
import { Rooms } from "../../models/Rooms";

export function handleVotingSession(
  this: Rooms,
  args: IHandleSessionArgs
): any {
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
    // result.room.currentSession.activeCategoryId = "";
  } else if (action === EAction.reset) {
    // Push current session to issues -> sessions
    // If most-recent does not yet exist, then push a new issue
    if (result.room.currentSession.session.sessionCategories[0].votes.length) {
      if (!result.room.issues.length) {
        const newDefaultSession: ISession = {
          id: "most-recent",
          sessionCategories:
            result.room.currentSession.session.sessionCategories,
        };
        const newIssue: IIsue = {
          id: "default",
          name: "Default Issue",
          sessions: [newDefaultSession],
        };
        result.room.issues.push(newIssue);
      } else {
        // ... if it exists, then replace the last most-recent with only current session
        const foundMostRecentIssue = result.room.issues.find(
          (x) => x.id === "default"
        );
        if (foundMostRecentIssue) {
          const foundMostRecentSession = foundMostRecentIssue.sessions.find(
            (s) => s.id === "most-recent"
          );
          if (foundMostRecentSession) {
            const fountRecentCatIndex = foundMostRecentSession.sessionCategories.findIndex(
              (sc) =>
                sc.categoryId === result.room.currentSession.activeCategoryId
            );
            if (fountRecentCatIndex !== -1) {
              let temp = foundMostRecentSession.sessionCategories[0];

              foundMostRecentSession.sessionCategories[
                fountRecentCatIndex
              ].votes =
                result.room.currentSession.session.sessionCategories[0].votes;

              // Swap items to keep the most recent ones on top
              foundMostRecentSession.sessionCategories[0] =
                foundMostRecentSession.sessionCategories[fountRecentCatIndex];
              foundMostRecentSession.sessionCategories[
                fountRecentCatIndex
              ] = temp;
            } else {
              foundMostRecentSession.sessionCategories.unshift(
                result.room.currentSession.session.sessionCategories[0]
              );
            }
          }
        }
      }
    }

    // Reset current session
    result.room.currentSession.active = false;
    result.room.currentSession.activeCategoryId = "";
    result.room.currentSession.session = null;
  } else if (action === EAction.vote) {
    // Check if there currently is an active session
    if (
      !result.room.currentSession.active ||
      !result.room.currentSession.activeCategoryId ||
      !result.room.currentSession.session
    ) {
      result.error = "Voting session is not currently active.";
      return result;
    }

    const { categoryId, vote } = args;

    // Check if the category ID has been passed
    if (!categoryId) {
      result.error = "Category ID has not been provided.";
      return result;
    }

    const foundSessionCat = result.room.currentSession.session.sessionCategories.find(
      (s) => s.categoryId === categoryId
    );

    if (!foundSessionCat) {
      result.error = "Session category has not been found.";
      return result;
    }

    if (
      !vote.userId ||
      vote.unit === null ||
      vote.unit === undefined ||
      isNaN(vote.unit)
    ) {
      result.error = "Please provide vote with unit and user ID.";
      return result;
    }

    const foundUser = this.users.getUser(vote.userId);

    if (!foundUser) {
      result.error = "User with specified user ID has not been found.";
      return result;
    }

    const voteIndex = foundSessionCat.votes.findIndex(
      (v) => v.userId === vote.userId
    );

    if (voteIndex !== -1) {
      if (foundSessionCat.votes[voteIndex].unit === vote.unit) {
        foundSessionCat.votes.splice(voteIndex, 1);
      } else {
        foundSessionCat.votes[voteIndex].unit = vote.unit;
      }
    } else {
      foundSessionCat.votes.push(vote);
    }
  }

  return result;
}
