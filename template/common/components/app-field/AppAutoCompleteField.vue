<script lang="ts" setup generic="T, TModel">
import type { ErrorObject } from '@vuelidate/core';
import { get } from 'lodash-es';
import axiosInstance from '~/common/services/app-client/axios';
export interface Props {
  items?: T[]
  itemLabel?: string
  itemValue?: string
  itemSubtitle?: string
  errors?: ErrorObject[]
  label?: string
  appendIcon?: string
  getUrl?: string
  fetchOnSearch?: boolean
  searchKey?: string
  multiple?: boolean
  modelValue?: TModel
  disabled?: boolean
  allowCreate?: boolean
  oldData?: T[]
  placeholder?: string
  selectAll?: boolean
  withoutData?: boolean
}
const anchorName = computed(() => {
  function makeid() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  return "--anchor-name-" + makeid();
});
const emits = defineEmits(['update:objectValue', 'update:modelValue', 'create:item'])
const createNewItem = () => {
  if (!search.value.trim()) return

  const newItem = {
    [props.itemLabel!]: search.value,
    [props.itemValue!]: search.value,
    isNew: true,
  } as T

  selectItem(newItem)
  emits('create:item', newItem)
}
const props = defineProps<Props>()
const error = computed(() => {
  return props.errors?.length ? props.errors.map((e) => e.$message).join(', ') : ''
})
const pageSize = 50
defineSlots<{
  item: { item: T }
}>()
const modelValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string | string[]) => {
    emits('update:modelValue', value)
  },
})
const search = ref<string>('')
const isOpen = ref(false)
// const items = ref<T[]>(props.items || [])
const itemsRef = ref<T[]>(props.items || [])
const items = computed({
  get: () => props.items || itemsRef.value || [],
  set: (value) => {
    itemsRef.value = value
  },
})
const searchKey = computed(() => props.searchKey || 'name')
const selectedItems = ref<T[]>([])
// Flag to prevent circular updates between selectedItems and modelValue watchers
const isInternalUpdate = ref(false)

function itemWithLabel(item: T): string {
  if (!item || !item[props.itemLabel! as keyof T]) return modelValue.value as string
  if (typeof item === 'string') return item
  if (
    item[props.itemLabel! as keyof T] !== undefined &&
    typeof item[props.itemLabel! as keyof T] === 'string'
  )
    return item[props.itemLabel! as keyof T] as string

  return modelValue.value as string
}
function itemWithSubtitle(item: T): string {
  if (typeof item === 'string') return item

  const val = get(item, props.itemSubtitle)
  if (val !== undefined && typeof val === 'string') return val as string

  return modelValue.value as string
}
function itemWithValue(item: T): string | number {
  if (!item || item[props.itemValue! as keyof T] === undefined) {
    return modelValue.value as string | number // Allow 0 as a valid value
  }
  if (typeof item === 'string') return item
  return item[props.itemValue! as keyof T] as string | number
}
const filteredItems = computed(() => {
  if (!props.fetchOnSearch)
    return items.value.filter((item) =>
      itemWithLabel(item as T)
        .toLowerCase()
        .includes(search.value.toLowerCase())
    )
  return items.value
})
const menu = ref(null)
function selectItem(item: T) {
  // if(props.disabled) return
  search.value = itemWithLabel(item)
  if (!props.multiple) {
    selectedItems.value = [item]
  } else {
    if (isItemSelected(item)) {
      removeItem(item)

      search.value = ''
      return
    }
    selectedItems.value.push(item)

    search.value = ''
  }
  isOpen.value = false
}
function removeItem(item: T) {
  selectedItems.value = selectedItems.value.filter((i) => i !== item)
}
watchDeep(
  () => selectedItems.value,
  () => {
    // Skip if triggered by modelValue watcher to prevent circular updates
    if (isInternalUpdate.value) return

    if (props.multiple) {
      modelValue.value = selectedItems.value.map((i) => itemWithValue(i as T))
      emits('update:objectValue', selectedItems.value)
    } else {
      if (selectedItems.value.length === 0) {
        modelValue.value = ''
        emits('update:objectValue', null)
        return
      }

      modelValue.value = itemWithValue(selectedItems.value[0] as T)

      emits('update:objectValue', selectedItems.value[0])
    }
  }
)

// Watch for external modelValue changes and sync to selectedItems
watch(
  () => props.modelValue,
  (newValue) => {
    // Set flag to prevent circular updates
    isInternalUpdate.value = true
    if (props.multiple) {
      // For multiple selection, if modelValue is cleared externally, clear selectedItems
      if (!newValue || newValue.length === 0) {
        selectedItems.value = []
        search.value = ''
      } else if (newValue) {
        // Sync selectedItems with modelValue
        selectedItems.value = items.value.filter((item) =>
          (newValue as (string | number)[]).includes(itemWithValue(item as T))
        )
      }
    } else {
      // For single selection
      if (newValue === null || newValue === '' || newValue === undefined) {
        selectedItems.value = []
        search.value = ''
      } else {
        const item = items.value.find((i) => itemWithValue(i as T) === newValue)
        if (item) {
          selectedItems.value = [item]
          selectItem(item as T)
        }
      }
    }

    // Reset flag after Vue processes the change
    nextTick(() => {
      isInternalUpdate.value = false
    })
  },
  { deep: true }
)

async function fetchData() {
  if (props.getUrl) {
    let params = { pageSize: pageSize } // default pageSize
    if (props.fetchOnSearch) {
      if (search.value) params = { ...params, [searchKey.value]: search.value }
    }
    const res = await axiosInstance.get(props.getUrl, { params })
    if (props.withoutData) {
      items.value = res.data
    } else {
      items.value = res.data.items
    }
  }
}

