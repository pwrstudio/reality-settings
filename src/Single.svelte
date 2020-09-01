<script>
  import { AuthenticatorAssertionResponse } from "lodash/_freeGlobal";
  import { urlFor, loadData, renderBlockText } from "./sanity.js";

  export let slug = "";

  // VARIABLES
  let query = "*[slug.current == $slug][0]{...,authors[]->{...,name}}";

  // VARIABLES
  let post = loadData(query, { slug: slug });

  post.then(p => {
    // console.dir(p)
  });
</script>

<style>
  h1 {
    /* padding: 20px 0px; */
    font-family: "five", "Akkurat-Mono", monospace;
    font-size: 96px;
    font-weight: normal;
    line-height: 0.8em;
    margin-bottom: 40px;
  }

  .project {
    width: 800px;
    max-width: 100%;
    margin: 20px;
    margin-right: auto;
    margin-left: auto;
    padding-top: 40px;
  }

  img {
    max-width: 100%;
  }

  .main-text {
    font-size: 16px;

    /* font-family: "times new roman", times, serif; */
  }

  .author {
    font-size: 16px;

    /* font-family: "times new roman", times, serif; */
  }
</style>

<main>
  <div class="project">
    {#await post then post}
      <h1>{post.title}</h1>
      {#if post.authors}
        {#each post.authors as author (author._id)}
          <div class="author">{author.name}</div>
        {/each}
      {/if}
      <div class="main-text">
        {@html renderBlockText(post.mainContent.content)}
      </div>
    {/await}
  </div>

</main>
