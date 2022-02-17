import Point from './point';

export class Objectives {
    static readonly AREA:number = 0;
    static readonly SURVIVAL:number = 1;
    static readonly NODES:number = 2;
    static readonly OFFENSE:number = 3;

}

export class LocationSelection {
    static readonly FIXED:number = 0;
    static readonly SHUFFLED:number = 1;
    static readonly CHOSEN:number = 2;

}

export class Operations {
    static readonly NUMBER_OF_OPERATIONS:number = 13;

    static readonly SUBTRACT:number = 0;
    static readonly MULTIPLY:number = 1;
    static readonly DIVIDE:number = 2;
    static readonly MOD:number = 3;
    static readonly NEGATE:number = 4;
    static readonly ABS:number = 5;
    static readonly SIN:number = 6;
    static readonly COS:number = 7;
    static readonly TAN:number = 8;
    static readonly MIN:number = 9;
    static readonly MAX:number = 10;
    static readonly IF:number = 11;
    static readonly CONSTANT:number = 12;
}

export class Constants {
    static readonly NUMBER_OF_CONSTANTS:number = 9;

    static readonly CENTER_DIRECTION:number = 13;
    static readonly CENTER_DISTANCE:number = 14;
    static readonly ROOT_DISTANCE:number = 15;
    static readonly ROOT_SEPARATION:number = 16;
    static readonly EMPTY_SURROUNDING:number = 17;
    static readonly ENEMIES_SURROUNDING:number = 18;
    static readonly TIME:number = 19;
    static readonly RANDOM:number = 20;
    static readonly BRANCHES:number = 21;
}

export class Parameters {

    // Visuals:
    static skipGenerations:number = 1;
    static delay:number = 0;
    static drawingDelay:number = 0;
    static noRender:boolean = false;
    static readonly roundDelay:number = 2500;
    static activateRoundDelay:boolean = false;
    static displayEquations:boolean = false;
    static scaleFromPixel:number = 100.0; // 20 or 50 percent of height one square will be
    static numPlants:number = 5;

    static canvasPixelSize:number = 800;
    static readonly lineThicknessFactor:number = 0.004;
    //static canvasSize:number = Parameters.canvasPixelSize / Parameters.scaleFromPixel;
    static halfCanvas:number = Parameters.scaleFromPixel / 2;
    static innerCanvas:number = Parameters.halfCanvas * 3.5 / 5;
    static unitSize = Parameters.canvasPixelSize / Parameters.scaleFromPixel;
    static newScaleFromPixel = Parameters.scaleFromPixel;
    static center = new Point(Parameters.halfCanvas, Parameters.halfCanvas);


    // Evolution:
    static percentMaximumImperfectCopy:number = 0.08;
    static probibilityRandomPlant:number = 0.5;
    static randomParent:boolean = false;
    static percentPlantsReplaced = 0.1;
    //static numSpecies:number = 3;


    //Growth:
    static objectiveFunction:number = 0;
    static locationMethod:number = 0;
    static numberGrowthAngles:number = 32;
    static allowStraightLines:boolean = true;
    static maximumLiveNodes:number = 5;
    static growthOpportunities:number = 1;  // if less than 3 some plants cant grow straight

    static sliceSize = 2 * Math.PI / Parameters.numberGrowthAngles;


    // Equation:
    static defaultRandomEquationLength:number = 2;
    static maxEquationLength:number = 150;
    static variablesAllowed:boolean[] = new Array(Constants.NUMBER_OF_CONSTANTS).fill(true);
    static allowRandomness:boolean = true;
    
    static readonly equationNumberChoices:number = 100;
    
    static updateScaleFromPixel() {
        Parameters.scaleFromPixel = Parameters.newScaleFromPixel; 
        Parameters.halfCanvas = Parameters.scaleFromPixel / 2;
        Parameters.innerCanvas = Parameters.halfCanvas * 3.5 / 5;
        Parameters.unitSize = Parameters.canvasPixelSize / Parameters.scaleFromPixel;

    }

    

