import Node from './node';
import Point from './point';
import PetriDish from './petriDish';
import Utils from './utils';
import { Parameters, Constants, Operations } from './parameters';


export default class Equation {

    
    petri:PetriDish;
    definedNumbers:number;

    memo:{ [constant: number]: number};

    
    constructor(petri:PetriDish) {
        this.petri = petri;
        this.definedNumbers = Operations.NUMBER_OF_OPERATIONS + Constants.NUMBER_OF_CONSTANTS;
        this.memo = {};
    }

    evaluate(id:number, equation:number[], node:Node): number {
        this.memo = {};
        var subList = this.evaluateSubExpressions(id, equation, node);
        var solution = 0;
        subList.forEach((term) => { solution += term; })
        return solution;
    }

    private evaluateSubExpressions(id:number, equation:number[], node:Node): number[] {
        if (equation.length === 0) { return []; }
        const firstCommand = equation[0] % this.definedNumbers;
        if (firstCommand > Operations.NUMBER_OF_OPERATIONS - 1) {
            var constantNum = this.constant(id, firstCommand, node);
            if (isNaN(constantNum)) { throw Error('Invalid (NaN) constant in equation'); }

            return [constantNum].concat(this.evaluateSubExpressions(id, equation.slice(1), node));
        }
        var restOfEquation:number[] = Utils.copyArray(this.evaluateSubExpressions(id, equation.slice(1), node));
        switch (firstCommand) {
                
            case Operations.SUBTRACT:
                if (restOfEquation.length > 1) {
                    restOfEquation.splice(0, 2, restOfEquation[0] - restOfEquation[1]);
                } else if (restOfEquation.length === 1) {
                    restOfEquation[0] = -restOfEquation[0];
                }
                break;

            case Operations.MULTIPLY:
                if (restOfEquation.length > 1) { 
                    restOfEquation.splice(0, 2, restOfEquation[0] * restOfEquation[1]);
                 }
                 break;

            case Operations.DIVIDE:
                if (restOfEquation.length > 1 && restOfEquation[1] !== 0) { 
                    restOfEquation.splice(0, 2, restOfEquation[0] / restOfEquation[1]);
                 }
                 break;

            case Operations.MOD:
                if (restOfEquation.length > 1 && restOfEquation[1] !== 0) { 
                    restOfEquation.splice(0, 2, restOfEquation[0] % restOfEquation[1]);
                    }
                    break;

            case Operations.NEGATE:
                if (restOfEquation.length > 0) { 
                    restOfEquation[0] = -Math.abs(restOfEquation[0]);
                }
                break;

            case Operations.ABS:
                if (restOfEquation.length > 0) { 
                    restOfEquation[0] = Math.abs(restOfEquation[0]);
                }
                break;

            case Operations.SIN:
                if (restOfEquation.length > 0) { 
                    restOfEquation[0] = Math.sin(restOfEquation[0]);
                } 
                break;

            case Operations.COS:
                if (restOfEquation.length > 0) { 
                    restOfEquation[0] = Math.cos(restOfEquation[0]); 
                } 
                break;

            case Operations.TAN:
                if (restOfEquation.length > 0) { 
                    restOfEquation[0] = Math.tan(restOfEquation[0]); 
                } 
                break;

            case Operations.MIN:
                if (restOfEquation.length > 1) { 
                    restOfEquation[1] = Math.min(restOfEquation[0], restOfEquation[1]);
                    restOfEquation.splice(0, 1);
                }
                break;

            case Operations.MAX:
                if (restOfEquation.length > 1) { 
                    restOfEquation[1] = Math.max(restOfEquation[0], restOfEquation[1]);
                    restOfEquation.splice(0, 1);
                }
                break;

            case Operations.IF:
                if (restOfEquation.length > 3) { 
                    restOfEquation[3] = restOfEquation[0] > restOfEquation[1] ? restOfEquation[2] : restOfEquation[3];
                    restOfEquation.splice(0, 3);
                }
                break;

            case Operations.CONSTANT:
                restOfEquation = equation.length > 1 ? [equation[1]].concat(restOfEquation) : [1];
                break;
                
            default:
                throw new Error('Invalid operation');
        }

        if (restOfEquation.length > 0 && isNaN(restOfEquation[0])) { throw Error('Invalid (NaN) operation in equation'); }
        return restOfEquation;

    }

