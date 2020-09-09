<script>
  // # # # # # # # # # # # # #
  //
  //  AUTHOR VIEW
  //
  // # # # # # # # # # # # # #

  import { onMount } from 'svelte'
  import { links } from 'svelte-routing'
  import { fade } from 'svelte/transition'
  import get from 'lodash/get'

  import { urlFor, renderBlockText, singleToPlainText } from './sanity.js'

  // STORES
  import { globalSeed, globalHeat, generation, inSession } from './stores.js'

  // PROPS
  export let authorPost = {}

  console.dir(authorPost)
</script>

<style lang="scss">
  @import './variables.scss';

  .author {
    margin-right: 20px;
    margin-left: 20px;
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0px;
    width: calc(100% - 440px);
    overflow: scroll;
    padding: 10px;
    height: 100vh;

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
      font-family: 'five', 'Akkurat-Mono', monospace;
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
  <a href={'/' + $globalSeed} class="back-link">BACK</a>
  <!-- CONTENT -->
  <h1>{authorPost.name}</h1>
  <!-- <div class="main-text">
    {@html renderBlockText(projectPost.mainContent.content)}
  </div> -->
</div>
