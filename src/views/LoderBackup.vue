<template>
  <img
    :src= "fileUrl" 
    alt="Fit-files in storage"
    class="fitfile data"
    style="width: 150px"
  />
  <div id="display"></div>
  <div style="width: 150px">
    <input
      style="visibility: hidden; position: absolute"
      type="file"
      id="single"
      accept=".fit"
      @change="uploadFitFile"
      :disabled="uploading"
    />
    <label class="button primary block" htmlFor="single">
      <span>{{ uploading ? "UpLoading..." : "Upload" }}</span>
    </label>
  </div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
import { supabase } from "@/supabase";
import missingImage from "@/assets/no_image_available.jpeg";
import fitDecoder from "fit-decoder"

export default {
  name: "Loader",
  props: {
    url: String
  },
  emits: ["onUpload"],
  setup(props, ctx) {
    const fileUrl = ref(null);
    const uploading = ref(false);

    watch(
      () => props?.url,
      (cur) => {
        downloadImage(cur);
      }
    );


    const downloadImage = async path => {
      console.log("download path", path);

      if (!path) {
        fileUrl.value = missingImage;
        return;
      }

      const { data, error } = await supabase.storage
        .from("fitfilebucket")
        .download(path);
      if (error) throw error;
      fileUrl.value = URL.createObjectURL(data);

      //start edit
      var buffer = await data.arrayBuffer();

      const jsonRaw = fitDecoder.fit2json(buffer);
      const json = fitDecoder.parseRecords(jsonRaw);
      //const outPut = JSON.stringify(fitDecoder.getRecordFieldValue(json, "record", "power"));
      console.log(
        JSON.stringify(fitDecoder.getRecordFieldValue(json, "record", "power")))
        document.getElementById('display').innerHTML = JSON.stringify(fitDecoder.getRecordFieldValue(json, "record", "power"))
//end edit
    };

    

    async function uploadFitFile(event) {
      try {
        uploading.value = true;

        if (!event.target.files || event.target.files.length === 0) {
          throw new Error("You must select an file to upload.");
        }

        const user = supabase.auth.user();
        const file = event.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { error: uploadError } = await supabase.storage
          .from("fitfilebucket")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        ctx.emit("onUpload", filePath);
      } catch (error) {
        alert(error.message);
      } finally {
        uploading.value = false;
      }
    }

  /* const listAll = async => {

    const { data, error } = await supabase.storage.from('fitfilebucket').list();
      if (error) throw error;
      var fileList = await data.arrayBuffer();
      return fileList;
    }; 
 */
    return {
      fileUrl,
      uploading,
      uploadFitFile,
      //outPut
      //listAll
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>