<script>
  // # # # # # # # # # # # # #
  //
  //  PROJECTS LIST
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { fade } from "svelte/transition"
  import { quartOut } from "svelte/easing"
  import { links } from "svelte-routing"

  import { urlFor, loadData } from "./sanity.js"

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
    padding-bottom: 3px;
    display: block;
    cursor: pointer;
    user-select: none;
    background: $grey;

    &:hover {
      transition: background 0.3 ease-out;
      text-decoration: none;
      background: $white;
      // border: 3px solid $white;
    }

    &.active {
      background: $off-white;
      // border: 3px solid orangered;
      // &:hover {
      //   border: 3px solid orangered;
      // }
    }

    .title {
      @include medium-title;
    }

    .authors {
      margin-top: 10px;
      margin-bottom: 10px;
      .author {
        font-size: $font-size-small;
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
      padding-bottom: 15px;
      justify-content: space-between;
      .image {
        float: right;
        img {
          max-height: 180px;
        }
      }
      .title {
        margin-right: 40px;
        font-size: $font_size_normal;
        line-height: 1em;
        font-family: "Akkurat-Mono", monospace;
        -webkit-text-stroke-width: 0px;
        letter-spacing: 0px;
        word-spacing: 0;
      }
    }
  }

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
</style>

{#each projects as post, index (post._id)}
  <a
    href={'/projects/' + post.slug.current}
    class="post"
    class:small
    class:active={slug === post.slug.current}
    in:fade={{ delay: 80 * index, duration: 300, easing: quartOut }}>
    <div>
      <!-- CATEGORIES -->
      {#if small & post.categories && Array.isArray(post.categories)}
        {#each post.categories as category (category._key)}
          <a href={'/categories/' + category} class="category">{category}</a>
        {/each}
      {/if}
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
