<template>
  <div class="delete-user">
    <div class="content">
      <template v-if="!deleted">
        <h2 class="expa-large">{{ $t('removeUserTitle') }}</h2>
        <p>{{ $t('removeUserContent') }}</p>
        <button @click="deleteUser">{{$t('removeUserConfirm')}}</button>
        <p v-if="error" v-html="$t('removedUserError')" class="error"></p>
        <a @click="$store.commit('SET_DELETING', false)">{{$t('removeUserCancel')}}</a>
      </template>
      <template v-else>
        <h2 class="expa-large">{{ $t('removedUserTitle') }}</h2>
        <p>{{ $t('removedUserContent') }}</p>
        <a @click="reload">{{ $t('removedUserReload') }}</a>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteUser",
  data() {
    return {
      deleted: false,
      error: false
    };
  },
  methods: {
    deleteUser() {
      return this.$store.dispatch("deleteCurrentUser").then(r => {
        if (r) this.deleted = true;
        else this.error = true;
      });
    },
    reload() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.delete-user {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999;
  pointer-events: all;
  background-color: rgba($col-dark, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    text-align: center;
    max-width: 500px;
    padding: 1rem;
    border: 1px solid $col-white;
    background-color: $col-dark;
  }
  p {
    margin-bottom: 1rem;
  }
  button {
    margin-bottom: 0;
  }
  a {
    display: block;
    margin-top: 0.5rem;
  }
  ::v-deep .error {
      margin: 1rem 0;
      color: $col-green;
      a {
          text-transform: none;
      }
  }
}
</style>