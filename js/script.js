//

let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [
        {
            locations: [0, 0, 0],
            hits: ['', '', '']
        },
        {
            locations: [0, 0, 0],
            hits: ['', '', '']
        },
        {
            locations: [0, 0, 0],
            hits: ['', '', 'hit']
        }
    ],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage("Попал!");
                if (this.isSunk(ship)) {
                    view.displayMessage('Ты потопил корабль!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('Промах!');
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function () {
        let directions = Math.floor(Math.random() * 2);
        let row, col;

        if (directions === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (directions === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

let view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.textContent = msg;
    },
    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.classList.add('hit');

    },
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.classList.add('miss');
    }
};

let controller = {
    guesses: 0,
    processGuess: function (guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`Вы потопили все корабли! Попыток было сделано ${this.guesses}`);
            }
        }
    }
};

function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Ой, пожалуйста, введите букву и цифру на доске. Или кликните по клетке!');
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert(`Ой, этого нет на доске`);
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert(`Упс, это не по теме!`);
        } else {
            return row + column;
        }
    }
    return null;
}

function handleFireButton() {
    let guessInput = document.querySelector('#guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess.toUpperCase());
    guessInput.value = '';
}

function handleKeyPress(e) {
    let fireButton = document.querySelector('#fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function fireMap(id) {
    model.fire(id);
}

window.onload = init;

function init() {
    let fireButton = document.querySelector('#fireButton');
    fireButton.addEventListener('click', handleFireButton);
    let guessInput = document.querySelector('#guessInput');
    guessInput.onkeypress = handleKeyPress;
    let getMap = document.querySelector('table');
    console.log(getMap);
    getMap.addEventListener('click', function (e) {

        fireMap(e.target.id);

    });

    model.generateShipLocations();
}


