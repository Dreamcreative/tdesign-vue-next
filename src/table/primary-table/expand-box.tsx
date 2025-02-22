import { defineComponent, h } from 'vue';
import isFunction from 'lodash/isFunction';
import { ChevronRightCircleIcon } from 'tdesign-icons-vue-next';
import mixins from '../../utils/mixins';
import getConfigReceiverMixins, { TableConfig } from '../../config-provider/config-receiver';

import { prefix } from '../../config';
import { Styles } from '../../common';
import primaryTableProps from '../primary-table-props';
import { renderTNodeJSX } from '../../utils/render-tnode';
import { emitEvent } from '../../utils/event';

export default defineComponent({
  ...mixins(getConfigReceiverMixins<TableConfig>('table')),
  name: `${prefix}-expand-box`,
  components: {
    ChevronRightCircleIcon,
  },
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
    },
    rowIndex: {
      type: Number,
    },
    expandIcon: primaryTableProps.expandIcon,
  },
  emits: ['click'],
  methods: {
    getDefaultIcon() {
      return isFunction(this.global.expandIcon) ? this.global.expandIcon(h) : <ChevronRightCircleIcon />;
    },
    getExpandIcon(expanded: boolean) {
      const style: Styles = {
        transition: 'transform .2s',
        display: 'flex',
        'align-items': 'center',
      };
      const icon = renderTNodeJSX(this, 'expandIcon', {
        params: { row: this.row, index: this.rowIndex },
        defaultNode: this.getDefaultIcon(),
      });
      if (expanded) {
        style.transform = 'rotate(90deg)';
      }
      if (!icon) return false;
      return <span style={style}>{icon}</span>;
    },
    handleClick(e: Event) {
      emitEvent(this, 'click', e);
    },
  },
  render() {
    const { expanded } = this;
    const icon = this.getExpandIcon(expanded);
    if (!icon) return null;
    return (
      <span class={`${prefix}-table__expand-box`} onClick={this.handleClick}>
        {icon}
      </span>
    );
  },
});
