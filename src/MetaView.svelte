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

  .meta {
    margin-right: 20px;
    margin-left: 20px;
    z-index: 100;
    width: calc(100% - 40px);
    overflow: scroll;
    padding: 10px;
    height: 100vh;
    padding-bottom: 40px;
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
      line-height: 0.8em;
      // max-width: 1000px;
    }
  }
</style>

<div class="meta" in:fade use:links>
  <!-- BACK LINK -->
  <a href={'/seed/' + $globalSeed} class="back-link">&#x2039&#x2039&#x2039 BACK</a>

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

  <!-- CONTENT => AUTHORS -->
  {#if metaPost.authors && Array.isArray(metaPost.authors)}
    {#each metaPost.authors as author (author._id)}
      <a
        href={'/author/' + get(author, 'slug.current', '')}
        class="author">{author.name}</a>
    {/each}
  {/if}
</div>
