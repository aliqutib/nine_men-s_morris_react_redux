import { useEffect, useState } from "react";
import PlayArea from "./PlayArea";
import StatusBar from "./StatusBar";
//import PiecesTray from "./PiecesTray";

// Redux connect & actions
import { connect } from "react-redux";

function App() {

  const dispatch = useDispatch();

  // We keep most UI state local for now to minimize changes to App logic.
  // The action thunks compute the new state and return it so we can apply it here
  // (this demonstrates using thunk to compute and return values to the component).
  const [turn, setTurn] = useState("blue");
  const [holders, setHolders] = useState([]);
  const [blueCount, setBlueCount] = useState(9);
  const [redCount, setRedCount] = useState(9);
  const [placingCount, setPlacingCount] = useState(18);
  const [moveBlinking, setMoveBlinking] = useState(false);
  const [moved, setMoved] = useState(-1);
  const [message, setMessage] = useState(null);
  const [history, setHistory] = useState([]);
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

  const handleUndo = () => {
    // dispatch undo action which the reducer handles using the history snapshot
    undo();
  }
   
  const handleClick = (id) => {

    console.log('Clicked holder id: ', id);

    const xL = getXLine(id); //[0,1,2] 1 is clicked
    const yL = getYLine(id);

    const xN = (id===xL[1]) ? [xL[0], xL[2]] : [xL[1]];
    const yN = (id===yL[1]) ? [yL[0], yL[2]] : [yL[1]];

    //1. Case I (picking the piece)
    if (message && holders[id].filled && holders[id].piecePlaced!==turn)
    {
      pickPiece(id);
      setBlinkIds(new Set());
      return;
    }

    //2. Case II (placing the piece)
    else if (!holders[id].filled && (placingCount)>0 && message===null)
    {
      // Minimal action dispatched — reducer computes resulting state
      placePiece(id);
      return;
    }  

    //3. Case III (selecting movable piece)
    else if (holders[id].filled && holders[id].piecePlaced===turn && (placingCount)<=0 && !moveBlinking && message===null)
    {
      console.log('is movable piece id ', id)
      const blinkSet = new Set();
      (xN.concat(yN)).forEach(n => {
        if (!holders[n].filled) blinkSet.add(n);
      });

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
        movePiece(moved, id);
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
        handleUndo={handleUndo}
      />
    </div>
  );
}

const mapStateToProp = (state) => ({
  holders: state.holdersReducer.holders,
  placingCount: state.holdersReducer.placingCount,
  turn: state.holdersReducer.turn,
  redCount: state.holdersReducer.redCount,
  blueCount: state.holdersReducer.blueCount,
  history: state.holdersReducer.history,
  message: state.holdersReducer.message
});

const mapDispatchToProp = { placePiece, pickPiece, movePiece, undo };

export default connect(mapStateToProp, mapDispatchToProp)(App);