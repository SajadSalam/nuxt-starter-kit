<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Current selected date
const selectedDate = ref(new Date())

// Format month name based on locale
const formattedMonth = computed(() => {
  const options = { month: 'long' as const }
  return selectedDate.value.toLocaleString(locale.value === 'ar' ? 'ar-SA' : 'en-US', options)
})

// Format year
const formattedYear = computed(() => {
  return selectedDate.value.getFullYear()
})

// Navigate to previous month
const goToPreviousMonth = () => {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1)
}

// Navigate to next month
const goToNextMonth = () => {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1)
}

// Emit selected date for parent component
const emit = defineEmits<{
  dateChanged: [date: Date]
}>()

// Watch for date changes and emit to parent
watch(selectedDate, (newDate) => {
  emit('dateChanged', newDate)
}, { immediate: true })
</script>

<template>
  <div class="p-1 px-2 bg-[linear-gradient(180deg,_#24283E_0%,_#000_100%)] rounded-lg flex text-center items-center gap-2 text-white">
    <!-- Previous Month Arrow -->
    <div 
      class="flex items-center justify-center bg-white bg-op-20 rounded-lg p-2 cursor-pointer hover:bg-op-30 transition-colors"
      @click="goToPreviousMonth"
    >
      <Icon 
        :name="locale === 'ar' ? 'lucide:chevron-right' : 'lucide:chevron-left'" 
        size="18"
      />
    </div>
    
    <!-- Date Display -->
    <div class="flex items-center text-center gap-2">
      <Icon name="solar:calendar-outline" size="18" />
      <span class="text-sm">
        {{ formattedYear }} | {{ formattedMonth }}
      </span>
    </div>
    
    <!-- Next Month Arrow -->
    <div 
      class="flex items-center justify-center bg-white bg-op-20 rounded-lg p-2 cursor-pointer hover:bg-op-30 transition-colors"
      @click="goToNextMonth"
    >
      <Icon 
        :name="locale === 'ar' ? 'lucide:chevron-left' : 'lucide:chevron-right'" 
        size="18"
      />
    </div>
  </div>
</template> 