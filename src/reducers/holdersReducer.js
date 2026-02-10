import {getXLine, getYLine} from "../utils/lines";

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
    message: null,
    moveBlinking: false,
    movedId: -1
}


function holdersReducer (state=initialState, action) {
    switch(action.type) 
    {
        case 'PLACING_PIECE': 
            return placePieceLocal(state, action.payload.id);

        case 'PICK_PIECE':
            return pickPieceLocal(state, action.payload.id);

        case 'SELECT_PIECE':
            return selectPiece(state, action.payload.id);

        case 'MOVE_PIECE':
            return movePieceLocal(state, state.movedId, action.payload.id);
            
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

 //   const prevSnapshot = {}
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
    } 
    else 
        nextTurn = (turn === "blue") ? "red" : "blue";

    return{
        ...state,
        holders: newholders,
     //   history: [...history, prevSnapshot],
        placingCount: placingCount -1,
        message: msg,
        turn: nextTurn
    }

}

function pickPieceLocal(state,id) {
    // validation: must be a valid bordered candidate

    const {holders, redCount, blueCount, turn} = state;

    if (!holders[id].border) return;


//    const prevSnapshot = { holders: holders, turnCount: placingCount, redC: redCount, blueC: blueCount, turnS: turn, mes: message };

    const targetColor = holders[id].piecePlaced;

    let newholders = holders.map(h => {
        if (h.id===id && h.border) return { id, filled:false, piecePlaced:null, inTriplet:false, border:null, blink:false };
        return { ...h, border: null };
    });

    // recompute triplets (some inTriplet may have been broken)
    newholders = recomputeTriplets(newholders);

    let redC = redCount;
    let blueC = blueCount;
    if (targetColor === 'red') redC -= 1;
    if (targetColor === 'blue') blueC -= 1;

    let msg = null;
    if (redC < 3) msg = 'Blue Wins';
    else if (blueC < 3) msg = 'Red Wins';

    // flip turn after a pick
    const nextTurn = (turn === "blue") ? "red" : "blue";

    return{
        ...state,
        holders: newholders,
        redCount: redC,
        blueCount: blueC,
        message: msg,
        turn: nextTurn
    }
}

function selectPiece(staet, id){
    
    const {holders, turn, placingCount, message, moveBlinking} = state;

    
      console.log('is movable piece id ', id)
      const blinkSet = new Set();
      (xN.concat(yN)).forEach(n => {
        if (!holders[n].filled) 
          blinkSet.add(n);
      });

      const renderedHolders = holders.map(h => ({ ...h, blink: blinkSet.has(h.id) }));

      console.log(blinkSet);

      return{
        ...state,
        holders: renderedHolders,
        movedId: id,
        moveBlinking: true
      }

    

}

function movePieceLocal(state, from, to) {
  
    const {holders, message, turn, } = state;
    // validation
    if (!holders[from].filled) return;
    if (holders[from].piecePlaced !== turn) return;
    if (holders[to].filled) return;
    if (message) return; // cannot move while in pick mode

//    const prevSnapshot = { holders: holders, turnCount: placingCount, redC: redCount, blueC: blueCount, turnS: turn, mes: message };

    let newholders = holders.map(h => {
        if (h.id === from) return { id: from, filled:false, piecePlaced:null, inTriplet:false, border:null, blink:false };
        if (h.id === to) return { id: to, filled:true, piecePlaced: turn, inTriplet:false, border:null, blink:false };
        return { ...h, border: null };
    });

    // recompute triplets
    newholders = recomputeTriplets(newholders);

    // check whether move formed a triplet at `to`
    const xL = getXLine(to).filter(x=>x!==to);
    const yL = getYLine(to).filter(y=>y!==to);
    const isXTriplet = newholders[xL[0]].piecePlaced===newholders[to].piecePlaced && newholders[xL[1]].piecePlaced===newholders[to].piecePlaced;
    const isYTriplet = newholders[yL[0]].piecePlaced===newholders[to].piecePlaced && newholders[yL[1]].piecePlaced===newholders[to].piecePlaced;

    let msg = null;
    let nextTurn = turn;

    if (isXTriplet || isYTriplet) {
        // mark opponent candidate pieces with border
        newholders = newholders.map(h => {
            if (h.piecePlaced && h.piecePlaced!==turn && !h.inTriplet) return { ...h, border: "5px solid black" };
            return h;
        });
        msg = (turn === "blue") ? "pick one piece of red" : "pick one piece of blue";
    } else {
        // flip turn
        nextTurn = (turn === "blue") ? "red" : "blue";
    }

    newholders = newholders.map(h => ({ ...h, blink:false }));


    return{
        ...state,
        holders: newholders,
        turn: nextTurn,
        message: msg,
        moveBlinking: false,
        movedId: -1
    }

}