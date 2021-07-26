import {platform} from "./platform";
import {ball} from "./ball";
export class game {
        width: 640
        height: 323
        ctx: undefined
        platform: platform
        ball: ball
        rows: 4
        cols: 8
        running: true
        scores: 0
        bricks: []
        sprites: {
            background: undefined,
            platform: undefined,
            ball: undefined,
            brick: undefined,
        }
    
        init(){
            var canvas = document.getElementById("mycanvas");
            this.ctx = canvas.getContext("2d");
    
            window.addEventListener("keydown", function(event){
                if (event.keyCode == 37) {
                    game.platform.dx = -game.platform.speed
                } else if (event.keyCode == 39) {
                    game.platform.dx = game.platform.speed;
                } else if (event.keyCode == 16) {
                    game.platform.releaseBall();
                }
            });
    
    
            window.addEventListener("keyup", function(event){
                game.platform.stop();
            });
    
        }
    
        load(){
            for (var key in this.sprites){
                this.sprites[key] = new Image();
                this.sprites[key].src = "build/images/" + key + ".png";
            }
        }
        create(){
            for (var row = 0; row < this.rows; row ++) {       
                for (var col = 0; col < this.cols; col ++){
                    this.bricks.push({
                        x: 70 * col + 46,
                        y: 38 * row + 35,
                        width: 64,
                        height: 32,
                        isAlive: true
                    });
                }
            }   
        }
    
        start(){
            this.init();
            this.load();
            this.create();
            this.run();
        }

        render(){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.sprites.background, 0, 0);
            this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
            this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    
            this.bricks.forEach(function(element){ //В качестве параметра принимает функцию, которая будет выполнятся для каждого элемента в этом массиве
                if (element.isAlive) {
                    this.ctx.drawImage(this.sprites.brick, element.x, element.y);
                }
            }, this);
    
        }

        update(){
            if(this.ball.collide(this.platform)){
                this.ball.bumpPlatform(this.platform);
    
            }
            
            if (this.platform.dx){
                this.platform.move();
            }
    
            if (this.ball.dx || this.ball.dy){
                this.ball.move();
            }
    
            this.bricks.forEach(function(element){ 
                if (element.isAlive){
                    if (this.ball.collide(element)) {
                    this.ball.bumpBrick(element);
                    } 
                }
            }, this);
    
            this.ball.checkBounds();
    
        }

        run(){
            this.update(); //обновить информацию
            this.render(); //нарисовать с учётом обновлений
    
            if(this.running){  
                window.requestAnimationFrame(function(){ //Показать на экране
                    game.run(); //Повторить всё ещё раз и так далее
                });
            }  
        }

        over(message){
            alert(message);
            this.running = false;
            console.log("Game over");
            window.location.reload();
    
        }
};