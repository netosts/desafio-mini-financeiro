<template>
  <q-page padding style="background-color: #f7f7f8">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-form @submit="onSubmit">
          <q-card-section>
            <h3 class="add-dialog--title">
              Adicionar
              {{ promptValues.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
            </h3>
            <q-select
              flat
              v-model="promptValues.categoria"
              :options="categoriesStore.options"
              label="Categoria"
              autofocus
              lazy-rules
              :rules="[
                (val: string) =>
                  (val && val.length > 0) ||
                  'Por favor, selecione uma categoria',
              ]"
            />

            <q-select
              v-model="promptValues.cliente"
              :options="clientsStore.options"
              label="Cliente"
              autofocus
              lazy-rules
              :rules="[
                (val: string) =>
                  (val && val.length > 0) || 'Por favor, selecione um cliente',
              ]"
            />

            <q-input
              type="number"
              v-model.number="promptValues.valor"
              :label="promptValues.tipo === 'entrada' ? 'Entrada' : 'Saída'"
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
            <q-btn flat label="Salvar" type="submit" />
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
      style="height: 400px"
      flat
      bordered
      title="Entradas e Saídas"
      :rows="manager.rows"
      :columns="columns"
      row-key="name"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <span class="finance-history">Histórico Financeiro</span>

        <q-space />

        <q-btn-dropdown color="primary" label="Filtro">
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
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer">
          <q-popup-edit
            :cover="$q.screen.lt.sm ? true : false"
            anchor="center middle"
            v-model="props.row"
            @save="manager.updateRecord"
            buttons
            label-set="Salvar"
            label-cancel="Cancelar"
            v-slot="scope"
          >
            <div class="popup-title">
              <span>Atualizar Registro</span>
              <q-btn
                color="red"
                text-color="white"
                label="Deletar"
                class="q-ma-md"
                @click="manager.deleteRecord(props.row.id)"
                @click.stop.prevent="scope.cancel"
              />
            </div>

            <q-select
              label="Categoria"
              v-model="scope.value.categoria"
              :options="categoriesStore.options"
              :rules="[
                (val: string) =>
                  (val && val.length > 0) ||
                  'Por favor, selecione uma categoria',
              ]"
              dense
              autofocus
            />
            <q-select
              label="Cliente"
              v-model="scope.value.cliente"
              :options="clientsStore.options"
              :rules="[
                (val: string) =>
                  (val && val.length > 0) ||
                  'Por favor, selecione um cliente',
              ]"
              dense
              autofocus
            />
            <q-select
              label="Tipo"
              v-model="scope.value.tipo"
              :options="managerTypesList"
              :rules="[
                (val: string) =>
                  (val && val.length > 0) ||
                  'Por favor, selecione um tipo',
              ]"
              dense
              autofocus
            />
            <q-input
              type="number"
              label="Valor"
              v-model.number="scope.value.valor"
              :rules="[
                (val:number) => (val && val > 0) || 'Por favor, informe um valor',
              ]"
              dense
              autofocus
            />
          </q-popup-edit>
          <q-td key="categoria" :props="props">{{ props.row.categoria }}</q-td>
          <q-td key="cliente" :props="props">{{ props.row.cliente }}</q-td>
          <q-td key="tipo" :props="props">{{ props.row.tipo }}</q-td>
          <q-td key="valor" :props="props">
            R${{ props.row.valor.toFixed(2) }}
          </q-td>
        </q-tr>
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
        :direction="$q.screen.lt.sm ? 'up' : 'left'"
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
import { QTableColumn } from 'quasar';

onMounted(() => {
  manager.init();
});

export interface PromptValues {
  id?: number;
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

const columns: QTableColumn[] = [
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

const managerTypesList = ['Entrada', 'Saída'];

async function onSubmit() {
  try {
    prompt.value = false;
    if (promptValues.tipo === 'saida' && promptValues.valor !== undefined) {
      promptValues.valor = promptValues.valor * -1;
    }
    await manager.addRecord(promptValues as PromptValues);
    promptValues.tipo = undefined;
    promptValues.categoria = undefined;
    promptValues.cliente = undefined;
    promptValues.valor = undefined;
  } catch (err) {
    alert('Algo deu errado! Não foi possível adicionar o valor.');
    console.error(err);
  }
}

function promptEntry() {
  promptValues.tipo = 'entrada';
  prompt.value = true;
}

function promptExit() {
  promptValues.tipo = 'saida';
  prompt.value = true;
}
</script>

<style lang="scss" scoped>
.add-dialog {
  &--title {
    margin: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: rgb(64, 64, 64);
  }
}
.popup-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  span {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: rgb(64, 64, 64);
  }
}
.finance-history {
  font-size: 20px;
  font-weight: 500;
  color: rgb(64, 64, 64);
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
