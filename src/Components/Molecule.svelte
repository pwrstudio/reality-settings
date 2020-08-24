<script>
  import { links } from 'svelte-routing'
  import random from 'lodash/random'
  import { fly } from 'svelte/transition'

  import { renderBlockText } from '../sanity.js'

  // PROPS
  export let block = {}
  export let post = {}

  // COMPONENTS
  import ImageBlock from './Blocks/ImageBlock.svelte'
  import VideoBlock from './Blocks/VideoBlock.svelte'
  import AudioBlock from './Blocks/AudioBlock.svelte'
  import EmbedBlock from './Blocks/EmbedBlock.svelte'

  console.log(block)
</script>

<style lang="scss">
  .molecule {
    width: 1400px;
    max-width: 95%;
    overflow: hidden;
    padding: 10px;

    .info {
      font-size: 12px;
      padding: 5px;
      color: #222222;
      background: rgb(255, 255, 161);
      display: inline-block;
    }
  }
</style>

<!-- style={'top:' + random(50, 4500) + 'px; left:' + random(50, 4500) + 'px;'} -->
<div class="molecule" in:fly={{ y: 400 }}>
  <a href={'/' + post.slug.current}>
    <div class="info">{post.title}</div>
    {#if block.content._type === 'block'}
      {@html renderBlockText(block.content)}
    {/if}
    {#if block.content._type === 'imageBlock'}
      <ImageBlock block={block.content} />
    {/if}
    {#if block.content._type === 'videoBlock'}
      <VideoBlock block={block.content} />
    {/if}
    {#if block.content._type === 'audioBlock'}
      <AudioBlock block={block.content} />
    {/if}
    {#if block.content._type === 'embedBlock'}
      <EmbedBlock block={block.content} />
    {/if}
  </a>
</div>
