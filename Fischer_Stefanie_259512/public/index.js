"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var cards = [
        {
            name: 'Apple',
            src: 'images/apple.png'
        },
        {
            name: 'Bananas',
            src: 'images/bananas.png'
        },
        {
            name: 'FruitMix',
            src: 'images/fruitMix.png'
        },
        {
            name: 'Grapes',
            src: 'images/grapes.png'
        },
        {
            name: 'Mango',
            src: 'images/mango.png'
        },
        {
            name: 'Orange',
            src: 'images/orange.png'
        },
        {
            name: 'Strawberry',
            src: 'images/strawberry.png'
        },
        {
            name: 'Watermelon',
            src: 'images/watermelon.png'
        }
    ];

    var allCards = [];
    for (var i = 0; i < cards.length; i++) {
        allCards.push(cards[i], cards[i]);
    }
    var gameGrid = $('#game-grid');
    var gameButton = $('#game-button');
    var timeDisplay = $('#time-display');
    if (gameGrid == null || gameButton == null || timeDisplay == null) {
        console.error('Invalid HTML.');
        return;
    }
    var timer = new Timer();
    var flippedCards = [];
    var cardsWon = [];
    var state = 'init';
    gameButton.text('Start game');
    gameButton.on('click', onGameButtonClicked);

    function resetGameGrid() {
        gameGrid.empty();
        allCards.sort(function () { return 0.5 - Math.random(); });
        for (var i = 0; i < allCards.length; i++) {
            var card = $('<img>');
            card.attr('data-card-id', i);
            card.addClass('hided');
            card.on('click', flipCard);
            gameGrid.append(card);
        }
    }

    function flipCard(ev) {
        var card = $(ev.target);
        var cardId = Number(card.attr('data-card-id'));
        if (isNaN(cardId)) {
            console.error('No card id found!');
            return;
        }

        card.attr('src', allCards[cardId].src);
        flippedCards.push(cardId);

        if (flippedCards.length === 2) {
            var cards_1 = gameGrid.children('img');
            var cardOneName = allCards[flippedCards[0]].name;
            var cardTwoName = allCards[flippedCards[1]].name;

            if (cardOneName === cardTwoName) {
                alert('You found a match!');
                $(cards_1[flippedCards[0]]).attr('src', '').addClass('solved');
                $(cards_1[flippedCards[1]]).attr('src', '').addClass('solved');
                cardsWon = cardsWon.concat(flippedCards);

                if (cardsWon.length === allCards.length) {
                    var elapsedTime = timer.stop();
                    var playerName = prompt("Congratulations! You found all pairs in " + convertSecondsToString(elapsedTime) + "!\nPlease input your name to set yourself on the highscore:");
                    if (playerName != null) {
                        console.log('Store new player highscore!', { player: playerName, score: elapsedTime });
                        var score = {
                            name: playerName,
                            score: elapsedTime
                        };
                        $.ajax(window.location.origin + '/store', {
                            type: 'POST',
                            data: JSON.stringify(score),
                            headers: {
                                'Content-Type': "application/json"
                            },
                            success: function () {
                                console.log('Score was successfully stored.');
                                alert('Your score was entered into the highscore table.');
                                window.location.href = window.location.origin + '/highscore';
                            },
                            error: function (reg, err) {
                                console.error('Storing highscore failed!', err);
                                alert('Storing your highscore failed.');
                            }
                        });
                    }
                }
            }

            else {
                alert('No match!');
                $(cards_1[flippedCards[0]]).attr('src', '').addClass('hided');
                $(cards_1[flippedCards[1]]).attr('src', '').addClass('hided');
            }
            flippedCards = [];
        }
    }

    function updateTimeDisplay() {
        timeDisplay.text(convertSecondsToString(timer.getElapsedTime()));
    }

    function onGameButtonClicked(ev) {
        if (ev.button != 0)
            return;
        switch (state) {
            case 'init':
                if (confirm('Ready to start the game?')) {
                    resetGameGrid();
                    updateTimeDisplay();
                    timer.start(function () { return updateTimeDisplay(); });
                    state = 'started';
                    gameButton.text('Restart');
                }
                break;
            case 'started':
                if (confirm('Do you want to restart the game?')) {
                    resetGameGrid();
                    timer.stop();
                    timer.start(function () { return updateTimeDisplay(); });
                    state = 'started';
                    gameButton.text('Restart');
                }
        }
    }
});

function convertSecondsToString(seconds) {
    var minutes = Math.floor(seconds / 60);
    var secounds = seconds - minutes * 60;
    return ("00" + minutes).slice(-2) + " : " + ("00" + secounds).slice(-2);
}
var Timer = /** @class */ (function () {
    function Timer() {
        this.__elapsedTime = 0;
    }

    Timer.prototype.start = function (cb) {
        var _this = this;
        this.__elapsedTime = 0;
        this.__intervalId = setInterval(function () {
            _this.__elapsedTime += 1;
            cb();
        }, 1000);
    };

    Timer.prototype.stop = function () {
        clearInterval(this.__intervalId);
        return this.__elapsedTime;
    };

    Timer.prototype.getElapsedTime = function () {
        return this.__elapsedTime;
    };
    return Timer;
}());
