var game = {
    width: 640,
    height: 360,
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    rows: 4,
    cols: 8,
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

    },
    run: function(){
        this.update(); //обновить информацию
        this.render(); //нарисовать с учётом обновлений

        window.requestAnimationFrame(function(){ //Показать на экране
            game.run(); //Повторить всё ещё раз и так далее
        });   
    }
};
game.ball = {
    x: 336,
    y: 308,
    dx: 0,
    dy: 0,
    speed: 3,
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
        
        if (x + this.width > element.x && //Правая сторона мяча > левая сторона блока
            x < element.x + element.width && //Левая сторона мяча < правой стороны блока
            y + this.height > element.y && //Нижняя сторона мяча > верхней стороны блока
            y < element.y + element.height //Верхняя сторона мяча < нижней стороны блока
            ){
            return true;
        }

        return false;
    },
    bumpBrick: function(brick){
        this.dy *= -1; //Меняем направление мяча
        brick.isAlive = false;

    }
};

game.platform = {
    x: 300,
    y: 300,
    speed: 5, //максимальная допустимая скорость
    dx: 0, //текущая скорость по оси y, скорость изменения координат
    ball: game.ball,
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

