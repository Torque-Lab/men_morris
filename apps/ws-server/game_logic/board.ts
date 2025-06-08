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

private static readonly ADJACENT_POSITIONS: Record<Position, Position[]> = {
  "a1": ["d1", "a4"],
  "d1": ["a1", "g1", "d2"],
  "g1": ["d1", "g4"],
  "b2": ["d2", "b4"],
  "d2": ["b2", "f2", "d1", "d3"],
  "f2": ["d2", "f4"],
  "c3": ["d3", "c4"],
  "d3": ["c3", "e3", "d2", "d5"],
  "e3": ["d3", "e4"],
  "a4": ["a1", "b4", "a7"],
  "b4": ["a4", "c4", "b2", "b6"],
  "c4": ["b4", "c3", "c5"],
  "e4": ["e3", "f4", "e5"],
  "f4": ["e4", "g4", "f2", "f6"],
  "g4": ["f4", "g1", "g7"],
  "c5": ["c4", "d5"],
  "d5": ["c5", "e5", "d3", "d7"],
  "e5": ["d5", "e4"],
  "b6": ["b4", "d6"],
  "d6": ["b6", "f6", "d5", "d7"],
  "f6": ["d6", "f4"],
  "a7": ["a4", "d7"],
  "d7": ["a7", "g7", "d6", "d5"],
  "g7": ["d7", "g4"]
};

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

  public movePiece(from: Position, to: Position, color: Piece, isFlying: boolean = false): boolean {
    if (this.positions[from] !== color || this.positions[to] !== null) return false;
    
    // If not flying, check if the move is to an adjacent position
    if (!isFlying && !Board.ADJACENT_POSITIONS[from]!.includes(to)) {
        return false;
    }

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

public getAdjacentPositions(position: Position): Position[] {
  return Board.ADJACENT_POSITIONS[position] ?? [];
}
}