import { ref } from 'vue';

const snackbarVisible = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

export function useGlobalSnackbar() {
  function showSnackbar(message, color) {
    snackbarMessage.value = message;
    snackbarColor.value = color;
    snackbarVisible.value = true;
  }

  return {
    snackbarVisible,
    snackbarMessage,
    snackbarColor,
    showSnackbar,
  };
}

export const { showSnackbar } = useGlobalSnackbar();
