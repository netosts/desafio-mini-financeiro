<template>
  <q-page padding>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-form @submit="onSubmit">
          <q-card-section>
            <div class="text-h6">Categoria</div>
            <q-select
              dense
              v-model="promptValues.categoria"
              :options="categoriesStore.options"
              autofocus
              lazy-rules
              :rules="[
                (val: string) =>
                  (val && val.length > 0) ||
                  'Por favor, selecione uma categoria',
              ]"
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Cliente</div>
            <q-select
              dense
              v-model="promptValues.cliente"
              :options="clientsStore.options"
              autofocus
              lazy-rules
              :rules="[
                (val: string) =>
                  (val && val.length > 0) || 'Por favor, selecione um cliente',
              ]"
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6">{{ promptValues.tipo }}</div>
            <q-input
              dense
              type="number"
              v-model.number="promptValues.valor"
              autofocus
              lazy-rules
              :rules="[
                (val: number) => (val && val > 0) || 'Por favor, informe um valor',
              ]"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancelar" type="button" v-close-popup />
            <q-btn
              flat
              :label="`Adicionar ${promptValues.tipo}`"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-input
      flat
      v-model="inputFilter"
      @update:model-value="manager.findRecords(inputFilter)"
      label="Pesquisar por Cliente"
      style="margin-bottom: 20px"
    />
    <q-btn-dropdown color="info" label="Filtro">
      <q-list>
        <q-item clickable v-close-popup @click="manager.filterRecords('All')">
          <q-item-section>
            <q-item-label>Todos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="(item, id) in categoriesStore.categories"
          :key="id"
          clickable
          v-close-popup
          @click="manager.filterRecords(item.id)"
        >
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-table
      title="Entradas e Saídas"
      :rows="manager.rows"
      :columns="columns"
      row-key="name"
    />
    <div class="q-pa-md" style="padding-bottom: 30px">
      <div class="q-mt-md">
        <q-fab
          v-model="addValueButton"
          label="Adicionar"
          label-position="left"
          color="green"
          icon="keyboard_arrow_right"
          direction="right"
        >
          <q-fab-action
            color="primary"
            @click="promptEntry"
            icon="add"
            label="Entrada"
          />
          <q-fab-action
            color="red"
            @click="promptExit"
            icon="horizontal_rule"
            label="Saída"
          />
        </q-fab>
      </div>
    </div>
    {{ total }}
  </q-page>
</template>

<script setup lang="ts">
import { useManager } from 'src/stores/manager';
import { useCategories } from 'src/stores/categories';
import { useClients } from 'src/stores/clients';
import { computed, onMounted, ref, reactive } from 'vue';

onMounted(() => {
  manager.init();
});

export interface PromptValues {
  tipo: string | undefined;
  categoria: string | undefined;
  cliente: string | undefined;
  valor: number | undefined;
}

const addValueButton = ref<boolean | undefined>(false);
const prompt = ref<boolean | undefined>(false);
const promptValues = reactive<PromptValues>({
  tipo: undefined,
  categoria: undefined,
  cliente: undefined,
  valor: undefined,
});

const inputFilter = ref('');

const manager = useManager();
const categoriesStore = useCategories();
const clientsStore = useClients();
const total = computed(() => manager.total);

const columns = [
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
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
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    sortable: true,
    align: 'left',
  },
  {
    name: 'valor',
    label: 'Valor',
    field: 'valor',
    sortable: true,
    align: 'left',
  },
];

async function onSubmit() {
  prompt.value = false;
  if (promptValues.tipo === 'Saída' && promptValues.valor !== undefined) {
    promptValues.valor = promptValues.valor * -1;
  }
  await manager.addRecord(promptValues as PromptValues);
  promptValues.tipo = undefined;
  promptValues.categoria = undefined;
  promptValues.cliente = undefined;
  promptValues.valor = undefined;
}

function promptEntry() {
  promptValues.tipo = 'Entrada';
  prompt.value = true;
}

function promptExit() {
  promptValues.tipo = 'Saída';
  prompt.value = true;
}
</script>
