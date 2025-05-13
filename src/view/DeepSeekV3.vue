<template>
  <div class="m-3 p-2 rounded-lg shadow-lg">
    <form @submit.prevent="deepfreeOpen">
      <div class="flex gap-3">
        <InputText v-model="requestTxt" />
        <Button type="submit" label="My V3" />
      </div>
    </form>
    <div class="mt-3">
      <div v-html="myres"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { InputText, Button } from "primevue";
// import { Marked } from "marked"
import { marked } from "marked";

const myres = ref("");
const requestTxt = ref("");

const deepv3 = async () => {
  const response = await fetch(
    // "https://openrouter.ai/api/v1/chat/completions",
    "https://api.deepseek.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        // Authorization:
        //   "Bearer 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",
        Authorization: "Bearer sk-5f4a5dfe4ef44a208c12736482e0cc01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // model: "deepseek/deepseek-chat-v3-0324:free",
        // model: "deepseek/deepseek-chat:free",
        // model: "deepseek/deepseek-r1:free",
        model: "deepseek-reasoner",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "What is the AI?" },
        ],
        stream: false,
      }),
    }
  );

  const data = response.json();
  myres.value = data.choices?.[0]?.message?.content || "";
};

const deepfreeOpen = async () => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        // model: "deepseek/deepseek-chat:free",
        // model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: requestTxt.value }],
      }),
    }
  );
  const data = await response.json();
  myres.value = marked.parse((await data.choices?.[0]?.message?.content) || "");
};
</script>
