import {
  ICategory,
  IEditCategory,
  ERoomStatus,
  ICurrentSession,
} from "../models";

export const votesExist = (currentSession: ICurrentSession): boolean => {
  if (
    !currentSession ||
    !currentSession.session ||
    !currentSession.session.sessionCategories ||
    !Array.isArray(currentSession.session.sessionCategories)
  )
    return false;
  const foundSessionCat = currentSession.session.sessionCategories.find(
    (s) => s.categoryId === currentSession.activeCategoryId
  );
  if (!foundSessionCat) return false;
  return foundSessionCat.votes.length > 0;
};

export const allCatChangesSaved = (
  catId: string,
  categories: ICategory[],
  editCategoriesValues: IEditCategory
) => {
  const foundCategory = categories.find((c) => c.id === catId);
  if (!foundCategory) return false;
  const foundEditCategory = editCategoriesValues[catId];
  if (
    foundCategory.name !== foundEditCategory.name ||
    foundCategory.singular !== foundEditCategory.singular
  )
    return false;
  return true;
};

export const getConfirmMsg = (
  incomplete: boolean,
  unsaved: boolean
): string => {
  const msgArr = [
    "There are currently ",
    "",
    "",
    "",
    ". ",
    "",
    "Do you still want to proceed?",
  ];

  if (incomplete) {
    msgArr[1] = "incomplete categories";
    msgArr[5] = "All incomplete categories will be removed. ";
  }
  if (incomplete && unsaved) msgArr[2] = " and ";
  if (unsaved) msgArr[3] = "unsaved changes";

  return msgArr.join("");
};

export const voteActionText = (afterVoteMode, currentSession) => {
  if (afterVoteMode())
    return {
      txt: "Reset",
      ico: "refresh",
      title: "Reset recent voting session",
    };
  if (!currentSession.active)
    return {
      txt: "Vote",
      ico: "done_all",
      title: "Start new voting session",
    };
  if (currentSession.active)
    return {
      txt: "Done voting",
      ico: "done_all",
      title: "End current voting session",
    };
  console.error(
    "fix voteActionText() funciton. None of the conditions for text and icon have been met."
  );
  return { txt: "error", ico: "done_all" };
};

export const viewStatsText = (afterVoteMode, current) => {
  if (afterVoteMode() && current.matches(ERoomStatus.viewingStats)) {
    return {
      txt: "Back to cards",
      ico: "arrow_back",
      icoPos: "left",
      title: "Go back to cards",
    };
  } else {
    return {
      txt: "View stats",
      ico: "pie_chart",
      icoPos: "right",
      title: "View stats",
    };
  }
};

export const editDropdownStyle = (currentSession, current) => ({
  display:
    !currentSession.active &&
    !currentSession.session &&
    current.matches(ERoomStatus.initial)
      ? "block"
      : "none",
});

export const doneEditingStyle = (currentSession, current) => {
  const style = { display: "block" };
  if (
    currentSession.active ||
    current.matches(ERoomStatus.initial) ||
    current.matches(ERoomStatus.viewingStats)
  )
    style.display = "none";
  return style;
};
