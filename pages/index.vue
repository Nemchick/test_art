<template>
  <div class="p-6 max-w-screen-2xl m-auto">
    <h1 class="text-2xl font-bold mb-6">Категории</h1>
    <div class="mb-4">
      <label for="lang-select" class="block text-sm font-medium text-gray-700">
        Выберите язык:
      </label>
      <select id="lang-select" v-model="selectedLang" class="mt-1 block w-full">
        <option v-for="lang in languages" :key="lang" :value="lang">
          {{ lang }}
        </option>
      </select>
    </div>

    <!-- Отображение состояния загрузки или ошибки -->
    <div v-if="isLoading" class="text-center text-gray-600">
      Загрузка данных...
    </div>
    <div v-else-if="error" class="text-red-600 text-center">
      Ошибка загрузки данных. Пожалуйста, попробуйте обновить страницу.
    </div>

    <!-- Отображение дерева данных после успешной загрузки -->
    <div v-else-if="treeData" class="flex flex-col gap-4">
      <TreeNode
        v-for="node in treeData"
        :key="node.id"
        :node="node"
        :lang="selectedLang"
        :fallbackLang="fallbackLang"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
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
  childs?: Node[];
}

const languages = ["ru", "en", "fr"];
const selectedLang = ref("ru");
const fallbackLang = "ru";

// Состояния для отслеживания загрузки и ошибок
const treeData = ref<Node[] | null>(null);
const isLoading = ref(true); // Новое состояние для отслеживания загрузки
const error = ref(false); // Новое состояние для отслеживания ошибки

// Функция загрузки данных с обработкой ошибок
const loadTreeData = async () => {
  try {
    const data = await fetch("/assets/data/task_json.json").then((res) =>
      res.json()
    );
    treeData.value = data;
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Запуск загрузки данных при монтировании
onMounted(loadTreeData);
</script>

<style>
select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}
</style>
