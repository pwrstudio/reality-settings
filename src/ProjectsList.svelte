<script>
  // # # # # # # # # # # # # #
  //
  //  PROJECTS LIST
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { fade } from "svelte/transition"
  import { links } from "svelte-routing"

  import { urlFor, loadData, renderBlockText } from "./sanity.js"

  // *** PROPS
  export let projects = []
</script>

<style lang="scss">
  @import "./variables.scss";

  .projects-list {
    position: absolute;
    top: 80px;
    height: calc(100vh - 120px);
    padding: 0;
    width: 100%;
    font-size: 12px;
    overflow: scroll;
    @include screen-size("small") {
      padding-bottom: 40px;
    }
  }

  .post {
    margin: 10px;
    margin-bottom: 10px;
    padding: 20px;
    background: #a4a4a4;
    border-radius: 10px;
    display: block;
    font-size: 12px;
    cursor: pointer;
    user-select: none;

    &:hover {
      transition: background 0.3 ease-out;
      text-decoration: none;
      background: #949494;
    }

    .title {
      // max-width: 240px;
      font-size: 32px;
      line-height: 1em;
      font-family: "five", "helvetica", Arial, "Akkurat-Mono", monospace;
    }

    .authors {
      margin-top: 1em;
      margin-bottom: 1em;
      .author {
        display: inline-block;
        background: lightgray;
        padding: 10px;
        border-radius: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }

    .image {
      img {
        max-width: 100%;
        max-height: 340px;
      }
    }
  }
</style>

<div class="projects-list" use:links>
  {#each projects as post, index (post._id)}
    <a
      href={'/projects/' + post.slug.current}
      class="post"
      in:fade={{ delay: 40 * index, duration: 200 }}>
      <div class="title">{post.title}</div>
      {#if post.authors && Array.isArray(post.authors)}
        <div class="authors">
          {#each post.authors as author}
            <div class="author">{author.name}</div>
          {/each}
        </div>
      {/if}
      {#if post.mainImage}
        <div class="image">
          <img
            src={urlFor(post.mainImage)
              .width(800)
              .quality(90)
              .auto('format')
              .url()} />
        </div>
      {/if}
    </a>
  {/each}
</div>
