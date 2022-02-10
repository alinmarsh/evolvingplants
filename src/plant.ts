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

        var branchEquation:number[] = [];
        var directionEquation:number[] = [];
        var locationEquation:number[] = []
        for (let i = 0; i < equationLength; i++) {
            branchEquation.push(Math.floor(Math.random() * Parameters.equationNumberChoices));
            directionEquation.push(Math.floor(Math.random() * Parameters.equationNumberChoices));
            locationEquation.push(Math.floor(Math.random() * Parameters.equationNumberChoices));
        }
        return new Plant(id, petri, canvas, color, seedLocation, branchEquation, directionEquation, locationEquation, evaluator);
    }

    static createChildPlant(id:number, parent:Plant, petri:PetriDish, canvas:Canvas, newSeedLocation:Point) {
        const newColor = parent.color;
        newColor[2] = Math.max(newColor[2] - 1, 25);
        return new Plant(id, petri, canvas, parent.color, newSeedLocation, parent.branchEquation, 
            parent.directionEquation, parent.locationEquation, new Equation(petri));
    }

    static createMutatedPlant(id:number, parentA:Plant, parentB:Plant, petri:PetriDish, canvas:Canvas, newSeedLocation:Point, 
        maxEquationLength:number = Parameters.maxEquationLength) {

        var color = [Utils.random(0,360), Utils.random(25,85), 85];
        var branchEquationA:number[] = Utils.copyArray(parentA.branchEquation);
        var directionEquationA:number[] = Utils.copyArray(parentA.directionEquation);
        var locationEquationA:number[] = Utils.copyArray(parentA.locationEquation);

        var branchEquationB:number[] = Utils.copyArray(parentB.branchEquation);
        var directionEquationB:number[] = Utils.copyArray(parentB.directionEquation);
        var locationEquationB:number[] = Utils.copyArray(parentB.locationEquation);

        var newBranchEquation = Plant.mergeEquations(branchEquationA, branchEquationB, maxEquationLength);
        var newDirectionEquation =  Plant.mergeEquations(directionEquationA, directionEquationB, maxEquationLength);
        var newLocationEquation = Plant.mergeEquations(locationEquationA, locationEquationB, maxEquationLength);
        

        return new Plant(id, petri, canvas, color, newSeedLocation, newBranchEquation, 
            newDirectionEquation, newLocationEquation, new Equation(petri));
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
    seedLocation:Point;
    rotation:number;
    branchEquation:number[];
    directionEquation:number[];
    locationEquation:number[];
    evaluator:Equation;
    squaresOwned:number;
    timeOfDeath:number;

    nodes:Node[];
    liveNodes:Node[];


    constructor(id:number, petri:PetriDish, canvas:Canvas, color:number[],
        seedLocation:Point, branchEquation:number[], directionEquation:number[], locationEquation:number[],
        evaluator:Equation) {

        this.id = id;
        this.petri = petri;
        this.canvas = canvas;
        this.color = color;
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

        this.germinate();
    }

    grow(draw:boolean) {
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
            var growingDesire = this.evaluator.evaluate(this.id, this.branchEquation, node);
            if (growingDesire > maxGrowingDesire) {
                maxGrowingDesire = growingDesire;
                growingNode = node;
            }
        });
        var numAngles = Parameters.numberGrowthAngles;
        var relativeAngle = this.evaluator.evaluate(this.id, this.directionEquation, growingNode) % (2 * Math.PI);
        var relativeSlice = Math.floor(relativeAngle / Parameters.sliceSize);
        var absoluteSlice = (relativeSlice + growingNode.absoluteSlice) % numAngles;

        
        var newLocation = Point.createFromAngle(growingNode.location, absoluteSlice * Parameters.sliceSize + this.rotation, 1);
        var addedArea:boolean = this.petri.areaClaimable(this.id, newLocation);
        const grew = this.petri.tryGrowingNode(this.id, growingNode, newLocation, relativeSlice);
        
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
                if (this.nodes.length % 10 === 0) { this.drawChildren(this.nodes[0]); }
                else { this.canvas.drawThickLine(growingNode.location, newNode.location, 0.04, this.colorString()); }
            }
        } else {
            var badIndex = this.liveNodes.indexOf(growingNode);
            this.liveNodes.splice(badIndex, 1);
        }

        if (this.liveNodes.length === 0) {
            this.timeOfDeath = this.petri.getTime();
        }
        while (this.liveNodes.length > Parameters.maximumLiveNodes) {
            this.liveNodes = this.liveNodes.slice(1, this.liveNodes.length);
        }
        return this.liveNodes.length > 0;
    }

    drawChildren(parent:Node) {
        const minWidth = 0.04;
        const maxWidth = 2.3;
        parent.children.forEach((child) => {
            this.drawChildren(child);
            const thickness = Math.min(Math.max(minWidth, Parameters.lineThicknessFactor * child.totalChildren), maxWidth);
            //this.canvas.drawThickLine(parent.location, child.location, thickness, '#FFFFFF');
            this.canvas.drawThickLine(parent.location, child.location, thickness, this.colorString());
        });
        if (parent.totalChildren > 10) {
            const radius = Math.min(Math.max(minWidth / 2, Parameters.lineThicknessFactor * parent.totalChildren / 2), maxWidth / 2);
            //console.log(radius);
            this.canvas.fillCircle(parent.location, radius, this.colorString());
        }
    }

    colorString() {
        return `hsl(${this.color[0]}, ${this.color[1]}%, ${this.color[2]}%)`;
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
            const value = this.evaluator.evaluate(this.id, this.locationEquation, node);
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
}