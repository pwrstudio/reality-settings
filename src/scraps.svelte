
  // const transitionWorld = (index) => {
  //   if (index < WORLD_SIZE) {
  //     let temp = []
  //     for (let x = 0; x < WORLD_WIDTH; x++) {
  //       temp.push(life.board[index + x])
  //     }
  //     worldOut = [...worldOut, ...temp]
  //     window.requestAnimationFrame(() => {
  //       transitionWorld(index + WORLD_WIDTH)
  //     })
  //   } else {
  //     inSession.set(true)
  //     startWorld()
  //   }
  // }

      const resizeWorld = () => {
      if (worldEl && worldEl.style && paneEl) {
        // console.log('worldEl.clientHeight', worldEl.clientHeight)
        // console.log('worldEl.clientWidth', worldEl.clientWidth)
        // console.log('paneEl.clientHeight', paneEl.clientHeight)
        // console.log('paneEl.clientWidth', paneEl.clientWidth)
        // console.log('heightRatio', paneEl.clientHeight / worldEl.clientHeight)
        // console.log('widthRatio', paneEl.clientWidth / worldEl.clientWidth)
        let heightRatio = paneEl.clientHeight / worldEl.clientHeight
        let widthRatio = paneEl.clientWidth / worldEl.clientWidth
        let smallestRatio = heightRatio > widthRatio ? widthRatio : heightRatio
        // console.log('smallestRatio', smallestRatio)
        // console.log(typeof heightRatio)
        // console.log(typeof widthRatio)
        // console.log('heightRatio > widthRatio', heightRatio > widthRatio )
        // console.log(heightRatio , '>', widthRatio, '==', heightRatio > widthRatio )
        let roundedSmallestRatio = Math.floor(smallestRatio * 10) / 10
        // console.log('roundedSmallestRatio', roundedSmallestRatio)
        worldEl.style.transform = "scale(" + roundedSmallestRatio + ")"
      }
    }

        <!-- WORLD -->
    <!-- {#if countDownMarker}
      <div class="countdown-marker">{countDownMarker}</div>
    {/if} -->


  // $: {
  //   if (section == "project" && slug && postsArray) {
  //     stopWorld()
  //     projectPost = false
  //     setTimeout(() => {
  //       projectPost = postsArray.find((p) => p.slug.current == slug)
  //     }, 100)
  //   }
  //   if (section == "author" && slug && authorsArray) {
  //     stopWorld()
  //     console.log(slug)
  //     authorPost = false
  //     setTimeout(() => {
  //       authorPost = authorsArray.find((p) => p.slug.current == slug)
  //     }, 100)
  //   }
  //   if (meta && metaPost) {
  //     stopWorld()
  //   }
  // }

    const countDown = (i) => {
    console.log(i % 2)
    if (i === 0) {
      countDownMarker = false
      startWorld()
    } else {
      countDownMarker = $globalSeed[i]
      setTimeout(() => {
        countDown(--i)
      }, 60)
    }
  }

    // => Posts
  // let projects = loadData(QUERY.PROJECT)
  // let postsMap = {}
  // let postsArray = []
  // let projectPost = false

  // // => Authors
  // let authors = loadData(QUERY.AUTHOR)
  // let authorsArray = []
  // let authorPost = false

  // // => Meta
  // let metaData = loadData(QUERY.META)

    .project {
    width: 600px;
    max-width: 100%;
    margin: 20px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }
  .block {
    width: 300px;
    height: auto;
    background: lightgray;
    padding: 20px;
    font-size: 14px;
    margin: 20px;
  }

  .title {
    font-weight: bold;
    margin-bottom: 1em;
  }

  .description {
    word-break: break-all;
    margin-bottom: 1em;
  }

  img {
    max-width: 100%;
  }

  .Main {
    p {
      display: inline;
    }
  }

  .molecule {
    p {
      display: inline;
    }
  }