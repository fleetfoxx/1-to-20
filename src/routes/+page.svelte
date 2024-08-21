<script>
  import NumberList from "../components/NumberList.svelte";
  import RightPanel from "../components/RightPanel.svelte";
</script>

<h2 class="header">1-to-20</h2>

<div id="app-wrapper">
  <NumberList />
  <RightPanel />
</div>

<footer>
  built by <a href="https://fleetfoxx.dev/">fleetfoxx</a> | <a href="/stats">Stats!</a>
</footer>

<style>
  #app-wrapper {
    display: flex;
    gap: 1rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    text-align: center;
  }

  footer {
    text-align: center;
    padding: 5rem;
    font-size: 1.5rem;
  }
</style>
