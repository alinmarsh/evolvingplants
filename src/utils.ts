
export default class Utils {

    static copyArray(array:any[]):any[] {
        var newArray:any[] = [];
        array.forEach((element) => { newArray.push(element); });
        return newArray;
    }
    
    static shuffleArray(array:any[]):any[] {
        var oldArray = Utils.copyArray(array);
        var newArray = [];
        while (oldArray.length > 0) {
            newArray.push(oldArray.splice(Math.floor(Math.random() * oldArray.length), 1)[0]);
        }
        return newArray;
    }

    static random(lowerBound:number, upperBound:number) {
        return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    }

    static mode(list:number[]) {
        const counts: { [entry: number]: number} = {};
        list.forEach((element) => {
            if (counts[element]) { counts[element] += 1; }
            else { counts[element] = 1; }
        });
        let mostRepeated = -1;
        let maxRepeats = 0;
        Object.keys(counts).forEach((stringKey) => {
            const key = Number.parseInt(stringKey);
            maxRepeats = Math.max(counts[key], maxRepeats);
            mostRepeated = counts[key] === maxRepeats ? key : mostRepeated;
        });
        return mostRepeated;
    }

    static decimalRound(num:number) {
        return Math.round(num * 100) / 100.0
    }
}


/*

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

    */
