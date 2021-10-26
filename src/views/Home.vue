
<template>
  <div class="form-widget">
    <h2 class="header">Welcome! </h2>
    <p>You are signed in as: {{ userEmail }}</p>
    <loader :url="file_url" @onUpload="handleImageUpload" />
    
    <div>
    </div>

    <div>
      <button class="button block" @click="signOut">
        Sign Out
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Loader from "./Loader.vue";
import { supabase } from "@/supabase";
import { useStore } from "vuex"
import { computed } from "vue"

export default defineComponent({
  name: "Home",
  components: {
    Loader
  },
  setup() {
    const file_url = ref("");
    const store = useStore();
    const userEmail = computed(() => store.state.user);
    const signOut = () => {
      store.dispatch("signOutAction");
    };
    
    const handleImageUpload = async (path: string) => {
      file_url.value = path;

    };

    async function listAll() {

    const { data, error } = await supabase.storage.from('fitfilebucket').list();
      if (error) throw error;

      return data;
    }; 
 

    return {
      userEmail,
      store,
      file_url,
      supabase,
      handleImageUpload,
      signOut
    };
  }
});
</script>

<style scoped>
</style>
