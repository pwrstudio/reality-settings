<script>
  // # # # # # # # # # # # # #
  //
  //  PROJECT VIEW
  //
  // # # # # # # # # # # # # #

  import { fade } from "svelte/transition"
  import get from "lodash/get"

  import { urlFor, renderBlockText, singleToPlainText } from "./sanity.js"

  // *** COMPONENTS
  import MetaData from "./MetaData.svelte"

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
    font-size: $font-size-small;
    display: inline-block;
    background: orangered;
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 5px;
    // margin-bottom: 20px;

    &:hover {
      background: $white;
      text-decoration: none;
    }
  }

  .project {
    img {
      max-width: 100%;
      @include screen-size("small") {
        max-height: 80vh;
      }
    }

    .author {
      display: inline-block;
      background: lightgrey;
      padding: 10px;
      border-radius: 5px;
      font-size: $font-size-normal;
      margin-right: 10px;
      margin-bottom: 10px;

      &:hover {
        background: $white;
        text-decoration: none;
      }

      @include screen-size("small") {
        font-size: $font-size-normal;
      }
    }

    .main-text {
      font-size: $font_size_normal;
      max-width: 700px;
      width: 100%;
      margin-top: 30px;
    }

    h1 {
      @include big-title;
      margin-top: 20px;
    }
  }
</style>

<MetaData post={projectPost} />

<div class="project">
  <!-- CATEGORIES -->
  {#if projectPost.categories && Array.isArray(projectPost.categories)}
    {#each projectPost.categories as category (category._key)}
      <a href={'/categories/' + category} class="category">{category}</a>
    {/each}
  {/if}

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
