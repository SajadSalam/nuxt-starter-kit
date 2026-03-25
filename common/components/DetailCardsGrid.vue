<script setup lang="ts">
export interface DetailCardItem {
  label: string
  value: string | number
  valueClass?: string
  badgeVariant?: 'success' | 'danger'
}

export interface DetailCard {
  title: string
  icon: string
  iconColor?: 'primary' | 'emerald' | 'amber' | 'blue'
  items: DetailCardItem[]
}

const props = defineProps<{
  cards: DetailCard[]
}>()

const badgeVariantClasses: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="(card, index) in props.cards"
      :key="index"
      class="bg-white dark:bg-muted-800 rounded-2xl border border-muted-200 dark:border-muted-700 p-5"
    >
      <div class="flex items-center gap-2 mb-4">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30"
        >
          <Icon :name="card.icon" class="size-5 text-blue-500" />
        </div>
        <h3 class="font-semibold text-muted-800 dark:text-white">
          {{ card.title }}
        </h3>
      </div>
      <div class="space-y-3">
        <div
          v-for="(item, itemIndex) in card.items"
          :key="itemIndex"
          class="flex justify-between items-center"
          :class="{ 'items-center': item.badgeVariant }"
        >
          <span class="text-sm text-muted-500">{{ item.label }}</span>
          <span
            v-if="item.badgeVariant"
            class="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-0.5 rounded-full"
            :class="badgeVariantClasses[item.badgeVariant]"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="item.badgeVariant === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
            />
            {{ item.value }}
          </span>
          <span
            v-else
            class="text-sm font-medium text-muted-800 dark:text-muted-200"
            :class="item.valueClass"
          >
            {{ (item.value != null && item.value !== '') ? item.value : '—' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
