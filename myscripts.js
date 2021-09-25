// ***all variables here***
// music variables
const back_music = new Audio("sounds/back.mp3");
const eat_music = new Audio("sounds/eat.wav");
const move_music = new Audio("sounds/move2.wav");
const game_over_music = new Audio("sounds/gameover.wav");

// time variables
let p_time = 0;
let speed = 5;

//score variables
let score = 0;
let hiScore = parseInt(localStorage.getItem("hiScore"));
if(hiScore == null){
    hiScore = 0;
}
var bool = false;

//length variables
let height = 20;
let width = 20;

//min max values of position of food and head
let max = 16;
let min = 2;

// game elements variables
let direction = { x: 0, y: 0 };
let food;
let body;

startGame();


//***all functions here***
function any() {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

function anyXY() {
    return { x: any(), y: any() };
}

function ifFoodInBody() {
    body.forEach(element => {
        if (element.x == food.x && element.y == food.y) {
            return true;
        }
    });
    return false;
}

function isCollide() {
    for (bodyElement of body) {
        if ((body.indexOf(bodyElement) != 0) && (bodyElement.x == body[0].x && bodyElement.y == body[0].y)) {
            return true;
        }
    }
    return false;
}

function startGame() {

    bool = false;
    document.getElementsByClassName("mainDisplay")[0].style.filter = "none";
    document.getElementsByClassName("menuMsg")[0].style.display = "none";

    direction = { x: 0, y: 0 };
    score = 0;
    hiScore = parseInt(localStorage.getItem("hiScore"));

    food = anyXY();
    body = [anyXY()];

    while (ifFoodInBody()) {
        food = anyXY();
    }
}

function pause() {
    if (bool == false) {
        back_music.pause();
        bool = true;
    }
    else {
        back_music.play();
        bool = false;
    }
}

function gameOver() {
    if (parseInt(localStorage.getItem("hiScore")) < score) {
        localStorage.setItem("hiScore", score);
    }
    bool = true;
    direction = { x: 0, y: 0 };
    document.getElementsByClassName("mainDisplay")[0].style.filter = "blur(5px)";
    document.getElementsByClassName("menuMsg")[0].style.display = "block";
    game_over_music.play();
    back_music.pause();
}

function main(time) {
    window.requestAnimationFrame(main);
    if ((time - p_time) / 1000 < (1 / speed)) {
        return;
    }
    p_time = time;
    GameEngine();
}

function GameEngine() {
    if (bool) {
        return
    }

    // display the score 
    let scores = document.getElementsByClassName("score");
    for (element of scores) {
        element.innerHTML = "Score: " + score;
    }

    let hiScores = document.getElementsByClassName("hiScore");
    for (element of hiScores) {
        element.innerHTML = "Hi-Score: " + hiScore;
    }

    // clear everything in the display before starting
    display.innerHTML = "";

    // create and position food element 
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.x;
    foodElement.style.gridColumnStart = food.y;
    foodElement.classList.add("food");
    display.appendChild(foodElement);

    body.forEach((element, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = element.x;
        snakeElement.style.gridColumnStart = element.y;
        snakeElement.style.opacity = 1 - (((index) / body.length) * 0.5);

        if (index == 0) {
            snakeElement.classList.add("head");
            if (((element.x == 0 && direction.x == -1) || (element.x == 20 && direction.x == 1) || (element.y == 0 && direction.y == -1) || (element.y == 20 && direction.y == 1)) || (isCollide())) {
                gameOver();
            }
        }
        else {
            snakeElement.classList.add("body");
        }
        display.appendChild(snakeElement);
    });

    // add body if snake head meets food 
    if (body[0].x == food.x && body[0].y == food.y) {
        body.push({ x: body[0].x + direction.x, y: body[0].y + direction.y });
        score += 1;

        eat_music.play();
        food = anyXY();
    }

    body.forEach(element => {
        if (element.x == food.x && element.y == food.y) {
            food = anyXY();
        }
    });

    // move body elements 
    for (let i = body.length - 2; i >= 0; i--) {
        body[i + 1] = { ...body[i] };
    }
    body[0].x += direction.x;
    body[0].y += direction.y;
}

// ***all event listeners***
document.getElementsByClassName("tryBtn")[0].addEventListener("click", startGame);

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

if(window.mobileCheck()){
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
    return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                                
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                                
    function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                                
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */ 
            move_music.play();
            direction.y = -1;
            direction.x = 0;

        } else {
            /* left swipe */
            move_music.play();
            direction.y = 1;
            direction.x = 0;
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
            move_music.play();
            direction.x = -1;
            direction.y = 0;
        } else { 
            /* up swipe */
            move_music.play();
            direction.x = 1;
            direction.y = 0;
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
    };
}
else{
    window.addEventListener("keydown", (t) => {
        if ((t.key == "ArrowUp" || "ArrowDown" || "ArrowLeft" || "ArrowRight") && !bool) {
            back_music.play();
        }

        switch (t.key) {
            case "ArrowUp":
                move_music.play();
                direction.x = -1;
                direction.y = 0;
                break;
    
            case "ArrowDown":
                move_music.play();
                direction.x = 1;
                direction.y = 0;
                break;
    
            case "ArrowLeft":
                move_music.play();
                direction.y = -1;
                direction.x = 0;
                break;
    
            case "ArrowRight":
                move_music.play();
                direction.y = 1;
                direction.x = 0;
                break;
    
            case "Escape":
                pause();
    
            default:
                break;
        }
    })
}

window.requestAnimationFrame(main);
