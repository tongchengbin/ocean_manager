<script lang="ts" setup>
import { h, onMounted, ref, useSlots } from "vue";

defineOptions({
  name: "ReText"
});

const props = defineProps({
  // 行数
  lineClamp: {
    type: [String, Number]
  }
});

const $slots = useSlots();
const textRef = ref();
const showTooltip = ref(false);

const isTextEllipsis = (el: HTMLElement) => {
  if (!props.lineClamp) {
    // 单行省略判断
    return el.scrollWidth > el.clientWidth;
  } else {
    // 多行省略判断
    return el.scrollHeight > el.clientHeight;
  }
};

function handleMouseEnter(event: MouseEvent) {
  if (isTextEllipsis(event.target as HTMLElement)) {
    showTooltip.value = true;
  }
}

function handleMouseLeave() {
  showTooltip.value = false;
}
</script>

<template>
  <el-tooltip
    :disabled="!showTooltip"
    :content="$slots.default?.()?.[0]?.children"
    :show-after="100"
  >
    <el-text
      v-bind="{
        truncated: !lineClamp,
        lineClamp,
        ...$attrs
      }"
      ref="textRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot />
    </el-text>
  </el-tooltip>
</template>
