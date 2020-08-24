<script>
  import { links } from "svelte-routing";

  import has from "lodash/has";
  import shuffle from "lodash/shuffle";
  import flatMap from "lodash/flatMap";

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText
  } from "./sanity.js";

  // COMPONENTS
  import ImageBlock from "./Components/Blocks/ImageBlock.svelte";
  import VideoBlock from "./Components/Blocks/VideoBlock.svelte";
  import AudioBlock from "./Components/Blocks/AudioBlock.svelte";
  import EmbedBlock from "./Components/Blocks/EmbedBlock.svelte";

  // VARIABLES
  let query = '*[_type == "project"]';

  // VARIABLES
  let posts = loadData(query);
  let blocks = [];
  let postsMap = {};
  let testBlocks = [];
  let keywords = [];

  posts.then(posts => {
    // console.dir(posts);
    posts.forEach(post => {
      // Add to map
      postsMap[post._id] = post;

      // Get all blocks
      post.mainContent.content.forEach(block => {
        blocks.push({
          id: post._id,
          content: block
        });
      });

      // KEYWORDS
      let children = flatMap(
        post.mainContent.content
          .filter(c => c._type == "block")
          .map(b => b.children)
      );

      // console.dir(children);

      children.forEach(c => {
        if (c.marks.length > 0 && c.marks.includes("keyword")) {
          console.dir(c);
          keywords.push(c.text);
        }
      });

      // let b = a.map(x => x);

      // console.dir(b);

      // keywords = [...keywords, ...a.filter(x => x._type === "keyword")];
    });

    testBlocks = shuffle(blocks);

    console.dir(keywords);
  });
</script>

<style lang="scss">
  h1 {
    padding: 20px;
  }

  .project {
    width: 600px;
    max-width: 100%;
    margin: 20px;
  }

  img {
    max-width: 100%;
  }

  .settings {
    background: red;
    color: yellow;
  }
</style>

<div class="project" use:links>

  <!-- {#await posts then posts}
    {#each posts as p (p._id)}
      <div>
        <a href={p.slug.current}>{p.title}</a>
      </div>
      <!-- {@html renderBlockText(p.mainContent.content)} -->
  <!-- {/each}
  {/await} -->

  <div class="settings">
    <div class="parameter">
      <div class="label">Reality Settings</div>
    </div>
    <div class="parameter">
      <div class="label">Seed</div>
      <input type="range" />
    </div>
    <div class="parameter">
      <div class="label">Heat</div>
      <input type="range" />
    </div>
    <div class="parameter">
      <div class="label">Size</div>
      <input type="range" />
    </div>
    <div class="parameter">
      <button>Run</button>
    </div>
  </div>

  {#if testBlocks}
    {#each testBlocks as block}
      <a href={postsMap[block.id].slug.current}>
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
    {/each}
  {/if}

  <!-- <div>
    <a href="arena">Arena</a>
  </div>

  <div>
    <a href="text">Text</a>
  </div> -->

</div>
