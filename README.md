# Ultimate 3D Tic-Tac-Toe 🧊

A mind-bending, interactive, and fully rotatable Ultimate 3D Tic-Tac-Toe game built entirely with Vanilla web technologies. 

Instead of a standard flat 3x3 grid, this game takes place inside a holographic **3x3x3 cube** containing 27 separate macro-blocks. But there is a catch: to claim a block, you have to win a mini-game inside it first!

## 📜 How to Play (The Rules)

The game operates on two layers: the **Micro-Game** (inside a single block) and the **Macro-Game** (the entire 3D cube).

### 1. The Micro-Game (Winning a Block)
* The board consists of 27 "macro-blocks".
* Inside *every* macro-block is a standard 3x3 Tic-Tac-Toe board (a "micro-board").
* Players take turns placing their X or O inside the small squares of these micro-boards.
* **To claim a macro-block:** You must get 3 of your symbols in a row (horizontally, vertically, or diagonally) on that specific micro-board.
* Once a macro-block is won, it is visually locked and claimed by the winning player.

### 2. The Macro-Game (Winning the Cube)

* **To win the entire game:** You must claim **3 macro-blocks in a row** across the 3D space. 
* Because this is a 3D cube, there are **49 different ways to win**:
  * **Standard 2D Wins (24):** 3 in a row on the front, middle, or back faces.
  * **Z-Axis Pillars (9):** 3 blocks stacked perfectly from front to back.
  * **2D Cross-Layer Diagonals (12):** Diagonal lines that cut across the faces and depth layers simultaneously.
  * **True 3D Diagonals (4):** Lines that shoot from a corner, straight through the absolute center block (Block 14), to the opposite corner.

### 3. Controls
* **Desktop:** Click and drag your mouse to rotate the cube and view it from any angle.
* **Mobile:** Swipe on the screen to rotate the cube.
* **Auto-Spin:** Click the "Toggle Auto-Spin" button to let the cube rotate slowly on its own.

---

## 🛠️ The Tech Stack

This project was built from scratch without any external libraries, frameworks, or 3D rendering engines (like Three.js). 

* **Vanilla HTML5:** For the semantic structure of the 243 micro-cells nested within 27 macro-blocks.
* **Advanced CSS3:**
  * Uses `transform-style: preserve-3d` and `perspective` to create a true 3D scene.
  * Stacks layers along the Z-axis using `transform: translateZ()`.
  * Implements `pointer-events` toggling so users can physically click "through" the empty gaps of the front layers to interact with the layers behind them.
  * Uses CSS Grid for perfect 3x3 alignments on both the micro and macro levels.
* **Vanilla JavaScript (ES6+):**
  * **Spatial Logic:** Maps all 49 potential 3D win vectors across a flat 27-item array to monitor the macro-board state.
  * **State Management:** Tracks active players, 27 independent mini-board states, and the overarching macro-board state.
  * **Event Handling:** Custom logic for converting mouse drag distances (`mousemove`) and mobile touch inputs (`touchmove`) into X and Y rotational degrees for the CSS transforms.

---

## 🚀 How to Run

1. Clone this repository to your local machine.
2. Open the `index.html` file in any modern web browser.
3. Start playing! No build tools or servers required.
