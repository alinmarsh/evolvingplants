import Point from './point';
import { Parameters, Objectives, LocationSelection } from './parameters';

export default class Canvas {

    ctx:CanvasRenderingContext2D;
    pixelWidth:number;


    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.pixelWidth = Parameters.canvasPixelSize;
    }

    drawLine(startPoint:Point, endPoint:Point, color:string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.getX() * Parameters.unitSize, startPoint.getY() * Parameters.unitSize);
        this.ctx.lineTo(endPoint.getX() * Parameters.unitSize, endPoint.getY() * Parameters.unitSize);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#000000';
    }

    drawThickLine(startPoint:Point, endPoint:Point, width:number, color:string) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width *Parameters.unitSize;
        this.drawLine(startPoint, endPoint, color);
        this.ctx.lineWidth = 1;
    }

    drawSquare(startPoint:Point, sideLength:number, color:string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(startPoint.getX() * Parameters.unitSize, startPoint.getY() * Parameters.unitSize, sideLength * Parameters.unitSize, sideLength * Parameters.unitSize);
        this.ctx.fillStyle = '#000000';
    }

    outlineSquare(startPoint:Point, sideLength:number, color:string) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(startPoint.getX() * Parameters.unitSize, startPoint.getY() * Parameters.unitSize, sideLength * Parameters.unitSize, sideLength * Parameters.unitSize);
        this.ctx.strokeStyle = '#000000';
    }

    drawLeaf(startPoint:Point, size:number, angle:number, offsetPoint:Point, color:string){
        startPoint = new Point(startPoint.getX() * Parameters.unitSize, startPoint.getY() * Parameters.unitSize);
        var rotatedOffsetA = offsetPoint.rotate(angle).add(startPoint);
        var rotatedOffsetB = new Point(offsetPoint.getX(), -offsetPoint.getY()).rotate(angle).add(startPoint);
        this.ctx.fillStyle = color;
        var endPoint = Point.createFromAngle(startPoint, angle, size);
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.getX(), startPoint.getY());
        this.ctx.quadraticCurveTo(rotatedOffsetA.getX(), rotatedOffsetA.getY(), endPoint.getX(), endPoint.getY());
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.getX(), startPoint.getY());
        this.ctx.quadraticCurveTo(rotatedOffsetB.getX(), rotatedOffsetB.getY(), endPoint.getX(), endPoint.getY());
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#000000';
    }

    drawCircle(center:Point, radius:number, color:string) {
        this.ctx.strokeStyle = color;
        this.traceCircle(center, radius);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#000000';
    }

    fillCircle(center:Point, radius:number, color:string, opacity:number=1) {
        
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.traceCircle(center, radius);
        this.ctx.fill();
        this.ctx.fillStyle = '#000000';
        this.ctx.globalAlpha = 1;
    }

    traceCircle(center:Point, radius:number) {
        this.ctx.beginPath();
        this.ctx.arc(center.getX() * Parameters.unitSize, center.getY() * Parameters.unitSize, radius * Parameters.unitSize, 0, Math.PI * 2, true);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.pixelWidth, this.pixelWidth);
    }

    getCtx() {
        this.clear;
        return this.ctx;
    }
}

