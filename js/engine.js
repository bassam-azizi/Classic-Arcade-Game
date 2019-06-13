/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 */
// this is the whole  welcome module variable
let welcomeModule = document.getElementById('welcomeModule');

let player_list_nodes = document.querySelectorAll('.player');
let player_list = Array.from(player_list_nodes);
let chosen_sprite= null;
// this game_bridge is the div where the start game button is..
let game_bridge = document.getElementById('game_bridge');


// This will listen for a tab key or mouse click , so it invoke the select_player function().
for(let i =0; i<player_list.length; i++){
    player_list[i].addEventListener('click',select_player,false);
    player_list[i].addEventListener('focus',select_player,false);
}
    // This function will gave the player sprite that have focus on it with a special background
    // It will either make the start game button appears
    // Il will also make the game later work on the chosen player sprite
function select_player(){
    let toggled = false;
    if(!toggled){
        toggled = true;
        for(let i=0; i<player_list.length; i++){
            player_list[i].classList.remove('selected');
        }
        this.classList.add('selected');
        let player_name = this.className.split(' ')[1] ;
        chosen_sprite = 'images/' + player_name+'.png';

        welcomeModule.style.height= '70%' ;
        game_bridge.style.visibility = 'visible';
        

        return;
    }
    if(toggled){
        toggled = false;
        this.classList.remove('selected');
        return;
    }
}


// This will listen for a click on the button of start game on the welcome module,
// if the click done, this will call the Engine function, and make the game begin
let startGame = document.getElementById('startGame');
startGame.addEventListener('click',Engine,false);

function Engine() {
    //  When the game start, the first thing will be that the module will be hidden
    welcomeModule.style.display="none";

    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    let lastTime;
    let level = 1;
    let score = 500;

    canvas.width = 505;
    canvas.height = 806;
    document.body.appendChild(canvas);
    trophie.update();
    
    
    
    /* This function serves as the kickoff point for the game loop itself
    * and handles properly calling the update and render methods.
    */
   function main() {
       /* Get our time delta information which is required if your game
       * requires smooth animation. Because everyone's computer processes
       * instructions at different speeds we need a constant value that
       * would be the same for everyone (regardless of how fast their
       * computer is) - hurray time!
       */
      var now = Date.now(),
      dt = (now - lastTime) / 1000.0;
      
      /* Call our update/render functions, pass along the time delta to
      * our update function since it may be used for smooth animation.
      */
     update(dt);
     render();
     game_score();
     game_level();
     instructions();
        

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        window.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();

    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions(); 
        for(i=0;i<allEnemies.length; i++){
            if(player.get_distance(allEnemies[i])<50){
                score -= 500;
                player.reset();
            }
        }
        if(player.get_distance(trophie)<70){
            trophie.x = Math.floor(Math.random() * 450);
            trophie.y = Math.floor(Math.random()*(297-146+1)+146);
            score += 500;
            trophie.update();
        }
        // this check the game score, and determine your level in the game, 
        // this will over the game, if your score is under 0 or if you win the game
        // with 11000 or more as a score and when u are in level 5
        if(score<0){
            finish_game(lost);
        }
        if(player.y <= 45 && score>=3000 && score<6000){
            level=2;
            player.reset();
        }
        if(player.y <= 45 && score>=6000 && score< 9000){
            level=3;
            player.reset();
        }
        if(player.y <= 45 && score>=9000&& score < 11000){
            level=4;
            player.reset();
        }
        if(player.y <= 45 && score>=11000){
            level=5;
            player.reset();
            finish_game(won);
        }
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                null, // this gave us space so we draw our score and level
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 7,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);
        

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 1; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions we have defined
     * on enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function from app.js.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        trophie.render();
    }
/****  THE SCORE SECTION  ****/
// THE SCORE FUNCTION
//When invoke't, tHis draw the level and the score of the game on the upper area of the game 
    function game_score(){
        ctx.font = 'bold 30px serif';
        ctx.fillStyle = 'rgba(138, 43, 226)';
        ctx.fillText("Score : "+score,10,120);
    }
    function game_level(){
        ctx.font= 'bold 30px serif';
        ctx.fillStyle ='rgba(138, 43, 226)';
        ctx.fillText('Level : '+ level,360,120)
    }

// when call it, THIS DRAW THE instructions ON THE DOWN SIDE OF THE GAME 
    function instructions(){
        ctx.font = "14px Verdana";
        ctx.fillStyle = '#3A2B2B';
        ctx.fillText('+ Use arrow key, To move player.', 5, 700);
        ctx.beginPath();
        ctx.font = "14px Verdana";
        ctx.fillStyle = '#3A2B2B';
        ctx.fillText('+ You catch a trophie, You get 500 points', 5, 720);
        ctx.beginPath();
        ctx.font = "14px Verdana";
        ctx.fillStyle = '#3A2B2B';
        ctx.fillText('+ You got to get to the water, up', 5, 740);
        ctx.beginPath();
        ctx.font = "14px Verdana"
        ctx.fillStyle = '#3A2B2B';
        ctx.fillText('+ The game have five levels', 5, 760);
        ctx.beginPath();
        ctx.font = "14px Verdana";
        ctx.fillStyle = '#3A2B2B';
        ctx.fillText('+ To pass a level you need 3000 points and to be in the water area.', 5, 780);
        ctx.beginPath();
        ctx.font = "14px Verdana";
        ctx.fillStyle = '#3A2B2B';
        ctx.fillText('+ When your score is under than 0, GAME OVER , You loose.', 5, 800);
    }

//  This reset the whole game to initial state 
    function reset() {
        player.reset();
        score = 500;
        level = 1;
        finishGame.style.display= 'none';
    }
moduleButton.addEventListener('click', reset);


    /* This load all the images */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assigning the canvas' context object to the global variable so that we can use it more easily
     * from within their app.js files.
     */
    window.ctx = ctx;
};
