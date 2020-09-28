<script>
  // # # # # # # # # # # # # #
  //
  //  METADATA
  //
  // # # # # # # # # # # # # #
  // _lodash
  import get from "lodash/get"
  import has from "lodash/has"
  import isArray from "lodash/isArray"
  import isEmpty from "lodash/isEmpty"
  import truncate from "lodash/truncate"

  // *** STORES
  import { toPlainText, urlFor } from "./sanity.js"

  // *** PROPS
  export let post = {}

  console.dir(post)

  const stripHtml = (html) => {
    let tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const defaultDescription =
    "The Reality Settings COOP at the Dutch Art Institute took place in 2019-20, at a time when science fiction became our realism."

  const title =
    (has(post, "title") && !isEmpty(post.title)
      ? stripHtml(post.title) + " | "
      : "") + "REALITY.SETTINGS"

  const description =
    has(post, "mainContent.content") &&
    isArray(post.mainContent.content) &&
    !isEmpty(post.mainContent.content)
      ? truncate(toPlainText(post.mainContent.content), {
          length: 160,
          separator: /.? +/,
        })
      : defaultDescription

  const image =
    has(post, "mainImage") && post.mainImage
      ? urlFor(post.mainImage).quality(80).height(800).width(800).url()
      : "https://reality.codes/default.jpg"
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta property="twitter:title" content={title} />
  <meta property="description" content={description} />
  <meta property="og:description" content={description} />
  <meta property="twitter:description" content={description} />
  <meta property="image" content={image} />
  <meta property="og:image" content={image} />
  <meta property="twitter:image" content={image} />
</svelte:head>
