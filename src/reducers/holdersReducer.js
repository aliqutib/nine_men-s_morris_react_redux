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

const xAdjacent = [];
const yAdjacent = [[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];

for (let i=0; i<24; i+=3)
xAdjacent.push([i, i+1, i+2]);

function getXLine(id) {
for (let i=0; i<8; i++)
    for (let j=0; j<3; j++)
    if (xAdjacent[i][j]===id)
        return xAdjacent[i];
}

function getYLine(id) {
for (let i=0; i<8; i++)
    for (let j=0; j<3; j++)
    if (yAdjacent[i][j]===id)
        return yAdjacent[i];
}


const initialState = {
    holders: newholders,
    placingCount: 18,
    history: [],
    turn: "blue",
    redCount: 9,
    blueCount: 9,
    message: null
}


function holdersReducer (state=initialState, action) {
    switch(action.type) 
    {
        case 'PLACING_PIECE': 
            // AI highlighted: calling `placePieceLocal` but not returning its result.
            // AI highlighted: reducer must return the new state object; ignoring the return
            // will keep props/state unchanged in components (props fields appear undefined).
            return placePieceLocal(state, action.payload.id);

        case 'PICK_PIECE':
            break;


        case 'MOVE_PIECE':
            break;
            
        case 'UNDO':
            break;

        default:
            return state;
    }
}

export default holdersReducer;

/*MAIN FUNCTIONS */

  function placePieceLocal(state, id) {

    const {holders, placingCount, turn, redCount, blueCount, message, history } = state;

    // validation
    if (placingCount <= 0) return;
    if (message) return; 
    if (holders[id].filled) return;

    //saving previous state for keeping track of history
    // AI highlighted: `prevSnapshot.holders` is a reference to the same `holders` array
    // AI highlighted: mutate-safe snapshot should clone `holders` (e.g. `holders.map(h=>({...h}))`) to avoid later mutations altering history entries
    const prevSnapshot = {}
    //{ holders: holders, turnCount: placingCount, redC: redCount, blueC: blueCount, turnS: turn, mes: message};
    

    // place piece
    let newholders = holders.map(h => h.id===id ? { ...h, filled:true, piecePlaced: turn, inTriplet:false, border:null, blink:false } : { ...h });

    const placingC = placingCount - 1;

    // check for triplet
    const xL = getXLine(id).filter(x=>x!==id);
    const yL = getYLine(id).filter(y=>y!==id);
    const isXTriplet = newholders[xL[0]].piecePlaced===newholders[id].piecePlaced && newholders[xL[1]].piecePlaced===newholders[id].piecePlaced;
    const isYTriplet = newholders[yL[0]].piecePlaced===newholders[id].piecePlaced && newholders[yL[1]].piecePlaced===newholders[id].piecePlaced;

    let msg = null;
    let nextTurn = turn;

    if (isXTriplet || isYTriplet) 
    {    
        // mark triplet holders
        newholders[id].inTriplet = true;
        newholders[xL[0]].inTriplet = true;
        newholders[xL[1]].inTriplet = true;
        newholders[yL[0]] && (newholders[yL[0]].inTriplet = newholders[yL[0]].inTriplet || isYTriplet);
        newholders[yL[1]] && (newholders[yL[1]].inTriplet = newholders[yL[1]].inTriplet || isYTriplet);

        // mark opponent candidate pieces with border
        newholders = newholders.map(h => {
            if (h.piecePlaced && h.piecePlaced!==turn && !h.inTriplet) return { ...h, border: "5px solid black" };
            return h;
        });

        msg = (turn === "blue") ? "pick one piece of red" : "pick one piece of blue";
        // turn stays the same when a triplet was created
    } 
    else 
        // no triplet — flip turn
        nextTurn = (turn === "blue") ? "red" : "blue";

    return{
        ...state,
        holders: newholders,
        history: [...history, prevSnapshot],
        placingCount: placingCount -1,
        message: msg,
        turn: nextTurn
    }

    // setHistory([...history, prevSnapshot]);
    // setHolders(newholders);
    // setPlacingCount(placingC);
    // setTurn(nextTurn);
    // setMessage(msg);
  }