import fs from "fs";
function readFile(path) {
  //Reads a file, parsing it into a Javascript object, and returns it.
  //Crashes if the file doesn't exist or is invalid JSON.
  return JSON.parse(fs.readFileSync(path,"utf-8"));
}
function writeFile(path,data) {
  //Writes a JSON file, populating it with the data from the passed Javascript object.
  //Crashes if the path is invalid.
  fs.writeFileSync(path,JSON.stringify(data,'',2));
}
function numToWord(num) {
  //Really bad number -> word for exclusively 0-12.
  //Purely to make the output JSON file easier to read.
  switch (num) {
    case 0: return "zero";
    case 1: return "one";
    case 2: return "two";
    case 3: return "three";
    case 4: return "four";
    case 5: return "five";
    case 6: return "six";
    case 7: return "seven";
    case 8: return "eight";
    case 9: return "nine";
    case 10: return "ten";
    case 11: return "eleven";
    case 12: return "twelve"
  }
  return `unknown (${num})`;
}

//Read the input JSON files
const data = {
  events: readFile("events.json"),
  flygon: readFile("flygon.json"),
  kidd: readFile("kidd.json"),
  peter: readFile("peter.json")
}
//Set up a structure to hold the output data in
let output = {
  events: {},
  flygon: {rolls:{counts:{},all:[],total:0,average:0,streak:0},battles:{}},
  kidd: {rolls:{counts:{},all:[],total:0,average:0,streak:0},battles:{}},
  peter: {rolls:{counts:{},all:[],total:0,average:0,streak:0},battles:{}}
};

//Process the data
for (let type of Object.keys(data)) if (data.hasOwnProperty(type)) {
  let datum = data[type];
  if (type == "events") { //Total each event's occurences
    for (let event of datum) {
      if (output.events[event] == null) output.events[event] = 0; //Make sure the target variable exists
      output.events[event]++; //Increment it by one
    }
  } else {
    //The data is a player's stats
    let out = output[type]; //Make the code less of a headache to read

    out.rolls.all = datum.rolls; //Copy the player's rolls into the output
    let streak = 0;
    let bestStreak = -1;
    let streakRoll = -1;
    for (let roll of datum.rolls) { //Loop through the player's rolls
      if (out.rolls.counts[numToWord(roll)] == null) out.rolls.counts[numToWord(roll)]=0; //Make sure the target variable exists
      out.rolls.counts[numToWord(roll)]++ //Increment it by one
      out.rolls.total += roll; //Increment their total by the value of the roll
      if (streakRoll == roll) streak++; //Increment their streak if the roll is the same as the previous
      else { //If it's not the same as the previous
        streakRoll = roll; //Set the previous roll to the current (different) roll
        if (bestStreak < streak) bestStreak = streak; //Update the best streak if the one that just ended is longer
        streak = 1; //Reset the streak count to one (since we just started a new streak)
      }
    }
    out.rolls.streak = bestStreak; //Save the best streak to the output
    out.rolls.average = out.rolls.total / out.rolls.all.length; //Calculate the final average.
    out.battles.total = {count:0,wins:0,losses:0,ratio:-1}; //Add a structure for the overall battle stats to the output

    for (let battle of datum.battles) { //Process their battle stats
      if (out.battles[battle.against] == null) out.battles[battle.against] = {wins:0,losses:0,ratio:-1}; //Make sure the target data exists
      out.battles.total.count++; //Increment their total battle count - this only includes the battles that are recorded in their input stats, not anyone elses'!
      if (battle.win) {
        out.battles[battle.against].wins++; //Increment their wins if they win
        out.battles.total.wins++;
      } else {
        out.battles[battle.against].losses++; //Otherwise they lost
        out.battles.total.losses++;
      }

      let current = out.battles[battle.against]; //Make the next line of code easier to read
      
      out.battles[battle.against].ratio=current.wins/(current.wins+current.losses); //Calclate & store their current winrate
      out.battles.total.ratio = out.battles.total.wins/out.battles.total.count //Calculate & store their current overall winrate
      //The above is *probably* more efficient if I put it in its own loop, but that's a whole extra loop I'd have to write :P
    }

    output[type]=out; //Save to the output structure
  }
}

//Output everything to a JSON file
writeFile("out.json",output)
