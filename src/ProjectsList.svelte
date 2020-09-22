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
  export let small = false
  export let slug = ""
</script>

<style lang="scss">
  @import "./variables.scss";

  .post {
    margin-top: 0px;
    margin-bottom: 3px;
    padding: 15px;
    padding-bottom: 0;
    // border-radius: 20px;
    display: block;
    cursor: pointer;
    user-select: none;
    background: #949494;
    border: 3px solid #949494;

    &:hover {
      transition: background 0.3 ease-out;
      text-decoration: none;
      background: $white;
      border: 3px solid $white;
    }

    &.active {
      border: 3px solid orangered;
      &:hover {
        border: 3px solid orangered;
      }
    }

    .title {
      color: $black;
      font-size: 48px;
      line-height: 0.95em;
      font-family: "five", "helvetica", Arial, "Akkurat-Mono", monospace;
      -webkit-text-stroke-width: 3px;
      -webkit-text-stroke-color: $black;
      letter-spacing: -1px;
    }

    .authors {
      margin-top: 10px;
      margin-bottom: 10px;
      .author {
        font-size: 12px;

        display: inline-block;
        background: darkgrey;
        padding: 10px;
        border-radius: 3px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }

    .image {
      img {
        display: block;
        margin-right: auto;
        margin-left: auto;
        max-width: 90%;
        max-height: 240px;
      }
    }

    &.small {
      display: flex;
      width: 100%;
      max-width: 700px;
      justify-content: space-between;
      .image {
        float: right;
        img {
          max-height: 180px;
        }
      }
      .title {
        // max-width: 240px;
        margin-right: 40px;
        font-size: 16px;
        line-height: 1em;
        font-family: "Akkurat-Mono", monospace;
        -webkit-text-stroke-width: 0px;
        letter-spacing: 0px;
      }
    }
  }
</style>

<div in:fade={{ duration: 200 }}>
  {#each projects as post, index (post._id)}
    <a
      href={'/projects/' + post.slug.current}
      class="post"
      class:small
      class:active={slug === post.slug.current}>
      <div>
        <div class="title">{post.title}</div>
        {#if post.authors && Array.isArray(post.authors)}
          <div class="authors">
            {#each post.authors as author}
              <div class="author">{author.name}</div>
            {/each}
          </div>
        {/if}
      </div>
      {#if post.mainImage && small}
        <div class="image">
          <img
            src={urlFor(post.mainImage)
              .width(400)
              .quality(90)
              .auto('format')
              .url()} />
        </div>
      {/if}
    </a>
  {/each}
</div>
