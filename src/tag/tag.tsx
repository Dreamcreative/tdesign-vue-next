import { defineComponent, h } from 'vue';
import { CloseIcon } from 'tdesign-icons-vue-next';
import CLASSNAMES from '../utils/classnames';
import config from '../config';
import props from './props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { ClassName, TNodeReturnValue } from '../common';
import { emitEvent } from '../utils/event';

import mixins from '../utils/mixins';
import getConfigReceiverMixins, { TagConfig } from '../config-provider/config-receiver';

const { prefix } = config;
const name = `${prefix}-tag`;

export default defineComponent({
  ...mixins(getConfigReceiverMixins<TagConfig>('tag')),
  name: 'TTag',
  props: { ...props },
  emits: ['close', 'click'],
  computed: {
    tagClass(): ClassName {
      return [
        `${name}`,
        `${name}--${this.theme}`,
        CLASSNAMES.SIZE[this.size],
        `${name}--${this.variant}`,
        this.shape !== 'square' && `${name}--${this.shape}`,
        {
          [`${name}--ellipsis`]: this.maxWidth,
          [`${name}--close`]: this.closable,
          [`${prefix}-is-disabled`]: this.disabled,
          [`${name}--disabled`]: this.disabled,
        },
      ];
    },
    tagStyle(): Record<string, string> {
      if (this.maxWidth) return { maxWidth: `${this.maxWidth}px` };
      return {};
    },
  },
  methods: {
    handleClose({ e }: { e: MouseEvent }): void {
      emitEvent(this, 'close', { e });
    },
    handleClick(event: MouseEvent): void {
      emitEvent(this, 'click', event);
    },
    getCloseIcon() {
      if (!this.closable) return null;
      const iconClassName = `${prefix}-tag__icon-close`;
      // console.log(this.global.closeIcon);

      if (this.global.closeIcon) {
        const component = this.global.closeIcon();
        return h(component, {
          class: iconClassName,
        });
      }
      return <CloseIcon onClick={this.handleClose} class={iconClassName} />;
    },
  },
  render() {
    // 关闭按钮 自定义组件使用 nativeOnClick 绑定事件
    const closeIcon = this.getCloseIcon();
    // 标签内容
    const tagContent: TNodeReturnValue = renderContent(this, 'default', 'content');
    // 图标
    const icon = renderTNodeJSX(this, 'icon');

    return (
      <span class={this.tagClass} style={this.tagStyle} onClick={this.handleClick}>
        {icon}
        {this.maxWidth ? (
          <span style={this.tagStyle} class={`${name}--text`}>
            {tagContent}
          </span>
        ) : (
          tagContent
        )}
        {closeIcon}
      </span>
    );
  },
});
