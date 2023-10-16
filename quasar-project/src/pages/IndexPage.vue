<template>
  <q-page padding>
    <q-table
      title="Entradas e Saídas"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useManager } from 'src/stores/manager';
import { computed, onMounted } from 'vue';

onMounted(() => {
  manager.init();
});

const manager = useManager();
const rows = computed<object[]>(() => manager.records);

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Id',
    align: 'left',
    field: (row: any) => row.id,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'label',
    label: 'Categoria',
    field: 'label',
    sortable: true,
    align: 'left',
  },
  {
    name: 'cliente',
    label: 'Cliente',
    field: 'cliente',
    sortable: true,
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    sortable: true,
    align: 'left',
  },
];
</script>
