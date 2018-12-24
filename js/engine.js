var Engine = (function(global) {

    startAnimation = function() {
        id = window.requestAnimationFrame(main);
    }

    cancelAnimation = function() {
        window.cancelAnimationFrame(id);
    }

    /**** Engine Logic ****/
    var ctx = CANVAS.getContext('2d'),
        lastTime,
        id;

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    main = function() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        if (startedGame) {
            update(dt);
            render();
            lastTime = now;

            // check if game is won
            gameWon();

            // update player's health
            health(PLAYER.health);

            // Show hearts if player is in need of health
            hearts();

            // update player's power
            power(PLAYER.powers);
        }

    }

    function init() { // this runs once
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
    }

    function updateEntities(dt) {
        ALL_FINISHES.forEach(finish => finish.update(dt));
        SCORE.update();
        ALL_ENEMIES.forEach(enemy => enemy.update(dt));
        ALL_COLLECTABLES.forEach(collectable => collectable.update(dt));
        PLAYER.update(dt);

        global.dt = dt;
    }

    function render() {
        var center = [5, 2], // name of block = [xPos, yPos] on spritesheet
            top = [3, 2],
            right = [3, 0],
            bottom = [2, 2],
            left = [2, 0],
            topBridge = [4, 0],
            bottomBridge = [4, 2],
            bottomRightCorner  = [5, 1],
            bottomLeftCorner = [5, 0],
            enemiesRightTop = [1, 0],
            enemiesLeftTop = [0, 0],
            enemiesRightBottom = [1, 1],
            enemiesLeftBottom = [0, 1],
            enemiesRightEdge = [1, 2],
            enemiesLeftEdge = [0, 2],
            bridge = [4, 1],
            bottomRight = [3, 1],
            bottomLeft = [2, 1],
            bottomEdge = [7, 0],
            wall_1 = [6, 1],
            wallTop = [6, 0],
            wall_2 = [6, 2],
            empty = [7, 1],

            numRows = 12,
            numCols = 7,
            row, col;

        // this is the tile map for facility level
        let facilityMapTiles = [
            [wall_2, wallTop, wall_2, wallTop, wall_2, wallTop, wall_2],
            [center, wall_1, center, wall_1, center, wall_1, center],
            [left, center, center, center, center, center, right],
            [enemiesLeftBottom, bottom, topBridge, bottom, topBridge, bottom, enemiesRightBottom],
            [enemiesLeftEdge, bottomEdge, bridge, bottomEdge, bridge, bottomEdge, enemiesRightEdge],
            [enemiesLeftTop, top, bottomBridge, top, bottomBridge, top, enemiesRightTop],
            [enemiesLeftBottom, topBridge, bottom, topBridge, bottom, topBridge, enemiesRightBottom],
            [enemiesLeftEdge, bridge, bottomEdge, bridge, bottomEdge, bridge, enemiesRightEdge],
            [enemiesLeftTop, bottomBridge, top, bottomBridge, top, bottomBridge, enemiesRightTop],
            [left, center, center, center, center, center, right],
            [bottomLeft, bottom, bottom, bottom, bottom, bottom, bottomRight],
            [bottomEdge, bottomEdge, bottomEdge, bottomEdge, bottomEdge, bottomEdge, bottomEdge]
        ];

        // this is the tile map for dungeon level
        let dungeonMapTiles = [
            [wall_2, wallTop, wall_2, wallTop, wall_2, wallTop, wall_2],
            [center, wall_1, center, wall_1, center, wall_1, center],
            [left, center, center, center, center, center, right],
            [enemiesLeftBottom, topBridge, bottom, bottom, bottom, topBridge, enemiesRightBottom],
            [enemiesLeftEdge, bridge, bottomEdge, bottomEdge, bottomEdge, bridge, enemiesRightEdge],
            [enemiesLeftTop, bottomBridge, top, top, top, bottomBridge, enemiesRightTop],
            [enemiesLeftBottom, bottom, topBridge, bottom, topBridge, bottom, enemiesRightBottom],
            [enemiesLeftEdge, bottomEdge, bridge, bottomEdge, bridge, bottomEdge, enemiesRightEdge],
            [enemiesLeftTop, top, bottomBridge, top, bottomBridge, top, enemiesRightTop],
            [bottomLeft, bottomLeftCorner, center, center, center, bottomRightCorner, bottomRight],
            [bottomEdge, bottomLeft, bottom, bottom, bottom, bottomRight, bottomEdge],
            [empty, bottomEdge, bottomEdge, bottomEdge, bottomEdge, bottomEdge, empty]
        ];

        // Choose map design based on selected level
        const MAP_TILES = selectedLevel === 'facility' ? facilityMapTiles : dungeonMapTiles;

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

        // helper function for placing blocks
        function placeBlock(block) {
            // ctx.drawImage(Resources.get(sprite), sx, sy, sw, sh, x, y, dw, dh);
            ctx.drawImage(Resources.get(`images/${selectedLevel}/level-sheet.png`), block[0] * 24, block[1] * 24, 24, 24 ,col * 24, row * 24, 24, 24);
        }

        // draw tiles on the canvas according to the provided map
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++){
                placeBlock(MAP_TILES[row][col]);
            }
        }

        renderEntities();
    }

    function renderEntities() {
        ALL_FINISHES.forEach(finish => finish.render());
        SCORE.render();
        ALL_ENEMIES.forEach(enemy => enemy.render());
        ALL_COLLECTABLES.forEach(collectable => collectable.render());
        PLAYER.render();
    }

    reset = function() {
        resetTimer();
        ALL_FINISHES.forEach(finish => finish.reset());
        SCORE.reset();
        ALL_ENEMIES.forEach(enemy => enemy.reset());
        ALL_COLLECTABLES.forEach(collectable => collectable.reset());
        PLAYER.reset();
        CANVAS.classList.remove('gameover');
        paused = false;
        if (startedGame) { // after exiting the game we reset it but we dont want to start the timer
            startTimer();
            startAnimation();
        }
    }

    Resources.load([
        'images/ar-logo.png',
        'images/character-image.png',
        'images/buttons-sheet.png',
        'images/bars-sheet.png',
        'images/star.png',

        'images/subzero-sheet.png',
        'images/subzero-alt-sheet.png',
        'images/scorpion-sheet.png',
        'images/scorpion-alt-sheet.png',
        'images/reptile-sheet.png',
        'images/reptile-alt-sheet.png',

        'images/facility/level-sheet.png',
        'images/facility/enemy_1-sheet.png',
        'images/facility/enemy_2-sheet.png',
        'images/facility/enemy_3-sheet.png',
        'images/facility/boss-sheet.png',
        'images/facility/score-sheet.png',
        'images/facility/finish-sheet.png',

        'images/dungeon/level-sheet.png',
        'images/dungeon/enemy_1-sheet.png',
        'images/dungeon/enemy_2-sheet.png',
        'images/dungeon/enemy_3-sheet.png',
        'images/dungeon/boss-sheet.png',
        'images/dungeon/score-sheet.png',
        'images/dungeon/finish-sheet.png',

        'images/collectable_1-sheet.png',
        'images/collectable_2-sheet.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
