import { Machine } from "xstate";
import { ERoomEvents, ERoomStatus } from "../common/models";

const { initial, editingCards, editingCategories, viewingStats } = ERoomStatus;
const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

export const roomMachine = Machine({
  id: "room",
  initial,
  states: {
    initial: {
      on: {
        [EDIT_CARDS]: editingCards,
        [EDIT_CATEGORIES]: editingCategories,
        [VIEW_STATS]: viewingStats,
      },
    },
    editingCards: {
      on: { [DONE]: initial },
    },
    editingCategories: {
      on: { [DONE]: initial },
    },
    viewingStats: {
      on: { [DONE]: initial },
    },
  },
});
