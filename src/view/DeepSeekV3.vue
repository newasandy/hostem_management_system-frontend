<template>
  <div class="m-3 p-2 rounded-lg shadow-lg">
    <form @submit.prevent="deepfreeOpen">
      <div class="flex gap-3">
        <!-- <InputText v-model="requestTxt" /> -->
        <Textarea v-model="requestTxt" rows="5" cols="30" />
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
import { InputText, Button, Textarea } from "primevue";
// import { Marked } from "marked"
import { marked } from "marked";

const myres = ref("");
const requestTxt = ref("");
const demos = () => {
  console.log(requestTxt.value);
};
const deepv3 = async () => {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer **************************************",
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
  });

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
          "Bearer *********************************************",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        // model: "openai/gpt-4.1-nano",
        // model: "deepseek/deepseek-chat:free",
        // model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: requestTxt.value }],
        // messages: [
        //   {
        //     role: "user",
        //     content: [
        //       {
        //         type: "text",
        //         text: requestTxt.value,
        //       },
        //     ],
        //   },
        // ],
      }),
    }
  );
  const data = await response.json();
  myres.value = marked.parse((await data.choices?.[0]?.message?.content) || "");
};
</script>
