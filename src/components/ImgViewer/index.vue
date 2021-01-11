<template>
  <div>
    <img @click="maxImg" class="image" :src="src">
    <div v-show="show" class="viewer-backdrop viewer-container">
      <div class="viewer-canvas" @click="show=false">
        <h1>sdfsdf</h1>
        <img :src="src">
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name:"imgView",
    props: {
    src: {
        type:String,
        default:""
    }
  },
  data() {
    return {
        show:false,
        loading: false,
        excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
      maxImg() {
          this.show=true
      }
  },
    created() {
        console.log('create',this.src)
    }
}
</script>

<style scoped>
  .viewer-container {
    bottom: 0;
    direction: ltr;
    font-size: 0;
    left: 0;
    line-height: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    -webkit-tap-highlight-color: transparent;
    top: 0;
    -webkit-touch-callout: none;
    -ms-touch-action: none;
    touch-action: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .viewer-canvas{
    bottom: 0;
    left: 0;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
  }
  .image{
    width: 100%;
  }
  .viewer-backdrop {
    z-index: 99999;
    background-color: rgba(0,0,0,.5);
  }
</style>
