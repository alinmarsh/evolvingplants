<template>


    
    <div id="app">
        <div id="sidebar" v-on:click.stop class="sidebar">
            <div class="generationCounter"> 
                <div style="padding: 14px 18px"> Generation: {{generation}}
                <button class="button" v-on:click="resetPlants()">Reset</button>
                <button class="button playButton" v-if="paused" v-on:click="paused = false">&#9654;</button>
                <button class="button pauseButton" v-if="!paused" v-on:click="paused = true">&#10074;&#10074;</button>

                </div>
                
            </div>
            <div id="DisplayMenu">
                <button id="displayLabel" type="button" v-on:click="handleMenuClick('displayContent')" class="collapsible">Display</button>
                <div id="displayContent" class="content">
                    
                    <div class="input">
                        <span>Skip Generations:</span>
                        <input type="text" id="skipGenerationsInput"
                        v-on:keyup="handleInput('skipGenerations'); resize();" style="max-width: 40px;width:fit-content;">
                    </div>
                    <div class="input">
                        <span>Show generation results</span>
                        <input type="checkbox" id="activateRoundDelayInput" 
                            v-on:click="handleInput('activateRoundDelay')">
                    </div>
                    <div class="input">
                        <span>Show equations</span>
                        <input type="checkbox" id="displayEquationsInput" 
                            v-on:click="handleInput('displayEquations'); toggle('equationDisplay');">
                    </div>
                    <div class="input">
                        <span>Drawing Speed</span>
                        <input type="range" id="drawingDelayInput" min="0" max="100"
                                v-on:change="handleInput('drawingDelay')">
                    </div>
                    <div class="input">
                        <span>Number of plants:</span>
                        <input type="text" id="numPlantsInput"
                                v-on:keyup="handleInput('numPlants')"
                        style="max-width: 40px;width:fit-content;">
                    </div> 

                    
                </div>

            </div>
            <div id="EvolutionMenu">
                <button id="evolutionLabel" type="button" v-on:click="handleMenuClick('evolutionContent')" class="collapsible">Evolution</button>
                <div id="evolutionContent" class="content">
                    <div class="input">
                        <span>Child mutations</span>
                        <input type="range" id="percentMaximumImperfectCopyInput" min="0" max="100"
                                v-on:change="handleInput('percentMaximumImperfectCopy')">
                    </div>
                    
                    <div class="input">
                        <span>Random plants</span>
                        <input type="range" id="probibilityRandomPlantInput" min="0" max="100"
                                v-on:change="handleInput('probibilityRandomPlant')">
                    </div>
                    <div class="input">
                        <span>Parent selection:</span>
                        <form>
                            <input type="radio" id="best" name="parent" value="" checked="checked"
                                v-on:change="radioChange('randomParent', false) ">
                            <label for="best">Best parent</label><br>
                            <input type="radio" id="randomParentInput" name="parent" 
                                v-on:change="radioChange('randomParent', true)">
                            <label for="randomParentInput">Random parent</label><br>
                        </form> 
                    </div>
                    <div class="input">
                        <span>Plants replaced</span>
                        <input type="range" id="percentPlantsReplacedInput" min="0" max="100"
                                v-on:change="handleInput('percentPlantsReplaced')">
                    </div>
                    
                </div>
            </div>

            <div id="GrowthMenu">
                <button id="growthLabel" type="button" v-on:click="handleMenuClick('growthContent')" class="collapsible">Growth</button>
                <div id="growthContent" class="content">
                    <div class="input">
                        <span>Plant size</span>
                        <input type="range" id="scaleFromPixelInput" min="0" max="100"
                                v-on:change="handleInput('scaleFromPixel')">
                    </div>
                    <div class="input">
                        <span>Objective function:</span>
                        <!--<button class="button infoButton" id="objectiveFunctionInfo" >&#8505;</button>-->
                        <form>
                            <input type="radio" name="objective" v-on:change="radioChange('objectiveFunction', '0')" value="" checked="checked">
                            <label >Maximum area covered</label><br>

                            <input type="radio" name="objective" v-on:change="radioChange('objectiveFunction', '2')">
                            <label for="randomParentInput">Most branches</label><br>

                            <input type="radio" name="objective" v-on:change="radioChange('objectiveFunction', '1')">
                            <label for="randomParentInput">Longest survival</label><br>

                            <input type="radio" name="objective" v-on:change="radioChange('objectiveFunction', '3')">
                            <label for="randomParentInput">Most offensive</label><br>
                        </form> 
                    </div>
                    <div class="input">
                        <span>Location:</span>
                        <form>
                            <input type="radio" name="objective" v-on:change="radioChange('locationMethod', '0'); toggleLocationEquation(false);" 
                                value="" checked="checked">
                            <label >Fixed seed location</label><br>

                            <input type="radio" name="objective"  v-on:change="radioChange('locationMethod', '1'); toggleLocationEquation(false);">
                            <label for="randomParentInput">Randomly shuffled locations</label><br>

                            <input type="radio" name="objective" v-on:change="radioChange('locationMethod', '2'); toggleLocationEquation(true);">
                            <label for="randomParentInput">Plant chosen locations</label><br>
                        </form> 
                    </div>
                    <div class="input">
                        <span>Number allowed angles:</span>
                        <input type="text" id="numberGrowthAnglesInput"
                        v-on:keyup="handleInput('numberGrowthAngles')" style="max-width: 40px;width:fit-content;">
                    </div>
                    <div class="input">
                        <span>Straight lines</span>
                        <input type="checkbox" id="allowStraightLinesInput" 
                            v-on:click="handleInput('allowStraightLines')">
                    </div>
                    <div class="input">
                        <span>Live branches:</span>
                        <input type="text" id="maximumLiveNodesInput"
                        v-on:keyup="handleInput('maximumLiveNodes')" style="max-width: 40px;width:fit-content;">
                    </div>
                    <div class="input">
                        <span>Times it can cross itself</span>
                        <input type="range" id="growthOpportunitiesInput" min="1" max="5"
                                v-on:change="handleInput('growthOpportunities')">
                    </div>
                </div>
            </div>

            <div id="EquationMenu">
                <button id="equationLabel" type="button" v-on:click="handleMenuClick('equationContent')" class="collapsible">Learning</button>
                <div id="equationContent" class="content">
                    <div class="input" style="margin-bottom: -13px;">
                        <span>Equation length</span>
                        <span class="price-slider">
                            <input value="0" min="0" max="500" type="range" id="defaultRandomEquationLengthInput" 
                                v-on:change="handleInput('defaultRandomEquationLength')">
                            <input value="100" min="0" max="500" type="range" id="maxEquationLengthInput" 
                                v-on:change="handleInput('maxEquationLength')">
                        </span>
                    </div>
                    <div class="input">
                        <span class="checkboxList">Information plants know:</span>
                        <div style="padding-left:10px">
                        <span>Direction to center</span>
                        <input type="checkbox" id="CENTER_DIRECTIONInput" v-on:click="handleConstantsInput('CENTER_DIRECTION')">
                        <br>
                        <span>Distance to center</span>
                        <input type="checkbox" id="CENTER_DISTANCEInput" v-on:click="handleConstantsInput('CENTER_DISTANCE')">
                        <br>
                        <span>Distance to root</span>
                        <input type="checkbox" id="ROOT_DISTANCEInput" v-on:click="handleConstantsInput('ROOT_DISTANCE')">
                        <br>
                        <span>Branches from root</span>
                        <input type="checkbox" id="ROOT_SEPARATIONInput" v-on:click="handleConstantsInput('ROOT_SEPARATION')">
                        <br>
                        <span>Nearby empty space</span>
                        <input type="checkbox" id="EMPTY_SURROUNDINGInput" v-on:click="handleConstantsInput('EMPTY_SURROUNDING')">
                        <br>
                        <span>Number of close other plants</span>
                        <input type="checkbox" id="ENEMIES_SURROUNDINGInput" v-on:click="handleConstantsInput('ENEMIES_SURROUNDING')">
                        <br>
                        <span>Time since sprouted</span>
                        <input type="checkbox" id="TIMEInput" v-on:click="handleConstantsInput('TIME')">
                        <br>
                        <span>Number of branches</span>
                        <input type="checkbox" id="BRANCHESInput" v-on:click="handleConstantsInput('BRANCHES')">
                        <br>
                        <span>Randomness</span>
                        <input type="checkbox" id="RANDOMInput" v-on:click="handleConstantsInput('RANDOM')">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="main" class="main" v-on:click="handleMainClick()">
            <canvas id="petriDish" class="canvas" ></canvas>
        </div>
        <div id="equationDisplay" class="equation">
            <div id="equationTitle" class="generationCounter"> 
                <div style="padding: 14px 18px">  {{equationTitleText}}
                </div>
                
            </div>
           <div class="equationCategory">
               Growth Equation
           </div>
           <div class="equationString">
               {{equationStrings[0]}}
           </div>
           <div class="equationCategory">
               Direction Equation
           </div>
           <div class="equationString">
               {{equationStrings[1]}}
           </div>
           <div id="locationEquationDisplay" hidden>
                <div class="equationCategory" >
                    Location Equation
                </div>
                <div class="equationString" >
                    {{equationStrings[2]}}
                </div>
            </div>
            
                
        </div>

    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Home from './components/Home.vue';
    import PetriDish from './petriDish';
    import Point from './point';
    import Plant from './plant';
    import Canvas from './canvas';
    import Equation from './equation';
    import Node from './node';
    import Utils from './utils';
    import { Parameters, Objectives, LocationSelection } from './parameters';



    @Component({
        components: {
            Home
        }
    })


    export default class App extends Vue {


        private generation = 0;
        private sidebarVisible = false;
        private reset = false
        private petri:PetriDish;
        private lastDrawnPetri: PetriDish;
        private excecutingInterval = false;
        private equationStrings = ['','',''];
        private lastDrawnPlants:Plant[] = [];
        private equationTitleText = "Winning equations";
        private paused = false;


        private mounted() {
            window.addEventListener('resize', this.resize);
            let canvas = this.resize();
            //this.setInputVariableValues();

            
            let startTime = Date.now();
            this.petri = new PetriDish(2 * Parameters.halfCanvas, canvas);

            var seedLocations = this.getSeedLocations();

            let plants = this.makeInitialPlants(canvas, this.petri, seedLocations);
            let stillGrowing = true;
            let x = 0;
            let lastDrawnTime = 0;
            const outerInterval = setInterval(() => {
                x++;
                const roundDelay = Parameters.activateRoundDelay ? Parameters.roundDelay : 0;
                const wait = this.generation % Parameters.skipGenerations === 0 && Date.now() - lastDrawnTime < roundDelay
                if (!this.excecutingInterval && !wait && stillGrowing && !this.paused && !this.reset) {
                    this.excecutingInterval = true;
                    if (this.generation % Parameters.skipGenerations === 0) {
                        canvas.clear();
                        canvas.fillCircle(new Point (Parameters.halfCanvas, Parameters.halfCanvas), Parameters.halfCanvas, "#FFFFFF");
                        canvas.drawCircle(new Point (Parameters.halfCanvas, Parameters.halfCanvas), Parameters.halfCanvas, "#000000");
                        const titleDiv = document.getElementById('equationTitle');
                        if (titleDiv instanceof HTMLElement) { 
                            titleDiv.style.backgroundColor = 'rgb(68, 67, 67)'; 
                            this.equationTitleText = 'Winning equations';
                        }
                        this.lastDrawnPlants = plants;
                    }
                    let draw = this.generation % Parameters.skipGenerations === 0;
                    let delay = draw ? Parameters.drawingDelay : 0;
                    this.lastDrawnPetri = draw ? this.petri : this.lastDrawnPetri;
                    const interval = setInterval(() => {
                        if (!this.paused && !(draw && Date.now() - lastDrawnTime < roundDelay)) {
                            stillGrowing = this.growPlants(plants,  draw);
                            if (!stillGrowing || this.reset) { 
                                this.excecutingInterval = false;
                                if (draw) { lastDrawnTime = Date.now(); }
                                clearInterval(interval); 
                            }
                        }
                    }, delay);
                }
                if (!this.excecutingInterval && (!stillGrowing || this.reset) && !this.paused) {
                    
                    Parameters.updateScaleFromPixel();
                    canvas = new Canvas(canvas.getCtx());
                    this.petri = new PetriDish(2 * Parameters.halfCanvas, canvas);
                    if (this.reset) {
                        this.generation = 0;
                        plants = this.makeInitialPlants(canvas, this.petri, this.getSeedLocations());
                        this.reset = false;
                    } else {
                        plants = this.makeEvolvedPlants(plants, this.petri, canvas, this.generation % Parameters.skipGenerations === 0);
                        this.generation++;
                    }
                    stillGrowing = true;
                }
                
            });

        }

        resize() {
            var canvasElement = document.getElementById("petriDish");
            var parent = canvasElement ? canvasElement.parentElement : null;
            if (canvasElement instanceof HTMLCanvasElement && parent instanceof HTMLElement) {
                var w = Math.min(parent.clientWidth, window.innerHeight);
                canvasElement.width = w;
                canvasElement.height = w;
                var ctx = <CanvasRenderingContext2D> canvasElement.getContext('2d');
                Parameters.updateCanvas(w);
                let canvas = new Canvas(ctx);
                canvas.fillCircle(new Point (Parameters.halfCanvas, Parameters.halfCanvas), Parameters.halfCanvas, "#FFFFFF");
                canvas.drawCircle(new Point (Parameters.halfCanvas, Parameters.halfCanvas), Parameters.halfCanvas, "#000000");
                this.lastDrawnPlants.forEach((plant) => {
                    plant.drawChildren(plant.nodes[0]);
                });
                
                return canvas;
            }
            throw new Error('Unable to resize canvas: element not found');
        }

        resetPlants() {
            this.reset = true;
        }

        setInputVariableValues() {
            const inputVariableNames = ["allowStraightLines", "skipGenerations", "activateRoundDelay", 
                                        "displayEquations", "drawingDelay", "scaleFromPixel", "numPlants",
                                        "percentMaximumImperfectCopy", "probibilityRandomPlant",
                                        "percentPlantsReplaced", "numberGrowthAngles",
                                        "maximumLiveNodes", "growthOpportunities", 
                                        "defaultRandomEquationLength", "maxEquationLength"];
            inputVariableNames.forEach((name) => {
                const element = document.getElementById(name + "Input");
                if (element instanceof HTMLInputElement) {
                    element.checked = Parameters.getValue(name);
                    element.value = Parameters.getValue(name);
                }
            })
        }


        setInputConstantValues() {
            const inputConstantNames = ["CENTER_DIRECTION", "CENTER_DISTANCE", 
                                        "ROOT_DISTANCE", "ROOT_SEPARATION", 
                                        "EMPTY_SURROUNDING", "ENEMIES_SURROUNDING", 
                                        "TIME", "BRANCHES", "RANDOM"];
            inputConstantNames.forEach((name) => {
                const element = document.getElementById(name + "Input");
                if (element instanceof HTMLInputElement) {
                    element.checked = Parameters.getConstantValue(name);
                }
            })
        }

        radioChange(variableName:string, newValue:boolean) { Parameters.change(variableName, newValue); }

        handleInput(variableName:string) { 
            const inputId = variableName + "Input";
            const inputElement = document.getElementById(inputId);
            if (inputElement instanceof HTMLInputElement) {
                let newValue = inputElement.type !== 'checkbox' ? inputElement.value : inputElement.checked;
                Parameters.change(variableName, newValue); 
            } else {
                throw new Error(inputId + " element not found");
            }
        }

        handleConstantsInput(constantName:string) { 
            const inputId = constantName + "Input";
            const inputElement = document.getElementById(inputId);
            if (inputElement instanceof HTMLInputElement) {
                let newValue = inputElement.checked;
                Parameters.changeVariablesAllowed(constantName, newValue); 
            } else {
                throw new Error(inputId + " element not found");
            }
        }

        toggleLocationEquation(show:boolean) {
            const locationDisplay = document.getElementById("locationEquationDisplay");
            if (locationDisplay instanceof HTMLElement) { locationDisplay.hidden = !show; }
        }

        handleMainClick() {
            if (Parameters.displayEquations) {
                var petriDishElement = document.getElementById('petriDish');
                if (petriDishElement instanceof HTMLElement && event instanceof MouseEvent && this.lastDrawnPetri) {
                    const petriX = petriDishElement.getBoundingClientRect().x;
                    const petriY = petriDishElement.getBoundingClientRect().y;
                    const ownerID = this.lastDrawnPetri.ownerFromPixel(event.screenX - petriX, event.screenY - petriY);
                    //console.log(ownerID);
                    if (ownerID === -1) { 
                        this.toggle('sidebar');
                    } else if (ownerID > 0) {
                        const titleDiv = document.getElementById('equationTitle');
                        if (titleDiv instanceof HTMLElement) {
                            //console.log(this.lastDrawnPlants[ownerID - 1]);
                            titleDiv.style.backgroundColor = this.lastDrawnPlants[ownerID - 1].colorString();
                            this.equationTitleText = 'Equations ' + this.lastDrawnPlants[ownerID - 1].id.toString();
                        }
                        this.updateDisplayedEquations(this.lastDrawnPlants[ownerID - 1]);
                    }

                }
                //console.log(event);
                
                //console.log(petriDishElement instanceof HTMLElement ? petriDishElement.getBoundingClientRect() : 'ohno');
            } else {
                this.toggle('sidebar');
            }
        }

        toggle(id:string) {
            var element = document.getElementById(id);
            var sidebar = document.getElementById('sidebar');
            var equations = document.getElementById('equationDisplay');
            var main = document.getElementById('main');
            if (element instanceof HTMLElement && main instanceof HTMLElement &&
                equations instanceof HTMLElement && sidebar instanceof HTMLElement) {
                const sidebarWasOpen = !(!sidebar.style.maxWidth || Number.parseInt(sidebar.style.maxWidth[0]) === 0);
                const sidebarOpen = id === 'sidebar' ? !sidebarWasOpen : sidebarWasOpen;
                const equationsOpen = Parameters.displayEquations;
                const sidebarWidth:number = sidebarOpen ? 20 : 0;
                const equationsWidth:number = equationsOpen ? 20 : 0;
                const mainWidth = 100 - sidebarWidth - equationsWidth;
                main.style.width = `${mainWidth}%`;
                sidebar.style.maxWidth = `${sidebarWidth}%`;
                equations.style.maxWidth = `${equationsWidth}%`;
                main.style.marginLeft = sidebar.style.maxWidth;
                this.resize();
            } else {
                throw new Error('Sidebar not found');
            }
        }

        handleMenuClick(contentId:string) {
            var content = document.getElementById(contentId);
            if (content instanceof HTMLElement) {
                if (!content.style.maxHeight || Number.parseInt(content.style.maxHeight[0]) === 0) {
                    this.closeMenu();
                    this.setInputVariableValues();
                    this.setInputConstantValues();
                    content.style.maxHeight = (content.scrollHeight + 50) + "px";
                } else {
                    content.style.maxHeight = "0px";
                }
            } else {
                throw new Error('Content not found');
            }
        }

        closeMenu() {
            var listOfContent = document.getElementsByClassName("content");
            for (let i = 0; i < listOfContent.length; i++) {
                let content = listOfContent[i];
                if (content instanceof HTMLElement) { content.style.maxHeight = "0px"; }
            }
        }

        private makeInitialPlants(canvas:Canvas, petri:PetriDish, seedLocations:Point[]) {
            var plants:Plant[] = [];
            var evaluator = new Equation(petri);
            for (let i = 0; i < Parameters.numPlants; i++) {
                plants.push(Plant.createRandomPlant(i + 1, petri, canvas, seedLocations[i], evaluator, 
                    Parameters.defaultRandomEquationLength))
            }
            return plants;
        }

        private updateDisplayedEquations(displayPlant:Plant) {
            const evaluator = displayPlant.evaluator;
            this.equationStrings = [evaluator.readableString(displayPlant.branchEquation, 'branch'),
                                    evaluator.readableString(displayPlant.directionEquation, 'direction'),
                                    evaluator.readableString(displayPlant.locationEquation, 'location')];
            const equationElement = document.getElementById('equationDisplay');
            if (equationElement instanceof HTMLElement) {
                equationElement.hidden = true;
                equationElement.hidden = false;
            }
        }

        private makeEvolvedPlants(plants:Plant[], newPetri:PetriDish, canvas:Canvas, draw:boolean = false) {
            var seedLocations = this.getSeedLocations();
            var shuffledSeedLocations = Utils.shuffleArray(seedLocations);
            var newPlants:Plant[] = [];

            var plantRankings:Plant[] = this.getPlantRankings(plants);

           
            var maxPlant = plantRankings[plantRankings.length - 1];
            let randomPlant = maxPlant;
            
            if (Parameters.displayEquations && this.generation % Parameters.skipGenerations === 0) {
                this.updateDisplayedEquations(maxPlant)
            };

            
            
            if (plantRankings.length > 1) {
                randomPlant = Parameters.randomParent ? 
                plantRankings[Utils.random(Math.floor(Parameters.percentPlantsReplaced * Parameters.numPlants), plantRankings.length - 2)] :
                plantRankings[plantRankings.length - 2];
            }


            let locationMethod = Parameters.locationMethod;

            if (locationMethod === LocationSelection.FIXED) {
                if (Parameters.numPlants !== plants.length) { 
                    console.log('changed number');
                    locationMethod = LocationSelection.SHUFFLED;
                }
                else {
                    for (let i = 0; i < plants.length; i++) {
                        const plant = plants[i];
                        let inSeedLocations = false;
                        seedLocations.forEach((location) => {
                            if (location.equals(plant.seedLocation)) { inSeedLocations = true; }
                        });
                        if (!inSeedLocations) { 
                            console.log('changed location');
                            locationMethod = LocationSelection.SHUFFLED; 
                            break;
                        }    
                    }
                }
                
            }
            
            

            //if (draw) { maxPlant.canvas.outlineSquare(new Point(0,0), 2, maxPlant.color) };
            plantRankings.forEach((plant, index) => {
                if (newPlants.length === Parameters.numPlants) { return newPlants; }

                let newLocation = new Point(0,0);
                switch (locationMethod) {
                    case LocationSelection.FIXED:
                        newLocation = plant.seedLocation;
                        break;
                    case LocationSelection.SHUFFLED:
                        newLocation = shuffledSeedLocations[index];
                        break;
                    case LocationSelection.CHOSEN:
                        newLocation = plant.getDescendantLocation();
                        break;
                    default:
                        throw new Error('Bad seed location');
                }
                
                if (index < Parameters.percentPlantsReplaced * Parameters.numPlants) {
                    if (draw && Parameters.activateRoundDelay) { 
                        canvas.fillCircle(plant.seedLocation, 2, 'red', 0.2); 
                        canvas.drawCircle(plant.seedLocation, 2, 'red'); 
                    }
                    if (Math.random() > Parameters.probibilityRandomPlant) {
                        newPlants.push(Plant.createMutatedPlant(index + 1, maxPlant, randomPlant, newPetri, canvas, newLocation));
                    } else {
                        newPlants.push(Plant.createRandomPlant(index + 1, newPetri, canvas, newLocation, 
                            new Equation(newPetri), plants[0].directionEquation.length));
                    }
                } else {
                     newPlants.push(Plant.createChildPlant(index + 1, plant, newPetri, canvas, newLocation));
                     if (draw && index === plantRankings.length - 1 && Parameters.activateRoundDelay) { 
                         canvas.fillCircle(plant.seedLocation, 2, 'green', 0.2); 
                         canvas.drawCircle(plant.seedLocation, 2, 'green'); 
                    }
                }
            });

            while (newPlants.length < Parameters.numPlants) {
                let newLocation = shuffledSeedLocations[newPlants.length];
                newPlants.push(Plant.createRandomPlant(newPlants.length + 1, newPetri, canvas, newLocation, 
                            new Equation(newPetri), plants[0].directionEquation.length));
            }
            return newPlants;

        }


        private getPlantRankings(plants:Plant[]) {
            const plantsCopy = Utils.copyArray(plants);
            const rankedPlants:Plant[] = [];

            while (plantsCopy.length > 0) {
                var minIndex = 0;
                var minScore = Number.MAX_SAFE_INTEGER;
                plantsCopy.forEach((plant, index) => {
                    let score:number;
                    switch(Parameters.objectiveFunction) {
                        case Objectives.AREA:
                            score = plant.getGrowth();
                            break;
                        case Objectives.SURVIVAL:
                            score = plant.timeOfDeath;
                            break;
                        case Objectives.NODES:
                            score = plant.nodes.length;
                            break;
                        case Objectives.OFFENSE:
                            score = plant.petri.getBlockingCount(plant.id) + (plant.getGrowth() / (this.generation * this.generation));
                            break;
                        default:
                            throw new Error('Invalid objective');
                    }
                    if (score  < minScore) {
                        minScore = score;
                        minIndex = index;
                    }
                });
                rankedPlants.push(plantsCopy[minIndex]);
                plantsCopy.splice(minIndex, 1);
            }
            return rankedPlants;
        }

        private growPlants(plants:Plant[], draw:boolean):boolean {
            let stillGrowing = false;
            plants.forEach((plant, index) => {
                if (plant.grow(draw)) { 
                    stillGrowing = true; 
                }
            });
            return stillGrowing;
        }

       
        private getSeedLocations() {
            if (Parameters.numPlants === 1) { return [new Point(Parameters.halfCanvas, Parameters.halfCanvas)]; }
            var locationAngle = 2 * Math.PI / Parameters.numPlants;
            var centerPoint = new Point(Parameters.halfCanvas, Parameters.halfCanvas);
            var seedLocations:Point[] = [];
            for (let i = 0; i < Parameters.numPlants; i++) {
                seedLocations.push(Point.createFromAngle(centerPoint, i * locationAngle , Parameters.innerCanvas))
            }
            return seedLocations;
        }

        
        updatePriceLabels() {
            //avoids slider overlap
            var sliders = document.querySelectorAll(".price-slider input");
            var lowSlider = sliders[0];
            var highSlider = sliders[1];
            if (lowSlider instanceof HTMLInputElement && highSlider instanceof HTMLInputElement) {
                var val1 = parseInt(lowSlider.value);
                var val2 = parseInt(highSlider.value);
                if (val1 >= val2) {
                    lowSlider.value = (val2 - 3).toString();
                    return;
                }
                if (val2 <= val1) {
                    highSlider.value = (val1 + 3).toString();
                    return;
                }
            }
            
            
        }
    }
