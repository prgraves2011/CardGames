document.addEventListener('DOMContentLoaded', () => {
    let draggedTile = null;
    let draggedFrom = null;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // Make tiles draggable
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.draggable = true;
        tile.style.cursor = 'grab';
    });

    // Mouse down - prepare for drag
    document.addEventListener('mousedown', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) {
            tile.style.cursor = 'grabbing';
        }
    });

    // Drag start
    document.addEventListener('dragstart', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) {
            draggedTile = tile;
            draggedFrom = tile.parentElement;
            
            // Calculate offset from mouse to tile corner
            const rect = tile.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Add visual feedback
            setTimeout(() => {
                tile.style.opacity = '0.5';
            }, 0);
            
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    // Drag end
    document.addEventListener('dragend', (e) => {
        if (draggedTile) {
            draggedTile.style.opacity = '';
            draggedTile.style.cursor = 'grab';
            draggedTile = null;
            draggedFrom = null;
        }
    });

    // Setup drop zones on cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        // Drag over
        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Visual feedback
            if (draggedTile && cell !== draggedFrom) {
                cell.style.backgroundColor = 'rgb(127, 255, 212)';
                cell.style.transform = 'scale(1.05)';
            }
        });

        // Drag leave
        cell.addEventListener('dragleave', (e) => {
            cell.style.backgroundColor = '';
            cell.style.transform = '';
        });

        // Drop
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.style.backgroundColor = '';
            cell.style.transform = '';
            
            if (draggedTile && cell.children.length === 0) {
                // Get drop position
                const dropX = e.clientX;
                const dropY = e.clientY;
                
                // Get tile and cell positions
                const tileRect = draggedTile.getBoundingClientRect();
                const cellRect = cell.getBoundingClientRect();
                
                // Calculate where tile should end up (centered in cell)
                const targetX = cellRect.left + (cellRect.width - tileRect.width) / 2;
                const targetY = cellRect.top + (cellRect.height - tileRect.height) / 2;
                
                // Calculate current position (where mouse dropped it)
                const startX = dropX - offsetX;
                const startY = dropY - offsetY;
                
                // Calculate the offset needed to animate
                const translateX = startX - targetX;
                const translateY = startY - targetY;
                
                // Apply starting position
                draggedTile.style.transform = `translate(${translateX}px, ${translateY}px)`;
                draggedTile.style.transition = 'none';
                
                // Move tile to new cell in DOM
                cell.appendChild(draggedTile);
                
                // Force reflow
                draggedTile.offsetHeight;
                
                // Animate to final position
                draggedTile.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                draggedTile.style.transform = 'translate(0, 0)';
                
                // Clean up after animation
                setTimeout(() => {
                    draggedTile.style.transition = '';
                    draggedTile.style.transform = '';
                }, 400);
            }
        });
    });
});