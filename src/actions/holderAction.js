import { PLACING_PIECE, PICK_PIECE, MOVE_PIECE, UNDO, SELECT_PIECE } from "./types";

/*
  Approach B (implemented here):
  - Action creators are minimal: they carry just the intent and minimal payload (e.g. the clicked `id`).
  - Reducer contains pure logic to compute the new state (triplets, counts, messages, history, etc.).
  - Components dispatch actions and use `connect` + `mapStateToProps` so UI updates when the store changes.

  This keeps actions small and keeps side-effect-free logic in reducers — preferred for clarity and testability.
*/

export const placePiece = (id) => ({
  type: PLACING_PIECE,
  payload: { id }
});

export const pickPiece = (id) => ({
  type: PICK_PIECE,
  payload: { id }
});

export const selectPiece = (id) => ({
  type: SELECT_PIECE,
  payload: { id }
});


export const movePiece = (from, to) => ({
  type: MOVE_PIECE,
  payload: { from, to }
});

export const undo = () => ({
  type: UNDO
});
