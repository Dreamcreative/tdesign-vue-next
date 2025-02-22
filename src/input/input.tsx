import { defineComponent, h, VNodeChild, nextTick } from 'vue';
import { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';
import { InputValue } from './type';
import { getCharacterLength, omit } from '../utils/helper';
import getConfigReceiverMixins, { InputConfig } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

import CLASSNAMES from '../utils/classnames';
import { prefix } from '../config';
import props from './props';
import { emitEvent } from '../utils/event';

const name = `${prefix}-input`;

function getValidAttrs(obj: Record<string, unknown>): Record<string, unknown> {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

export default defineComponent({
  ...mixins(getConfigReceiverMixins<InputConfig>('input')),
  name: 'TInput',
  inheritAttrs: false,
  props: { ...props },
  emits: ['enter', 'keydown', 'keyup', 'keypress', 'clear', 'change', 'input', 'focus', 'blur'],
  data() {
    return {
      isHover: false,
      focused: false,
      renderType: this.type,
    };
  },
  computed: {
    showClear(): boolean {
      return this.value && !this.disabled && this.clearable && this.isHover;
    },
    inputAttrs(): Record<string, any> {
      return getValidAttrs({
        autofocus: this.autofocus,
        disabled: this.disabled,
        readonly: this.readonly,
        autocomplete: this.autocomplete,
        placeholder: this.placeholder || this.t(this.global.placeholder),
        maxlength: this.maxlength,
        name: this.name || undefined,
        type: this.renderType,
      });
    },
  },
  watch: {
    autofocus: {
      handler(val) {
        if (val === true) {
          this.$nextTick(() => {
            (this.$refs.refInputElem as HTMLInputElement).focus();
          });
        }
      },
      immediate: true,
    },
  },
  created() {
    this.composing = false;
  },
  methods: {
    mouseEvent(v: boolean) {
      this.isHover = v;
    },
    renderIcon(icon: string | Function | undefined, iconType: 'prefix-icon' | 'suffix-icon') {
      if (typeof icon === 'function') {
        return icon(h);
      }
      if (this.$slots[iconType]) {
        return this.$slots[iconType](null);
      }
      return null;
    },
    setInputValue(v: InputValue = ''): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      const sV = String(v);
      if (!input) {
        return;
      }
      if (input.value !== sV) {
        input.value = sV;
      }
    },
    focus(): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      input?.focus();
    },
    blur(): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      input?.blur();
    },
    handleInput(e: InputEvent): void {
      // 中文输入的时候inputType是insertCompositionText所以中文输入的时候禁止触发。
      const checkInputType = e.inputType && e.inputType === 'insertCompositionText';
      if (e.isComposing || checkInputType) return;
      this.inputValueChangeHandle(e);
    },

    handleKeydown(e: KeyboardEvent) {
      if (this.disabled) return;
      const { code } = e;
      if (code === 'Enter' || code === 'NumpadEnter') {
        emitEvent(this, 'enter', this.value, { e });
      } else {
        emitEvent(this, 'keydown', this.value, { e });
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (this.disabled) return;
      emitEvent(this, 'keyup', this.value, { e });
    },
    handleKeypress(e: KeyboardEvent) {
      if (this.disabled) return;
      emitEvent(this, 'keypress', this.value, { e });
    },
    emitPassword() {
      const { renderType } = this;
      const toggleType = renderType === 'password' ? 'text' : 'password';
      this.renderType = toggleType;
    },
    emitClear({ e }: { e: MouseEvent }) {
      emitEvent(this, 'clear', e);
      emitEvent(this, 'change', '', e);
      emitEvent(this, 'input', '', e);
    },
    emitFocus(e: FocusEvent) {
      if (this.disabled) return;
      this.focused = true;
      emitEvent(this, 'focus', this.value, { e });
    },
    emitBlur(e: FocusEvent) {
      this.focused = false;
      emitEvent(this, 'blur', this.value, { e });
    },
    onCompositionend(e: CompositionEvent) {
      this.inputValueChangeHandle(e);
    },
    inputValueChangeHandle(e: InputEvent | CompositionEvent) {
      const { target } = e;
      let val = (target as HTMLInputElement).value;
      if (this.maxcharacter && this.maxcharacter >= 0) {
        const stringInfo = getCharacterLength(val, this.maxcharacter);
        val = typeof stringInfo === 'object' && stringInfo.characters;
      }
      emitEvent(this, 'change', val, { e });
      emitEvent(this, 'input', val, { e });
      // 受控
      nextTick(() => this.setInputValue(this.value));
    },
  },
  render(): VNodeChild {
    const inputEvents = getValidAttrs({
      onFocus: this.emitFocus,
      onBlur: this.emitBlur,
      onKeydown: this.handleKeydown,
      onKeyup: this.handleKeyUp,
      onKeypresss: this.handleKeypress,
      // input的change事件是失去焦点或者keydown的时候执行。这与api定义的change不符，所以不做任何变化。
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange: () => {},
    });

    const wrapperAttrs = omit(this.$attrs, [...Object.keys(inputEvents), ...Object.keys(this.inputAttrs), 'input']);

    // @ts-ignore: TODO
    const prefixIcon = this.renderIcon(this.prefixIcon, 'prefix-icon');

    // @ts-ignore: TODO
    let suffixIcon = this.renderIcon(this.suffixIcon, 'suffix-icon');

    if (this.showClear) {
      suffixIcon = <CloseCircleFilledIcon class={`${name}__suffix-clear`} onClick={this.emitClear} />;
    }

    if (this.type === 'password') {
      if (this.renderType === 'password') {
        suffixIcon = <BrowseOffIcon class={`${name}__suffix-clear`} onClick={this.emitPassword} />;
      } else if (this.renderType === 'text') {
        suffixIcon = <BrowseIcon class={`${name}__suffix-clear`} onClick={this.emitPassword} />;
      }
    }

    const classes = [
      name,
      CLASSNAMES.SIZE[this.size] || '',
      {
        [CLASSNAMES.STATUS.disabled]: this.disabled,
        [CLASSNAMES.STATUS.focused]: this.focused,
        [`${prefix}-is-${this.status}`]: this.status,
        [`${name}--prefix`]: prefixIcon,
        [`${name}--suffix`]: suffixIcon,
      },
    ];
    return (
      <div
        class={classes}
        onMouseenter={() => this.mouseEvent(true)}
        onMouseleave={() => this.mouseEvent(false)}
        {...{ ...wrapperAttrs }}
      >
        {prefixIcon ? <span class={`${name}__prefix`}>{prefixIcon}</span> : null}
        <input
          {...{ ...this.inputAttrs }}
          {...inputEvents}
          ref="refInputElem"
          value={this.value}
          class={`${name}__inner`}
          onInput={(e: Event) => this.handleInput(e as InputEvent)}
          onCompositionend={this.onCompositionend}
        />
        {suffixIcon ? (
          <span class={[`${name}__suffix`, { [`${name}__clear`]: this.showClear }]}>{suffixIcon}</span>
        ) : null}
      </div>
    );
  },
});
