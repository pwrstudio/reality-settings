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
    width: 600px;
    max-width: 100%;
    margin: 20px;
  }

  img {
    max-width: 100%;
  }
</style>

<main>

  {#await post then post}
    <div class="project">
      {@html renderBlockText(post.mainContent.content)}
    </div>
  {/await}
</main>
