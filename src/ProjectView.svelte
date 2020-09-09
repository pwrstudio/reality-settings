<script>
  // # # # # # # # # # # # # #
  //
  //  PROJECT VIEW
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
  export let projectPost = {}

  console.dir(projectPost)
</script>

<style lang="scss">
  @import './variables.scss';

  .project {
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

    img {
      max-width: 100%;
    }

    .author {
      font-size: 16px;
      margin-bottom: 40px;
    }

    .main-text {
      font-size: 16px;
      max-width: 700px;
      padding-bottom: 140px;
    }

    h1 {
      /* padding: 20px 0px; */
      font-family: 'five', 'Akkurat-Mono', monospace;
      font-size: 72px;
      font-weight: normal;
      line-height: 0.8em;
      margin-bottom: 40px;
      max-width: 80%;
    }
  }
</style>

<div class="project" in:fade use:links>
  <!-- BACK LINK -->
  <a href={'/' + $globalSeed} class="back-link">BACK</a>

  <!-- CONTENT => TITLE -->
  <h1>{projectPost.title}</h1>

  <!-- CONTENT => AUTHORS -->
  {#if projectPost.authors && Array.isArray(projectPost.authors)}
    {#each projectPost.authors as author (author._id)}
      <a
        href={'/author/' + get(author, 'slug.current', '')}
        class="author">{author.name}</a>
    {/each}
  {/if}

  <!-- CONTENT => MAIN CONTENT -->
  <div class="main-text">
    {@html renderBlockText(projectPost.mainContent.content)}
  </div>
</div>
