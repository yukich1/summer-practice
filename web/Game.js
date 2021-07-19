var game = {
    width: 640,
    height: 323,
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    rows: 4,
    cols: 8,
    running: true,
    scores: 0,
    bricks: [],
    sprites: {
        background: undefined,
        platform: undefined,
        ball: undefined,
        brick: undefined,
    },

    init: function(){
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

    },

    load: function(){
        for (var key in this.sprites){
            this.sprites[key] = new Image();
            this.sprites[key].src = "build/images/" + key + ".png";
        }
    },
    create: function(){
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
    },

    start: function(){
        this.init();
        this.load();
        this.create();
        this.run();
    },    
    render: function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);

        this.bricks.forEach(function(element){ //В качестве параметра принимает функцию, которая будет выполнятся для каждого элемента в этом массиве
            if (element.isAlive) {
                this.ctx.drawImage(this.sprites.brick, element.x, element.y);
            }
        }, this);

    },
    update: function(){
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

        this.ball.CheckBounds();

    },
    run: function(){
        this.update(); //обновить информацию
        this.render(); //нарисовать с учётом обновлений

        if(this.running){  
            window.requestAnimationFrame(function(){ //Показать на экране
                game.run(); //Повторить всё ещё раз и так далее
            });
        }  
    },
    over: function(message){
        alert(message);
        this.running = false;
        console.log("Game over");
        window.location.reload();

    }
};
game.ball = {
    x: 336,
    y: 310,
    dx: 0,
    dy: 0,
    speed: 3,
    width: 30,
    height: -10,
    jump: function(){
        this.dy = -this.speed;
        this.dx = -this.speed;
    },
    move: function(){
        this.x += this.dx;
        this.y += this.dy;
    },
    collide: function(element) { //в качестве параметра элемент, в котором проверяется столкновение
    //Суть метода - проверить сталкивается ли мяч с element, который у нас в качестве параметра этого метода
        var x = this.x + this.dx; //Проверяем наложение не на текущей координаты, а координаты, который мяч получит на следующем кадре анимации
        var y = this.y + this.dy;
        
        if (x < element.x + element.width &&
            x + this.width > element.x &&
            y < element.y + element.height &&
            this.height + y > element.y
            ){
            return true;
        }

        return false;
    },
    bumpBrick: function(brick){
        this.dy *= -1; //Меняем направление мяча
        brick.isAlive = false;
        ++game.scores;
        if (game.scores >= game.bricks.length){
            game.over("You are win");
        }
    },

    leftSide: function(platform){
       return (this.x + this.width / 2) < (platform.x + platform.width / 2)
    },

    bumpPlatform: function(platform){
        this.dy = -this.speed;
        this.dx = this.leftSide(platform) ? -this.speed : this.speed;
        
    },
    
    CheckBounds: function(){
        var x = this.x + this.dx; 
        var y = this.y + this.dy;  
        if (x < 0){ //Левее левой стороны экрана
            this.x = 0; //Не выходить за рамки поля
            this.dx = this.speed; //Напрвление мяча вправо
        } else if(x + this.width > game.width) { //Правее правой стороны экрана
            this.x = game.width - this.width; //координата по x равна координате правой стороны экрана
            this.dx = -this.speed; //Направление мяча влево
        } else if (y < 0){ //Выше верхней стороны экрана
            this.y = 0; //Помещаем на верхнюю сторону, не даём выйти за рамки поля
            this.dy = this.speed;
        } else if (y + this.height > game.height) { //Ниже нижней стороны экрана
            //game over
            game.over("Game over");
        }     
    }
};

game.platform = {
    x: 300,
    y: 300,
    speed: 5, //максимальная допустимая скорость
    dx: 0, //текущая скорость по оси y, скорость изменения координат
    ball: game.ball,
    width: 100,
    height: 84,
    releaseBall: function(){
        if (this.ball){
            this.ball.jump();
            this.ball = false;
        }
    },
    move: function(){
        this.x += this.dx;
        if (this.ball){
            this.ball.x += this.dx;
        }
    },
    stop: function(){
        this.dx = 0;       

        if (this.ball){
            this.ball.dx = 0;
        }
    }
};


window.addEventListener("load", function(){
    game.start();
}); 

