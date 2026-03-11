  // --- 3D ROTATION LOGIC ---
        const cube = document.getElementById('cube');
        const scene = document.getElementById('scene');
        let isDragging = false;
        let previousPosition = { x: 0, y: 0 };
        let rotation = { x: -25, y: 45 }; 
        let autoRotateInterval = null;

        function updateRotation() {
            cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
        }

        // Mouse Events
        scene.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousPosition = { x: e.clientX, y: e.clientY };
            stopAutoRotate();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let deltaMove = { x: e.clientX - previousPosition.x, y: e.clientY - previousPosition.y };
            rotation.y += deltaMove.x * 0.5; 
            rotation.x -= deltaMove.y * 0.5;
            updateRotation();
            previousPosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mouseup', () => { isDragging = false; });

        // Touch Events (For Mobile)
        scene.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            stopAutoRotate();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            let deltaMove = { x: e.touches[0].clientX - previousPosition.x, y: e.touches[0].clientY - previousPosition.y };
            rotation.y += deltaMove.x * 0.6; 
            rotation.x -= deltaMove.y * 0.6;
            updateRotation();
            previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: false });

        document.addEventListener('touchend', () => { isDragging = false; });

        // Auto-Rotate Button
        function startAutoRotate() {
            if (autoRotateInterval) return;
            autoRotateInterval = setInterval(() => {
                rotation.y += 0.5; // Slowly spin on Y axis
                updateRotation();
            }, 16); // roughly 60fps
        }

        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }

        document.getElementById('autoRotate').addEventListener('click', () => {
            if (autoRotateInterval) stopAutoRotate();
            else startAutoRotate();
        });

        document.getElementById('resetView').addEventListener('click', () => {
            stopAutoRotate();
            rotation = { x: -25, y: 45 };
            updateRotation();
        });


        // --- GAME LOGIC ---
        let microBoards = Array.from({ length: 27 }, () => Array(9).fill(null)); 
        let macroBoard = Array(27).fill(null); 
        let currentPlayer = 'X';
        let isGameActive = true;

        const microWinCombos = [
            [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
        ];

        const macroWinCombos = [
            [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6],
            [9,10,11], [12,13,14], [15,16,17], [9,12,15], [10,13,16], [11,14,17], [9,13,17], [11,13,15],
            [18,19,20], [21,22,23], [24,25,26], [18,21,24], [19,22,25], [20,23,26], [18,22,26], [20,22,24],
            [0,9,18], [1,10,19], [2,11,20], [3,12,21], [4,13,22], [5,14,23], [6,15,24], [7,16,25], [8,17,26],
            [0,12,24], [6,12,18], [1,13,25], [7,13,19], [2,14,26], [8,14,20], 
            [0,10,20], [2,10,18], [3,13,23], [5,13,21], [6,16,26], [8,16,24], 
            [0,13,26], [2,13,24], [6,13,20], [8,13,18]
        ];

        const statusElement = document.getElementById('status');

        function createBoard() {
            cube.innerHTML = '';
            for (let layer = 0; layer < 3; layer++) {
                const layerGrid = document.createElement('div');
                layerGrid.className = 'layer';
                layerGrid.dataset.layer = layer; 

                for (let block = 0; block < 9; block++) {
                    const macroIndex = (layer * 9) + block;
                    const macroCell = document.createElement('div');
                    macroCell.className = 'macro-cell';
                    macroCell.id = `macro-${macroIndex}`;

                    for (let cell = 0; cell < 9; cell++) {
                        const microCell = document.createElement('button');
                        microCell.className = 'micro-cell';
                        microCell.dataset.macro = macroIndex;
                        microCell.dataset.micro = cell;
                        microCell.addEventListener('click', handleCellClick);
                        macroCell.appendChild(microCell);
                    }
                    layerGrid.appendChild(macroCell);
                }
                cube.appendChild(layerGrid);
            }
        }

        function handleCellClick(e) {
            // Stop auto-rotate if player clicks to make a move
            stopAutoRotate(); 

            if (!isGameActive || isDragging) return;

            const macroIdx = parseInt(e.target.dataset.macro);
            const microIdx = parseInt(e.target.dataset.micro);

            if (macroBoard[macroIdx] !== null || microBoards[macroIdx][microIdx] !== null) return;

            microBoards[macroIdx][microIdx] = currentPlayer;
            e.target.textContent = currentPlayer;
            e.target.classList.add(currentPlayer.toLowerCase());

            if (checkMicroWin(macroIdx)) {
                claimMacroBlock(macroIdx);
                
                if (checkMacroWin()) {
                    statusElement.textContent = `ULTIMATE WINNER: Player ${currentPlayer}!`;
                    statusElement.style.color = currentPlayer === 'X' ? '#ff5252' : '#448aff';
                    isGameActive = false;
                    return;
                }
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusElement.textContent = `Player ${currentPlayer}'s Turn`;
            statusElement.style.color = currentPlayer === 'X' ? '#ff5252' : '#448aff';
        }

        function checkMicroWin(macroIdx) {
            const board = microBoards[macroIdx];
            for (let [a, b, c] of microWinCombos) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) return true;
            }
            return false;
        }

        function claimMacroBlock(macroIdx) {
            macroBoard[macroIdx] = currentPlayer;
            const macroElement = document.getElementById(`macro-${macroIdx}`);
            macroElement.classList.add('claimed');
            macroElement.dataset.winner = currentPlayer;
        }

        function checkMacroWin() {
            for (let [a, b, c] of macroWinCombos) {
                if (macroBoard[a] && macroBoard[a] === macroBoard[b] && macroBoard[a] === macroBoard[c]) return true;
            }
            return false;
        }

        document.getElementById('reset').addEventListener('click', () => {
            microBoards = Array.from({ length: 27 }, () => Array(9).fill(null));
            macroBoard = Array(27).fill(null);
            currentPlayer = 'X';
            isGameActive = true;
            statusElement.textContent = `Player X's Turn`;
            statusElement.style.color = '#ff5252';
            createBoard();
        });

        createBoard();