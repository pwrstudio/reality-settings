<script>
  // # # # # # # # # # # # # #
  //
  //  LOG OUTPUT
  //
  // # # # # # # # # # # # # #

  import { fly, fade } from "svelte/transition"
  import get from "lodash/get"
  import sample from "lodash/sample"

  import { urlFor, renderBlockText, singleToPlainText } from "./sanity.js"

  // PROPS
  export let logOut = {}

  console.dir(logOut)
</script>

<style lang="scss">
  @import "./variables.scss";
  .log-output {
    position: fixed;
    bottom: 25px;
    left: 15px;
    padding: 20px;
    background: $white;
    color: $black;
    max-width: 300px;
    font-size: $font-size-small;
    border-radius: 5px;
    user-select: none;
    text-decoration: none;
  }
</style>

<a
  href="/log"
  class="log-output"
  in:fly={{ duration: 300, y: 200 }}
  out:fade={{ duration: 500 }}>
  {logOut.time} – {logOut.string}
</a>
