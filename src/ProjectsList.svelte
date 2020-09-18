<script>
  // # # # # # # # # # # # # #
  //
  //  PROJECTS LIST
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { fade } from "svelte/transition"
  import { links } from "svelte-routing"

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
      font-size: 26px;
      line-height: 1em;
      font-family: "five", "helvetica", Arial, "Akkurat-Mono", monospace;
    }

    .authors {
      margin-top: 0.5em;
    }
  }
</style>

<div class="projects-list" use:links>
  {#each projects as post, index (post._id)}
    <a
      href={'/projects/' + post.slug.current}
      class="post"
      in:fade={{ delay: 40 * index }}>
      <div class="title">{post.title}</div>
      <div class="authors">
        {#if post.authors && Array.isArray(post.authors)}
          {#each post.authors as author}
            <div class="author">{author.name}</div>
          {/each}
        {/if}
      </div>
    </a>
  {/each}
</div>
