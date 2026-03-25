<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { useAuthStore } from "~/features/auth/store/auth";

const authStore = useAuthStore();
const userData = computed(() => authStore.userData);
const fullName = computed(
  () => userData.value.fullName || userData.value.username || "Sajad Salam"
);
const role = computed(() => {
  if (userData.value.roles && userData.value.roles.length > 0) {
    return userData.value.roles[0].name;
  }
  return "SuperAdmin";
});
</script>

<template>
  <div class="group relative z-20 inline-flex items-center justify-center text-end">
    <Menu v-slot="{ close }" as="div" class="relative z-20 text-left">
      <MenuButton as="div">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full transition-all duration-300"
        >
          <div
            class="relative p-1 border border-muted-200 inline-flex size-12 items-center justify-center rounded-full"
          >
            <img
              src="/img/avatars/3.svg"
              class="max-w-full z-40 rounded-full object-cover shadow-sm dark:border-transparent"
              alt=""
            />
            <div class="absolute -left-1 bg-white w-3 h-4 z-20" />
          </div>
          <div
            class="h-20 w-45 flex items-center justify-between p-4 relative text-black left-1 rounded-full"
          >
            <span class="grow text-start">
              <p class="font-bold text-[13px]">
                {{ fullName }}
              </p>
              <p class="text-muted-500 text-xs">
                {{ role }}
              </p>
            </span>
            <icon name="tabler-chevron-down" class="size-5 text-gray-500" />
          </div>
        </button>
      </MenuButton>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="divide-muted-100 border-muted-200 dark:divide-muted-700 dark:border-muted-700 dark:bg-muted-800 absolute end-0 mt-2 w-64 origin-top-right divide-y rounded-md border shadow-lg focus:outline-none !bg-white"
        >
          <div class="p-6 text-center">
            <div
              class="relative mx-auto flex size-20 items-center justify-center rounded-full"
            >
              <img
                src="/img/avatars/2.svg"
                class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                alt=""
              />
            </div>
            <div class="mt-3">
              <h6 class="font-heading font-medium text-muted-800 lg dark:text-white">
                {{ fullName }}
              </h6>
              <p class="text-muted-400 text-xs">
                {{ role }}
              </p>
            </div>
          </div>

          <div class="p-6 space-y-2">
            <BaseButton
              rounded="lg"
              class="group flex w-full items-center rounded-md p-3 text-sm transition-colors duration-300"
              @click="authStore.logout()"
            >
              <Icon name="ic:baseline-log-out" class="size-5" />
              <div class="ms-3">
                <h6
                  class="font-heading text-muted-800 text-xs font-medium leading-none dark:text-white"
                >
                  تسجيل الخروج
                </h6>
              </div>
            </BaseButton>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
</template>
