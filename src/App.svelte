<script>
  // # # # # # # # # # # # # #
  //
  //  REALITY SETTINGS
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { Router, Route } from "svelte-routing"

  // ROUTES
  import Main from "./Main.svelte"
  import Settings from "./Components/Settings.svelte"
</script>

<style lang="scss" global>
  * {
    box-sizing: border-box;
  }
</style>

<main>
  <Router>
    <Route path="/" component={Settings} />
    <Route path="/:section" component={Main} />
    <Route path="/:section/:slug" component={Main} />
  </Router>
</main>
