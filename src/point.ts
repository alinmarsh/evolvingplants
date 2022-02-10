export default class Point {

    static distance(pointA:Point, pointB: Point): number {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)) // distance formula
    }

    // angle from point A to point B
    static angle(pointA:Point, pointB: Point): number {
        let angle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
        while (angle < 0) { angle += 2 * Math.PI; }
        while (angle > 2 * Math.PI) { angle -= 2 * Math.PI; }
        return angle;
    }

    static close(pointA:Point, pointB: Point): boolean {
        return ((Math.floor(pointA.x) === Math.floor(pointB.x)) &&
            (Math.floor(pointA.y) === Math.floor(pointB.y)));
    }

    static createFromAngle(startPoint:Point, angle:number, distance:number) {
        if (isNaN(angle) || isNaN(distance)) {
            throw new Error('createFromAngle must be numbers');
        }
        var deltaX = distance * Math.cos(angle);
        var deltaY = distance * Math.sin(angle);
        return new Point(startPoint.x + deltaX, startPoint.y + deltaY)
    }

    static round(other:Point) {
        return new Point(Math.floor(other.getX()), Math.floor(other.getY()));
    }


    private x:number;
    private y:number;

    constructor(x:number, y:number) {
        if (isNaN(x) || isNaN(y)) {
            throw new Error('Point must be numbers');
        }
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    equals(other:any) {
        if (other instanceof Point) {
            return this.x === other.x && this.y === other.y;
        }
        return false;
    }

    print() {
        console.log(`(${this.x}, ${this.y})`)
    }
}