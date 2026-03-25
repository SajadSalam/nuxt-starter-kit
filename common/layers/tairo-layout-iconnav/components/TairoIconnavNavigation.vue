<script setup lang="ts">
import { useAuthStore } from '~/features/auth/store/auth';
import { useIconnav } from '../composables/iconnav';

const props = withDefaults(
  defineProps<{
    display:
      | 'condensed'
      | 'horizontal-scroll'
      | 'expanded-sm'
      | 'expanded-md'
      | 'expanded-lg'
      | 'expanded-xl'
    position: 'fixed' | 'absolute'
  }>(),
  {
    display: 'expanded-lg',
    position: 'absolute',
  }
)
const isSearchOpen = useState('search-open', () => false)
const metaKey = useMetaKey()
const { menuItems, selectedMenuItem } = useIconnav()
const app = useAppConfig()
const authStore = useAuthStore()

const router = useRouter()
const isUserInRole = (roles?: string[]) => {
  if (!roles) return true
  return authStore.hasRole(roles)
}
const filteredMenuItems = menuItems.value!.filter((item) => isUserInRole(item.role))
</script>

<template>
  <div
    class="z-140 left-0 top-0 w-full border-b border-muted-200 bg-transparent transition-all duration-300 dark:border-muted-800 dark:bg-muted-950"
    :class="[props.position === 'fixed' && 'fixed', props.position === 'absolute' && 'absolute']"
  >
    <nav
      class="relative"
      :class="[
        props.display === 'condensed' && 'w-full',
        props.display === 'horizontal-scroll' && 'mx-auto w-full pe-4',
        props.display === 'expanded-sm' && 'max-w-95% mx-auto w-full px-4 xl:px-0',
        props.display === 'expanded-md' && 'max-w-95% mx-auto w-full px-4 xl:px-0',
        props.display === 'expanded-lg' && 'max-w-95% mx-auto w-full px-4 xl:px-0',
        props.display === 'expanded-xl' && 'mx-auto w-full px-4 xl:px-0',
      ]"
    >
      <!-- Flex container -->
      <div class="flex h-20 w-full items-center justify-between">

        <!-- Logo -->
        <div class="w-1/5 md:w-1/4">
          <slot />
        </div>
        <!-- Menu Items -->
        <div
          class="border-1 hidden justify-between gap-x-3 overflow-hidden rounded-3xl border-white bg-white lg:flex ltablet:flex"
        >
          <div
            v-for="(item, index) in filteredMenuItems"
            :key="index"
            v-motion
            class="text-center"
            :initial="{
              opacity: 0,
              x: 100,
            }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: {
                duration: 600,
                delay: index * 100,
              },
            }"
          >
            <button
              v-if="item.children"
              type="button"
              class="group flex flex-col"
              :class="
                selectedMenuItem?.activePath === item.activePath &&
                '[&>div]:!bg-primary-500/10 [&>div]:!text-primary-500 dark:[&>div]:!bg-primary-500/20 [&>p]:!text-primary-500'
              "
              @click="
                () => {
                  ;(selectedMenuItem = item), router.push(item.children?.[0]?.to)
                }
              "
            >
              <div
                class="relative mx-auto flex size-11 items-center justify-center rounded-xl text-muted-400 transition-colors duration-300 group-hover:bg-muted-100 group-hover:text-muted-600 dark:group-hover:bg-muted-800 dark:group-hover:text-muted-300"
              >
                <Icon :name="item.icon.name" :class="item.icon.class" />
              </div>
              <p class="w-full text-center text-xs text-muted-400">
                {{ item.name }}ss
              </p>
            </button>
            <NuxtLink
              v-if="item.to"
              class="p-3 transition-duration-500 flex items-center gap-1 transition-all"
              :to="item.to"
              exact-active-class="bg-primary-500 [&>div]:!text-white [&>p]:!text-white"
            >
              <div
                class="relative flex items-center justify-center rounded-xl text-muted-400 transition-colors duration-300 group-hover:text-muted-600 dark:group-hover:bg-muted-800 dark:group-hover:text-muted-300"
              >
                <Icon :name="item.icon.name" :class="item.icon.class" />
              </div>
              <p class="w-full text-center text-xs text-muted-400">
                {{ item.name }}
              </p>
            </NuxtLink>
            <button
              v-else
              type="button"
              class="transition-duration-500 flex items-center transition-all"
              @click="item.click"
            >
              <div
                class="relative flex size-11 items-center justify-center rounded-xl text-muted-400 transition-colors duration-300 group-hover:text-muted-600 dark:group-hover:bg-muted-800 dark:group-hover:text-muted-300"
              >
                <Icon :name="item.icon.name" :class="item.icon.class" />
              </div>
              <p class="w-full text-center text-xs text-muted-400">
                {{ item.name }}
              </p>
            </button>
          </div>
        </div>

        <div
          class="border-1 flex justify-center gap-x-6 rounded-3xl border-white bg-white lg:hidden ltablet:hidden"
        >
          <div v-for="(item, index) in filteredMenuItems" :key="index" class="text-center">
            <button
              v-if="item.children"
              type="button"
              class="group flex flex-col rounded-3xl"
              :class="
                selectedMenuItem?.activePath === item.activePath &&
                '[&>div]:!bg-primary-500/10 [&>div]:!text-primary-500 [&>p]:!text-primary-500'
              "
              @click="
                () => {
                  selectedMenuItem = item
                }
              "
            >
              <div
                class="relative mx-auto flex size-12 items-center justify-center rounded-xl text-muted-400 transition-colors duration-300 group-hover:bg-muted-100 group-hover:text-muted-600 dark:group-hover:bg-muted-700 dark:group-hover:text-muted-300"
              >
                <Icon :name="item.icon.name" :class="item.icon.class" />
              </div>
            </button>
            <NuxtLink
              v-else-if="item.to"
              class="group flex flex-col"
              :to="item.to"
              exact-active-class="[&>div]:!bg-primary-500/10 [&>div]:!text-primary-500 [&>p]:!text-primary-500"
            >
              <div
                class="relative mx-auto flex size-12 items-center justify-center rounded-3xl text-muted-400 transition-colors duration-300 group-hover:bg-muted-100 group-hover:text-muted-600 dark:group-hover:bg-muted-700 dark:group-hover:text-muted-300"
              >
                <Icon :name="item.icon.name" :class="item.icon.class" />
              </div>
            </NuxtLink>
            <button v-else type="button" class="group flex flex-col" @click="item.click">
              <div
                class="relative mx-auto flex size-12 items-center justify-center rounded-xl text-muted-400 transition-colors duration-300 group-hover:bg-muted-100 group-hover:text-muted-600 dark:group-hover:bg-muted-700 dark:group-hover:text-muted-300"
              >
                <Icon :name="item.icon.name" :class="item.icon.class" />
              </div>
            </button>
          </div>
        </div>

        <!-- Button -->
        <div class="w-4/5 md:w-1/4">
          <slot name="toolbar">
            <BaseButton to="#" color="primary"> Get Started </BaseButton>
          </slot>
        </div>
      </div>
    </nav>

    <div
      class="flex items-center"
      :class="[
        props.display === 'condensed' && 'w-full',
        props.display === 'horizontal-scroll' && 'mx-auto w-full overflow-x-auto',
        props.display === 'expanded-sm' && 'mx-auto w-full max-w-5xl',
        props.display === 'expanded-md' && 'mx-auto w-full max-w-6xl',
        props.display === 'expanded-lg' && 'mx-auto w-full',
        props.display === 'expanded-xl' && 'mx-auto w-full',
      ]"
    >
      <div class="flex overflow-x-auto lg:overflow-x-hidden">
        <NuxtLink
          v-for="(item, index) in selectedMenuItem?.children"
          :key="index"
          :to="item.to"
          class="flex items-center justify-center border-b-2 border-transparent p-3 text-center text-muted-400 transition-colors duration-300 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-400 lg:pt-5 ltablet:pt-5"
          exact-active-class="!border-primary-500 !text-muted-800 dark:!text-muted-100"
        >
          <BaseText size="sm">
            {{ item.name }}
          </BaseText>
        </NuxtLink>
      </div>
      <div
        v-if="selectedMenuItem?.children"
        class="ms-auto hidden pe-4 lg:block xl:pe-0 ltablet:block"
      >
        <button
          type="button"
          class="group flex items-center gap-2 rounded-xl border border-muted-100 bg-muted-100 py-1 pe-1 ps-3 text-muted-400 hover:text-primary-500 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-500 dark:hover:text-primary-500"
          aria-label="Open search"
          @click="isSearchOpen = true"
        >
          <Icon
            name="lucide:search"
            class="size-4 motion-safe:transition-colors motion-safe:duration-300"
          />
          <span
            class="rounded-lg border border-muted-200 bg-white px-2 py-0.5 shadow group-hover:text-muted-600 motion-safe:transition-colors motion-safe:duration-300 dark:border-muted-700 dark:bg-muted-800 dark:group-hover:text-muted-100"
          >
            <kbd class="text-sm tracking-wide"> {{ metaKey }} + k </kbd>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
