<script setup lang="ts">
const props = defineProps({
  cols: Number,
  title: {
    type: String,
    default: 'لا يوجد بيانات',
  },
  subtitle: {
    type: String,
    default: 'قم بإضافة بيانات للعرض',
  },
})
</script>

<template>
  <TairoTableRow :hoverable="false">
    <TairoTableCell class="!rounded" :colspan="props.cols">
      <BasePlaceholderPage :title="props.title" :subtitle="props.subtitle" />
    </TairoTableCell>
  </TairoTableRow>
</template>
