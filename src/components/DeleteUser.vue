<template>
  <div class="delete-user">
    <div class="content">
      <template v-if="!deleted">
        <h2 class="expa-large">{{ $t('removeUserTitle') }}</h2>
        <p class="desc">{{ $t('removeUserContent') }}</p>
        <button @click="deleteUser" v-if="!loading">{{$t('removeUserConfirm')}}</button>
        <Loader v-else />
        <p
          v-if="error"
          v-html="$t('removedUserError', {id: $store.state.user.id, key: $store.state.key})"
          class="error"
        ></p>
        <a @click="$store.commit('SET_DELETING', false)">{{$t('removeUserCancel')}}</a>
      </template>
      <template v-else>
        <h2 class="expa-large">{{ $t('removedUserTitle') }}</h2>
        <p class="desc">{{ $t('removedUserContent') }}</p>
        <a @click="reload" class="reload">{{ $t('removedUserReload') }}</a>
      </template>
    </div>
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";

export default {
  name: "DeleteUser",
  components: { Loader: SingleLoader },
  data() {
    return {
      deleted: false,
      error: false,
      loading: false
    };
  },
  methods: {
    deleteUser() {
      this.loading = true;
      return this.$store.dispatch("deleteCurrentUser").then(r => {
        this.loading = false;
        if (r) {
          this.deleted = true;
          setTimeout(() => window.location.reload(), 5000);
        } else this.error = true;
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
  color: $col-white;
  .content {
    text-align: center;
    max-width: 560px;
    padding: 1.5rem;
    border: 1px solid $col-white;
    background-color: $col-dark;
  }
  p {
    margin-bottom: 1rem;
    &.desc {
      margin-top: 1rem;
      margin-bottom: 2rem;
    }
  }
  button {
    margin-bottom: 0;
  }
  a {
    display: block;
    margin-top: 0.5rem;
    &.reload {
      color: $col-green;
    }
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