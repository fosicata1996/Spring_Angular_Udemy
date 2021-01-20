import {Shape} from "./Shape";
import {Circle} from "./Circle";
import {Rectangle} from "./Rectangle";

let theShapes: Shape[] = [];
theShapes.push(new Shape(10, 15));
theShapes.push(new Circle(5, 10, 20));
theShapes.push(new Rectangle(0, 0, 3, 7));

for (let currentShape of theShapes)
{
    console.log(currentShape.getInfo());
}