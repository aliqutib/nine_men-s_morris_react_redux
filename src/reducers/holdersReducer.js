const newholders = []; 
    for (let i=0; i<24; i++)
        newholders.push({
            id: i,
            filled : false,
            piecePlaced : null,
            inTriplet : false,
            border: null,
            blink : false
    });

const initialState = {
    holders: newholders,
    placingCount: 18,
    history: [],
    turn: "blue",
    redCount: 9,
    blueCount: 9,
    message: null
}

// Helper adjacency maps
const xAdjacent = [];
for (let i=0; i<24; i+=3) xAdjacent.push([i, i+1, i+2]);
const yAdjacent = [[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];

const getXLine = (id) => { for (let i=0;i<8;i++) for (let j=0;j<3;j++) if (xAdjacent[i][j]===id) return xAdjacent[i]; };
const getYLine = (id) => { for (let i=0;i<8;i++) for (let j=0;j<3;j++) if (yAdjacent[i][j]===id) return yAdjacent[i]; };

// Compute inTriplet flags for all holders based on current piecePlaced
function recomputeTriplets(holders) {
    const res = holders.map(h => ({ ...h, inTriplet: false }));
    for (let i=0; i<24; i++) {
        const xL = getXLine(i).filter(x=>x!==i);
        const yL = getYLine(i).filter(y=>y!==i);
        const p = res[i].piecePlaced;
        if (p && res[xL[0]].piecePlaced===p && res[xL[1]].piecePlaced===p) {
            res[i].inTriplet = true;
            res[xL[0]].inTriplet = true;
            res[xL[1]].inTriplet = true;
        }
        if (p && res[yL[0]].piecePlaced===p && res[yL[1]].piecePlaced===p) {
            res[i].inTriplet = true;
            res[yL[0]].inTriplet = true;
            res[yL[1]].inTriplet = true;
        }
    }
    return res;
}

function holdersReducer (state=initialState, action) {
    switch(action.type) {
        case 'PLACING_PIECE': {
            const id = action.payload.id;
            // validation
            if (state.placingCount <= 0) return state;
            if (state.message) return state; // don't allow placing while in pick mode
            if (state.holders[id].filled) return state;

            const prevSnapshot = { holders: state.holders, turnCount: state.placingCount, redC: state.redCount, blueC: state.blueCount, turnS: state.turn, mes: state.message };

            // place piece
            let newholders = state.holders.map(h => h.id===id ? { ...h, filled:true, piecePlaced: state.turn, inTriplet:false, border:null, blink:false } : { ...h });

            const placingCount = state.placingCount - 1;

            // check for triplet
            const xL = getXLine(id).filter(x=>x!==id);
            const yL = getYLine(id).filter(y=>y!==id);
            const isXTriplet = newholders[xL[0]].piecePlaced===newholders[id].piecePlaced && newholders[xL[1]].piecePlaced===newholders[id].piecePlaced;
            const isYTriplet = newholders[yL[0]].piecePlaced===newholders[id].piecePlaced && newholders[yL[1]].piecePlaced===newholders[id].piecePlaced;

            let message = null;
            let turn = state.turn;

            if (isXTriplet || isYTriplet) {
                // mark triplet holders
                newholders[id].inTriplet = true;
                newholders[xL[0]].inTriplet = true;
                newholders[xL[1]].inTriplet = true;
                newholders[yL[0]] && (newholders[yL[0]].inTriplet = newholders[yL[0]].inTriplet || isYTriplet);
                newholders[yL[1]] && (newholders[yL[1]].inTriplet = newholders[yL[1]].inTriplet || isYTriplet);

                // mark opponent candidate pieces with border
                newholders = newholders.map(h => {
                    if (h.piecePlaced && h.piecePlaced!==state.turn && !h.inTriplet) return { ...h, border: "5px solid black" };
                    return h;
                });

                message = (state.turn === "blue") ? "pick one piece of red" : "pick one piece of blue";
                // turn stays the same when a triplet was created
            } else {
                // no triplet — flip turn
                turn = (state.turn === "blue") ? "red" : "blue";
            }

            const history = [...state.history, prevSnapshot];

            return { ...state, holders: newholders, placingCount, turn, message, history };
        }

        case 'PICK_PIECE': {
            const id = action.payload.id;
            // validation: must be a valid bordered candidate
            if (!state.holders[id].border) return state;

            const prevSnapshot = { holders: state.holders, turnCount: state.placingCount, redC: state.redCount, blueC: state.blueCount, turnS: state.turn, mes: state.message };

            const targetColor = state.holders[id].piecePlaced;

            let newholders = state.holders.map(h => {
                if (h.id===id && h.border) return { id, filled:false, piecePlaced:null, inTriplet:false, border:null, blink:false };
                return { ...h, border: null };
            });

            // recompute triplets (some inTriplet may have been broken)
            newholders = recomputeTriplets(newholders);

            let redCount = state.redCount;
            let blueCount = state.blueCount;
            if (targetColor === 'red') redCount -= 1;
            if (targetColor === 'blue') blueCount -= 1;

            let message = null;
            if (redCount < 3) message = 'Blue Wins';
            else if (blueCount < 3) message = 'Red Wins';

            // flip turn after a pick
            const turn = (state.turn === "blue") ? "red" : "blue";

            const history = [...state.history, prevSnapshot];

            return { ...state, holders: newholders, redCount, blueCount, message, turn, history };
        }

        case 'MOVE_PIECE': {
            const { from, to } = action.payload;
            // validation
            if (!state.holders[from].filled) return state;
            if (state.holders[from].piecePlaced !== state.turn) return state;
            if (state.holders[to].filled) return state;
            if (state.message) return state; // cannot move while in pick mode

            const prevSnapshot = { holders: state.holders, turnCount: state.placingCount, redC: state.redCount, blueC: state.blueCount, turnS: state.turn, mes: state.message };

            let newholders = state.holders.map(h => {
                if (h.id === from) return { id: from, filled:false, piecePlaced:null, inTriplet:false, border:null, blink:false };
                if (h.id === to) return { id: to, filled:true, piecePlaced: state.turn, inTriplet:false, border:null, blink:false };
                return { ...h, border: null };
            });

            // recompute triplets
            newholders = recomputeTriplets(newholders);

            // check whether move formed a triplet at `to`
            const xL = getXLine(to).filter(x=>x!==to);
            const yL = getYLine(to).filter(y=>y!==to);
            const isXTriplet = newholders[xL[0]].piecePlaced===newholders[to].piecePlaced && newholders[xL[1]].piecePlaced===newholders[to].piecePlaced;
            const isYTriplet = newholders[yL[0]].piecePlaced===newholders[to].piecePlaced && newholders[yL[1]].piecePlaced===newholders[to].piecePlaced;

            let message = null;
            let turn = state.turn;

            if (isXTriplet || isYTriplet) {
                // mark opponent candidate pieces with border
                newholders = newholders.map(h => {
                    if (h.piecePlaced && h.piecePlaced!==state.turn && !h.inTriplet) return { ...h, border: "5px solid black" };
                    return h;
                });
                message = (state.turn === "blue") ? "pick one piece of red" : "pick one piece of blue";
            } else {
                // flip turn
                turn = (state.turn === "blue") ? "red" : "blue";
            }

            const history = [...state.history, prevSnapshot];

            return { ...state, holders: newholders, turn, message, history };
        }

        case 'UNDO': {
            if (!state.history || state.history.length===0) return state;
            const prev = state.history[state.history.length-1];
            const history = state.history.slice(0, -1);
            return { ...state, holders: prev.holders, placingCount: prev.turnCount, redCount: prev.redC, blueCount: prev.blueC, turn: prev.turnS, message: prev.mes, history };
        }

        default:
            return state;
    }
}

export default holdersReducer;