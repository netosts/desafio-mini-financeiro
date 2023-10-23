<template>
  <q-page padding style="background-color: #f7f7f8">
    <DialogInput
      :prompt="prompt"
      :type="promptType"
      @prompt="handleDialogInput"
    />

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
      class="q-px-sm"
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

        <q-btn-dropdown flat color="primary" label="Filtro">
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
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="categoria" :props="props">{{ props.row.categoria }}</q-td>
          <q-td key="cliente" :props="props">{{ props.row.cliente }}</q-td>
          <q-td key="tipo" :props="props">{{ props.row.tipo }}</q-td>
          <q-td key="valor" :props="props">
            R${{ props.row.valor.toFixed(2) }}
          </q-td>
          <q-td>
            <q-btn round size="sm" icon="update" />
            <q-popup-edit
              :cover="$q.screen.lt.sm ? true : false"
              anchor="center start"
              v-model="props.row"
              @save="manager.updateRecord"
              buttons
              label-set="Salvar"
              label-cancel="Cancelar"
              v-slot="scope"
            >
              <div class="popup-title">
                <span>Atualizar Registro</span>
              </div>
              <q-select
                label="Categoria"
                v-model="scope.value.categoria_id"
                :options="categoriesStore.options"
                emit-value
                map-options
                :rules="[
                (val: number) =>
                  (val && val !== 0) ||
                  'Por favor, selecione uma categoria',
              ]"
                dense
                autofocus
              />
              <q-select
                label="Cliente"
                v-model="scope.value.cliente_id"
                :options="clientsStore.options"
                emit-value
                map-options
                :rules="[
                (val: number) =>
                  (val && val !== 0) ||
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
          </q-td>
          <q-td>
            <q-btn round size="sm" icon="delete" />
            <q-popup-edit
              v-model="props.row"
              :cover="$q.screen.lt.sm ? true : false"
              anchor="center start"
              style="width: 250px"
              v-slot="scope"
            >
              <div class="popup-title">
                <span
                  >Tem certeza que deseja deletar o registro
                  {{ props.row.id }}?</span
                >
              </div>
              <div class="popup-buttons">
                <q-btn
                  color="grey-3"
                  text-color="black"
                  label="Cancelar"
                  @click.stop.prevent="scope.cancel"
                />
                <q-btn
                  color="red"
                  text-color="white"
                  label="Deletar"
                  @click="manager.deleteRecord(props.row.id)"
                  @click.stop.prevent="scope.cancel"
                />
              </div>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div
      class="q-pa-lg"
      :class="{
        'flex justify-end': !$q.screen.lt.sm,
        'fixed-bottom-right': $q.screen.lt.sm,
      }"
    >
      <q-fab
        v-model="addValueButton"
        color="primary"
        icon="add"
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
import { useMeta } from 'quasar';
import { useManager } from 'src/stores/manager';
import { useCategories } from 'src/stores/categories';
import { useClients } from 'src/stores/clients';
import { onMounted, ref } from 'vue';
import { QTableColumn } from 'quasar';
import DialogInput from 'src/components/DialogInput.vue';

const pageTitle = ref('Desafio Mini Financeiro');

useMeta(() => {
  return {
    title: pageTitle.value,
  };
});

onMounted(() => {
  manager.init();
});

const prompt = ref<boolean>(false);
const promptType = ref<string>('');
const addValueButton = ref<boolean | undefined>(false);

const inputFilter = ref('');

const manager = useManager();
const categoriesStore = useCategories();
const clientsStore = useClients();

const pagination = ref({ rowsPerPage: 0 });

const columns: QTableColumn[] = [
  {
    name: 'id',
    label: 'Id',
    field: 'id',
    sortable: true,
    align: 'left',
  },
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
  {
    name: 'update',
    label: 'Editar',
    field: 'update',
    sortable: true,
    align: 'left',
  },
  {
    name: 'delete',
    label: 'Deletar',
    field: 'delete',
    sortable: true,
    align: 'left',
  },
];

const managerTypesList = ['Entrada', 'Saída'];

function promptEntry() {
  promptType.value = 'entrada';
  prompt.value = true;
}

function promptExit() {
  promptType.value = 'saida';
  prompt.value = true;
}

function handleDialogInput(emittedValue: boolean) {
  prompt.value = emittedValue;
}
</script>

<style lang="scss" scoped>
$text-title: rgb(65, 65, 65);

.popup-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  span {
    padding: 10px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: $text-title;
  }
}
.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px;
}
.finance-history {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: $text-title;
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
