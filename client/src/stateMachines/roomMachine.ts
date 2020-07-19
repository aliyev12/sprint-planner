import { Machine } from "xstate";
import {
  // EHomeStatuses,
  ERoomStatus,
  ERoomEvents,
  ETheme,
  IEditCategory,
  IRoomState,
  ICurrentSession,
  IUser,
} from "../common/models";

// export enum ERoomStatus {
//   initial = "initial",
//   editingCards = "editing-cards",
//   editingCategories = "editing-categories",
//   viewingStats = "viewing-stats",
// }

// export enum ERoomEvents {
//   EDIT_CARDS = "EDIT_CARDS",
//   EDIT_CATEGORIES = "EDIT_CATEGORIES",
//   VIEW_STATS = "VIEW_STATS",
//   DONE = "DONE",
// }

const { initial, editingCards, editingCategories, viewingStats } = ERoomStatus;
const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

// This machine is completely decoupled from React

// export const roomMachine = Machine(
//   {
//     id: "room",
//     initial: "inactive",
//     context: {
//       active: false,
//       session: null,
//     },
//     on: {
//       ROOM_DATA_CHANGE: {
//         actions: ["handleRoomDataChange"],
//       },
//     },
//     states: {
//       /* INACTIVE */
//       inactive: {
//         id: "inactive",
//         initial: "initial",
//         states: {
//           initial: {
//             on: {
//               [EDIT_CARDS]: editingCards,
//               [EDIT_CATEGORIES]: editingCategories,
//               ACTIVATE: "#active",
//             },
//           },
//           editingCards: {
//             on: { [DONE]: initial },
//           },
//           editingCategories: {
//             on: { [DONE]: initial },
//           },

//           afterVote: {
//             on: {
//               "": [
//                 { target: "withSession", cond: "inactiveWithSession" },
//                 { target: "initial" },
//               ],
//             },
//           },
//           withSession: {
//             on: {
//               [VIEW_STATS]: viewingStats,
//               [DONE]: initial,
//             },
//           },
//           viewingStats: {
//             on: {
//               [DONE]: initial,
//               BACK: "afterVote",
//             },
//           },
//         },
//       },
//       /* ACTIVE */
//       active: {
//         id: "active",
//         initial: "notVoted",
//         states: {
//           notVoted: {
//             on: {
//               VOTE: "voted",
//               [DONE]: "#inactive.initial",
//             },
//           },
//           voted: {
//             on: {
//               UNVOTE: "notVoted",
//               AFTER_VOTE: "#inactive.afterVote",
//             },
//           },
//         },
//       },
//     },
//   },
//   {
//     actions: {
//       handleRoomDataChange: (ctx, e) => {
//         console.log("e.roomData = ", e.roomData);
//       },
//     },
//     guards: {
//       inactiveWithSession: (context) =>
//         context.active === false && context.session !== null,
//     },
//   }
// );

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

// service.onTransition((state) => {
//   if (state.changed) {
//     log(state.value);
//     log(state.children.child.state.value);
//     // log(state.context);
//   }
// });
