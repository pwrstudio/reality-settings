<script>
  import { urlFor, loadData, renderBlockText } from "./sanity.js";

  export let slug = "";

  // VARIABLES
  let query = "*[slug.current == $slug][0]";

  console.log(slug);

  // VARIABLES
  let post = loadData(query, { slug: slug });
</script>

<style>
  h1 {
    padding: 20px;
  }

  .project {
    width: 900px;
    max-width: 100%;
    margin: 20px;
    margin-right: auto;
    margin-left: auto;
  }

  img {
    max-width: 100%;
  }
</style>

<main>
  <div class="project">
    {#await post then post}
      {@html renderBlockText(post.mainContent.content)}
    {/await}
  </div>

</main>
