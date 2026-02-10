const xAdjacent = [];
const yAdjacent = [[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];

for (let i=0; i<24; i+=3)
xAdjacent.push([i, i+1, i+2]);

export function getXLine(id) {
for (let i=0; i<8; i++)
    for (let j=0; j<3; j++)
    if (xAdjacent[i][j]===id)
        return xAdjacent[i];
}

export function getYLine(id) {
for (let i=0; i<8; i++)
    for (let j=0; j<3; j++)
    if (yAdjacent[i][j]===id)
        return yAdjacent[i];
}

export function recomputeTriplets(hs) {
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

