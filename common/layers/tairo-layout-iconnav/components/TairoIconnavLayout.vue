<script setup lang="ts">
import { useIconnav } from '../composables/iconnav'

const props = withDefaults(
  defineProps<{
    topnav?: boolean
    toolbar?: boolean
    circularMenu?: boolean
    display?:
      | 'condensed'
      | 'horizontal-scroll'
      | 'expanded-sm'
      | 'expanded-md'
      | 'expanded-lg'
      | 'expanded-xl'
  }>(),
  {
    topnav: true,
    toolbar: true,
    circularMenu: true,
    display: 'expanded-lg',
  }
)

const route = useRoute()
const app = useAppConfig()
const config = useAppConfig().tairo.iconnav
const { selectedMenuItem } = useIconnav()

const iconnavEnabled = computed(() => {
  return config?.navigation?.enabled !== false
})
const toolbarEnabled = computed(() => {
  return true
})
const circularMenuEnabled = computed(() => {
  return config?.circularMenu?.enabled !== false && props.circularMenu !== false
})

const mainClass = computed(() => {
  if (props.display === 'condensed') {
    return 'bg-muted-50 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden'
  }

  if (!iconnavEnabled.value) {
    return 'bg-muted-50 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10'
  }

  const list = [
    'bg-muted-50 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10',
  ]

  if (props.display === 'horizontal-scroll') {
    list.push('!pe-0 xl:!pe-0')
  }

  return list
})
</script>

<template>
  <div>
    <div class="bg-svg dark:bg-muted-900">
      <slot name="navigation">
        <TairoIconnavNavigation v-if="iconnavEnabled" :display="props.display" position="absolute">
          <div
            v-if="config?.navigation?.logo?.component"
            class="flex h-16 w-full items-center gap-x-4"
          >
            <NuxtLink
              v-motion
              :initial="{
                opacity: 0,
                x: 10,
              }"
              :enter="{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 600,
                },
              }"
              to="/"
              class="flex items-center justify-center"
            >
              <EventsLogo class="size-10" />
            </NuxtLink>
            <BaseHeading
              v-if="config?.toolbar?.showTitle"
              v-motion
              :initial="{
                opacity: 0,
                x: -10,
              }"
              :enter="{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 600,
                  delay: 200,
                },
              }"
              as="h1"
              size="lg"
              weight="light"
              class="text-brand-primary hidden dark:text-white md:block"
            >
              <h1 class="font-bold">منصة ايفنتس</h1>
              <slot name="title">
                {{ route.meta.title }}
              </slot>
            </BaseHeading>
          </div>
          <template #toolbar>
            <div v-if="toolbarEnabled">
              <div class="flex items-center justify-end gap-2">
                <template v-for="tool of config?.toolbar?.tools">
                  <component
                    :is="resolveComponentOrNative(tool.component)"
                    v-if="tool.component"
                    :key="tool.component"
                    v-bind="tool.props"
                  />
                </template>
              </div>
            </div>
          </template>
        </TairoIconnavNavigation>
      </slot>

      <div :class="mainClass">
        <div
          id="content"
          :class="[
            props.display === 'condensed' && 'w-full',
            props.display === 'horizontal-scroll' && 'mx-auto w-full overflow-x-auto',
            props.display === 'expanded-sm' && 'mx-auto w-full max-w-5xl',
            props.display === 'expanded-md' && 'mx-auto w-full max-w-6xl',
            props.display === 'expanded-lg' && 'mx-auto w-full',
            props.display === 'expanded-xl' && 'mx-auto w-full',
            selectedMenuItem?.children ? 'pt-60 lg:pt-44 ltablet:pt-36' : 'pt-24',
          ]"
          class="relative z-10"
        >
          <slot />
        </div>
      </div>

      <TairoPanels />

      <TairoIconnavCircularMenu v-if="circularMenuEnabled" />
    </div>

    <!-- <TairoIconnavFooter v-if="config?.footer?.enabled" :display="props.display" /> -->
  </div>
</template>
<style lang="scss">
.bg-svg {
  &::before {
    content: '';
    position: fixed;
    top: 0;
    z-index: 1;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('~/assets/bg.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
