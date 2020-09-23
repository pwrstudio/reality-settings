<script>
  // # # # # # # # # # # # # #
  //
  //  PROJECT VIEW
  //
  // # # # # # # # # # # # # #

  import { onMount } from "svelte"
  import { links } from "svelte-routing"
  import { fade } from "svelte/transition"
  import get from "lodash/get"

  import { urlFor, renderBlockText, singleToPlainText } from "./sanity.js"

  // BLOCKS
  import ImageBlock from "./Components/Blocks/ImageBlock.svelte"
  import VideoBlock from "./Components/Blocks/VideoBlock.svelte"
  import AudioBlock from "./Components/Blocks/AudioBlock.svelte"
  import EmbedBlock from "./Components/Blocks/EmbedBlock.svelte"

  // STORES
  import { globalSeed } from "./stores.js"

  // PROPS
  export let projectPost = {}

  console.dir(projectPost)
</script>

<style lang="scss">
  @import "./variables.scss";

  .category {
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

  .project {
    width: 100%;
    overflow: scroll;
    padding-top: 10px;
    padding-bottom: 80px;
    padding-left: 20px;
    padding-right: 20px;
    height: 100vh;
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

    img {
      max-width: 100%;
    }

    .author {
      display: inline-block;
      background: lightgrey;
      padding: 10px;
      border-radius: 5px;
      font-size: 1em;
      margin-right: 10px;
      margin-bottom: 10px;

      &:hover {
        background: white;
        text-decoration: none;
      }

      @include screen-size("small") {
        font-size: 22px;
      }
    }

    .main-text {
      font-size: 16px;
      max-width: 700px;
      width: 100%;
      margin-top: 30px;
    }

    h1 {
      /* padding: 20px 0px; */
      font-family: "five", "Akkurat-Mono", monospace;
      font-size: 72px;
      font-weight: normal;
      line-height: 0.9em;
      margin-bottom: 20px;
      max-width: 90%;
      margin-top: 20px;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: $black;
      letter-spacing: -1px;
      word-spacing: -10px;

      @include screen-size("small") {
        hyphens: auto;
        font-size: 46px;
        max-width: 100%;
        -webkit-text-stroke-width: 3px;
      }
    }
  }
</style>

<div class="project" in:fade use:links>
  <!-- CATEGORIES -->
  <div class="category">Embodied</div>

  <!-- CONTENT => TITLE -->
  <h1>{projectPost.title}</h1>

  <!-- CONTENT => AUTHORS -->
  {#if projectPost.authors && Array.isArray(projectPost.authors)}
    {#each projectPost.authors as author (author._id)}
      <a
        href={'/authors/' + get(author, 'slug.current', '')}
        class="author">{author.name}</a>
    {/each}
  {/if}

  <!-- CONTENT => MAIN CONTENT -->
  <div class="main-text">
    {#if get(projectPost, 'mainContent.content', false) && Array.isArray(projectPost.mainContent.content)}
      {#each projectPost.mainContent.content as block}
        {#if block._type === 'block'}
          {@html renderBlockText(block)}
        {/if}
        {#if block._type === 'imageBlock'}
          <ImageBlock {block} />
        {/if}
        {#if block._type === 'videoBlock'}
          <VideoBlock {block} />
        {/if}
        {#if block._type === 'audioBlock'}
          <AudioBlock {block} />
        {/if}
        {#if block._type === 'embedBlock'}
          <EmbedBlock {block} />
        {/if}
      {/each}
    {/if}
  </div>
</div>
