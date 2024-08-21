import { get, writable, type Writable } from "svelte/store";
import seedrandom from "seedrandom";

const getInitialSelections = () => new Array<number | null>(20).fill(null);

// export const seed: Writable<string> = writable("");
let seed = "";
let rng = seedrandom();

export const selections: Writable<(number | null)[]> = writable(getInitialSelections());

export const currentNumber: Writable<number | null> = writable(null);

export enum GameState {
  ValidMoves,
  NoValidMoves,
  Win
}

export const currentState: Writable<GameState> = writable(GameState.ValidMoves);

export const availableMoves: Writable<number[]> = writable([]);

const getRandomInt = () => Math.floor(rng() * (1000 - 1 + 1) + 1);

export const startGame = () => {
  seed = crypto.randomUUID();
  rng = seedrandom(seed);
  console.log(seed);
  generateNextNumber();
};

export const generateNextNumber = () => {
  const selectionValues = get(selections);
  let randomNumber = getRandomInt();

  // Prevent duplicates
  while (selectionValues.includes(randomNumber)) {
    randomNumber = getRandomInt();
  }

  currentNumber.set(randomNumber);

  /* Update game state. */
  if (selectionValues.every((v) => v === null)) {
    // New game, all moves valid.

    currentState.set(GameState.ValidMoves);

    const nextAvailableMoves = [];

    for (let i = 0; i < selectionValues.length; i++) {
      nextAvailableMoves.push(i);
    }

    availableMoves.set(nextAvailableMoves);
  } else {
    const nextAvailableMoves: number[] = [];

    let currentMin = 0;
    let currentMinIndex = -1;
    let currentMax = 1001;
    let currentMaxIndex = selectionValues.length;

    for (let i = 0; i < selectionValues.length; i++) {
      const v = selectionValues[i];

      if (v === null) continue;
      if (v < randomNumber && v > currentMin) {
        currentMin = v;
        currentMinIndex = i;
        continue;
      }

      if (v > randomNumber) {
        currentMax = v;
        currentMaxIndex = i;
        break;
      }
    }

    for (let i = currentMinIndex + 1; i < currentMaxIndex; i++) {
      nextAvailableMoves.push(i);
    }

    if (nextAvailableMoves.length === 0) {
      currentState.set(GameState.NoValidMoves);
      sendResults();
    } else {
      currentState.set(GameState.ValidMoves);
      availableMoves.set(nextAvailableMoves);
    }
  }
};

export const setSelection = (index: number) => {
  selections.update((s) => {
    s[index] = get(currentNumber);
    return s;
  });

  // Check for win.
  const selectionValues = get(selections);

  if (selectionValues.every((v) => v !== null)) {
    currentState.set(GameState.Win);
    sendResults();
  } else {
    generateNextNumber();
  }
};

export const restart = () => {
  selections.set(getInitialSelections());
  currentState.set(GameState.ValidMoves);
  currentNumber.set(null);
};

const sendResults = () => {
  console.log(import.meta.env.VITE_API_URI);
  fetch(`${import.meta.env.VITE_API_URI}/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      numbers: get(selections),
      lastNumber: get(currentNumber),
      seed
    })
  });
};
