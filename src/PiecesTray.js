export default function PiecesTray({color, count, label}){
    
    const pieces = [];
    for (let i=0; i<count; i++)
        pieces.push(i+1); 

    return(
        <div className="pieces-tray-section">
            <h3 className="tray-label" style={{color}}>{label}</h3>
            <div className="pieceTray">
                {
                    pieces.map(piece => { return(
                        <div 
                            key={piece} 
                            style={{backgroundColor:color}}
                            className="piece"
                        ></div>
                    )})
                }
            </div>
        </div>
    )

}