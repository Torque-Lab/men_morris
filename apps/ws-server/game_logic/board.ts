
type Position=string;
type Piece="white" | "black" | null;

export class  Board{
// finally positions will hold all the point
private positions:Record<Position,Piece>={}
private static readonly MILL_COMBINATIONS: Position[][] = [
  // Horizontal mills
  ["a1", "d1", "g1"],
  ["b2", "d2", "f2"],
  ["c3", "d3", "e3"],
  ["a4", "b4", "c4"],
  ["e4", "f4", "g4"],
  ["c5", "d5", "e5"],
  ["b6", "d6", "f6"],
  ["a7", "d7", "g7"],
  // Vertical mills
  ["a1", "a4", "a7"],
  ["b2", "b4", "b6"],
  ["c3", "c4", "c5"],
  ["d1", "d2", "d3"],
  ["d5", "d6", "d7"],
  ["e3", "e4", "e5"],
  ["f2", "f4", "f6"],
  ["g1", "g4", "g7"],
];

constructor() {
    const allPositions = [
        //top three
      "a1", "d1", "g1", 
      "b2", "d2", "f2",
      "c3", "d3", "e3",

      //bottom three
      "a4", "b4", "c4", 
      "e4", "f4", "g4",
      "c5", "d5", "e5",

      // two remaining rows
      "b6", "d6", "f6",
      "a7", "d7", "g7"
    ];
    for (const pos of allPositions) {
      this.positions[pos] = null;
    }
  }

  public placePiece(position: Position, color: Piece): boolean {
    if (this.positions[position] !== null) return false;
    this.positions[position] = color;
    return true;
  }

  public movePiece(from: Position, to: Position, color: Piece): boolean {
    if (this.positions[from] !== color || this.positions[to] !== null) return false;
    this.positions[from] = null;
    this.positions[to] = color;
    return true;
  }

  public getState(): Record<Position, Piece> {
    return this.positions;
  }


public isMill(position: Position, color: Piece): boolean {
  if (!color) return false;
  
  for (const mill of Board.MILL_COMBINATIONS) {
      if (mill.includes(position)) {
          const isMill = mill.every(pos => this.positions[pos] === color);
          if (isMill) return true;
      }
  }
  return false;
}

public getMillPositions(color: Piece): Position[] {
  const millPositions: Position[] = [];
  
  for (const mill of Board.MILL_COMBINATIONS) {
      const occupied = mill.filter(pos => this.positions[pos] === color).length;
      if (occupied === 2) {
          const emptyPos = mill.find(pos => this.positions[pos] !== color);
          if (emptyPos) {
              millPositions.push(emptyPos);
          }
      }
  }
  
  return [...new Set(millPositions)];
}
}