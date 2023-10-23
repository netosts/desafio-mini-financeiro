<template>
  <q-dialog v-model="promptDialog" persistent>
    <q-card :class="$q.screen.lt.sm ? 'add-dialog--sm' : 'add-dialog--default'">
      <q-form @submit="onSubmit">
        <q-card-section>
          <h3 class="add-dialog--title">
            Adicionar
            {{ type === 'entrada' ? 'Entrada' : 'Saída' }}
          </h3>

          <q-select
            flat
            v-model.number="promptValues.categoria_id"
            :options="categoriesStore.options"
            label="Categoria"
            emit-value
            map-options
            autofocus
            lazy-rules
            :rules="[
                (val: number) =>
                  (val && val !== 0) ||
                  'Por favor, selecione uma categoria',
              ]"
          />

          <q-select
            v-model.number="promptValues.cliente_id"
            :options="clientsStore.options"
            label="Cliente"
            emit-value
            map-options
            autofocus
            lazy-rules
            :rules="[
                (val: number) =>
                  (val && val !== 0) || 'Por favor, selecione um cliente',
              ]"
          />

          <q-input
            type="number"
            v-model.number="promptValues.valor"
            :label="type === 'entrada' ? 'Entrada' : 'Saída'"
            autofocus
            lazy-rules
            step="any"
            :rules="[
                (val: number) => (val && val > 0) || 'Por favor, informe um valor',
              ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancelar"
            type="button"
            @click="emit('prompt', false)"
          />
          <q-btn flat label="Adicionar" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useCategories } from 'src/stores/categories';
import { useClients } from 'src/stores/clients';
import { useManager } from 'src/stores/manager';
import { Record } from 'src/types/manager';
import { reactive, computed } from 'vue';

const manager = useManager();
const categoriesStore = useCategories();
const clientsStore = useClients();

const props = defineProps<{
  type?: string;
  prompt: boolean;
}>();

const emit = defineEmits(['prompt']);

const promptDialog = computed<boolean>(() => props.prompt);
const promptValues = reactive<Record>({
  tipo: undefined,
  categoria_id: undefined,
  cliente_id: undefined,
  valor: undefined,
});

async function onSubmit() {
  try {
    emit('prompt', false);
    if (promptValues.tipo === 'saida' && promptValues.valor !== undefined) {
      promptValues.valor = promptValues.valor * -1;
    }
    promptValues.tipo = props.type;
    await manager.addRecord(promptValues);
    promptValues.tipo = undefined;
    promptValues.categoria_id = undefined;
    promptValues.cliente_id = undefined;
    promptValues.valor = undefined;
  } catch (err) {
    alert('Algo deu errado! Não foi possível adicionar o valor.');
    console.error(err);
  }
}
</script>

<style lang="scss" scoped>
$text-title: rgb(65, 65, 65);
.add-dialog {
  &--sm {
    min-width: 260px;
  }
  &--default {
    min-width: 350px;
  }
  &--title {
    margin: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: $text-title;
  }
}
</style>