</script>

<style>
    .canvas {
        margin: auto;
        display: block;
    }

    .equation {
        /*right: 0px;
        width: 30%;
        position: fixed;*/
        right:0px;
        background-color: #eee;
        position:absolute;
        height:100%;
        max-width: 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .equationCategory {
        background-color: #eee;
        color: #444;
        cursor: pointer;
        padding: 18px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
    }

    .equationString {
        padding: 0 18px;
        background-color: white;
        transition: height 0.4s ease-out;
    }

    .sidebar {
        float:left;  
        background-color: white;
        position:absolute;
        height:100%;
        max-width: 0;
        overflow: hidden;
        /*transition: max-width 0.4s ease-out;*/
    }
    .main {
        margin-left: 0px;
        width:100%;
        display:relative;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);  
        overflow-x: hidden;   
    }
    html, body {
        margin:0px;
        padding:0;
        height: 100%;
        overflow-y: hidden;
        background-color: #bebebe;
    }
    .collapsible {
        background-color: #eee;
        color: #444;
        cursor: pointer;
        padding: 18px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
    }
    .active, .collapsible:hover {
        background-color: #ccc;
    }
    .content {
        padding: 0 18px;
        background-color: white;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease-out;
    }
    .input {
        margin-top:16px;
        padding: 0 0 16px;
    }
    .checkboxList {
        margin-top:5px;
        margin-bottom:5px;
    }
    .generationCounter {
        height:50px;
        background-color: rgb(68, 67, 67);
        font-size: 20px;
        color: white;
    }

    #equationDisplay {
        width: 30%;
    }


    
