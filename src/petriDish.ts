import Point from './point';
import Node from './node';
import Canvas from './canvas';
import Utils from './utils';
import PetriDishSquare from './PetriDishSquare';
import { Parameters } from './parameters';

export default class PetriDish {

    private dish:PetriDishSquare[][];
    private centerPoint:Point;
    private time:number;
    private blockingCount:Set<number>[];
    canvas:Canvas;

    constructor(diameter:number, canvas:Canvas) {
        this.canvas = canvas;
        var radius:number = Parameters.halfCanvas;
        this.centerPoint = new Point(Parameters.halfCanvas, Parameters.halfCanvas);
        this.dish = [];
        for (let x = 0; x < Parameters.scaleFromPixel; x++) {
            var dishColumn:PetriDishSquare[] = [];
            for (let y = 0; y < Parameters.scaleFromPixel; y++) {
                // 0 iff point is inside radius of the dish
                var addingPoint = new Point(x,y);
                //console.log(addingPoint);
                var inside = Point.distance(addingPoint, this.centerPoint) < radius ? 0 : -1; //square
                //if (inside === -1) { canvas.drawSquare(addingPoint, 1, '#808080'); }
                //if (inside === 0) { canvas.drawSquare(addingPoint, 1, '#FFFFFF'); }
                var addingSquare = new PetriDishSquare(inside, false);
                
                dishColumn.push(addingSquare);
            }
            this.dish.push(dishColumn);
        }
        this.time = 0;
        this.blockingCount = Array<Set<number>>(Parameters.numPlants + 1);
        for (let i = 1; i < this.blockingCount.length; i++) {
            this.blockingCount[i] = new Set();
        }
    }

    drawClaimed() {
        for (let x = 0; x < Parameters.scaleFromPixel; x++) {
            for (let y = 0; y < Parameters.scaleFromPixel; y++) {
                const p = new Point(x,y);
                var owner = this.squareAt(p).getOwner();
                if (owner === -1) { this.canvas.drawSquare(p, 1, '#000000'); }
                if (owner > 0) { this.canvas.drawSquare(p, 1, '#808080'); }
            }
        }
    }

    private squareAt(area:Point) {
        var roundedPoint = Point.round(area);
        return this.dish[roundedPoint.getX()][roundedPoint.getY()];
    }

    ownerFromPixel(x:number, y:number) {
        const ownerCounter = {};
        const area = new Point(Math.round(x / Parameters.unitSize), Math.round(y / Parameters.unitSize - 10));
        let outOfDish = false;
        const nearbyOwners = [];
        for (let x = area.getX() - 1; x < area.getX() + 2; x++) {
            for (let y = area.getY() - 1; y < area.getY() + 2; y++) {
                //canvas.drawSquare(new Point(x, y), 1, '#000000');
                const owner = this.inDish(new Point(x, y)) ? this.squareAt(new Point(x, y)).getOwner() : -1;
                if (owner !== 0) {
                    nearbyOwners.push(owner);
                }
            }
        }
        return nearbyOwners.length > 0 ? Utils.mode(nearbyOwners) : 0; //outOfDish ? -1 : 0;
    }

    inDish(area:Point) {
        var roundedPoint = Point.round(area);
        return roundedPoint.getX() >= 0 && roundedPoint.getX() < this.dish.length && 
                roundedPoint.getY() >= 0 && roundedPoint.getY() < this.dish[0].length;
    }

    areaClaimable(id: number, area:Point) {
        if (!this.inDish(area)) { return false; }
        return this.squareAt(area).canClaim(id);
    }

    addGrowth(id:number, area:Point, attemptClaim:boolean) {
        var square = this.squareAt(area);
        square.grow(id, attemptClaim);
        //this.canvas.drawSquare(area, 1, '#000000');
    }

    tryGrowingNode(id:number, growingNode:Node, newLocation:Point, relativeSlice:number):boolean[] {
        this.time++;
        if (Math.abs(relativeSlice * Parameters.sliceSize - Math.PI) < 0.01 || (!Parameters.allowStraightLines && relativeSlice % Parameters.numberGrowthAngles === 0)) { 
            //console.log('grew back');
            return [false, false]; 
        }
        var roundedPoint = Point.round(newLocation);
        for (var i = 0; i < growingNode.children.length; i++) {
            if (roundedPoint.equals(Point.round(growingNode.children[i].location)))
                return [false, false]; 
        }
        return this.attemptGrowth(id, growingNode.location, newLocation, true);
    }

    private attemptGrowth(id:number, startPoint:Point, endPoint:Point, attemptClaim:boolean):boolean[] {
        if (!this.inDish(endPoint)) { 
            //console.log('Endpoint outside dish');
            return [false, true]; 
        }
        var squareOwner = this.squareAt(endPoint).getOwner();
        //if (isNaN(squareOwner)) { throw new Error('Owner NaN, possible cross'); }
        if (squareOwner !== 0 && squareOwner !== id) { 
            if (squareOwner !== -1) { this.blockingCount[squareOwner].add(id); }
            //console.log('owned by other');
            return [false, true]; 
        }
        var square = this.squareAt(endPoint);
        if (square.getRecources() <= 0) { 
            if (Point.round(startPoint).equals(Point.round(endPoint)) && !square.grownTwice)
                square.grownTwice = true;
            else
            //console.log('no recources');
                return [false, false]; }
        var crossesDiagonal = endPoint.getX() !== startPoint.getX() && endPoint.getY() !== startPoint.getY();
        if (crossesDiagonal) {
            var diagonalPointA = new Point(startPoint.getX(), endPoint.getY());
            var diagonalPointB = new Point(endPoint.getX(), startPoint.getY());
            let grewDiagonal = this.attemptGrowth(id, startPoint, diagonalPointA, false);
            if (!grewDiagonal) {
                grewDiagonal = this.attemptGrowth(id, startPoint, diagonalPointB, false);
            }
            if (grewDiagonal) {
                this.addGrowth(id, endPoint, attemptClaim);
                return [true, false];
            }
            return [false, false];
        }

        this.addGrowth(id, endPoint, attemptClaim);
        return [true, false];
    }

    getCenter() {
        return this.centerPoint;
    }

    getTime() {
        return this.time;
    }

    getBlockingCount(id:number) {
        return this.blockingCount[id].size;
    }


    getNumberOpen(area:Point) {
        var roundedPoint = (Point.round(area));
        var xCenter = roundedPoint.getX();
        var yCenter = roundedPoint.getY();
        let openSquares = 0.0;
        for (let x = xCenter - 1; x < xCenter + 2; x++) {
            for (let y = yCenter - 1; y < yCenter + 2; y++) {
                var area = new Point(x, y);
                if (this.inDish(area)) {
                    openSquares += this.squareAt(area).getOwner() === 0 ? 1.0 : 0.0; // maybe canClaim/isclaimed? later
                }
            }
        }
        return openSquares;
    }

    getNumberNearbyEnemies(id:number, area:Point) {
        var roundedPoint = (Point.round(area));
        var xCenter = roundedPoint.getX();
        var yCenter = roundedPoint.getY();
        const enemies:Set<number> = new Set();
        for (let x = xCenter - 2; x < xCenter + 3; x++) {
            for (let y = yCenter - 2; y < yCenter + 3; y++) {
                var area = new Point(x, y);
                if (this.inDish(area)) {
                    const owner = this.squareAt(area).getOwner();
                    if (owner !== id && owner > 0) { enemies.add(owner); }
                }
            }
        }
        return enemies.size;
    }
    
}