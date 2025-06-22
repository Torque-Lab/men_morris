# Man Morris Game

This project is an implementation of the classic "Nine Men's Morris" (Man Morris) board game. It is built using Next.js for the frontend and uses WebSockets for real-time multiplayer gameplay.

## Features

- Play Nine Men's Morris online with real-time updates
- Modern UI built with Next.js
- Multiplayer support via WebSockets
- Modular codebase for easy extension

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd man_morris
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Start the servers:

   - Start the WebSocket server:
     ```sh
     pnpm --filter ws-server dev
     ```
   - Start the HTTP server (if needed):
     ```sh
     pnpm --filter http-server dev
     ```
   - Start the Next.js web app:
     ```sh
     pnpm --filter web dev
     ```

4. Open your browser and go to `http://localhost:3000/gameboard` to play.

## If You not Know Game Rules, This is for You

Nine Men's Morris is a strategy board game for two players. The goal is to form "mills" (three of your pieces in a align in row) and reduce your opponent to two pieces or block all their moves.

### Game Phases

1. **Placing Pieces:**

   - Players take turns placing one of their 9 pieces on empty spots.
   - If a player forms a mill (three in a row), they remove one opponent's piece (but can not remove from a oponent mill if exist till they have more than three).

2. **Moving Pieces:**

   - After all pieces are placed, players take turns moving their pieces to adjacent empty spots.
   - Forming a mill allows removing an opponent's piece.

3. **Flying (when a player has 3 pieces left):**
   - A player with only 3 pieces can move to any empty spot, not just adjacent ones.

### How to Win

- Reduce your opponent to two pieces, or
- Block all their possible moves.

## Project Structure

- `apps/web` - Next.js frontend
- `apps/ws-server` - WebSocket server for real-time gameplay
- `apps/http-server` - (Optional) HTTP server
- `packages/` - Shared code and utilities

## License

MIT
