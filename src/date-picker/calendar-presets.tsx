import isFunction from 'lodash/isFunction';
import { PropType, defineComponent } from 'vue';
import { DatePickerConfig } from '../config-provider/config-receiver';
import { CalendarPresetsProps, DateValue, TdDatePickerProps } from './interface';
import { prefix } from '../config';
import { emitEvent } from '../utils/event';

import { Button as TButton } from '../button';

export default defineComponent({
  name: 'TCalendarPresets',
  components: {
    TButton,
  },
  props: {
    global: {
      type: Object as PropType<DatePickerConfig>,
    },
    presets: {
      type: Object as PropType<CalendarPresetsProps['presets']>,
    },
    onClick: Function,
  },
  methods: {
    clickPreset(value: DateValue | (() => DateValue)) {
      this.onClick(value);
    },
  },
  render() {
    const { presets } = this;
    return (
      <div class={`${prefix}-date-picker__presets`}>
        <ul>
          {presets &&
            Object.keys(presets).map((key: string) => (
              <li key={key}>
                <a onClick={() => this.clickPreset(presets[key])}>{key}</a>
              </li>
            ))}
        </ul>
      </div>
    );
  },
});
