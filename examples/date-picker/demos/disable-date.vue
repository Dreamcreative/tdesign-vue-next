<template>
  <div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker theme="primary" mode="date" :disable-date="disableDate" />
    </div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker theme="primary" mode="date" :disable-date="disableDate2" />
    </div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker theme="primary" mode="date" :disable-date="disableDate3" />
    </div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker theme="primary" mode="date" range :disable-date="disableDate4" />
    </div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker theme="primary" mode="date" :disable-date="getDisableDate" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  setup() {
    const disableDate = [dayjs().subtract(1, 'day').format(), dayjs().subtract(2, 'day').format()];
    const disableDate2 = {
      before: dayjs().subtract(2, 'day').format(),
      after: dayjs().add(3, 'day').format(),
    };
    const disableDate3 = {
      from: dayjs().add(1, 'day').format(),
      to: dayjs().add(3, 'day').format(),
    };
    const disableDate4 = {
      before: dayjs().subtract(2, 'day').format(),
      after: dayjs().add(10, 'day').format(),
    };
    return {
      disableDate,
      disableDate2,
      disableDate3,
      disableDate4,
      getDisableDate(date) {
        // 禁用所有周六
        return dayjs(date).day() === 6;
      },
      onChange(value) {
        console.log(value);
      },
    };
  },
});
</script>
<style scoped>
.tdesign-demo-item--datepicker {
  margin-bottom: 12px;
}
</style>
