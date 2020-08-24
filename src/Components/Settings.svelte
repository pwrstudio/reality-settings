<script>
  import { links } from 'svelte-routing'
  import random from 'lodash/random'
  import has from 'lodash/has'
  import shuffle from 'lodash/shuffle'
  import flatMap from 'lodash/flatMap'

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText,
  } from '../sanity.js'

  let heat = 50
  let size = 50
  let friction = 30
  let seed = random(0, 10000)
</script>

<style lang="scss">
  .settings {
    font-size: 32px;
    padding: 20px;

    .header {
      margin-bottom: 40px;
    }

    .parameter {
      margin-bottom: 40px;
      .label {
        width: 200px;
        background: red;
        display: inline-block;
      }

      input {
        width: calc(90% - 320px);
        display: inline-block;
      }

      .preview {
        width: 120px;
        background: red;
        display: inline-block;
      }
    }

    .run {
      font-size: 32px;
      cursor: pointer;
      outline: 0;
      border: 0;
      background: white;
      text-decoration: none;
      color: #222222;
      padding: 10px 40px;
      margin-top: 40px;
      width: 300px;
      display: block;
      text-align: center;

      &:hover {
        background: lightgray;
      }
    }
  }

  // Styling Cross-Browser Compatible Range Inputs with Sass
  // Github: https://github.com/darlanrod/input-range-sass
  // Author: Darlan Rod https://github.com/darlanrod
  // Version 1.5.2
  // MIT License

  $track-color: #ffffff !default;
  $thumb-color: #ff0000 !default;

  $thumb-radius: 0px !default;
  $thumb-height: 40px !default;
  $thumb-width: 20px !default;
  $thumb-shadow-size: 0px !default;
  $thumb-shadow-blur: 0px !default;
  $thumb-shadow-color: rgba(0, 0, 0, 0) !default;
  $thumb-border-width: 0px !default;
  $thumb-border-color: #eceff1 !default;

  $track-width: 100% !default;
  $track-height: 10px !default;
  $track-shadow-size: 0px !default;
  $track-shadow-blur: 0px !default;
  $track-shadow-color: rgba(0, 0, 0, 0) !default;
  $track-border-width: 0px !default;
  $track-border-color: #cfd8dc !default;

  $track-radius: 0px !default;
  $contrast: 5% !default;

  $ie-bottom-track-color: darken($track-color, $contrast) !default;

  @mixin shadow($shadow-size, $shadow-blur, $shadow-color) {
    box-shadow: $shadow-size $shadow-size $shadow-blur $shadow-color,
      0 0 $shadow-size lighten($shadow-color, 5%);
  }

  @mixin track {
    cursor: default;
    height: $track-height;
    transition: all 0.2s ease;
    width: $track-width;
  }

  @mixin thumb {
    // @include shadow(
    //   $thumb-shadow-size,
    //   $thumb-shadow-blur,
    //   $thumb-shadow-color
    // );
    background: $thumb-color;
    border: $thumb-border-width solid $thumb-border-color;
    border-radius: $thumb-radius;
    box-sizing: border-box;
    cursor: default;
    height: $thumb-height;
    width: $thumb-width;
  }

  [type='range'] {
    -webkit-appearance: none;
    background: transparent;
    margin: $thumb-height / 2 0;
    width: $track-width;

    &::-moz-focus-outer {
      border: 0;
    }

    &:focus {
      outline: 0;

      &::-webkit-slider-runnable-track {
        background: lighten($track-color, $contrast);
      }

      &::-ms-fill-lower {
        background: $track-color;
      }

      &::-ms-fill-upper {
        background: lighten($track-color, $contrast);
      }
    }

    &::-webkit-slider-runnable-track {
      @include track;
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      background: $track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: $track-radius;
    }

    &::-webkit-slider-thumb {
      @include thumb;
      -webkit-appearance: none;
      margin-top: (
        (-$track-border-width * 2 + $track-height) / 2 - $thumb-height / 2
      );
    }

    &::-moz-range-track {
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      @include track;
      background: $track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: $track-radius;
      height: $track-height / 2;
    }

    &::-moz-range-thumb {
      @include thumb;
    }

    &::-ms-track {
      @include track;
      background: transparent;
      border-color: transparent;
      border-width: ($thumb-height / 2) 0;
      color: transparent;
    }

    &::-ms-fill-lower {
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      background: $ie-bottom-track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: ($track-radius * 2);
    }

    &::-ms-fill-upper {
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      background: $track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: ($track-radius * 2);
    }

    &::-ms-thumb {
      @include thumb;
      margin-top: $track-height / 4;
    }

    &:disabled {
      &::-webkit-slider-thumb,
      &::-moz-range-thumb,
      &::-ms-thumb,
      &::-webkit-slider-runnable-track,
      &::-ms-fill-lower,
      &::-ms-fill-upper {
        cursor: not-allowed;
      }
    }
  }
</style>

<div class="settings" use:links>
  <div class="header">REALITY SETTINGS</div>
  <div class="parameter">
    <div class="label">Seed</div>
    <input min="0" max="10000" type="range" bind:value={seed} />
    <div class="preview">{seed}</div>
  </div>
  <div class="parameter">
    <div class="label">Heat</div>
    <input min="0" max="100" type="range" bind:value={heat} />
    <div class="preview">{heat}</div>
  </div>
  <div class="parameter">
    <div class="label">Repulsion</div>
    <input min="0" max="100" type="range" bind:value={size} />
    <div class="preview">{size}</div>
  </div>
  <div class="parameter">
    <div class="label">Friction</div>
    <input min="0" max="100" type="range" bind:value={friction} />
    <div class="preview">{size}</div>
  </div>
  <div class="parameter">
    <a class="run" href={'/seed/' + seed + '/heat/' + heat}>Run</a>
  </div>
</div>
