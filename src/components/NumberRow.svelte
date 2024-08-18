<script lang="ts">
  import { availableMoves, currentNumber, currentState, GameState, setSelection } from "../store";

  let currentNumberValue: number | null = null;
  currentNumber.subscribe((value) => {
    currentNumberValue = value;
  });

  let gameStateValue: GameState = GameState.ValidMoves;
  currentState.subscribe((value) => {
    gameStateValue = value;
  });

  let availableMovesValue: number[] = [];
  availableMoves.subscribe((value) => {
    availableMovesValue = value;
  });

  $: disabled =
    gameStateValue !== GameState.ValidMoves || currentNumberValue === null || !availableMovesValue.includes(index);

  export let index: number;
  export let value: number | null;

  const handleClick = () => {
    setSelection(index);
  };
</script>

<div class="number-row">
  <span class="row-number">{index + 1}.</span>
  {#if value === null}
    <button on:click={handleClick} class="blank-button" {disabled} />
  {:else}
    <span class="locked-in">{value}</span>
  {/if}
</div>

<style>
  .number-row {
    display: flex;
    justify-content: space-between;
  }

  .row-number {
    width: 3rem;
    text-align: right;
    padding-right: 1rem;
  }

  .blank-button {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.1);
    border: 0;
    border-radius: 5px;

    &:not(:disabled):hover {
      background-color: rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }

    &:disabled {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .locked-in {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    padding: 0 0.5rem;
  }
</style>
