<script lang="ts" setup>
import AppInputField from '~/common/components/app-field/AppInputField.vue'
import { requiredValidator } from '~/common/services/validation'
import { Validator } from '~/common/services/validator'
import { useAuthStore } from '../store/auth'
import type { LoginBody, MeResponse } from '../types/index'

const body = ref<LoginBody>({
  loginIdentifier: '',
  password: '',
  rememberMe: true,
})
const isError = ref(false)
const isLoading = ref(false)
const validator = new Validator<LoginBody>(body.value, {
  loginIdentifier: {
    required: requiredValidator(''),
  },
  password: {
    required: requiredValidator(''),
  },
})
const authStore = useAuthStore()

const login = async () => {
  const validate = await validator.validation.value.$validate()
  if (!validate) return
  try {
    isLoading.value = true
    isError.value = false
    await authStore.login(body.value)

    const userDataStr = localStorage.getItem('userData')
    if (userDataStr) {
      const userData = JSON.parse(userDataStr) as MeResponse
      // Check roles array for navigation
      const userRoles = userData.roles?.map((role: any) => role.name) || []
        window.location.href = '/'

    }
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {})
</script>

<template>
  <form @submit.prevent="login">
    <div class="w-[100%] flex flex-col gap-3 !text-black">
      <AppInputField
        v-model="validator.validation.value.loginIdentifier.$model"
        :errors="validator.validation.value.loginIdentifier.$errors"
        rounded="lg"
        placeholder="ادخل اسم المستخدم"
        label="اسم المستخدم"
        class="rounded-full"
      />
      <AppInputField
        v-model="validator.validation.value.password.$model"
        :errors="validator.validation.value.password.$errors"
        type="password"
        rounded="lg"
        placeholder="ادخل كلمة المرور"
        label="كلمة المرور"
        class="rounded-full"
      />


      <p v-if="isError" class="text-red text-sm">
        اسم المستخدم أو كلمة المرور غير صحيحة
      </p>

      <div class="flex w-full flex-col items-center gap-3">
        <BaseButton :loading="isLoading" type="submit" class="w-full" color="primary">
          تسجيل الدخول
        </BaseButton>
      </div>
    </div>
  </form>
</template>
