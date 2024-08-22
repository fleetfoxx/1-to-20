<script lang="ts">
  import { onMount } from "svelte";
  import { Chart } from "chart.js/auto";
  import { base } from "$app/paths";

  type Stats = {
    gamesPlayed: number;
    wins: number;
    data: [number, number][];
  };

  let stats: Stats | null = null;
  let loading = false;

  const buildCharts = (stats: Stats) => {
    const scoreHistogram = new Map<number, number>(stats.data);

    new Chart(document.getElementById("score-histogram") as HTMLCanvasElement, {
      type: "bar",
      data: {
        labels: [...scoreHistogram.keys()],
        datasets: [
          {
            label: "Score frequency",
            data: [...scoreHistogram.values()]
          }
        ]
      }
    });
  };

  const fetchStats = async () => {
    loading = true;

    try {
      const response = await fetch("https://one-to-twenty-server.fly.dev/stats");

      if (!response.ok) {
        stats = null;
      } else {
        stats = await response.json();
        if (stats) buildCharts(stats);
      }
    } finally {
      loading = false;
    }
  };

  onMount(() => fetchStats());
</script>

<div id="stats-page">
  <a href={`${base}/`}>{"<"} Back to game</a>

  <h2>Stats</h2>

  {#if loading}
    <p>Loading...</p>
  {:else if stats === null}
    <p>Failed to fetch stats.</p>
  {:else}
    <p>Number of games played: {stats.gamesPlayed}</p>
    <p>Number of wins: {stats.wins}</p>
  {/if}

  <div class="chart-wrapper">
    <canvas id="score-histogram"></canvas>
  </div>
</div>

<style>
  #stats-page {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .chart-wrapper {
    width: 100%;
  }
</style>
