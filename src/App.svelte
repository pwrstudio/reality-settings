<script>
  // # # # # # # # # # # # # #
  //
  //  REALITY SETTINGS
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { onMount } from 'svelte'
  import { Router, Route } from 'svelte-routing'
  import { fade, fly } from 'svelte/transition'

  // STORES
  import { running, globalSeed, globalHeat } from './stores.js'

  // ROUTES
  import Arena from './Arena.svelte'
  import Main from './Main.svelte'
  import Settings from './Components/Settings.svelte'

  // COMPONENTS
  import Ball from './Components/Ball.svelte'
</script>

<style lang="scss" global>
  h1 {
    padding: 20px;
  }

  * {
    box-sizing: border-box;
  }

  .project {
    width: 600px;
    max-width: 100%;
    margin: 20px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }
  .block {
    width: 300px;
    height: auto;
    background: lightgray;
    padding: 20px;
    font-size: 14px;
    margin: 20px;
  }

  .title {
    font-weight: bold;
    margin-bottom: 1em;
  }

  .description {
    word-break: break-all;
    margin-bottom: 1em;
  }

  img {
    max-width: 100%;
  }

  .Main {
    p {
      display: inline;
    }
  }

  .molecule {
    p {
      display: inline;
    }
  }
</style>

<main>
  <Router>
    <Route path="/" component={Settings} />
    <Route path="/meta" component={Main} meta={true}/>
    <Route path="/seed/:seed/" start={true} component={Main} />
    <Route path="/:section/:slug" component={Main} />
  </Router>
</main>
