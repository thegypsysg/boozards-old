<template>
  <div>
  <v-dialog persistent width="500" v-model="isDelete">
      <v-card>
        <v-card-title>{{modalTitle}}</v-card-title>
        <v-card-text>
          {{modalText}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteAddressMaster">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
	name: 'ConfirmationModal',
  props: [{
		modalText: String,
		modalTitle: String,
		cancelDelete: Function,
		deleteAddressMaster: Function,
	}],
	data: () => ({
		idAddressMaster: null,
		isDelete: false,
		isDeleteLoading: false,
	}),
	methods: {
		// cancelDelete() {
		// this.idAddressMaster = null;
		// this.isDelete = false;
		// },
		// openDeleteConfirm(itemId) {
		// this.idAddressMaster = itemId;
		// this.isDelete = true;
		// },
		// cancelConfirmation() {
		// this.idAddressMaster = null;
		// this.isDelete = false;
		// },
		// deleteAddressMaster() {
		// this.isDeleteLoading = true;
		// setTimeout(() => {
		// 	this.isDeleteLoading = false;
		// }, 2000);
		// }
	},
};
</script>