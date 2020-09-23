<script>
  // # # # # # # # # # # # # #
  //
  //  META VIEW
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
  export let metaPost = {}

  console.dir(metaPost)
</script>

<style lang="scss">
  @import "./variables.scss";

  .meta {
    z-index: 100;
    width: 100%;
    overflow: scroll;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 80px;
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
      line-height: 0.9em;
      margin-bottom: 20px;
      max-width: 90%;
      margin-top: 20px;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: $black;

      @include screen-size("small") {
        hyphens: auto;
        font-size: 46px;
        max-width: 100%;
        -webkit-text-stroke-width: 3px;
      }
    }
  }
</style>

<div class="meta" in:fade use:links>
  <!-- CONTENT => MAIN CONTENT -->
  <div class="main-text">
    <!-- CONTENT => TITLE -->
    <h1>Reality Settings</h1>
    <!-- CONTENT => MAIN CONTENT -->

    <div class="main-text">
      {#each metaPost.mainContent.content as block}
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
    </div>
  </div>

  <!-- CONTENT => AUTHORS -->
  {#if metaPost.authors && Array.isArray(metaPost.authors)}
    {#each metaPost.authors as author (author._id)}
      <a
        href={'/author/' + get(author, 'slug.current', '')}
        class="author">{author.name}</a>
    {/each}
  {/if}
</div>
