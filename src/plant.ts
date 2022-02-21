import PetriDish from './petriDish';
import Point from './point';
import Node from './node';
import Canvas from './canvas';
import Equation from'./equation';
import Utils from './utils';
import { Parameters } from './parameters';

export default class Plant{
    static createRandomPlant(id:number, petri:PetriDish, canvas:Canvas, seedLocation:Point, evaluator:Equation, 
        equationLength:number = Parameters.defaultRandomEquationLength) : Plant {

        //var color = '#' + Math.floor(Math.random()*16777215).toString(16);
        //var color = `hsl(${Utils.random(0,360)}, ${Utils.random(25,85)}%, 90%)`;
        const color = [Utils.random(0,360), Utils.random(25,85), 85];
        // TODO: centralize leafcolor
        var leafColor = [color[0], color[1], color[2] - 20];
        var leafSize = Utils.random(10,20);        
        var leafOffset = new Point(Utils.random(6,12), Utils.random(6, 17)); // 10,10 the best

        var branchEquation:number[] = [];
        var directionEquation:number[] = [];
        var locationEquation:number[] = []
        for (let i = 0; i < equationLength; i++) {
            branchEquation.push(Math.floor(Math.random() * Parameters.equationNumberChoices));
            directionEquation.push(Math.floor(Math.random() * Parameters.equationNumberChoices));
            locationEquation.push(Math.floor(Math.random() * Parameters.equationNumberChoices));
        }
        return new Plant(id, petri, canvas, color, leafColor, seedLocation, leafSize, leafOffset, branchEquation, directionEquation, locationEquation, evaluator);
    }

    static createChildPlant(id:number, parent:Plant, petri:PetriDish, canvas:Canvas, newSeedLocation:Point) {
        return new Plant(id, petri, canvas, parent.color, parent.leafColor, newSeedLocation, parent.leafSize, parent.leafOffset, parent.branchEquation, 
            parent.directionEquation, parent.locationEquation, new Equation(petri));
    }

    static createMutatedPlant(id:number, parentA:Plant, parentB:Plant, petri:PetriDish, canvas:Canvas, newSeedLocation:Point, 
        maxEquationLength:number = Parameters.maxEquationLength) {

        var color = [Utils.random(0,360), Utils.random(25,85), 85];
        var leafColor = [color[0], color[1], color[2] - 20];
        var leafSize = Utils.random(10,20);
        var leafOffset = new Point(Utils.random(6,12), Utils.random(6,17)); // 10,10 the best
        var branchEquationA:number[] = Utils.copyArray(parentA.branchEquation);
        var directionEquationA:number[] = Utils.copyArray(parentA.directionEquation);
        var locationEquationA:number[] = Utils.copyArray(parentA.locationEquation);

        var branchEquationB:number[] = Utils.copyArray(parentB.branchEquation);
        var directionEquationB:number[] = Utils.copyArray(parentB.directionEquation);
        var locationEquationB:number[] = Utils.copyArray(parentB.locationEquation);

        var newBranchEquation = Plant.mergeEquations(branchEquationA, branchEquationB, maxEquationLength);
        var newDirectionEquation =  Plant.mergeEquations(directionEquationA, directionEquationB, maxEquationLength);
        var newLocationEquation = Plant.mergeEquations(locationEquationA, locationEquationB, maxEquationLength);
        

        return new Plant(id, petri, canvas, color, leafColor, newSeedLocation, leafSize, leafOffset,
            newBranchEquation, newDirectionEquation, newLocationEquation, new Equation(petri));
    }

