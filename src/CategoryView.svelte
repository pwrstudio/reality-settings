<script>
  // # # # # # # # # # # # # #
  //
  //  CATEGORY VIEW
  //
  // # # # # # # # # # # # # #

  import { onMount } from "svelte"
  import { links } from "svelte-routing"
  import { fade } from "svelte/transition"
  import { quartOut } from "svelte/easing"
  import get from "lodash/get"

  // *** COMPONENTS
  import ProjectsList from "./ProjectsList.svelte"

  import { loadData, urlFor, renderBlockText } from "./sanity.js"

  // *** STORES
  import { globalSeed } from "./stores.js"

  // *** GLOBAL
  import { QUERY } from "./global.js"

  // PROPS
  export let slug = {}

  let connectedProjects = []

  $: {
    connectedProjects = loadData(QUERY.CATEGORY, {
      slug: slug,
    })
  }
</script>

<style lang="scss">
  @import "./variables.scss";

  .category-view {
    img {
      max-width: 100%;
    }

    .main-text {
      font-size: $font_size_normal;
      max-width: 700px;
      margin-bottom: 40px;
    }

    .author {
      font-size: $font_size_normal;
      margin-bottom: 40px;
    }

    h1 {
      @include big-title;
    }
  }
</style>

<div class="category-view">
  <!-- TITLE -->
  <h1>{slug}</h1>
  <!-- CONNECTED PROJECTS -->
  {#await connectedProjects then connectedProjects}
    {#if connectedProjects && Array.isArray(connectedProjects)}
      <div class="connected-projects">
        <ProjectsList projects={connectedProjects} small={true} />
      </div>
    {/if}
  {/await}
</div>
