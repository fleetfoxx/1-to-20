<script lang="ts">
  import { selections } from "../store";
  import NumberRow from "./NumberRow.svelte";

  let selectionsValue: (number | null)[];

  selections.subscribe((value) => {
    selectionsValue = value;
  });
</script>

<div id="number-list">
  {#each selectionsValue as value, i (i)}
    <NumberRow index={i} {value} />
  {/each}
</div>

<style>
  #number-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5rem;
  }
</style>
