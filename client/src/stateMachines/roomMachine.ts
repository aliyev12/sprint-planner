import { createMachine, type AnyActorRef } from "xstate";
import { ERoomEvents, ERoomStatus } from "../common/models";

const { initial, editingCards, editingCategories, viewingStats } = ERoomStatus;
const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

// Define types
type Context = Record<string, never>; // Empty context

type Events =
  | { type: typeof EDIT_CARDS }
  | { type: typeof EDIT_CATEGORIES }
  | { type: typeof VIEW_STATS }
  | { type: typeof DONE };

// Define the machine config separately
const config = {
  id: "room",
  initial,
  context: {},
  states: {
    [initial]: {
      on: {
        [EDIT_CARDS]: { target: editingCards },
        [EDIT_CATEGORIES]: { target: editingCategories },
        [VIEW_STATS]: { target: viewingStats },
      },
    },
    [editingCards]: {
      on: { [DONE]: { target: initial } },
    },
    [editingCategories]: {
      on: { [DONE]: { target: initial } },
    },
    [viewingStats]: {
      on: { [DONE]: { target: initial } },
    },
  },
} as const;

// Create the machine
export const roomMachine = createMachine(config);

// For TypeScript to infer the right type when used with useMachine
export type RoomMachine = typeof roomMachine;
