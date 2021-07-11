interface ICard {
    name: string,
    src: string
}

interface IScore {
    /** Spielername und Score */
    name: string,
    score: number
}

document.addEventListener('DOMContentLoaded', () => {
    // Karten des Spiels
    const cards: ICard[] = [
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

    // array mit Karten
   
    const allCards: ICard[] = [];
    for (let i = 0; i < cards.length; i++) {
        allCards.push(cards[i], cards[i]);
    }

    let gameGrid = $('#game-grid');
    let gameButton = $('#game-button');
    let timeDisplay = $('#time-display');

    if (gameGrid == null || gameButton == null || timeDisplay == null) {
        console.error('Invalid HTML.');
        return;
    }

    const timer = new Timer();
    /*Karten wenden */
    let flippedCards: number[] = [];
    let cardsWon: number[] = [];
    let state: 'init' | 'started' | 'finished' = 'init';
    gameButton.text('Start game');
    gameButton.on('click', onGameButtonClicked); 

    /*Reset des Spiels*/
    function resetGameGrid() {
        gameGrid.empty();

        allCards.sort(() => 0.5 - Math.random());

        for (let i = 0; i < allCards.length; i++) {
            let card = $<HTMLImageElement>('<img>');
            card.attr('data-card-id', i);
            card.addClass('hided');
            card.on('click', flipCard);
            gameGrid.append(card);
        }
    }

    /** Karten checken*/
    function flipCard(ev: JQuery.ClickEvent) {
        let card = $<HTMLImageElement>(ev.target);
        const cardId = Number(card.attr('data-card-id'));
        if (isNaN(cardId)) {
            console.error('No card id found!');
            return;
        }

        card.attr('src', allCards[cardId].src);
        flippedCards.push(cardId);
        
        // Checken, wenn zwei Karten umgedreht
        if (flippedCards.length === 2) {
            let cards = gameGrid.children('img');

            const cardOneName = allCards[flippedCards[0]].name;
            const cardTwoName = allCards[flippedCards[1]].name;

            // check:Match
            if (cardOneName === cardTwoName) {
                alert('You found a match!');
                $(cards[flippedCards[0]]).attr('src', '').addClass('solved');
                $(cards[flippedCards[1]]).attr('src', '').addClass('solved');
                cardsWon = cardsWon.concat(flippedCards);

                // Spielende // Alle Bild-Paare gefunden
                if (cardsWon.length === allCards.length) {
                    let elapsedTime = timer.stop();
                    let playerName = prompt(`Congratulations! You found all pairs in ${convertSecondsToString(elapsedTime)}!\nPlease input your name to set yourself on the highscore:`);
                    if (playerName != null) {
                        console.log('Store new player highscore!', {player: playerName, score: elapsedTime });
                        let score: IScore = {
                            name: playerName,
                            score: elapsedTime
                        };
                        $.ajax(window.location.origin + '/store', {
                            type: 'POST',
                            data: JSON.stringify(score),
                            headers: {
                                'Content-Type': "application/json"
                            },
                            success: () => {
                                console.log('Score was successfully stored.');
                                alert('Your score was entered into the highscore table.');
                                window.location.href = window.location.origin + '/highscore';
                            },
                            error: (reg, err) => {
                                console.error('Storing highscore failed!', err);
                                alert('Storing your highscore failed.');
                            }
                        });
                    }
                }
            }
            // check:kein Match
            else {
                alert('No match!');
                $(cards[flippedCards[0]]).attr('src', '').addClass('hided');
                $(cards[flippedCards[1]]).attr('src', '').addClass('hided');
            }
            flippedCards = [];
        }
    }

    
    function updateTimeDisplay() {
        timeDisplay.text(convertSecondsToString(timer.getElapsedTime()));
    }

    /** CTA Button geklickt */
    function onGameButtonClicked(ev: JQuery.ClickEvent) {
        if (ev.button != 0)
            return;
        
        switch (state) {
            case 'init':
                if (confirm('Ready to start the game?')) {
                    resetGameGrid();
                    updateTimeDisplay();
                    timer.start(() => updateTimeDisplay());
                    state = 'started';
                    gameButton.text('Restart');
                }
                break;
            case 'started':
                if (confirm('Do you want to restart the game?')) {
                    resetGameGrid();
                    timer.stop();
                    timer.start(() => updateTimeDisplay());
                    state = 'started';
                    gameButton.text('Restart');
                }
        }
    }   
});

/** Sukunden in MM:SS */
function convertSecondsToString(seconds: number) {
    let minutes = Math.floor(seconds / 60);
    let secounds = seconds - minutes * 60;
    return `${("00" + minutes).slice(-2)} : ${("00" + secounds).slice(-2)}`;
}

class Timer {
    private __intervalId: number | undefined;
    private __elapsedTime: number = 0;

    /** Timer-Start*/
    public start(cb: () => any) {
        this.__elapsedTime = 0;
        this.__intervalId = setInterval(() => {
            this.__elapsedTime += 1;
            cb();
        }, 1000);
    }

    /**Timer-Stop*/
    public stop() {
        clearInterval(this.__intervalId);
        return this.__elapsedTime;
    }

    public getElapsedTime() {
        return this.__elapsedTime;
    }
}