    static mergeEquations(equationA:number[], equationB:number[], maxLength:number) {
        let newEquation:number[] = equationA.slice(0, Math.floor(Math.random() * equationA.length));
        var sliceStart = Math.floor(Math.random() * equationB.length);
        var sliceEnd = Math.floor(Math.random() * (equationB.length - sliceStart) + sliceStart);
        newEquation = newEquation.concat(equationB.slice(sliceStart, sliceEnd));
        newEquation = newEquation.concat(equationB.slice(-(Math.floor(Math.random() * equationA.length))));
        newEquation = newEquation.length > maxLength ? newEquation.slice(maxLength) : newEquation;
        
        var copyErrors = Math.floor(Math.random() * newEquation.length * Parameters.percentMaximumImperfectCopy);
        for (let i = 0; i < copyErrors; i++) {
            newEquation[Math.floor(Math.random() * newEquation.length)] = Math.floor(Math.random() * 20);
        }
        return newEquation;
    }

    id:number;
    petri:PetriDish;
    canvas:Canvas;
    color:number[];
    leafColor:number[];
    leafColorOffset:number;
    leafSize:number;
    leafOffset:Point;
    seedLocation:Point;
    rotation:number;
    branchEquation:number[];
    directionEquation:number[];
    locationEquation:number[];
    evaluator:Equation;
    squaresOwned:number;
    timeOfDeath:number;
    plantTime:number;

    nodes:Node[];
    liveNodes:Node[];


    constructor(id:number, petri:PetriDish, canvas:Canvas, color:number[], leafColor:number[],
        seedLocation:Point, leafSize:number, leafOffset:Point,
        branchEquation:number[], directionEquation:number[], locationEquation:number[],
        evaluator:Equation) {

        this.id = id;
        this.petri = petri;
        this.canvas = canvas;
        this.color = color;
        this.leafColor = leafColor;
        this.leafColorOffset = 0;
        this.leafSize = leafSize;
        this.leafOffset = leafOffset;
        this.seedLocation = seedLocation;
        this.rotation = Point.angle(this.seedLocation, this.petri.getCenter());
        this.branchEquation = branchEquation;
        this.directionEquation = directionEquation; // [7, 14] [1,16] gave NaN
        this.locationEquation = locationEquation;
        this.evaluator = evaluator;
        this.nodes = [];
        this.liveNodes = [];
        this.squaresOwned = 0;
        this.timeOfDeath = -1;
        this.plantTime = 0;

        this.germinate();
    }

    grow(draw:boolean, firstGrowth:boolean = true):boolean {
        this.plantTime++;
        if (this.liveNodes.length === 0) { 
            return false; }

        let chosenNodes = this.liveNodes.slice(Math.max(0, this.liveNodes.length - 5)); // back to empty
        if (this.liveNodes.length < 5) {
            for (let i = 0; i < 5; i++ ) {
                chosenNodes.push(this.liveNodes[Math.floor(Math.random() * this.liveNodes.length)]);
            }
        }
        let maxGrowingDesire = Number.MIN_SAFE_INTEGER;
        let growingNode = this.liveNodes[this.liveNodes.length - 1];
        chosenNodes.forEach((node) => {
            var growingDesire = this.evaluator.evaluate(this.id, this.branchEquation, node, this.plantTime);
            if (growingDesire > maxGrowingDesire) {
                maxGrowingDesire = growingDesire;
                growingNode = node;
            }
        });
        var numAngles = Parameters.numberGrowthAngles;
        var relativeAngle = this.evaluator.evaluate(this.id, this.directionEquation, growingNode, this.plantTime) % (2 * Math.PI);
        var relativeSlice = Math.floor(relativeAngle / Parameters.sliceSize);
        var absoluteSlice = (relativeSlice + growingNode.absoluteSlice) % numAngles;

        
        var newLocation = Point.createFromAngle(growingNode.location, absoluteSlice * Parameters.sliceSize + this.rotation, 1);
        var addedArea:boolean = this.petri.areaClaimable(this.id, newLocation);
        let result = this.petri.tryGrowingNode(this.id, growingNode, newLocation, relativeSlice);
        const grew = result[0];
        var blocked = result[1];
        
        if (grew) {
            if (addedArea) { 
                this.squaresOwned++; 
                //this.canvas.outlineSquare(new Point(Math.floor(newLocation.getX()), Math.floor(newLocation.getY())), 1, this.color);
            }
            var newNode = Node.createChildNode(newLocation, growingNode, relativeSlice, absoluteSlice, 
                this.petri.getCenter(), this.seedLocation);
            this.nodes.push(newNode);
            this.liveNodes.push(newNode);
            if (draw) { 
                this.canvas.drawThickLine(growingNode.location, newNode.location, 0.04, this.colorString());
                if (!Parameters.noRender && this.nodes.length % 10 === 0) { this.drawChildren(this.nodes[0]); }
            }
        } else {
            var badIndex = this.liveNodes.indexOf(growingNode);
            this.killNode(this.liveNodes[badIndex], draw, blocked);
            this.liveNodes.splice(badIndex, 1);
        }

        
        while (this.liveNodes.length > Parameters.maximumLiveNodes) {
            this.killNode(this.liveNodes[0], draw);
            this.liveNodes = this.liveNodes.slice(1, this.liveNodes.length);
        }
        if (this.liveNodes.length === 0) {
            this.timeOfDeath = this.petri.getTime();
        } else if (firstGrowth){
            var probibilitySecondGrowth = this.getLeaves() * 0.01;
            if (Math.random() < probibilitySecondGrowth)
                return this.grow(draw, false);
        }
        return this.liveNodes.length > 0;
    }

