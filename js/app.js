// ********** THE ENEMY CLASS CONSTRUCOR **********

class Enemy{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speed = Math.floor(Math.random()*(700-200+1)+200);
        this.sprite = 'images/enemy-bug.png';
    };

    // This will Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.x += Math.floor(Math.random()*(400-this.speed+1)+this.speed)* dt;  
        if(this.x>600){
            (this.x = -100)
        }
    };

    // This will Draw the enemy on the screen
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}


// *********** THE PLAYER CLASS CONSTRUCTOR ***********

class Player{
    constructor(x,y){
        this.x= x;
        this.y= y;
    }
    // This will make the user controle the player with arrow key
    update(key){
        if(key === "left" & player.x>-3){
            this.x -= 101;
        }
        if(key === "up"& player.y > 45){
            this.y -= 83;
        }
        if(key === "right"& player.x < 401){
            this.x += 101;
        }
        if(key === "down" & player.y < 380){
            this.y += 83;
        }
    }
    // This will draw the player on the screen
    render(){
        let pimg = new Image();
        pimg.src = chosen_sprite;
        ctx.drawImage(pimg, this.x, this.y);
    }
    // This will calculate the distance between the player and the parameter in the function
    get_distance(enemies){
                let xDistance = this.x - enemies.x;
                let yDistance = this.y - enemies.y;
            
                return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
    }
    // This will reset the player to it's intial position
    reset(){
        this.x= 199;
        this.y= 460;
    }
}

// ******************* THE TROPHIES CLASS CONSTRUCTOR ********************
class Trophies{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.sprites=['images/Heart.png','images/Star.png','images/Gem Orange.png','images/Gem Blue.png','images/Gem Green.png','images/Key.png'];
        this.sprite='images/Heart.png';
    }
    // this will draw the trophie on the canvas 
    render(){
        let s = new Image();
        s.src= this.sprite;
        ctx.drawImage(s,this.x,this.y);
    }
    // this will update the trophie's position and source when it's called 
    update(){
        this.sprite = this.sprites[Math.floor(Math.random()*(this.sprites.length))];
        this.x = Math.floor(Math.random()*450);
        this.y = Math.floor(Math.random()*(297-146+1)+146);
    }
}

//  ******************** INSTANTINATION **************************

// Instantiated bugs from Enemy class.
let bug1 = new Enemy(50,146);
let bug2 = new Enemy(0,230);
let bug3 = new Enemy(600,297);

// All enemies objects are in an array called allEnemies
let allEnemies = [bug1, bug2, bug3] ;


// Instantiated player object from Player class
let player = new Player(199,460);

// Instantiated Trophies
let trophie = new Trophies(200,300);


// THE MODAL SECTION
let finishGame = document.getElementById('finishModule');
let moduleHeader2 = document.getElementById('moduleHeader2');
let won = "You won!";
let lost = "You just Lost the game!"
let moduleButton = document.getElementById('moduleButton');

    function finish_game(state){
        finishGame.style.display= 'block';
        moduleHeader2.innerHTML= state;
    }

// This listens for key presses and sends the keys to your
// Player.update() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.update(allowedKeys[e.keyCode]);
    select_player_arrow(allowedKeys[e.keyCode]);
});