    constant(id:number, input:number, node:Node):(number) {
        let index = input - Operations.NUMBER_OF_OPERATIONS;
        if (!Parameters.variablesAllowed[index]) { return 1; }
        switch(input) {
            case Constants.CENTER_DIRECTION:
                return -node.absoluteSlice * Parameters.sliceSize;

            case Constants.CENTER_DISTANCE:
                return node.distanceToCenter;

            case Constants.ROOT_DISTANCE:
                return  node.distanceFromRoot;

            case Constants.ROOT_SEPARATION:
                return node.nodesFromRoot;

            case Constants.EMPTY_SURROUNDING:
                if (typeof(this.memo[Constants.EMPTY_SURROUNDING]) === 'undefined') {
                    this.memo[Constants.EMPTY_SURROUNDING] = this.petri.getNumberOpen(node.location);
                }
                return this.memo[Constants.EMPTY_SURROUNDING];

            case Constants.ENEMIES_SURROUNDING:
                if (typeof(this.memo[Constants.ENEMIES_SURROUNDING]) === 'undefined') {
                    this.memo[Constants.ENEMIES_SURROUNDING] = this.petri.getNumberNearbyEnemies(id, node.location);
                }
                return this.memo[Constants.ENEMIES_SURROUNDING];

            case Constants.TIME:
                return this.petri.getTime();

            case Constants.RANDOM:
                return Parameters.allowRandomness ? Math.random() * 2 - 1 : 1;

            case Constants.BRANCHES:
                if (typeof(this.memo[Constants.BRANCHES]) === 'undefined') { 
                    this.memo[Constants.BRANCHES] = node.children.length; 
                }
                return this.memo[Constants.BRANCHES];
                
            default:
                throw new Error('Invalid constant');
            
        }
    }


    readableString(equation:number[], equationType:string):string {
        var expressionStrings = this.expressionsToString(equation);
        let numberSum = 0;
        const stringList:string[] = [];
        expressionStrings.forEach((term) => {
            if (typeof(term) === 'number') { numberSum += term; }
            else { stringList.push(term); }
        })

        if (stringList.length === 0) {
            switch (equationType) {
                case 'branch':
                    return 'last_successful_growth';
                case 'direction':
                    if (numberSum === 0) { return 'straight'; }
                    return 'constant_angle';
                case 'location':
                    return 'last_seed_location';
            }
        }
        let result = "";
        stringList.forEach((string, index) => {
            result += index < stringList.length - 1 ? string + " + " : string;
        });
        result += numberSum !== 0 ? " +\r\n" + numberSum.toString() : "";
        return result;
    }

