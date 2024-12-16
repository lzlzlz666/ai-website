<template>
  <div class="chat-container">
    <chat-view></chat-view>
  </div>
</template>

<script>
import ChatView from '@/views/chat/components/ChatView.vue'

export default {
  components: {
    ChatView
  },
}
</script>

<style scoped lang="scss">
.chat-container {
  height: calc(100vh - 104px);
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
</style>
