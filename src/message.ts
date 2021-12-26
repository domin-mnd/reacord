import type { EmbedOptions } from "./embed/embed-options"

export type MessageOptions = {
  content: string
  embeds: EmbedOptions[]
  actionRows: Array<Array<MessageButtonOptions | MessageSelectOptions>>
}

export type MessageButtonOptions = {
  type: "button"
  customId: string
  label?: string
  style?: "primary" | "secondary" | "success" | "danger"
  disabled?: boolean
  emoji?: string
}

export type MessageSelectOptions = {
  type: "select"
  customId: string
}

export type Message = {
  edit(options: MessageOptions): Promise<void>
  disableComponents(): Promise<void>
}
