<script setup lang="ts">
import DeleteModal from './components/DeleteModal.vue'
import { useAppCrudStore } from './store/AppCrudStore'
interface Props {
  title?: string
  addButtonText?: string
  description?: string
  pagination?: boolean
  totalPages?: number
  hideCreate?: boolean
  addBtnAction?: () => void
}
const props = defineProps<Props>()

const emits = defineEmits(['update:currentPage'])
const pagination = computed(() => props.pagination)
const appCrudStore = useAppCrudStore()
const route = useRoute()
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.pageNumber as string) || 1
  } catch {
    return 1
  }
})
watch(currentPage, (val) => {
  emits('update:currentPage', val)
})
const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]
const isFiltersOpen = ref(false)    
</script>
<template>
  <div class="bg-white p-5 border border shadow-md rounded-lg">
    <h1 class="text-2xl font-bold">{{ props.title }}</h1>
    <div class="p-3 flex w-full items-center justify-between rounded-lg bg-white">
    <div class="flex items-center gap-5">
      <slot name="filters" />
    </div>
    <div class="flex gap-4">
      <slot name="headerActions" />
      <BaseButtonIcon
        v-if="hasSlot('additional-filters')"
        :color="!isFiltersOpen ? 'none' : 'dark'"
        @click="isFiltersOpen = !isFiltersOpen"
      >
        <Icon name="carbon:filter-edit" size="23" />
      </BaseButtonIcon>
      <BaseButton v-if="!hideCreate" class="gap-1" color="primary" @click="addBtnAction">
        <Icon name="ph-plus-circle-duotone" size="20" />
        {{ addButtonText || 'إضافة' }}
      </BaseButton>
    </div>
  </div>
  <transition name="slide-fade">
    <div v-if="isFiltersOpen" class="p-5 my-2 rounded-lg bg-white">
      <h1 class="mb-2 text-lg font-bold">فلترة البيانات</h1>
      <slot name="additional-filters" />
    </div>
  </transition>
  <TairoContentWrapper :title="props.title ?? ''" class="mt-2">
    <slot />
    <BasePagination
      v-if="pagination && totalPages && totalPages > 1"
      v-model:current-page="currentPage"
      router-query-key="pageNumber"
      class="mt-2"
      :item-per-page="10"
      :total-items="totalPages! * 10"
      :max-links-displayed="10"
      rounded="lg"
    />
  </TairoContentWrapper>
  </div>
  <DeleteModal />
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
