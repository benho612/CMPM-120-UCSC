//helper
function replacePlayerName(engine, text) {
    if (engine.playerName) {
        return text.replace("[PLAYER_NAME]", engine.playerName);
    }
    return text;
}

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);

        // Make a div to hold input + button
        this.container = document.createElement("div");
        document.body.appendChild(this.container);

        // Input
        this.input = document.createElement("input");
        this.input.placeholder = "Enter your name";
        this.container.appendChild(this.input);

        // Button
        this.button = document.createElement("button");
        this.button.innerText = "Start Adventure";
        this.container.appendChild(this.button);

        // When button clicked:
        this.button.onclick = () => {
            this.engine.playerName = this.input.value || "Adventurer";

            this.engine.show(`Welcome, ${this.engine.playerName}, Your journey begins now... `);

            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);

            // Then REMOVE the whole container cleanly AFTER moving scenes
            document.body.removeChild(this.container);
        };
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        let text = locationData.Body;

        // Replace [PLAYER_NAME] with actual player name
        if (this.engine.playerName) {
            text = text.replace("[PLAYER_NAME]", this.engine.playerName);
        }

        setTimeout(()=>{this.engine.show(text)}, 1000);

        setTimeout(() => {
        if (locationData.Choices && locationData.Choices.length > 0) 
        {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
        else 
            this.engine.addChoice("The end.");
        
        }, 2000);
    }


    handleChoice(choice) {
        if (choice) {
            this.engine.show("> " + choice.Text);
            let targetLocation = this.engine.storyData.Locations[choice.Target];
            if (targetLocation) {
                // Check Mechanism
                switch (targetLocation.Mechanism) {
                    case "Runestone":
                        this.engine.gotoScene(Runestone, choice.Target);
                        break;
                    case "AbandonedShrine":
                        this.engine.gotoScene(AbandonedShrine, choice.Target);
                        break;
                    case "WyrmBurrow":
                        this.engine.gotoScene(WyrmBurrow, choice.Target);
                        break;
                    case "GlowingSwamp":
                        this.engine.gotoScene(GlowingSwamp, choice.Target);
                        break;
                    case "MoonstoneGate":
                        this.engine.gotoScene(MoonstoneGate, choice.Target);
                        break;
                    case "Village":
                        this.engine.gotoScene(Village, choice.Target);
                        break;
                    case "HeartTreeGrove":
                        this.engine.gotoScene(HeartTreeGrove, choice.Target);
                        break;
                    default:
                        this.engine.gotoScene(Location, choice.Target);
                }
            } else {
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }

}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

// Special Mechanisms!

class Runestone extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        if(!this.engine.InteractedWithStone)
        {
            this.engine.show(replacePlayerName(this.engine, locationData.Body));
            this.engine.addChoice("Interact with the runestone circle", { special: true });
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (choice && choice.special) {
            this.engine.show("> You touch the runestone. Tons of idea flows into your brain.");
            this.engine.show("You are ready to learn magic with the help of a Shrine!")

            this.engine.InteractedWithStone = true;
            this.create('Runestone Circle');
        } else {
            super.handleChoice(choice);
        }
    }
}

class AbandonedShrine extends Location{
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(replacePlayerName(this.engine, locationData.Body));

        if(this.engine.InteractedWithStone && !this.engine.LearnedMagic)
            this.engine.addChoice("Touch the glowing runestone", { special: true });

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (choice && choice.special) {
            this.engine.show("> You touch the runestone. A warm energy flows through you.\n You have learned MAGIC");
            this.engine.LearnedMagic = true;
            this.create('Abandoned Shrine');
        } else {
            super.handleChoice(choice);
        }
    }
}

class MoonstoneGate extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        // Show the main description
        this.engine.show(replacePlayerName(this.engine, locationData.Body));

        // Special action: if you have the shiny leaf (key), offer to open the gate
        if (this.engine.leaf) {
            this.engine.addChoice("Use the Shiny Leaf to open the Moonstone Gate", { openGate: true });
        }

        // Normal travel choices
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (choice && choice.openGate) {
            // If player uses the shiny leaf
            this.engine.show("> The Shiny Leaf transforms into a radiant key, unlocking the Moonstone Gate...");
            this.engine.gotoScene(Village, "Village");
        } else {
            super.handleChoice(choice);
        }
    }
}

