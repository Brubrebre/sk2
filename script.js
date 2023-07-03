let numRounds = 0; // Define numRounds globally
let currentRound = 0; // Global variable to track the current round
let numPlayers = 0;
let highestValue = 0; // Variable to store the highest value

function createGame() {
  numPlayers = parseInt(document.getElementById("numPlayers").value);
  numRounds = parseInt(document.getElementById("numRounds").value);
  const totalCards = parseInt(document.getElementById("totalCards").value);

  const cardsPerRound = distributeCards(numRounds, numPlayers, totalCards);

  const scoreTable = document.getElementById("scoreTable");
  scoreTable.innerHTML = "";

  // Create table headers
  const headerRow = document.createElement("tr");
  const roundHeader = document.createElement("th");
  roundHeader.textContent = "Round";
  headerRow.appendChild(roundHeader);

  for (let i = 1; i <= numPlayers; i++) {
    const playerHeader = document.createElement("th");
    playerHeader.textContent = "Player " + i;
    headerRow.appendChild(playerHeader);
  }

  scoreTable.appendChild(headerRow);

  // Create table rows
  for (let round = 1; round <= numRounds; round++) {
    const row = document.createElement("tr");

    const roundCell = document.createElement("td");
    roundCell.textContent = "#" + round + " / " + cardsPerRound[round - 1] + " Cards";
    roundCell.id = "round-" + round; // Assign an id to the roundCell element
    roundCell.classList.add("round-cell");
    row.appendChild(roundCell);

    for (let player = 1; player <= numPlayers; player++) {
      const bidInput = document.createElement("input");
      bidInput.type = "number";
      bidInput.min = "0";
      bidInput.value = "0";
      bidInput.classList.add("input-field");
      bidInput.id = "player" + player + "-bid-round" + round;

      const trickInput = document.createElement("input");
      trickInput.type = "number";
      trickInput.min = "0";
      trickInput.value = "0";
      trickInput.classList.add("input-field");
      trickInput.id = "player" + player + "-trickwon-round" + round;

      const bonusInput = document.createElement("input"); // Create the bonus input
      bonusInput.type = "number";
      bonusInput.min = "0";
      bonusInput.value = "0";
      bonusInput.classList.add("input-field");
      bonusInput.id = "player" + player + "-bonus-round" + round; // Set the ID for the bonus input

      const playerCell = document.createElement("td");
      playerCell.classList.add("player-cell");
      playerCell.appendChild(bidInput);
      playerCell.appendChild(trickInput);
      playerCell.appendChild(bonusInput);
      row.appendChild(playerCell);
    }

    scoreTable.appendChild(row);
  }

  // Add Total Row
  const totalRow = document.createElement("tr");
  const totalHeader = document.createElement("th");
  totalHeader.textContent = "Total";
  totalRow.appendChild(totalHeader);

  for (let player = 1; player <= numPlayers; player++) {
    const totalCell = document.createElement("td");
    totalCell.id = "player" + player + "-total";
    totalCell.classList.add("total-cell");
    totalRow.appendChild(totalCell);
  }

  scoreTable.appendChild(totalRow);

  // Disable all input fields except for the first round
  currentRound = 1;
  disableAllFields(currentRound);
}

// Define the nextRound function
function nextRound() {
  const numRounds = parseInt(document.getElementById("numRounds").value);

  if (currentRound <= numRounds) {
    calculateAndDisplayPoints(currentRound);
  }
  if (currentRound < numRounds + 1) {
    currentRound++;
    disableAllFields(currentRound);
  }
}

function distributeCards(numRounds, numPlayers, totalCards = 73) {
  var maxCardsPerPlayer = Math.floor(totalCards / numPlayers);
  var cardsPerRound = [];
  var remainingCards = totalCards;

  for (var round = 1; round <= numRounds; round++) {
    var cardsForRound = Math.min(round, maxCardsPerPlayer);
    cardsPerRound.push(cardsForRound);
    remainingCards -= cardsForRound;
  }

  var repeatRound = numRounds + 1;

  while (remainingCards > 0) {
    var cardsForRound = Math.min(repeatRound, maxCardsPerPlayer);
    cardsPerRound.push(cardsForRound);
    remainingCards -= cardsForRound;
    repeatRound++;
  }

  return cardsPerRound;
}

// Disable or enable the input fields based on the round number
function disableAllFields(roundNumber) {
  const inputFields = document.getElementsByClassName("input-field");
  for (let i = 0; i < inputFields.length; i++) {
    const fieldId = inputFields[i].id;
    const fieldRound = parseInt(fieldId.match(/round(\d+)/)[1]);

    if (fieldRound === roundNumber) {
      inputFields[i].disabled = false;
    } else {
      inputFields[i].disabled = true;
    }
  }

  if (roundNumber === 0) {
    nextRoundButton.style.display = "none"; // Hide the button
  } else if (roundNumber < numRounds) {
    nextRoundButton.removeAttribute("hidden");
    nextRoundButton.textContent = "Next Round";
    nextRoundButton.disabled = false;
  } else if (roundNumber === numRounds) {
    nextRoundButton.textContent = "Finish";
    nextRoundButton.disabled = false;
  } else {
    nextRoundButton.textContent = "Finish";
    nextRoundButton.disabled = true;
  }
}

function calculatePoints(cardCount, bid, tricksWon) {
  var points = 0;

  if (bid === 0) {
    if (tricksWon === 0) {
      points = 10 * cardCount;
    } else {
      points = -10 * cardCount;
    }
  } else {
    if (tricksWon === bid) {
      points = 20 * tricksWon;
    } else {
      points = -10 * Math.abs(tricksWon - bid);
    }
  }

  return points;
}

function calculateAndDisplayPoints(roundNumber) {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const cardsPerRoundCell = document.getElementById("round-" + roundNumber);
  const cardsPerRoundValue = parseInt(cardsPerRoundCell.textContent.split(" / ")[1]);

  const playerTotals = []; // Array to store player totals

  for (let player = 1; player <= numPlayers; player++) {
    const bidInput = document.getElementById("player" + player + "-bid-round" + roundNumber);
    const trickInput = document.getElementById("player" + player + "-trickwon-round" + roundNumber);
    const bonusInput = document.getElementById("player" + player + "-bonus-round" + roundNumber);
    const totalCell = document.getElementById("player" + player + "-total");

    const bid = parseInt(bidInput.value);
    const trickWon = parseInt(trickInput.value);
    const bonus = parseInt(bonusInput.value);
    const points = calculatePoints(cardsPerRoundValue, bid, trickWon);

    const currentTotal = parseInt(totalCell.textContent) || 0;
    const newTotal = currentTotal + bonus + points;

    playerTotals.push(newTotal); // Store the total in the array

    totalCell.textContent = String(newTotal);
  }

  const highestValue = Math.max(...playerTotals); // Find the highest value

  // Highlight the cell with the highest value
  for (let player = 1; player <= numPlayers; player++) {
    const totalCell = document.getElementById("player" + player + "-total");
    if (parseInt(totalCell.textContent) === highestValue) {
      totalCell.classList.add("highest-value"); // Add "highest-value" class
    } else {
      totalCell.classList.remove("highest-value"); // Remove the class if not the highest value
    }
  }
}

// Call nextRound on button click
document.getElementById("nextRoundButton").addEventListener("click", nextRound);
document.getElementById("createGameButton").addEventListener("click", createGame);
