<template>
  <div
    class="overflow-hidden w-full flex flex-col gap-4 bg-white z-50 rounded-3xl"
  >
    <div class="flex items-center relative h-52 p-4 gap-5">
      <button
        v-if="node.childs && node.childs.length > 0"
        @click="toggle"
        class="mr-2 z-50 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        <img src="@/public/assets/img/arrow.png" alt="arrow" class="w-6 h-6" />
      </button>

      <!-- Блок для отображения текста и ссылки -->
      <div class="z-50 flex flex-col justify-between h-full">
        <div>
          <p class="text-lg font-semibold">{{ nodeName }}</p>
          <p class="text-sm text-gray-500">{{ breadcrumb }}</p>
        </div>
        <NuxtLink :to="link" class="text-blue-600 underline" target="_blank">
          View Link
        </NuxtLink>
      </div>

      <!-- Главное изображение категории -->
      <img
        :src="node.category_image"
        class="absolute top-0 right-0 left-0 bottom-0 z-40 w-full h-full object-cover object-right-top"
        v-if="node.category_image"
      />

      <!-- Изображение menu_image, если оно существует -->
      <img
        v-if="node.menu_image"
        :src="node.menu_image"
        alt="Menu Image"
        class="w-auto h-52 object-cover absolute z-30 rounded-md top-0 right-0"
      />
    </div>

    <!-- Поддерево с передачей menu_image для каждого дочернего элемента -->
    <div v-show="isOpen" class="flex flex-col gap-4">
      <div
        v-for="child in node.childs"
        :key="child.id"
        class="bg-white overflow-hidden w-full rounded-3xl flex"
      >
        <TreeNode
          :node="child"
          :lang="lang"
          :fallbackLang="fallbackLang"
          :parentBreadcrumb="breadcrumb"
          :parentId="node.id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import TreeNode from "~/components/TreeNode.vue";

interface Locale {
  [key: string]: {
    cg_name?: string;
    link?: string;
  };
}

interface Node {
  id: number;
  locale: Locale;
  path_to_top: number[];
  childs?: Node[];
  category_image?: string;
  menu_image?: string; // Новый ключ для изображения меню
}

const props = defineProps<{
  node: Node;
  lang: string;
  fallbackLang: string;
  parentBreadcrumb?: string;
  parentId?: number;
}>();

const isOpen = ref(false);
const toggle = () => (isOpen.value = !isOpen.value);

// Вычисление имени узла с использованием fallback
const nodeName = computed(() => {
  return (
    props.node.locale[props.lang]?.cg_name ||
    props.node.locale[props.fallbackLang]?.cg_name ||
    "Unnamed"
  );
});

// Вычисление ссылки с добавлением parent ID, если доступен baseLink
const link = computed(() => {
  const baseLink =
    props.node.locale[props.lang]?.link ||
    props.node.locale[props.fallbackLang]?.link;
  return baseLink ? `${baseLink}${props.node.id}` : "#";
});

// Формирование breadcrumbs
const breadcrumb = computed(() => {
  return props.parentBreadcrumb
    ? `${props.parentBreadcrumb} -> ${nodeName.value}`
    : nodeName.value;
});
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
