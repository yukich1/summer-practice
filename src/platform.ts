import {game} from "./game";
import {ball} from "./ball";
export class platform {
    x: number = 300
    y: number = 300
    speed: number = 5 //максимальная допустимая скорость
    dx: number = 0 //текущая скорость по оси y, скорость изменения координат
    ball = game.ball
    width: number = 100
    height: number = 84

    releaseBall(){
        if (this.ball){
            this.ball.jump();
            this.ball = false;
        }
    }

    move(ball){
        this.x += this.dx;
        if (ball){
            ball.x += this.dx;
        }
    }

    stop(){
        this.dx = 0;       

        if (this.ball){
            this.ball.dx = 0;
        }
    }
};