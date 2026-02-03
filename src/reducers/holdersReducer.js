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


function holdersReducer (state=initialState, action) {
    switch(action.type) {
        case 'PLACING_PIECE': {
        }

        case 'PICK_PIECE': {
        }

        case 'MOVE_PIECE': {
        }

        case 'UNDO': {
        }

        default:
            return state;
    }
}

export default holdersReducer;