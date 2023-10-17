<template>
  <q-page padding style="background-color: #f7f7f8">
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
              step="any"
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

    <div class="values-container">
      <div class="values-container__content">
        <q-icon name="savings" size="2rem" />
        <span>Total</span>
        <h2>R$ {{ manager.total }}</h2>
      </div>
      <div class="values-container__content">
        <q-icon name="attach_money" size="2rem" />
        <span>Entradas</span>
        <h2>R$ {{ manager.entries }}</h2>
      </div>
      <div class="values-container__content">
        <q-icon name="money_off" size="2rem" />
        <span>Saídas</span>
        <h2>R$ {{ manager.expenses }}</h2>
      </div>
    </div>

    <q-input
      flat
      v-model="inputFilter"
      @update:model-value="manager.findRecords(inputFilter)"
      label="Pesquisar por Nome do Cliente"
      style="margin-bottom: 20px"
    />

    <q-table
      style="height: 400px; padding: 5px"
      flat
      title="Entradas e Saídas"
      :rows="manager.rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <span class="finance-history">Histórico Financeiro</span>

        <q-space />

        <q-btn-dropdown outline color="primary" label="Filtro">
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="manager.filterRecords('All')"
            >
              <q-item-section>
                <q-item-label>TODOS</q-item-label>
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
      </template>
    </q-table>

    <div
      class="flex justify-end"
      style="padding-bottom: 20px; padding-top: 20px"
    >
      <q-fab
        v-model="addValueButton"
        label="Adicionar"
        label-position="right"
        color="primary"
        icon="keyboard_arrow_left"
        direction="left"
      >
        <q-fab-action
          color="light-blue-4"
          @click="promptEntry"
          icon="add"
          label="Entrada"
        />
        <q-fab-action
          color="pink-3"
          @click="promptExit"
          icon="horizontal_rule"
          label="Saída"
        />
      </q-fab>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useManager } from 'src/stores/manager';
import { useCategories } from 'src/stores/categories';
import { useClients } from 'src/stores/clients';
import { onMounted, ref, reactive } from 'vue';

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

const pagination = ref({ rowsPerPage: 0 });

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
  if (
    promptValues.valor !== undefined &&
    typeof promptValues.valor === 'string'
  ) {
    promptValues.valor = parseFloat(promptValues.valor);
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

<style lang="scss" scoped>
.finance-history {
  font-size: 20px;
  font-weight: 500;
}
.values-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 20px;

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    gap: 5px;
    padding: 10px 30px;
    border-radius: 10px;
    box-shadow: inset 1px -2px 2px rgba(0, 0, 0, 0.267);

    i {
      opacity: 0.3;
    }

    span {
      margin-bottom: -15px;
      font-size: 16px;
      font-weight: 500;
      color: white;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: white;
    }

    &:nth-child(1) {
      background-color: #5ad4dd;
    }
    &:nth-child(2) {
      background-color: #9dc6f8;
    }
    &:nth-child(3) {
      background-color: #f7a1c6;
    }
  }
}
</style>
