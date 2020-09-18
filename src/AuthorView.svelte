<script>
  // # # # # # # # # # # # # #
  //
  //  AUTHOR VIEW
  //
  // # # # # # # # # # # # # #

  import { onMount } from "svelte"
  import { links } from "svelte-routing"
  import { fade } from "svelte/transition"
  import get from "lodash/get"

  import { urlFor, renderBlockText, singleToPlainText } from "./sanity.js"

  // STORES
  import { globalSeed } from "./stores.js"

  // PROPS
  export let authorPost = {}

  console.dir(authorPost)
</script>

<style lang="scss">
  @import "./variables.scss";

  .back-link {
    font-size: 12px;
    display: inline-block;
    background: orangered;
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 5px;
    // margin-bottom: 20px;

    &:hover {
      background: white;
      text-decoration: none;
    }
  }

  .author {
    margin-right: 20px;
    margin-left: 20px;
    z-index: 100;
    width: 100%;
    overflow: scroll;
    padding: 10px;
    height: 100vh;
    background: grey;

    @include screen-size("small") {
      margin-right: 0px;
      margin-left: 0px;
      width: calc(100vw - 20px);
      height: 100vh;
      left: 0;
      top: 0;
    }

    /* padding-top: 20px; */

    img {
      max-width: 100%;
    }

    .main-text {
      font-size: 16px;
      max-width: 700px;

      /* font-family: "times new roman", times, serif; */
    }

    .author {
      font-size: 16px;
      margin-bottom: 40px;

      /* font-family: "times new roman", times, serif; */
    }

    h1 {
      /* padding: 20px 0px; */
      font-family: "five", "Akkurat-Mono", monospace;
      font-size: 72px;
      font-weight: normal;
      line-height: 0.8em;
      margin-bottom: 40px;
      // max-width: 1000px;
    }
  }
</style>

<div class="author" in:fade>
  <!-- BACK LINK -->
  <a href={'/seed/' + $globalSeed} class="back-link">&#x2039&#x2039&#x2039 BACK</a>
  <!-- CONTENT -->
  <h1>{authorPost.name}</h1>
  <!-- <div class="main-text">
    {@html renderBlockText(projectPost.mainContent.content)}
  </div> -->
</div>
