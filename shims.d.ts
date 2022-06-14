import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare global {
  namespace preact.JSX {
    interface HTMLAttributes<T> extends AttributifyAttributes {}
  }
}
