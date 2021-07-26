import {game} from "./game";
import {platform} from "./platform";
export class ball{
    x: number =  336
    y: number = 310
    dx: number = 0
    dy: number = 0
    speed: number = 3
    width: number = 30
    height: number = -10

    jump(){
        this.dy = -this.speed;
        this.dx = -this.speed;
    }

    move(){
        this.x += this.dx;
        this.y += this.dy;
    }

    collide(element) { //в качестве параметра элемент, в котором проверяется столкновение
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
    }

    bumpBrick(brick){
        this.dy *= -1; //Меняем направление мяча
        brick.isAlive = false;
        ++game.scores;
        if (game.scores >= game.bricks.length){
            game.over("You are win");
        }
    }

    leftSide(platform){
       return (this.x + this.width / 2) < (platform.x + platform.width / 2)
    }

    bumpPlatform(platform){
        this.dy = -this.speed;
        this.dx = this.leftSide(platform) ? -this.speed : this.speed;
        
    }
    
    checkBounds(){
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
}