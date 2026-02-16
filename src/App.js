import { useEffect, useState } from "react";
import PlayArea from "./PlayArea";
import StatusBar from "./StatusBar";

function App(props) {

  
  return (
    <div className="App">
      <div className="game-wrapper">
        <PlayArea />
      </div>

      <StatusBar />
    </div>
  );
}

export default (App);



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

