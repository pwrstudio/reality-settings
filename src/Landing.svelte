<script>
  import { links } from "svelte-routing";
  import { fade } from "svelte/transition";

  import has from "lodash/has";
  import shuffle from "lodash/shuffle";
  import flatMap from "lodash/flatMap";
  import Markov from "markov-strings";
  import { v4 as uuidv4 } from "uuid";

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText
  } from "./sanity.js";

  // STORES
  import { running, globalSeed, globalHeat, generation } from "./stores.js";

  // PROPS
  export let seed = false;
  export let heat = false;
  export let start = false;

  // COMPONENTS
  import ImageBlock from "./Components/Blocks/ImageBlock.svelte";
  import VideoBlock from "./Components/Blocks/VideoBlock.svelte";
  import AudioBlock from "./Components/Blocks/AudioBlock.svelte";
  import EmbedBlock from "./Components/Blocks/EmbedBlock.svelte";
  import Settings from "./Components/Settings.svelte";
  import Molecule from "./Components/Molecule.svelte";
  import Ball from "./Components/Ball.svelte";

  // CONSTANTS
  const query = '*[_type == "project"]';

  // VARIABLES
  let posts = loadData(query);
  let blocks = [];
  let testBlocks = [];
  let currentBlocks = [];
  let postsMap = {};
  let keywords = [];
  let allTextOnly = "";
  let markovMaterial = [];
  let landingContainerEl = {};

  let allSentences = [];

  $: {
    // if (currentBlocks) {
    //   setTimeout(() => {
    //     landingContainerEl.scrollTo({
    //       top: landingContainerEl.scrollHeight,
    //       left: 0,
    //       behavior: "smooth"
    //     });
    //   }, 100);
    // }
  }

  // $: {
  if (start) {
    running.set(true);
    globalSeed.set(seed);
    globalHeat.set(heat);
  }
  // }

  posts.then(posts => {
    // console.dir(posts);
    posts.forEach(post => {
      // Add to map
      postsMap[post._id] = post;

      if (toPlainText(post.mainContent.content).length > 10) {
        allTextOnly =
          allTextOnly +
          toPlainText(post.mainContent.content)
            .replace(/\r?\n|\r/g, " ")
            .trim();
      }

      // console.log(toPlainText(post.mainContent.content));
      console.log(post.title);
      // console.log(allTextOnly);

      let sentences = allTextOnly.match(/[^\.!\?]+[\.!\?]+/g);

      if (sentences) {
        sentences = sentences.map(s => {
          return { text: s.trim(), title: post.title, slug: post.slug.current };
        });
        console.dir(sentences);

        allSentences = [...allSentences, ...sentences];
      }

      // Get all blocks
      post.mainContent.content.forEach(block => {
        // console.log(singleToPlainText(block).length)
        if (block._type !== "block" || singleToPlainText(block).length > 0) {
          blocks.push({
            id: post._id,
            uid: uuidv4(),
            content: block
          });
        }
        // if (block._type == "block") {
        //   console.dir(block);
        // }
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
          // console.dir(c)
          keywords.push(c.text);
        }
      });

      // let b = a.map(x => x);

      // console.dir(b);

      // keywords = [...keywords, ...a.filter(x => x._type === "keyword")];
    });

    console.dir(allSentences);

    // console.log("textonly");
    // console.log(allTextOnly);

    // markovMaterial = allTextOnly
    //   .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    //   .split("|");

    // console.dir(markovMaterial);

    // Build the Markov generator
    // const markov = new Markov(markovMaterial, { stateSize: 2 });
    // markov.buildCorpus();

    // const options = {
    //   maxTries: 500,
    //   filter: result => {
    //     // result.string.split(" ").length >= 5 &&
    //     return result.score > 10; // At least 5 words // End sentences with a dot.
    //   }
    // };

    // let result = [];
    // for (let i = 0; i < 50; i++) {
    //   let newMarkov = { ...markov.generate(options), uid: uuidv4() };
    //   result.push(newMarkov);
    // }

    // console.dir(result);

    testBlocks = shuffle(blocks);
    // allSentences = shuffle(allSentences);

    // currentBlocks.push(testBlocks.pop());
    currentBlocks = testBlocks;

    // setInterval(() => {
    //   currentBlocks.push(testBlocks.pop());
    //   currentBlocks = currentBlocks;
    // }, 5000);

    // console.dir(testBlocks);

    // console.dir(keywords)
  });
</script>

<style lang="scss">
  @import "./variables.scss";

  .landing {
    box-sizing: border-box;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    padding-right: 10%;
    padding-left: 10%;
    overflow-y: scroll;
    padding-bottom: 25vh;

    @include hide-scroll;
  }

  h1 {
    padding: 20px;
  }

  img {
    max-width: 100%;
  }

  .markov {
    width: 1400px;
    max-width: 95%;
    overflow: hidden;
    padding: 10px;
  }

  .markov .info {
    font-size: 12px;
    padding: 5px;
    color: #222222;
    background: rgb(255, 255, 161);
    display: inline-block;
  }
</style>

{#if !seed}
  <Settings />
{:else}
  <div class="landing" use:links bind:this={landingContainerEl}>

    {#await posts then posts}
      {#each posts as project, index}
        <Ball {index} {project} />
      {/each}
    {/await}

    {#each currentBlocks as block (block.uid)}
      <!-- {singleToPlainText(block.content).length} -->
      {#if block.string}
        <div class="markov">
          <div class="info">markov-gen. score: {block.score}</div>
          <div>{block.string}</div>
        </div>
      {:else}
        <Molecule {block} post={postsMap[block.id]} />
      {/if}
    {/each}

    <!-- <div>
    <a href="arena">Arena</a>
  </div>

  <div>
    <a href="text">Text</a>
  </div> -->

  </div>
{/if}
