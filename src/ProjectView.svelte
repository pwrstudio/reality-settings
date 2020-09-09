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

  // BLOCKS
  import ImageBlock from './Components/Blocks/ImageBlock.svelte'
  import VideoBlock from './Components/Blocks/VideoBlock.svelte'
  import AudioBlock from './Components/Blocks/AudioBlock.svelte'
  import EmbedBlock from './Components/Blocks/EmbedBlock.svelte'

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
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0px;
    width: calc(100% - 440px);
    overflow: scroll;
    padding: 10px;
    height: 100vh;
    background: grey;

    @include screen-size('small') {
        margin-right: 0px;
        margin-left: 0px;
        width: calc(100vw - 20px);
        height: 100vh;
        left:0;
        top: 0;
      }

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
      line-height: 1em;
      margin-bottom: 40px;
      max-width: 80%;
      margin-top: 20px;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: #222222;

    @include screen-size('small') {
      hyphens: auto;
      font-size: 46px;
      max-width: 100%;
      }

    }
  }
</style>

<div class="project" in:fade use:links>
  <!-- BACK LINK -->
  <a href={'/seed/' + $globalSeed} class="back-link">&#x2039&#x2039&#x2039 BACK</a>

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
  </div>
</div>
