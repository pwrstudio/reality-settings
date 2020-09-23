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

  // *** COMPONENTS
  import ProjectsList from "./ProjectsList.svelte"

  import { loadData, urlFor, renderBlockText } from "./sanity.js"

  // *** STORES
  import { globalSeed } from "./stores.js"

  // *** GLOBAL
  import { QUERY } from "./global.js"

  // PROPS
  export let authorPost = {}

  let connectedProjects = []

  $: {
    console.dir(authorPost)
    connectedProjects = loadData(QUERY.CONNECTED_PROJECTS, {
      id: authorPost._id,
    })
  }
</script>

<style lang="scss">
  @import "./variables.scss";

  .author {
    z-index: 100;
    width: 100%;
    overflow: scroll;
    padding: 10px;
    height: 100vh;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 80px;
    background: grey;

    @include hide-scroll;

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
      margin-bottom: 40px;

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
      line-height: 0.9em;
      margin-bottom: 40px;
      max-width: 90%;
      // max-width: 1000px;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: $black;
      letter-spacing: -1px;
      word-spacing: -10px;
    }
  }
</style>

<div class="author" in:fade>
  <!-- TITLE -->
  <h1>{authorPost.name}</h1>
  <!-- BIOGRAPHY -->
  {#if get(authorPost, 'biography.content', false) && Array.isArray(authorPost.biography.content)}
    <div class="main-text">
      {@html renderBlockText(authorPost.biography.content)}
    </div>
  {/if}
  <!-- CONNECTED PROJECTS -->
  {#await connectedProjects then connectedProjects}
    {#if connectedProjects && Array.isArray(connectedProjects)}
      <div class="connected-projects">
        <ProjectsList projects={connectedProjects} small={true} />
      </div>
    {/if}
  {/await}
</div>
