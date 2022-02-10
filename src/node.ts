import Point from './point';
import { Parameters } from './parameters';

export default class Node {

    static createRootNode(location:Point, center:Point) {
        /*var angleToCenter = Point.angle(location, center) ;
        var sliceToCenter = Math.round(angleToCenter / Parameters.sliceSize);*/
        return new Node(location, center, 0, 0, 0, 0, new EmptyNode());
    }

    static createChildNode(location:Point, parent:Node, growthDirection:number, absoluteDirection:number, center:Point, root:Point) {
        //var growthDirection = Point.angle(parent.location, location);
        var distanceFromRoot = Point.distance(location, root);

        return new Node(location, center, growthDirection, absoluteDirection,
            parent.nodesFromRoot + 1, distanceFromRoot, parent);
    }


    location:Point;
    parent:Node | EmptyNode;
    nodesFromRoot:number;
    children:Node[];
    totalChildren:number;

    //normalized inputs (in range [0,1])
    directionToCenter:number;
    distanceToCenter:number;
    relativeSlice:number;
    absoluteSlice:number;
    northDirection:number;
    //nodesFromRootNorm:number;
    distanceFromRoot:number;

    constructor(location:Point, center:Point, relativeSlice:number, absoluteSlice:number, nodesFromRoot:number, 
        distanceFromRoot:number, parent:(EmptyNode|Node)) {
            this.location = location;
            this.parent = parent;
            this.nodesFromRoot = nodesFromRoot;
            this.children = [];
            this.totalChildren = 0
            this.directionToCenter = Point.angle(location, center);
            this.distanceToCenter = Point.distance(location, center);
            this.relativeSlice = relativeSlice;
            this.absoluteSlice = absoluteSlice;
            this.northDirection = Point.angle(location, new Point(location.getX(), 0));
            //this.nodesFromRootNorm = parent.nodesFromRoot + 1;
            this.distanceFromRoot = distanceFromRoot;

            this.parent.addChild(this);
        }

    addChild(child:Node) { 
        this.children.push(child);
        this.addDescendant();
    }

    addDescendant() {
        this.totalChildren++;
        this.parent.addDescendant();
    }

}

export class EmptyNode {
    growthDirection:number = 0;
    nodesFromRoot:number = 0;
    absoluteSlice:number = 0; // TODO?????
    isEmpty() { return true; }
    addChild(child:Node) {}
    addDescendant() {}
}