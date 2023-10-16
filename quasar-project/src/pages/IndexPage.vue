<template>
  <q-page padding>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-form @submit="onSubmit">
          <q-card-section>
            <div class="text-h6">Categoria</div>
            <q-select
              dense
              v-model="promptValues.label"
              :options="manager.categories"
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
              :options="manager.clients"
              autofocus
              lazy-rules
              :rules="[
                (val: string) =>
                  (val && val.length > 0) || 'Por favor, selecione um cliente',
              ]"
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6">{{ promptValues.text }}</div>
            <q-input
              dense
              type="number"
              v-model.number="promptValues.value"
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
              :label="`Adicionar ${promptValues.text}`"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-input
      square
      outlined
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
          v-for="(item, id) in manager.categories"
          :key="id"
          clickable
          v-close-popup
          @click="manager.filterRecords(item)"
        >
          <q-item-section>
            <q-item-label>{{ item }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-table
      title="Entradas e Saídas"
      :rows="rows"
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
import { computed, onMounted, ref, reactive } from 'vue';
import { Record } from 'stores/manager';

onMounted(() => {
  manager.init();
});

interface PromptValues {
  text: string | undefined;
  label: string | undefined;
  cliente: string | undefined;
  value: number | undefined;
}

const addValueButton = ref<boolean | undefined>(false);
const prompt = ref<boolean | undefined>(false);
const promptValues = reactive<PromptValues>({
  text: undefined,
  label: undefined,
  cliente: undefined,
  value: undefined,
});

const inputFilter = ref('');

const manager = useManager();
const total = computed(() => manager.total);
const rows = computed<object[]>(() => manager.records);

const columns = [
  {
    name: 'label',
    label: 'Categoria',
    field: 'label',
    sortable: true,
    align: 'center',
  },
  {
    name: 'cliente',
    label: 'Cliente',
    field: 'cliente',
    sortable: true,
    align: 'center',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    sortable: true,
    align: 'center',
  },
];

async function onSubmit() {
  if (promptValues.text === 'Saída' && promptValues.value !== undefined) {
    promptValues.value = promptValues.value * -1;
  }
  delete promptValues.text;
  await manager.addRecord(promptValues as Record);
  prompt.value = false;
}

function promptEntry() {
  promptValues.text = 'Entrada';
  prompt.value = true;
}

function promptExit() {
  promptValues.text = 'Saída';
  prompt.value = true;
}
</script>
