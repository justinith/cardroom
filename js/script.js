(function() {

	var availCards = [];
	var cardsInHand = [];
	var dealerCards = [];
	var cardsInHandTotal = 0;
	var dealerCardsTotal = 0;
	var handAceCount = 0;
	var dealerAceCount = 0;
	var gameOver = false;

	var specMode = false;

    window.onload = function(){
    	
    	loadNewDeck();
    	dealBlackJackCards();
    	checkStatus();

    	$("#hitCard").click(function(){
    		if(gameOver == false){
	    		hitCard();
	    		checkStatus();
	    	}
    	});

    	$("#stay").click(function(){
    		if(gameOver == false){
    			playDealer();
    		}
    	});

    	$("#restartGame").click(function(){
    		restartTable();
    		dealBlackJackCards();
    		checkStatus();
    	});

    }

    function checkStatus(){
    	var status = document.getElementById("gameStatus");
    	if(gameOver == true && cardsInHandTotal == 21 && dealerCardsTotal != 21 || gameOver == true && cardsInHandTotal > dealerCardsTotal || gameOver == true && dealerCardsTotal > 21 && cardsInHandTotal <= 21){
    		status.innerHTML = "You won!";
    	} else if(gameOver == true && cardsInHandTotal < dealerCardsTotal && dealerCardsTotal < 22 || gameOver == true && cardsInHandTotal > 21 || gameOver == false && cardsInHandTotal > 21){
    		status.innerHTML = "You lost...";
    		gameOver = true;
    	} else if(gameOver == true && cardsInHandTotal == dealerCardsTotal){
    		status.innerHTML = "It's a tie!"
    	} else {
    		status.innerHTML = "Game in progress";
    	}
	}
	
	// Blackjack Functions

    function dealBlackJackCards(){
    	for(var i = 0; i < 2; i++){

			cardsInHand.push(drawCard());
			dealerCards.push(drawCard());

    		generateCard(drawCard(0), 0);
    		generateCard(drawCard(1), 1);
    	}
    	updateStatus();
    }

	// Returns a random card from the available deck
	// Removes that card from the available deck
    function drawCard(handFlag){
    	var selectedIndex = Math.floor(Math.random() * availCards.length);
    	var choosenCard = availCards[selectedIndex];
    	availCards.splice(selectedIndex, 1);
    	// if(handFlag == 0){
    	// 	cardsInHand.push(choosenCard);
    	// } else {
    	// 	dealerCards.push(choosenCard);
    	// }
    	return choosenCard;
    }

    function generateCard(card, handFlag){
    	var cardStats = getCardStats(card);
    	var newCard = document.createElement("div");
    	newCard.classList.add("card");
    	if(cardStats[2]){
    		newCard.classList.add("red");
    	}
    	
    	var top = document.createElement("div");
    	top.classList.add("top");
    	top.innerHTML = cardStats[0] + "<br>" + cardStats[1];
    	newCard.appendChild(top);

    	var mid = document.createElement("div");
    	mid.classList.add("mid");
    	mid.innerHTML = cardStats[1];
    	newCard.appendChild(mid);

    	var bot = document.createElement("div");
    	bot.classList.add("bot");
    	bot.innerHTML = cardStats[0] + "<br>" + cardStats[1];
    	newCard.appendChild(bot);

    	if(handFlag == 0){
    		document.getElementById("yourHand").appendChild(newCard);
    	} else {
    		document.getElementById("dealerHand").appendChild(newCard);
    	}	
    }

    function getCardStats(card){
    	var result = [];
    	if(card.slice(0,1) == "0"){
    		result.push(card.substring(1,2));
    	} else {
    		result.push("10");
    	}
    	var suite = card.substring(2,3);
    	if(suite == "H"){
    		result.push("&hearts;");
    	} else if(suite == "D"){
    		result.push("&diams;");
    	} else if(suite == "S"){
    		result.push("&spades;");
    	} else {
    		result.push("&clubs;");
    	}
    	if(card.substring(3,4) == "R"){
    		result.push(true);
    	} else {
    		result.push(false);
    	}
    	return result;
    }

    function getValue(card){
    	var rawValue = card.slice(0,2);
    	if(rawValue == "0A") {
    		return 11;
    	} else if(rawValue == "0J" || rawValue == "0Q" || rawValue == "0K" ){
    		return 10;
    	}
    	return parseInt(rawValue);
    }

    function handTotal(){
    	handAceCount = 0;
    	var total = 0;
    	for (var i = 0; i < cardsInHand.length; i++) {
    		total += getValue(cardsInHand[i]);
    		if(getValue(cardsInHand[i]) == 11){
    			handAceCount++;
    		}
    	};
    	cardsInHandTotal = total;
    	// document.getElementById("handTotal").innerHTML = "Your total hand: " + total;

    	dealerAceCount = 0;
    	var dTotal = 0;
    	for (var j = 0; j < dealerCards.length; j++) {
    		dTotal += getValue(dealerCards[j]);
    		if(getValue(dealerCards[j]) == 11){
    			dealerAceCount++;
    		}
    	};
    	dealerCardsTotal = dTotal;
    	// document.getElementById("dealerTotal").innerHTML = "Total in dealer's hand: " + dTotal;
    }

    function hitCard(){
    	generateCard(drawCard(0), 0);
    	updateStatus();
    }

    function loadNewDeck(){
    	availCards = createNewDeck();
	}
	
	function createNewDeck(){
		var newDeck = [];

		var values = ["0A", "02", "03", "04", "05", "06", "07", "08",
    					"09", "10", "0J", "0Q", "0K"];
		for (var i = 0; i < values.length; i++) {
			var card = values[i];
			for(var j = 0; j < 4; j++){
				if(j == 0){
					card = card + "HR";
				} else if(j == 1){
					card = card + "DR";
				} else if(j == 2){
					card = card + "SB";
				} else {
					card = card + "CB";
				}
				newDeck.push(card);
				card = values[i];
			}
		};

		return newDeck;
	}

    function playDealer(){
    	gameOver = true;
    	while (dealerCardsTotal <= 16){
			generateCard(drawCard(1), 1);
    		updateStatus();
    		checkStatus();
    	}
    	checkStatus();
    }

    function restartTable(){
    	availCards = [];
		cardsInHand = [];
		dealerCards = [];
		cardsInHandTotal = 0;
		dealerCardsTotal = 0;
		gameOver = false;
		loadNewDeck();
		document.getElementById("yourHand").innerHTML = "";
		document.getElementById("dealerHand").innerHTML = "";
		document.getElementById("handTotal").innerHTML = "";
		document.getElementById("dealerTotal").innerHTML = "";
		document.getElementById("gameStatus").innerHTML = "";
    }

    function showAvail(){
    	$("#availableCards").html(availCards.toString() + "<br> TOTAL: " + availCards.length);
    }

    function updateStatus(){
    	// showAvail();
    	handTotal();
    	calculateChances();
    }

    // CALCULATE CHANCES FUNCTIONS

    function calculateChances(){
    	var bjPercent = calBJ() + "%";
    	var bustPercent = calBust() + "%";
    	var stablePercent = 100 - (calBust() + calBJ()) + "%";

    	$("#blackjackBar").css("width", bjPercent);
    	$("#blackjackBar").html(bjPercent);

    	$("#stableBar").css("width", stablePercent);
    	$("#stableBar").html(stablePercent);

    	$("#bustBar").css("width", bustPercent);
    	$("#bustBar").html(bustPercent);
    }

    function calBJ(){
    	var targetVal = 21 - cardsInHandTotal;
    	var numWithVal = getValCount(targetVal);
    	return parseInt(((numWithVal + 0.0) / availCards.length) * 100);
    }

    function calBust(){
    	if(cardsInHandTotal == 21 || cardsInHandTotal == 20){
    		return 100;
    	} else {
	    	var minBust = 21 - cardsInHandTotal + 1;
	    	var totalBustCount = 0;
	    	for(var i = minBust; i <= 10; i++){
	    		totalBustCount += getValCount(i);
	    	}
	    	return parseInt(((totalBustCount + 0.0) / availCards.length) * 100);
	    }
    }

    function getValCount(targetVal){
    	var count = 0;
    	for (var i = 0; i < availCards.length; i++) {
    		if(getValue(availCards[i]) == targetVal){
    			count++;
    		}
    	};
    	return count;
    }

})();







