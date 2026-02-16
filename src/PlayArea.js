import { connect } from "react-redux";
import { pickPiece, placePiece, selectPiece, movePiece } from "./actions/holderAction";


function PlayArea(props){
    
    const {holders, placingCount, turn, message, moveBlinking } = props;

    const handleClick = (id)=> {
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
        if (holders[id].filled && holders[id].piecePlaced===turn && (placingCount)<=0 && !moveBlinking && message===null)
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

    return(
        <div className="board-container">
            <svg className="board-svg" viewBox="0 0 500 500" width="700" height="700">
                {/* Outer square */}
                <rect x="25" y="25" width="450" height="450" fill="none" stroke="#d4af37" strokeWidth="3"/>
                
                {/* Middle square */}
                <rect x="112.5" y="112.5" width="275" height="275" fill="none" stroke="#d4af37" strokeWidth="3"/>
                
                {/* Inner square */}
                <rect x="200" y="200" width="100" height="100" fill="none" stroke="#d4af37" strokeWidth="3"/>
                
                {/* Outer vertical lines */}
                <line x1="250" y1="25" x2="250" y2="112.5" stroke="#d4af37" strokeWidth="2"/>
                <line x1="250" y1="387.5" x2="250" y2="475" stroke="#d4af37" strokeWidth="2"/>
                
                {/* Outer horizontal lines */}
                <line x1="25" y1="250" x2="112.5" y2="250" stroke="#d4af37" strokeWidth="2"/>
                <line x1="387.5" y1="250" x2="475" y2="250" stroke="#d4af37" strokeWidth="2"/>
                
                {/* Middle vertical lines */}
                <line x1="250" y1="112.5" x2="250" y2="200" stroke="#d4af37" strokeWidth="2"/>
                <line x1="250" y1="300" x2="250" y2="387.5" stroke="#d4af37" strokeWidth="2"/>
                
                {/* Middle horizontal lines */}
                <line x1="112.5" y1="250" x2="200" y2="250" stroke="#d4af37" strokeWidth="2"/>
                <line x1="300" y1="250" x2="387.5" y2="250" stroke="#d4af37" strokeWidth="2"/>
            </svg>
          
            {
                holders.map(holder => { return (
                    <div
                        key={holder.id} 
                        id={`_${holder.id+1}`} 
                        className="holder"
                        style={{
                            backgroundColor: (holder.piecePlaced==="blue") ? "#4a90e2" : (holder.piecePlaced==="red") ?  "#e94b3c" : (holder.blink) ? "lightgray" : null,
                            border: holder.border
                        }}
                        onClick={() => handleClick(holder.id)}                        
                    ></div>
                )})
            }
            
        </div>
    );

}

const mapStateToProps = (state) => ({
  holders: state.holdersReducer.holders,
  placingCount: state.holdersReducer.placingCount,
  history: state.holdersReducer.history,
  turn: state.holdersReducer.turn,
  message: state.holdersReducer.message,
  moveBlinking: state.holdersReducer.moveBlinking
})

const mapDispatchToProps = (dispatch) => ({
  placePiece: (id)=> dispatch(placePiece(id)),
  pickPiece:  (id)=>dispatch(pickPiece(id)),
  selectPiece: (id)=>dispatch(selectPiece(id)),
  movePiece: (id)=>dispatch(movePiece(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayArea)