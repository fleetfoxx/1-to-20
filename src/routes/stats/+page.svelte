<script lang="ts">
  import { onMount } from "svelte";
  import { Chart } from "chart.js/auto";

  type Stats = {
    numbers: string;
    lastNumber: number;
    seed: string;
    timestamp: number;
  };

  let stats: Stats[] | null = [];
  let loading = false;

  const buildCharts = (stats: Stats[]) => {
    const scoreHistogram = new Map<number, number>(new Array(20).fill(0).map((v, i) => [i + 1, v]));

    for (const stat of stats) {
      const score = JSON.parse(stat.numbers).filter((n: number | null) => n !== null).length;
      scoreHistogram.set(score, scoreHistogram.has(score) ? scoreHistogram.get(score)! + 1 : 1);
    }

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
      const response = await fetch("https://one-to-twenty-server.fly.dev/games");

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

<h2>Stats</h2>

<a href="/">{"<"} Back to game</a>

{#if loading}
  <p>Loading...</p>
{:else if stats === null}
  <p>Failed to fetch stats.</p>
{:else}
  <p>Number of games played: {stats.length}</p>
{/if}

<div class="chart-wrapper">
  <canvas id="score-histogram"></canvas>
</div>

<style>
  .chart-wrapper {
    width: 800px;
    height: 600px;
  }
</style>