.price-slider {
    position: relative;
    margin: 0 auto 20px;
    height: 35px;
    text-align: center;
}

.price-slider input {
    pointer-events: none;
    position: absolute;
    left: 8px;
    top: 0px;
    width: 150px;
    outline: none;
    height: 18px;
    margin: 0;
    padding: 0;
    border-radius: 8px;
}

.price-slider input::-webkit-slider-thumb {
    pointer-events: all;
    position: relative;
    z-index: 1;
    outline: 0;
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 12px;
    background-color: white;
    border: 2px solid black;
}

.button {
  background-color: #797979; 
  border: none;
  color: white;
  padding: 5px 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.active, .button:hover {
        background-color: rgb(148, 8, 8);
    }

.playButton {
    position: absolute;
    right: 10px;
    margin-top: -2%;
    border-radius: 50%;
    width:33px;
    height:33px;
}

.infoButton {
    background-color: white; 
    color: black;
    border-color: black;
    position: absolute;
    right: 10px;
    margin-top: -2%;
    border-radius: 50%;
    width:15px;
    height:15px;
}

.active, .playButton:hover {
        background-color: rgb(87, 180, 69);
    }

.pauseButton {
    position: absolute;
    right: 10px;
    margin-top: -2%;
    border-radius: 50%;
    width:33px;
    height:33px;
}

.active, .pauseButton:hover {
        background-color: rgb(98, 108, 163);
    }





</style>
