<script setup lang="ts">
import AppAutoCompleteField from '~/common/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/common/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/common/components/app-field/AppTextAreaField.vue'
import { capitalLetterValidator, requiredValidator } from '~/common/services/validation'
import { Validator } from '~/common/services/validator'
import type { ApiError } from '~/common/utils/types/ApiResponses'
import { useDepartmentStore } from '../store'
import type { DepartmentCreateDto } from '../types'

const departmentStore = useDepartmentStore()

const validator = new Validator<DepartmentCreateDto>(
  {
    name: '',
    description: '',
    code: '',
    managerId: null,
    parentDepartmentId: null,
    budget: null,
    location: '',
    contactEmail: '',
    contactPhone: '',
  },
  {
    name: {
      required: requiredValidator('اسم القسم'),
    },
    code: {
      required: requiredValidator('رمز القسم'),
      capitalLetter: capitalLetterValidator('رمز القسم'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return departmentStore.isLoading
})

const createDepartment = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  try {
    await departmentStore.createDepartment(validator.extractBody())
    validator.resetBody()
    departmentStore.isCreateDialogOpen = false
  } catch (error) {
    console.error('Error creating department:', error)
    const errors = (error as ApiError).response?.data?.errors
    if (errors) {
      validator.setExternalErrors(errors)
    }
    useToast(
      {
        message: (error as ApiError).response?.data.title,
        isError: true
      }
    )
  }
}

watch(
  () => departmentStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="departmentStore.isCreateDialogOpen"
    title="إنشاء قسم"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.name.$model"
            :errors="body.name.$errors"
            size="md"
            label="اسم القسم"
            required
          />
          <AppInputField
            v-model="body.code.$model"
            :errors="body.code.$errors"
            size="md"
            label="رمز القسم"
            required
          />
        </div>

        <AppTextAreaField
          v-model="body.description.$model"
          :errors="body.description.$errors"
          size="md"
          label="الوصف"
          rows="3"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppAutoCompleteField
            v-model="body.managerId.$model"
            fetch-on-search
            search-key="fullName"
            :errors="body.managerId.$errors"
            size="md"
            label="المدير"
            get-url="/user"
            item-label="fullName"
            item-value="id"
          />
          <AppAutoCompleteField
            v-model="body.parentDepartmentId.$model"
            fetch-on-search
            search-key="name"
            :errors="body.parentDepartmentId.$errors"
            size="md"
            label="القسم الأب"
            get-url="/Department"
            item-label="name"
            item-value="id"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.budget.$model"
            :errors="body.budget.$errors"
            size="md"
            label="الميزانية"
            type="number"
            step="0.01"
            min="0"
          />
          <AppInputField
            v-model="body.location.$model"
            :errors="body.location.$errors"
            size="md"
            label="الموقع"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.contactEmail.$model"
            :errors="body.contactEmail.$errors"
            size="md"
            label="البريد الإلكتروني للتواصل"
            type="email"
          />
          <AppInputField
            v-model="body.contactPhone.$model"
            :errors="body.contactPhone.$errors"
            size="md"
            label="هاتف التواصل"
            type="tel"
          />
        </div>
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createDepartment">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        إنشاء قسم جديد
      </BaseButton>
    </template>
  </AppDialog>
</template>
