<script>
  import { urlFor, loadData, renderBlockText } from "./sanity.js";

  export let slug = "";

  // VARIABLES
  let query = "*[slug.current == $slug][0]";

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
    max-width: 1000px;
  }

  .project {
    width: calc(100% - 40px);
    margin-right: 20px;
    margin-left: 20px;
    /* padding-top: 20px; */
  }

  img {
    max-width: 100%;
  }

  .main-text {
    font-size: 16px;
    max-width: 700px;

    /* font-family: "times new roman", times, serif; */
  }

  .author {
    font-size: 16px;
    margin-bottom: 40px;

    /* font-family: "times new roman", times, serif; */
  }
</style>

<main>
  <div class="project">
    {#await post then post}
      <h1>{post.name}</h1>
    {/await}
  </div>

</main>
