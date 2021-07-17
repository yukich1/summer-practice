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
    },

    load: function(){
        for (var key in this.sprites){
            this.sprites[key] = new Image();
            this.sprites[key].src = "build/images/" + key + ".png";
        }
    },
    create: function(){
        for ( var col = 0; col < this.cols; col ++){
            this.bricks.push({
                x: 68 * col,
                y: 0,
                width: 64,
                height: 32
            });
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

        this.bricks.forEach(function(element){
            this.ctx.drawImage(this.sprites.brick, element.x, element.y);
        }, this);

    },
    run: function(){
         this.render();

        window.requestAnimationFrame(function(){
            game.run();
        });   
    }
};
game.ball = {
    x: 336,
    y: 308,
}

game.platform = {
    x: 300,
    y: 300,
};


window.addEventListener("load", function(){
    game.start();
}); 

