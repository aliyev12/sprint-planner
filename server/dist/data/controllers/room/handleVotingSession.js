"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVotingSession = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
const models_1 = require("../../models");
function handleVotingSession(args) {
    const { roomId, action } = args;
    const result = {
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
    if (action === models_1.EAction.start) {
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
        const newSession = {
            id: uniqid_1.default(),
            sessionCategories: [newSessionCategory],
        };
        result.room.currentSession.active = true;
        result.room.currentSession.activeCategoryId = categoryId;
        result.room.currentSession.session = newSession;
    }
    else if (action === models_1.EAction.end) {
        result.room.currentSession.active = false;
        result.room.currentSession.activeCategoryId = "";
    }
    else if (action === models_1.EAction.reset) {
        result.room.currentSession.active = false;
        result.room.currentSession.activeCategoryId = "";
        result.room.currentSession.session = null;
    }
    else if (action === models_1.EAction.vote) {
        // Check if there currently is an active session
        if (!result.room.currentSession.active ||
            !result.room.currentSession.activeCategoryId ||
            !result.room.currentSession.session) {
            result.error = "Voting session is not currently active.";
            return result;
        }
        const { categoryId, vote } = args;
        // Check if the category ID has been passed
        if (!categoryId) {
            result.error = "Category ID has not been provided.";
            return result;
        }
        const foundSessionCat = result.room.currentSession.session.sessionCategories.find((s) => s.categoryId === categoryId);
        if (!foundSessionCat) {
            result.error = "Session category has not been found.";
            return result;
        }
        if (!vote.userId || !vote.unit || isNaN(vote.unit)) {
            result.error = "Please provide vote with unit and user ID.";
            return result;
        }
        const foundUser = this.users.getUser(vote.userId);
        if (!foundUser) {
            result.error = "User with specified user ID has not been found.";
            return result;
        }
        const foundVote = foundSessionCat.votes.find((v) => v.userId === vote.userId);
        if (foundVote) {
            foundVote.unit = vote.unit;
        }
        else {
            foundSessionCat.votes.push(vote);
        }
    }
    return result;
}
exports.handleVotingSession = handleVotingSession;
