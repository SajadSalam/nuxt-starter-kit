<script setup lang="ts">
import AppCrudActions from '~/common/components/app-crud/components/AppCrudActions.vue'
import AppTable from '~/common/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/common/components/app-table/stores/AppTableStore'
import { tableHeader } from '~/features/departments'
import DepartmentCreate from '~/features/departments/components/DepartmentCreate.vue'
import DepartmentEdit from '~/features/departments/components/DepartmentEdit.vue'
import { useDepartmentStore } from '~/features/departments/store'
import type { DepartmentFilters } from '~/features/departments/types'

definePageMeta({
    title: 'الأقسام',
    description: 'إنشاء وإدارة الأقسام',
})

const departmentStore = useDepartmentStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => departmentStore.isLoading)
const departments = computed(() => departmentStore.departments || [])
const filters = computed<DepartmentFilters>({
    get() {
        return departmentStore.filters
    },
    set(value) {
        departmentStore.filters = value
    },
})

const getDepartments = async () => {
    appTableStore.setLoading(true)
    await departmentStore.getDepartments()
    appTableStore.setLoading(false)
}

getDepartments()
watch(
    filters,
    () => {
        getDepartments()
    },
    { deep: true }
)
onUnmounted(() => {
    departmentStore.filters = {
        pageSize: 10,
        pageNumber: 1,
        name: null,
        code: null,
        managerId: null,
    }
})
</script>

<template>
    <div>
        <AppCrud
            add-button-text="إضافة قسم جديد"
            :add-btn-action="() => (departmentStore.isCreateDialogOpen = true)"
            :pagination="true"
            :total-pages="departmentStore.totalPages"
            title="الأقسام"
            @update:current-page="filters.pageNumber = $event"
        >
            <template #filters>
                <BaseInput v-model="filters.name" placeholder="البحث" />
                <AppAutoCompleteField
                    v-model="filters.parentDepartmentId"
                    placeholder="القسم الأب"
                    get-url="/Department"
                    item-label="name"
                    item-value="id"
                />
                <AppAutoCompleteField
                    v-model="filters.managerId"
                    placeholder="المدير"
                    get-url="/user"
                    item-label="fullName"
                    item-value="id"
                />
            </template>
            <AppTable
                title="الأقسام"
                :headers="tableHeader()"
                :items="departments"
                :is-loading="isLoading"
            >
                <template #data-name="{ item }">
                    <div class="flex flex-col">
                        <span
                            class="font-medium text-muted-800 dark:text-muted-100"
                        >
                            {{ item.name }}
                        </span>
                        <span
                            v-if="item.description"
                            class="text-xs text-muted-500"
                        >
                            {{ item.description }}
                        </span>
                    </div>
                </template>

        <template #data-code="{ item }">
          <BaseTag color="primary" variant="pastel" size="sm">
            {{ item.code }}
          </BaseTag>
        </template>

                <template #data-manager="{ item }">
                    <div v-if="item.manager" class="flex flex-col">
                        <span
                            class="font-medium text-muted-800 dark:text-muted-100"
                        >
                            {{ item.manager.fullName }}
                        </span>
                        <span class="text-xs text-muted-500">
                            {{ item.manager.email }}
                        </span>
                    </div>
                    <span v-else class="text-muted-400">لا يوجد مدير</span>
                </template>

                <template #data-parentDepartment="{ item }">
                    <span
                        v-if="item.parentDepartment"
                        class="text-muted-800 dark:text-muted-100"
                    >
                        {{ item.parentDepartment.name }}
                    </span>
                    <span v-else class="text-muted-400">المستوى الأعلى</span>
                </template>

                <template #data-budget="{ item }">
                    <span
                        v-if="item.budget"
                        class="font-medium text-muted-800 dark:text-muted-100"
                    >
                        ${{ item.budget.toLocaleString() }}
                    </span>
                    <span v-else class="text-muted-400">لا توجد ميزانية</span>
                </template>

                <template #data-location="{ item }">
                    <span
                        v-if="item.location"
                        class="text-muted-800 dark:text-muted-100"
                    >
                        {{ item.location }}
                    </span>
                    <span v-else class="text-muted-400">لا يوجد موقع</span>
                </template>

                <template #data-actions="{ item }">
                    <AppCrudActions
                        :item="item"
                        :edit-button-action="
                            () => {
                                departmentStore.selectedDepartment = item
                                departmentStore.selectedDepartmentId = item.id
                                departmentStore.isEditDialogOpen = true
                            }
                        "
                        :delete-service="departmentStore.deleteDepartment"
                    />
                </template>
            </AppTable>
        </AppCrud>
        <DepartmentCreate />
        <DepartmentEdit />
    </div>
</template>
