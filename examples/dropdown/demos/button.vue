<template>
  <div>
    <t-dropdown :options="options" @click="clickHandler">
      <t-button theme="default" variant="outline"> 下拉菜单 </t-button>
    </t-dropdown>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const options = [
  {
    content: '操作一',
    value: 1,
  },
  {
    content: '操作二',
    value: 2,
  },
  {
    content: '操作三',
    value: 3,
  },
  {
    content: '操作四',
    value: 4,
  },
];
export default defineComponent({
  setup() {
    const clickHandler = (data) => {
      MessagePlugin.success(`选中【${data.content}】`);
    };
    return {
      clickHandler,
      options,
    };
  },
});
</script>
<style scoped>
.t-button {
  margin-right: 20px;
}
</style>
