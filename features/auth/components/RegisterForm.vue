<script lang="ts" setup>
import AppInputField from '~/common/components/app-field/AppInputField.vue'
import {
    alphaNumValidator,
    minLengthValidator,
    mobileValidator,
    requiredValidator,
} from '~/common/services/validation'
import { Validator } from '~/common/services/validator'
import { useAuthStore } from '../store/auth'
import type { RegisterBody } from '../types'

const isLoading = ref(false)
const body = ref<RegisterBody>({
  phoneNumber: '',
  password: '',
  fullName: '',
  // role: 0,
})

const validator = new Validator<RegisterBody>(body.value, {
  phoneNumber: {
    required: requiredValidator('رقم الهاتف'),
    phoneNumber: mobileValidator('رقم الهاتف'),
  },
  fullName: {
    required: requiredValidator('الاسم الكامل'),
    phoneNumber: alphaNumValidator('الاسم الكامل'),
    minLength: minLengthValidator('الاسم الكامل', 2),
  },
  password: {
    required: requiredValidator('كلمة المرور'),
    minLength: minLengthValidator('كلمة المرور', 6),
  },
})
const authStore = useAuthStore()
const register = async () => {
  const validate = await validator.validation.value.$validate()
  if (!validate) return
  try {
    isLoading.value = true
    await authStore.register(body.value)
    navigateTo('/')
  } catch (e) {
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AppInputField
    v-model="validator.validation.value.fullName.$model"
    :errors="validator.validation.value.fullName.$errors"
    icon="ph:user-duotone"
    rounded="lg"
    label="الاسم الكامل"
    class="rounded-full"
  />
  <AppInputField
    v-model="validator.validation.value.phoneNumber.$model"
    :errors="validator.validation.value.phoneNumber.$errors"
    icon="ph:user"
    rounded="lg"
    label="رقم الهاتف"
    class="rounded-full"
  />
  <AppInputField
    v-model="validator.validation.value.password.$model"
    :errors="validator.validation.value.password.$errors"
    icon="ph:lock"
    type="password"
    rounded="lg"
    label="كلمة السر"
    class="rounded-full"
  />
  <BaseButton
    :loading="isLoading"
    rounded="lg"
    class="mt-4 w-full"
    color="primary"
    @click="register"
    >تسجيل</BaseButton
  >
</template>

<style></style>
