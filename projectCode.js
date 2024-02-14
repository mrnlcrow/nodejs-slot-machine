//1. The user needs to deposit some money
//2. Collect the bet amount but initially know the number of slot lines to bet on
//3. Spin
//4. Check if they won
//5. Give their winnings
//6. Loop the spin
// This is the baseline of out project

const prompt = require("prompt-sync")(); //import the module, here the end brackets specifies that the function require() has been immediately evoked

// Variables to define the slot machines
// Global Variables
const ROWS = 3; // global variables are in all caps
const COLS = 3;
// This is an object
const SYMBOLS_COUNT = {
    "A":3,
    "B":4,
    "C":6,
    "D":8
}

const SYMBOL_VALUES = {
    "A":5, // Thes less the symbol count, the more value it has becaue it is less probable to occur
    "B":4,
    "C":3,
    "D":2
};

const deposit = () => {
    while (true){
    const depositAmount = prompt ("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount<=0){
        console.log("Invalid deposit amount, try again.");
    }else{
        return numberDepositAmount;
    }
    }
};

const getNumberOfLines=()=>{
    while (true){
        const lines = prompt ("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        }else{
            return numberOfLines;
        }
        }
};

//betting amount is dependent on the balance they have

const getBet=(balance,lines)=>{
    while (true){
        const bet = prompt ("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet > balance/lines || numberBet <= 0){
            console.log("Invalid bet, try again.");
        }else{
            return numberBet;
        }
        }
};
//1 and 2 completed

const spin=()=>{
    const symbols = [];  // An array, here we use const because we won't reassign i.e. we won't change the values in the array and it won't affect the array even if we add values to it (referenced)
    
    for(const[symbol, count] of Object.entries(SYMBOLS_COUNT))//for..in is normally used to iterate over objects but we use method Object.entries
    { // Will give us [key, value] in [symbol, count]
        // Object.entries() is an object method in js
        // for..in is better here
        for(let i=0;i<count;i++){

            symbols.push(symbol); // Insert element inside the array

        }

    }

    const reels=[]; // Represents a column inside out slot machine

    for (let i=0;i<COLS;i++){ 
        reels.push([]);  // each column represents a reel, more reels more arrays in our parent array
        const reelSymbols = [...symbols]; // If we don't add [...] then reelSymbols won't be a copy of the array rather just the reference
        for(let j=0;j<ROWS;j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); //MATH.random method generes from (0-1)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex,1);
        }
    }
    return reels;
};

// we transpose the reels array because we need to compare the positional value of each different reel (column) of the slot machine
// so, if we transpose the reels array, out job will be easier to find out the winnigs
const transpose =(reels)=>{
    const rows=[];
    for (let i = 0; i<ROWS; i++){
        rows.push([]);
        for (let j=0; j<COLS;j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
};

const printRows=(rows)=>{
    for (const row of rows){ // row will have one of the arrays of the 2d-array 
        let rowString="";
        for (const[i, symbol] of row.entries()){ // We can use for..in loop here to easily get "i", but using for..of, we do this
            rowString+=symbol;
            if (i != row.length-1){
                rowString+=" | "; // Concatanation
            }
        }
        console.log(rowString)
    }
};

const getWinnings=(rows,bet,lines)=>{
    let winnings=0;

    for(let row=0;row<lines;row++){
        const symbols= rows[row];
        let allSame=true;

        for(const symbol of symbols){
            if(symbol!=symbols[0]){
                allSame=false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]] 
        }
    }
    return winnings;
}

const game=()=>{
    let balance = deposit();
    while(true){
        console.log("You have a balance of Rs. "+balance);
        const numberOfLines=getNumberOfLines();
        const bet = getBet(balance,numberOfLines);
        balance-=bet*numberOfLines;
        const reels = spin();
        const rows=transpose(reels)
        printRows(rows);
        const winnings = getWinnings(rows,bet,numberOfLines);
        balance+=winnings;
        console.log("You won, Rs. "+winnings.toString());
        if(balance<=0){
            console.log("You ran out of money!");
            break;
        }
        const playAgain=prompt("Do you want to play again (y/n)?");
        if (playAgain != "y") break;
    }
};
 


game();


