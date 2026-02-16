import { connect } from "react-redux";

function StatusBar ({blueCount, redCount, placingCount, turn, message}) {

    return (
        <article className="status">
            <section className="statusbar">
                <h2 style={{color:"#4a90e2"}}>{`Blue Tray: ${Math.floor(placingCount/2)}`}</h2>
                <h2 style={{color:"#e94b3c"}}>{`Red Tray: ${Math.ceil(placingCount/2)}`}</h2>
                <h2 style={{color: turn === "blue" ? "#4a90e2" : "#e94b3c"}}>
                  {`${turn.toUpperCase()}'s TURN`}
                </h2>
                <h1>{message}</h1>
            </section>
            <section className="piecesLeft">
                <h2 style={{color:"#4a90e2"}}>{`Blue Pieces Left: ${blueCount}`}</h2>
                <h2 style={{color:"#e94b3c"}}>{`Red Pieces Left: ${redCount}`}</h2>                
            </section>
            <section>
                <button
                    onClick={()=>console.log('to be implemented')}
                >UNDO</button>
            </section>
        </article>
    );

}

const mapStateToProps = (state) => ({
  blueCount: state.holdersReducer.blueCount,
  redCount: state.holdersReducer.redCount,
  placingCount: state.holdersReducer.placingCount,
  turn: state.holdersReducer.turn,
  message: state.holdersReducer.message,
})

export default connect(mapStateToProps)(StatusBar)