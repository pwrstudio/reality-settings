<script>
  import { links } from 'svelte-routing'
  import { fade } from 'svelte/transition'

  import has from 'lodash/has'
  import shuffle from 'lodash/shuffle'
  import flatMap from 'lodash/flatMap'

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText,
  } from './sanity.js'

  // STORES
  import { running, globalSeed, globalHeat, generation } from './stores.js'

  // PROPS
  export let seed = false
  export let heat = false
  export let start = false

  // COMPONENTS
  import ImageBlock from './Components/Blocks/ImageBlock.svelte'
  import VideoBlock from './Components/Blocks/VideoBlock.svelte'
  import AudioBlock from './Components/Blocks/AudioBlock.svelte'
  import EmbedBlock from './Components/Blocks/EmbedBlock.svelte'
  import Settings from './Components/Settings.svelte'
  import Molecule from './Components/Molecule.svelte'
  import Ball from './Components/Ball.svelte'

  // CONSTANTS
  const query = '*[_type == "project"]'

  // VARIABLES
  let posts = loadData(query)
  let blocks = []
  let testBlocks = []
  let postsMap = {}
  let keywords = []

  // $: {
    if(start) {
      running.set(true)
      globalSeed.set(seed)
      globalHeat.set(heat)
    }
  // }

  posts.then((posts) => {
    // console.dir(posts);
    posts.forEach((post) => {
      // Add to map
      postsMap[post._id] = post

      // Get all blocks
      post.mainContent.content.forEach((block) => {
        // console.log(singleToPlainText(block).length)
        if (block._type !== 'block' || singleToPlainText(block).length > 0) {
          blocks.push({
            id: post._id,
            content: block,
          })
        }
      })

      // KEYWORDS
      let children = flatMap(
        post.mainContent.content
          .filter((c) => c._type == 'block')
          .map((b) => b.children)
      )

      // console.dir(children);

      children.forEach((c) => {
        if (c.marks.length > 0 && c.marks.includes('keyword')) {
          // console.dir(c)
          keywords.push(c.text)
        }
      })

      // let b = a.map(x => x);

      // console.dir(b);

      // keywords = [...keywords, ...a.filter(x => x._type === "keyword")];
    })

    testBlocks = shuffle(blocks)

    // console.dir(keywords)
  })
</script>

<style lang="scss">
  .landing {
    width: 900px;
    max-width: 100%;
    margin: 20px;
    margin-right: auto;
    margin-left: auto;
  }

  h1 {
    padding: 20px;
  }

  img {
    max-width: 100%;
  }

  .settings {
    background: red;
    color: yellow;
  }
</style>

{#if !seed && !heat}
  <Settings />
{:else}
  <div class="landing" use:links>

    {#if testBlocks}
      {#each testBlocks as block}
        <!-- {singleToPlainText(block.content).length} -->
        <Molecule {block} post={postsMap[block.id]} />
      {/each}
    {/if}

    <!-- <div>
    <a href="arena">Arena</a>
  </div>

  <div>
    <a href="text">Text</a>
  </div> -->

  </div>

{/if}