    static getValue(name:string) {
        let value = eval(`Parameters.${name}`);
        switch (name) {
            case "skipGenerations":
                return value - 1;
            case "drawingDelay":
                return 100 - value;
            case "scaleFromPixel":
                return 140 - value;
            case "percentMaximumImperfectCopy":
                return Math.floor(value * 100);
            case "probibilityRandomPlant":
                return Math.floor(value * 100);
            case "percentPlantsReplaced":
                return Math.floor(value * 100);
            
        }
        return eval(`Parameters.${name}`);
    }

    static updateCanvas(newPixelSize:number) {
        Parameters.canvasPixelSize = newPixelSize;
        Parameters.unitSize = Parameters.canvasPixelSize / Parameters.scaleFromPixel;
    }

    static getConstantValue(name:string) {
        let index = eval(`Constants.${name}`) - Operations.NUMBER_OF_OPERATIONS;
        return this.variablesAllowed[index];
    }
    



    // Equation parameters
    //static readonly directionScale:number = 16;

    static change(variableName:string, newValue:any) {
        if (typeof(newValue) === 'boolean') {
            const newBoolean:boolean = newValue;
            switch (variableName) {
                case 'activateRoundDelay':
                    Parameters.activateRoundDelay = newBoolean;
                    return;
                case 'displayEquations':
                    Parameters.displayEquations = newBoolean;
                    return;
                case 'noRender':
                    Parameters.noRender = newBoolean;
                    return;
                case 'allowStraightLines':
                    Parameters.allowStraightLines = newBoolean;
                    return;
                case 'randomParent':
                    Parameters.randomParent = newBoolean;
                    return;
                default:
                    throw new Error('No boolean handler for ' + variableName);
            }
        } else if (!isNaN(newValue)) {
            const newNumber = Number.parseInt(newValue);
            const newNumberAsPercent = newNumber / 100.0;
            switch(variableName) {
                case 'skipGenerations':
                    Parameters.skipGenerations = newNumber >= 0 ? newNumber + 1 : 1;
                    return;
                case 'drawingDelay':
                    Parameters.drawingDelay = 100 - newNumber;
                    return;
                case 'scaleFromPixel':
                    Parameters.newScaleFromPixel = 140 - newNumber;
                    return;
                case 'numPlants':
                    Parameters.numPlants = newNumber > 0 ? newNumber : 1;
                    return;
                case 'percentMaximumImperfectCopy':
                    Parameters.percentMaximumImperfectCopy = newNumberAsPercent;
                    return;
                case 'probibilityRandomPlant':
                    Parameters.probibilityRandomPlant = newNumberAsPercent;
                    return;
                case 'percentPlantsReplaced':
                    Parameters.percentPlantsReplaced = newNumberAsPercent;
                    return;
                case 'objectiveFunction':
                    Parameters.objectiveFunction = newNumber;
                    return;
                case 'locationMethod':
                    Parameters.locationMethod = newNumber;
                    return;
                case 'numberGrowthAngles':
                    Parameters.numberGrowthAngles = newNumber > 0 ? newNumber : 1; 
                    Parameters.sliceSize = 2 * Math.PI / Parameters.numberGrowthAngles;
                    return;
                case 'maximumLiveNodes':
                    Parameters.maximumLiveNodes = newNumber > 1 ? newNumber : 1;
                    return;
                case 'growthOpportunities':
                    Parameters.growthOpportunities = newNumber;
                    return;
                case 'defaultRandomEquationLength':
                    Parameters.defaultRandomEquationLength = newNumber;
                    return;
                case 'maxEquationLength':
                    Parameters.maxEquationLength = newNumber;
                    return;
                default:
                    throw new Error('No numeric handler for ' + variableName);
                }
        } else {
            throw new Error('Incorrect input type for ' + variableName);
        }
    }

    static changeVariablesAllowed(name:string, newValue:any) {
        let index = eval(`Constants.${name}`) - Operations.NUMBER_OF_OPERATIONS;
        this.variablesAllowed[index] = newValue;
    }


}

