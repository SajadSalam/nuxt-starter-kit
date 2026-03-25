<script setup lang="ts" generic="T">
import { useAppCrudStore } from '../store/AppCrudStore'
type Item = T & { id: string }
interface Props {
    item: T
    deleteService?: (id: string) => Promise<void>
    editButtonAction?: (id: string) => void
    hideDelete?: boolean
    hideUpdate?: boolean
    isEditDisabled?: boolean
    isDeleteDisabled?: boolean
}
const props = defineProps<Props>()
const item = computed(() => props.item)
const appCrudStore = useAppCrudStore()

const onEdit = (currentItem: Item) => {
    if (props.editButtonAction) props.editButtonAction(currentItem)
}
const onDelete = (currentItem: Item) => {
    appCrudStore.setItemId(currentItem.id)
    if (props.deleteService) {
        appCrudStore.setDeleteService(() =>
            props.deleteService!(currentItem.id)
        )
    }
    appCrudStore.isDeleteModalOpen = true
}
</script>
<template>
    <div class="flex items-center justify-center gap-1">
        <BaseButtonIcon
            v-if="!hideUpdate"
            data-nui-tooltip="تعديل"
            :disabled="isEditDisabled"
            variant="pastel"
            class="size-9"
            color="none"
            size="sm"
            rounded="full"
            @click="onEdit(item as Item)"
        >
            <Icon name="tabler-edit" class="size-8 text-warning-500" />
        </BaseButtonIcon>
        <BaseButtonIcon
            v-if="!hideDelete"
            data-nui-tooltip="حذف"
            :disabled="isDeleteDisabled"
            variant="pastel"
            class="size-9"
            color="none"
            size="sm"
            rounded="full"
            @click="onDelete(item as Item)"
        >
            <Icon name="tabler-trash" class="size-8 text-danger-500" />
        </BaseButtonIcon>
    </div>
</template>
