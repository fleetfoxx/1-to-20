<script lang="ts">
  import { currentNumber, currentState, GameState, generateNextNumber, restart, selections } from "../store";

  let currentNumberValue: number | null;
  currentNumber.subscribe((value) => {
    currentNumberValue = value;
  });

  let gameStateValue: GameState;
  currentState.subscribe((value) => {
    gameStateValue = value;
  });

  let selectionsValue: (number | null)[];
  selections.subscribe((value) => {
    selectionsValue = value;
  });

  const handleStart = () => {
    generateNextNumber();
  };

  const handleNewGame = () => restart();
</script>

<div id="right-panel">
  <div></div>
  {#if gameStateValue === GameState.ValidMoves}
    {#if currentNumberValue === null}
      <button on:click={handleStart} class="start-button large-font">Start!</button>
    {:else}
      <div class="current-number">
        <span class="label">Current Number</span>
        <span class="large-font">{currentNumberValue}</span>
        <button class="new-game" on:click={handleNewGame}>New game</button>
      </div>
    {/if}
  {:else if gameStateValue === GameState.NoValidMoves}
    <div class="current-number">
      <span class="label">Current Number</span>
      <span class="large-font">{currentNumberValue}</span>
      <span class="label">No valid moves!</span>
      <button class="new-game" on:click={handleNewGame}>New game</button>
    </div>
  {:else if gameStateValue === GameState.Win}
    <div class="current-number">
      <span class="large-font">You win!</span>
      <button class="new-game" on:click={handleNewGame}>New game</button>
    </div>
  {/if}
  <div>Score: {selectionsValue.filter((v) => v !== null).length}/{selectionsValue.length}</div>
</div>

<style>
  #right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .start-button,
  .current-number {
    background: rgba(255, 255, 255, 0.3);
    border: 0;
    border-radius: 10px;
    color: #eeeeee;
    text-align: center;
    height: 400px;
  }

  .start-button {
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }

  .new-game {
    cursor: pointer;
  }

  .current-number {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > .label {
      opacity: 0.8;
    }
  }

  .large-font {
    font-size: 10rem;
  }
</style>
