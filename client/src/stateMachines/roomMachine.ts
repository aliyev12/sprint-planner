import { Machine, assign, send } from "xstate";
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
import { votesExist } from "../common/categoriesHelpers";

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

const voteCb = (ctx, e) => (callback, onEvent) => {
  onEvent((e) => {
    console.log("received event = ", e);
    if (e.type === "VOTE") {
      callback("VOTE");
    }
    if (e.type === "UNVOTE") {
      callback("UNVOTE");
    }
  });
};

// export const roomMachine = Machine(
//   {
//     id: "room",
//     initial: "initial",
//     context: {
//       active: false,
//       session: null,
//       voted: false,
//     },
//     // invoke: {
//     //   id: 'voteCb',
//     //   src: () => (cb, onReceive) => {
//     //     onReceive(event => {
//     //       if (event.type === 'NEW_ITEM') {
//     //         //
//     //       }
//     //     }
//     //   }
//     // },

//     on: {
//       ROOM_DATA_CHANGE: {
//         actions: ["handleRoomDataChange"],
//       },
//     },
//     states: {
//       initial: {
//         on: {
//           [EDIT_CARDS]: editingCards,
//           [EDIT_CATEGORIES]: editingCategories,
//           ACTIVATE: "activeNotVoted",
//         },
//       },
//       activeNotVoted: {
//         on: {
//           VOTE: "activeVoted",
//           DONE: "initial",
//         },
//       },
//       activeVoted: {
//         on: {
//           UNVOTE: "activeNotVoted",
//           AFTER_VOTE: "afterVote",
//         },
//       },
//       afterVote: {
//         entry: [() => console.log("entered afterVote")],
//         on: {
//           SESSION: "withSession",
//           // "": [
//           //   { target: "withSession", cond: "inactiveWithSession" },
//           //   { target: "initial" },
//           // ],
//         },
//       },
//       withSession: {
//         on: {
//           [VIEW_STATS]: viewingStats,
//           [DONE]: initial,
//         },
//       },
//       viewingStats: {
//         on: {
//           [DONE]: initial,
//           BACK: "withSession",
//         },
//       },
//       editingCards: {
//         on: { [DONE]: initial },
//       },
//       editingCategories: {
//         on: { [DONE]: initial },
//       },
//     },
//   },
//   {
//     actions: {
//       handleRoomDataChange: assign({
//         active: (_, e: any) => e.roomData.room.currentSession.active,
//         session: (_, e: any) => e.roomData.room.currentSession.session,
//         voted: (_, e: any) => votesExist(e.roomData.room.currentSession),
//       }),
//       handleIfVoted: (_, e) => {
//         console.log(
//           "votesExist(e.roomData.room.currentSession) = ",
//           votesExist(e.roomData.room.currentSession)
//         );
//         if (votesExist(e.roomData.room.currentSession)) {
//           // send("VOTE");
//           send("VOTE", {
//             to: "voteCb",
//           });
//           console.log("sending VOTE");
//         } else {
//           // send("UNVOTE");
//           send("UNVOTE", {
//             to: "voteCb",
//           });
//           console.log("sending UNVOTE");
//         }
//       },
//     },
//     guards: {
//       inactiveWithSession: (context) => {
//         console.log("context.active = ", context.active);
//         console.log("context.session = ", context.session);
//         return context.active === false && context.session !== null;
//       },
//       checkIfVoted: (context) => context.voted === true,
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