class GlowingSwamp extends Location{
    create(key){
        let locationData = this.engine.storyData.Locations[key];
        //TODO
        this.engine.show(replacePlayerName(this.engine, locationData.Body));


        if(this.engine.teammateFound && !this.engine.leaf)
                this.engine.addChoice("Seek help from teamates", {special1:true});
            
        if(this.engine.LearnedMagic && !this.engine.leaf)
                this.engine.addChoice("Use the power of MAGIC", {special2:true});   
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice){
        if(choice && choice.special1)
        {
            this.engine.show("With your teammates' help, you climb the trees and retrieve a Shiny Leaf!");
            this.engine.leaf = true;
            this.create("Glowing Swamp");
        }
        else if(choice && choice.special2)
        {
            this.engine.show("You channel magic to control the wind and lift the Shiny Leaf toward you!");
            this.engine.leaf = true;
            this.create("Glowing Swamp");
        }
        else{
            super.handleChoice(choice);
        }
    }
}

class WyrmBurrow extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(replacePlayerName(this.engine, locationData.Body));

        if(!this.engine.teammateFound)
            this.engine.addChoice("Search for a teammate", { special: true });

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (choice && choice.special) {
            this.engine.show("> You find a brave spirit who joins your journey!");
            this.engine.teammateFound = true;
            this.create('WyrmBurrow');
        } else {
            super.handleChoice(choice);
        }
    }
}

class Village extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        if (this.engine.sacrificedTeammate) {
            // BAD ENDING
            this.engine.show(`${this.engine.playerName} walks into the village... but no mercy remains in their heart.\nThe village burns. Screams echo into the night.`);
            this.engine.show("<b>BAD ENDING: The Destroyer</b>");
        }
        else if (this.engine.blessedByGods) {
            // GOOD ENDING
            this.engine.show(`${this.engine.playerName} enters the village with their companions.\nThe people cheer. A new age of peace begins.`);
            this.engine.show("<b>GOOD ENDING: The Hero of Light</b>");
        }
        else {
            // Normal boring village if no special story
            this.engine.show(replacePlayerName(this.engine, locationData.Body));
            this.engine.show("<b>NORMAL ENDING: Boring life</b>");

            if (locationData.Choices && locationData.Choices.length > 0) {
                for (let choice of locationData.Choices) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        }
    }
}

class HeartTreeGrove extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        this.engine.show(replacePlayerName(this.engine, locationData.Body));

        if (this.engine.teammateFound) {
            // Player has a teammate: offer important choices
            this.engine.show(`A whisper enters your mind: 'Choose, ${this.engine.playerName}. What will you offer?'`);
            this.engine.addChoice("Sacrifice your teammate for ultimate power", { badEnding: true });
            this.engine.addChoice("Refuse to sacrifice your teammate", { goodEnding: true });
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (choice && choice.badEnding) {
            this.engine.show("> You offer your companion to the Heart Tree. Power floods into your veins, but your mind fractures...");
            this.engine.sacrificedTeammate = true;
            this.engine.teammateFound = false;
            // After the sacrifice event, return to Moonstone Gate
            this.engine.gotoScene(MoonstoneGate, "Moonstone Gate");
        } 
        else if (choice && choice.goodEnding) {
            this.engine.show("> You refuse to sacrifice your friend. The gods smile upon your loyalty. A golden path opens ahead...");
            this.engine.blessedByGods = true;
            // After refusing sacrifice, still return to Moonstone Gate
            this.engine.gotoScene(MoonstoneGate, "Moonstone Gate");
        }
        else if (choice) {
            // Normal return (e.g., chose "Return" manually)
            this.engine.gotoScene(MoonstoneGate, "Moonstone Gate");
        } else {
            super.handleChoice(choice);
        }
    }
}



Engine.load(Start, 'myStory.json');
