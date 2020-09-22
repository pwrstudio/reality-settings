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
    <Route path="/*" let:params>
      <Main {params} />
    </Route>
  </Router>
</main>
