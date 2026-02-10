import { useEffect, useState } from "react";
import PlayArea from "./PlayArea";
import StatusBar from "./StatusBar";

//REDUX
import { connect } from "react-redux";
import { pickPiece, placePiece, selectPiece, movePiece } from "./actions/holderAction";

function App(props) {

  const {holders, placingCount, history, turn, redCount, blueCount, message, moveBlinking } = props;
  //const [turn, setTurn] = useState("blue");
  //const [holders, setHolders] = useState([]);
  //const [blueCount, setBlueCount] = useState(9);
  //const [redCount, setRedCount] = useState(9);
  //const [placingCount, setPlacingCount] = useState(18);
  //const [moveBlinking, setMoveBlinking] = useState(false);
  //const [moved, setMoved] = useState(-1);
  //const [message, setMessage] = useState(null);
  //const [history, setHistory] = useState([]);
  //const [blinkIds, setBlinkIds] = useState(new Set());


  const handleClick = (id) => {

    console.log('Clicked holder id: ', id);


    //1. Case I (picking the piece)
    if (message && holders[id].filled && holders[id].piecePlaced!==turn)
    {
      props.pickPiece(id);
      return;
    }

    //2. Case II (placing the piece)
    if (!holders[id].filled && (placingCount)>0 && message===null)
    {
      props.placePiece(id);
      return;
    }

    //3. Case III (selecting the piece)
    if (holders[id].filled && holders[id].piecePlaced===turn && (placingCount)<=0 && message===null)
    {
      props.selectPiece(id);
      return;
    }

    //4. Case IV (moving the selected piece or re-selecting)
    if (moveBlinking && message===null)
    {
      props.movePiece(id);
      return;
    }
 

  }

  
  return (
    <div className="App">
      <div className="game-wrapper">
        <PlayArea 
          holders={holders}
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
  placePiece: (id)=> dispatch(placePiece(id)),
  pickPiece:  (id)=>dispatch(pickPiece(id)),
  selectPiece: (id)=>dispatch(selectPiece(id)),
  movePiece: (id)=>dispatch(movePiece(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);



/*



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





  


    //1. Case I (picking the piece)
    

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

