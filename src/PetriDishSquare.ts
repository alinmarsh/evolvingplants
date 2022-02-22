import { Parameters } from './parameters';

export default class PetriDishSquare {

    private owner:number;
    private claimed:boolean;
    private opportunitiesUsed:number;
    public grownTwice:boolean;

    constructor(owner:number, claimed:boolean) {
        this.owner = owner;
        this.claimed = claimed;
        this.opportunitiesUsed = 0;
        this.grownTwice = false;
    }

    getOwner() { return this.owner; }
    getRecources() { return Parameters.growthOpportunities - this.opportunitiesUsed; }
    isClaimed() { return this.claimed; }

    canClaim(id:number) {
        if (this.claimed) { return false; }
        return this.getRecources() > 0 && (id === this.owner || this.owner === 0);
    }

    grow(id:number, attemptClaim:boolean) {
        this.owner = id;
        if (attemptClaim) { this.claimed = true; }
        this.opportunitiesUsed += 1;
    }

}