    expressionsToString(equation:number[]):any[] {
        if (equation.length === 0) { return []; }
        const term = equation[0] % this.definedNumbers;
        if (term > Operations.NUMBER_OF_OPERATIONS - 1) {
            var constantString = this.constantToString(term);
            return [constantString].concat(this.expressionsToString(equation.slice(1)));
        }
        var restOfEquation:any[] = Utils.copyArray(this.expressionsToString(equation.slice(1)));
        const firstNum = restOfEquation.length > 0 && typeof(restOfEquation[0]) === 'number';
        const secondNum = restOfEquation.length > 1 && typeof(restOfEquation[1]) === 'number';
        const thirdNum = restOfEquation.length > 2 && typeof(restOfEquation[2]) === 'number';
        switch (term) {
                
            case Operations.SUBTRACT:
                if (restOfEquation.length > 1) {
                    if (firstNum && secondNum) { restOfEquation.splice(0, 2, restOfEquation[0] - restOfEquation[1]);
                    } else { restOfEquation.splice(0, 2, `(${restOfEquation[0]} - ${restOfEquation[1]})`); }
                } else if (restOfEquation.length === 1) {
                    if (firstNum) { restOfEquation[0] = -restOfEquation[0];
                    } else { restOfEquation.splice(0, 2, `-${restOfEquation[0]}`); }
                }
                break;

            case Operations.MULTIPLY:
                if (restOfEquation.length > 1) { 
                    if (firstNum && secondNum) { restOfEquation.splice(0, 2, Utils.decimalRound(restOfEquation[0] * restOfEquation[1]));
                    } else { restOfEquation.splice(0, 2, `(${restOfEquation[0]} * ${restOfEquation[1]})`); }
                }
                break;

            case Operations.DIVIDE:
                if (restOfEquation.length > 1 && restOfEquation[1] !== 0) { 
                    if (firstNum && secondNum) { restOfEquation.splice(0, 2, Utils.decimalRound(restOfEquation[0] / restOfEquation[1]));
                    } else { restOfEquation.splice(0, 2, `(${restOfEquation[0]} / ${restOfEquation[1]})`); }
                }
                break;

            case Operations.MOD:
                if (restOfEquation.length > 1 && restOfEquation[1] !== 0) { 
                    if (firstNum && secondNum) { restOfEquation.splice(0, 2, Utils.decimalRound(restOfEquation[0] % restOfEquation[1]));
                    } else { restOfEquation.splice(0, 2, `(${restOfEquation[0]} % ${restOfEquation[1]})`); }
                }
                break;

            case Operations.NEGATE:
                if (restOfEquation.length > 0) { 
                    if (firstNum) { restOfEquation[0] = -Math.abs(restOfEquation[0]);
                    } else { restOfEquation[0] = `neg(${restOfEquation[0]})`; }
                }
                break;

            case Operations.ABS:
                if (restOfEquation.length > 0) { 
                    if (firstNum) { restOfEquation[0] = Math.abs(restOfEquation[0]);
                    } else { restOfEquation[0] = `abs(${restOfEquation[0]})`; }
                }
                break;

            case Operations.SIN:
                if (restOfEquation.length > 0) { 
                    if (firstNum) { restOfEquation[0] = Utils.decimalRound(Math.sin(restOfEquation[0]));
                    } else { restOfEquation[0] = `sin(${restOfEquation[0]})`; }
                } 
                break;

            case Operations.COS:
                if (restOfEquation.length > 0) { 
                    if (firstNum) { restOfEquation[0] = Utils.decimalRound(Math.cos(restOfEquation[0]));
                    } else { restOfEquation[0] = `cos(${restOfEquation[0]})`; }
                } 
                break;

            case Operations.TAN:
                if (restOfEquation.length > 0) { 
                    if (firstNum) { restOfEquation[0] = Utils.decimalRound(Math.tan(restOfEquation[0]));
                    } else { restOfEquation[0] = `tan(${restOfEquation[0]})`; }
                } 
                break;

            case Operations.MIN:
                if (restOfEquation.length > 1) {
                    if (firstNum && secondNum) {
                        restOfEquation[1] = Math.min(restOfEquation[0], restOfEquation[1]);
                    } else {
                        restOfEquation[1] = `min(${restOfEquation[0]}, ${restOfEquation[1]})`;
                    }
                    restOfEquation.splice(0, 1);
                }
                break;

            case Operations.MAX:
                if (restOfEquation.length > 1) {
                    if (firstNum && secondNum) {
                        restOfEquation[1] = Math.max(restOfEquation[0], restOfEquation[1]);
                    } else {
                        restOfEquation[1] = `max(${restOfEquation[0]}, ${restOfEquation[1]})`;
                    }
                    restOfEquation.splice(0, 1);
                }
                break;
    

            case Operations.IF:
                if (restOfEquation.length > 3) {
                    if (firstNum && secondNum) {
                        restOfEquation[3] = restOfEquation[0] > restOfEquation[1] ? restOfEquation[2] : restOfEquation[3];
                    } else {
                        restOfEquation[3] = `if (${restOfEquation[0]} > ${restOfEquation[1]}) { ${restOfEquation[2]} } else { ${restOfEquation[3]} }`;
                    }
                    restOfEquation.splice(0, 3);
                }
                break;

            case Operations.CONSTANT:
                const constant = equation.length > 1 ? equation[1] : 1;
                restOfEquation.splice(0, 0, constant);
                break;
                
            default:
                console.log(term);
                throw new Error('Invalid operation');
        }

        return restOfEquation;
    }
        

    constantToString(term:number):(number|string) {  
        let index = term - Operations.NUMBER_OF_OPERATIONS;
        if (!Parameters.variablesAllowed[index]) { return 1; }
        switch(term) {
            case Constants.CENTER_DIRECTION:
                return 'direction_to_center';
            case Constants.CENTER_DISTANCE:
                return 'distance_to_center';
            case Constants.ROOT_DISTANCE:
                return  'distance_to_root';
            case Constants.ROOT_SEPARATION:
                return 'separation_from_root';
            case Constants.EMPTY_SURROUNDING:
                return 'empty_surrounding_space';
            case Constants.ENEMIES_SURROUNDING:
                return 'nearby_enimies';
            case Constants.TIME:
                return 'time';
            case Constants.RANDOM:
                return 'random';
            case Constants.BRANCHES:
                return 'branches_at_node';
            default:
                throw new Error('Invalid constant');
            
        }
}

}