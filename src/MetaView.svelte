<script>
  // # # # # # # # # # # # # #
  //
  //  META VIEW
  //
  // # # # # # # # # # # # # #

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
    img {
      max-width: 100%;
    }

    .main-text {
      font-size: $font_size_normal;
      max-width: 700px;
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

<div class="meta">
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