onMounted(async () => {
  onClickOutside(menu, () => {
    isOpen.value = false
  })
  if (props.getUrl){ await fetchData()}
  if (modelValue.value !== '' && !props.multiple && modelValue.value !== null) {
    const item = items.value.find((i) => i[props!.itemValue]! === modelValue.value)
    

    selectItem(item as T)
  }
})

const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]

watchDebounced(
  search,
  () => {
    if (props.fetchOnSearch) fetchData()
  },
  300
)

const menuWidth = computed(() => {
  if (menu.value) return menu.value.clientWidth
  return 0
})

const isItemSelected = (item: T) => {
  return selectedItems.value.some((i) => itemWithValue(i) === itemWithValue(item))
}

const isAnySelected = computed(() => selectedItems.value.length > 0)
const clearSelected = () => {
  selectedItems.value = []
  search.value = ''
}

const selectAllItems = () => {
  selectedItems.value = items.value
}

watch(isOpen, (v) => {
  if (v) {
    nextTick(() => {
      const el = document.getElementById(anchorName.value);
      if (!el) return;

      const elRect = el.getBoundingClientRect();
      const docHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      const elBottomAbs = elRect.bottom + scrollY;

      const spaceBelow = docHeight - elBottomAbs;

      let offset = 0;
      if (spaceBelow < 300) {
        el.classList.add('autocomplete-container-bottom')
        el.style.bottom = `calc(anchor(top)`;
        // offset = 300 - spaceBelow - 10;
        console.log('bottom');
        
      } else {
        el.classList.add('autocomplete-container-top')
        el.style.top = `calc(anchor(bottom)`;
        console.log('top');
      }
    });
  }
});
</script>

<template>
  <div ref="menu" class="autocomplete-container-anchor" relative>
    <div class="relative">
      <div class="text-gray pointer-events-none absolute inset-y-0 start-0 flex items-center ps-5">
        <i :class="appendIcon" />
      </div>
      <div class="text-gray pointer-events-none absolute inset-y-0 end-5 flex items-center ps-5">
        <i
          class="i-ph-caret-down transition-all-300"
          :class="{
            'rotate-180': isOpen,
          }"
        />
      </div>
      <BaseInput
        v-model="search"
        type="text"
        :class="{
          'ps-12': appendIcon,
          'rounded-b-0': isOpen,
        }"
        :icon="isAnySelected ? 's' : null"
        :error="error"
        :disabled="props.disabled"
        :placeholder="placeholder"
        :label="label"
        @focus="isOpen = true"
      >
        <template #icon>
          <Icon
            v-if="selectedItems.length > 0 && !props.disabled"
            name="ph-x"
            class="cursor-pointer text-red-500"
            size="20"
            @click="clearSelected"
          />
        </template>
      </BaseInput>
      <div v-if="props.multiple" class="mt-2 flex flex-wrap items-center gap-2">
        <BaseTag
          v-for="item in selectedItems"
          :key="itemWithValue(item)"
          color="primary"
          variant="pastel"
          class="flex items-center gap-1 text-lg"
        >
          {{ itemWithLabel(item) }}
          <Icon name="ph:x" class="size-3" @click="removeItem(item)" />
        </BaseTag>
      </div>
    </div>
    <div
      v-if="isOpen"
      :id="anchorName"
      class="autocomplete-container max-h-[200px] rounded-box dark:bg-dark absolute z-[99] flex flex-col overflow-y-auto rounded-xl border bg-white p-2 shadow dark:text-white"
      :style="{ 
        width: menuWidth + 'px',
       }"
    >
      <!-- Add create option when no exact match is found -->
      <div
        v-if="
          props.allowCreate &&
          search &&
          !filteredItems.some(
            (item) => itemWithLabel(item as T).toLowerCase() === search.toLowerCase()
          )
        "
        class="p-3 my-1 flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        @click="createNewItem"
      >
        <div class="flex items-center gap-2">
          <Icon name="ph-plus" class="text-green-500" size="20" />
          <p>Create "{{ search }}"</p>
        </div>
      </div>
      <div v-if="props.selectAll">
        <BaseButton size="sm" color="primary" variant="pastel" @click="selectAllItems">
          {{ $t('select-all') }}
        </BaseButton>
      </div>
      <div
        v-for="item in filteredItems"
        :key="itemWithValue(item as T)"
        class="p-3 my-1 flex cursor-pointer items-center justify-between rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        :class="{ 'font-bold': isItemSelected(item as T) }"
        @click="selectItem(item as T)"
      >
        <div>
          <p v-if="!hasSlot('item')" class="">
            {{ itemWithLabel(item as T) }}
          </p>
          <p v-if="!hasSlot('item') && props.itemSubtitle" class="text-sm">
            {{ itemWithSubtitle(item as T) }}
          </p>
        </div>

        <slot name="item" :item="item" />

        <Icon
          :name="isItemSelected(item as T) ? 'ph-check-square' : 'ph-square'"
          class="text-green-500"
          size="22"
        />
      </div>
      <div
        v-if="filteredItems.length == 0"
        class="p-3 flex items-center justify-center text-center"
      >
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('no-data-found') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.autocomplete-container-anchor {
  anchor-name: v-bind("anchorName");
}

.autocomplete-container {
  position: absolute;
  position-anchor: v-bind("anchorName");
  position-visibility: always;
}
.autocomplete-container-bottom {
  bottom: calc(anchor(top));
}
.autocomplete-container-top {
  top: calc(anchor(bottom));
}
</style>
