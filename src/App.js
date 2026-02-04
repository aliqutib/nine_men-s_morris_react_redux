import { useEffect, useState } from "react";
import PlayArea from "./PlayArea";
import StatusBar from "./StatusBar";

//REDUX
import { connect } from "react-redux";
import { placePiece } from "./actions/holderAction";

function App(props) {

  const {holders, placingCount, history, turn, redCount, blueCount, message } = props;
  //const [turn, setTurn] = useState("blue");
  //const [holders, setHolders] = useState([]);
  //const [blueCount, setBlueCount] = useState(9);
  //const [redCount, setRedCount] = useState(9);
  //const [placingCount, setPlacingCount] = useState(18);
  const [moveBlinking, setMoveBlinking] = useState(false);
  const [moved, setMoved] = useState(-1);
  //const [message, setMessage] = useState(null);
  //const [history, setHistory] = useState([]);
  const [blinkIds, setBlinkIds] = useState(new Set());

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

  const handleClick = (id) => {

    console.log('Clicked holder id: ', id);

    const xL = getXLine(id); //[0,1,2] 1 is clicked
    const yL = getYLine(id);

    const xN = (id===xL[1]) ? [xL[0], xL[2]] : [xL[1]];
    const yN = (id===yL[1]) ? [yL[0], yL[2]] : [yL[1]];

    //2. Case II (placing the piece)
    if (!holders[id].filled && (placingCount)>0 && message===null)
    {
      props.placePiece(id);
      return;
    }

  }

  // Derive the holders array to include local blink overlay
  const renderedHolders = holders.map(h => ({ ...h, blink: blinkIds.has(h.id) }));

  return (
    <div className="App">
      <div className="game-wrapper">
        <PlayArea 
          holders={renderedHolders}
          handleClick={handleClick}
        />
      </div>

      <StatusBar
        blueCount={blueCount}
        redCount={redCount} 
        placingCount={placingCount}
        turn={turn}
        message={message}
      />
    </div>
  );
}

// AI highlighted: `rootReducer` uses `combineReducers({ holdersReducer })`, so state shape is `{ holdersReducer: { holders, ... } }`.
// AI highlighted: mapping `holders: state.holders` will be undefined — use `state.holdersReducer.holders` instead.
const mapStateToProps = (state) => ({
  holders: state.holdersReducer.holders,
  placingCount: state.holdersReducer.placingCount,
  history: state.holdersReducer.history,
  turn: state.holdersReducer.turn,
  redCount: state.holdersReducer.redCount,
  blueCount: state.holdersReducer.blueCount,
  message: state.holdersReducer.message
})

const mapDispatchToProps = (dispatch) => ({
  placePiece: (id)=> dispatch(placePiece(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);



/*

/*
  // Helper to recompute inTriplet flags
  function recomputeTriplets(hs) {
    const res = hs.map(h => ({ ...h, inTriplet: false }));
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
    */
/*
  useEffect(()=>{
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

    setHolders(newholders);

  }, []);


  // Local undo that restores last snapshot from local history
  function handleUndo() {
    if (!history || history.length===0) return;
    const prev = history[history.length-1];
    setHistory(history.slice(0, -1));
    setHolders(prev.holders);
    setPlacingCount(prev.turnCount);
    setRedCount(prev.redC);
    setBlueCount(prev.blueC);
    setTurn(prev.turnS);
    setMessage(prev.mes);
  }


  function placePieceLocal(id) {
    // validation
    if (placingCount <= 0) return;
    if (message) return; 
    if (holders[id].filled) return;

    //saving previous state for keeping track of history
    const prevSnapshot = { holders: holders, turnCount: placingCount, redC: redCount, blueC: blueCount, turnS: turn, mes: message };

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

    if (isXTriplet || isYTriplet) {
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
    } else {
        // no triplet — flip turn
        nextTurn = (turn === "blue") ? "red" : "blue";
    }

    setHistory([...history, prevSnapshot]);
    setHolders(newholders);
    setPlacingCount(placingC);
    setTurn(nextTurn);
    setMessage(msg);
  }


  function pickPieceLocal(id) {
    // validation: must be a valid bordered candidate
    if (!holders[id].border) return;

    const prevSnapshot = { holders: holders, turnCount: placingCount, redC: redCount, blueC: blueCount, turnS: turn, mes: message };

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

    setHistory([...history, prevSnapshot]);
    setHolders(newholders);
    setRedCount(redC);
    setBlueCount(blueC);
    setMessage(msg);
    setTurn(nextTurn);
  }

  function movePieceLocal(from, to) {
    // validation
    if (!holders[from].filled) return;
    if (holders[from].piecePlaced !== turn) return;
    if (holders[to].filled) return;
    if (message) return; // cannot move while in pick mode

    const prevSnapshot = { holders: holders, turnCount: placingCount, redC: redCount, blueC: blueCount, turnS: turn, mes: message };

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

    setHistory([...history, prevSnapshot]);
    setHolders(newholders);
    setTurn(nextTurn);
    setMessage(msg);
  }


    //1. Case I (picking the piece)
    if (message && holders[id].filled && holders[id].piecePlaced!==turn)
    {
      pickPieceLocal(id);
      setBlinkIds(new Set());
      return;
    }


    //3. Case III (selecting movable piece)
    else if (holders[id].filled && holders[id].piecePlaced===turn && (placingCount)<=0 && !moveBlinking && message===null)
    {
      console.log('is movable piece id ', id)
      const blinkSet = new Set();
      (xN.concat(yN)).forEach(n => {
        if (!holders[n].filled) 
          blinkSet.add(n);
      });

      console.log(blinkSet);

      setMoved(id);
      setMoveBlinking(true);
      setBlinkIds(blinkSet);
      return;
    }

    //4. Case IV (moving the selected piece or re-selecting)
    else if (moveBlinking && message===null)
    {
      // move to a blinking spot
      if (blinkIds.has(id))
      {
        movePieceLocal(moved, id);
        setMoveBlinking(false);
        setMoved(-1);
        setBlinkIds(new Set());
        return;
      }

      // reselect
      else if (holders[id].piecePlaced===turn) 
      {
        const blinkSet = new Set();
        const xn = (id===getXLine(id)[1]) ? [getXLine(id)[0], getXLine(id)[2]] : [getXLine(id)[1]];
        const yn = (id===getYLine(id)[1]) ? [getYLine(id)[0], getYLine(id)[2]] : [getYLine(id)[1]];
        (xn.concat(yn)).forEach(n => { if (!holders[n].filled) blinkSet.add(n); });

        setMoved(id);
        setMoveBlinking(true);
        setBlinkIds(blinkSet);
        return;
      }
    }
  */