    drawChildren(parent:Node) {
        const minWidth = 0.04;
        const maxWidth = 2.3;
        parent.children.forEach((child) => {
            this.drawChildren(child);
            const thickness = Math.min(Math.max(minWidth, Parameters.lineThicknessFactor * child.totalChildren), maxWidth);
            this.canvas.drawThickLine(parent.location, child.location, thickness, this.colorString());
        });
        if (parent.totalChildren > 10) {
            const radius = Math.min(Math.max(minWidth / 2, Parameters.lineThicknessFactor * parent.totalChildren / 2), maxWidth / 2);
            //console.log(radius);
            this.canvas.fillCircle(parent.location, radius, this.colorString());
        }
    }

    killNode(node:Node, draw:boolean, blocked:boolean = false) {
        if (node.totalChildren == 0 && !blocked) {
            node.addLeaf();
            if (draw && !Parameters.noRender)
                this.drawLeaf(node);
        }
    }

    drawLeaf(node:Node) {
        var angle =  Utils.random(-0.0001, 0.0001);
        this.leafColorOffset += 0.25;
        if (node.parent instanceof Node) {
            angle = Utils.normalizeAngle(angle + Point.angle(node.parent.location, node.location));
        }
        this.canvas.drawLeaf(node.location, this.leafSize, angle, this.leafOffset, this.leafColorString());
    }

    colorString() {
        return `hsl(${this.color[0]}, ${this.color[1]}%, ${this.color[2]}%)`;
    }

    leafColorString() {
        return `hsl(${this.leafColor[0]}, ${this.leafColor[1]}%, ${Math.min(this.leafColor[2] + this.leafColorOffset, 90)}%)`;
    }

    germinate() {
        this.petri.addGrowth(this.id, this.seedLocation, false);
        var root = Node.createRootNode(this.seedLocation,this.petri.getCenter());
        this.nodes.push(root);
        this.liveNodes.push(root);
    }

    getDescendantLocation() {
        let maxValue = Number.MIN_SAFE_INTEGER;
        let bestLocation = this.seedLocation;
        this.nodes.forEach((node) => {
            const value = this.evaluator.evaluate(this.id, this.locationEquation, node, this.plantTime);
            if (value > maxValue) {
                maxValue = value;
                bestLocation = node.location;
            }
        });
        if (Point.distance(bestLocation, new Point(Parameters.halfCanvas, Parameters.halfCanvas)) >= Parameters.halfCanvas) {
            return new Point(Utils.random(0, 2 * Parameters.halfCanvas), Utils.random(0, 2 * Parameters.halfCanvas));
         }
         return bestLocation;
    }

    getSize() {
        return this.nodes.length;
    }

    getGrowth() {
        return this.squaresOwned;
    }

    getLeaves() {
        return this.nodes[0].getLeaves();
    }
}