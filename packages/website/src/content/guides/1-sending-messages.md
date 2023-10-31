---
title: Sending Messages
description: Sending messages by creating Reacord instances
slug: sending-messages
---

# Sending Messages with Instances

You can send messages via Reacord to a channel like so.

```tsx
client.once(Events.ClientReady, () => {
	const channel = await client.channels.fetch("abc123deadbeef")
	reacord.createChannelMessage(channel).render("Hello, world!")
})
```

The `.createChannelMessage()` function creates a **Reacord instance**. You can pass strings, numbers, or anything that can be rendered by React, such as JSX!

Components rendered through this instance can include state and effects, and the message on Discord will update automatically.

```tsx
import { useEffect, useState } from "react"

function Uptime() {
	const [startTime] = useState(Date.now())
	const [currentTime, setCurrentTime] = useState(Date.now())

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(Date.now())
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	return <>this message has been shown for {currentTime - startTime}ms</>
}

client.once(Events.ClientReady, () => {
	const instance = reacord.createChannelMessage(channel)
	instance.render(<Uptime />)
})
```

The instance can be rendered to multiple times, which will update the message each time.

```tsx
interface HelloProps {
	subject: string
}

const Hello = ({ subject }: HelloProps) => <>Hello, {subject}!</>

client.once(Events.ClientReady, () => {
	const instance = reacord.createChannelMessage(channel)
	instance.render(<Hello subject="World" />)
	instance.render(<Hello subject="Moon" />)
})
```

You can specify various options for the message:

```tsx
const instance = reacord.createChannelMessage(channel, {
	tts: true,
	reply: {
		messageReference: someMessage.id,
	},
	flags: [MessageFlags.SuppressNotifications],
})
```

See the [Discord.js docs](https://discord.js.org/#/docs/discord.js/main/typedef/MessageCreateOptions) for all of the available options.

## Cleaning Up Instances

If you no longer want to use the instance, you can clean it up in a few ways:

- `instance.destroy()` - This will remove the message.
- `instance.deactivate()` - This will keep the message, but it will disable the components on the message, and no longer listen to user interactions.

By default, Reacord has a max limit on the number of active instances, and deactivates older instances to conserve memory. This can be configured through the Reacord options:

```ts
const reacord = new ReacordDiscordJs(client, {
	// after sending four messages,
	// the first one will be deactivated
	maxInstances: 3,
})
```

## Discord Slash Commands

<aside>
This section also applies to other kinds of application commands, such as context menu commands.
</aside>

To reply to a command interaction, use the `.createInteractionReply()` function. This function returns an instance that works the same way as the one from `.createChannelMessage()`. Here's an example:

```tsx
import { Client, Events } from "discord.js"
import { Button, ReacordDiscordJs } from "reacord"
import * as React from "react"

const client = new Client({ intents: [] })
const reacord = new ReacordDiscordJs(client)

client.once(Events.ClientReady, () => {
	client.application?.commands.create({
		name: "ping",
		description: "pong!",
	})
})

client.on(Events.InteractionCreate, (interaction) => {
	if (interaction.isCommand() && interaction.commandName === "ping") {
		// Use the createInteractionReply() function instead of createChannelMessage
		reacord.createInteractionReply(interaction).render(<>pong!</>)
	}
})

await client.login(process.env.DISCORD_TOKEN)
```

<aside>
This example uses <a href="https://discord.com/developers/docs/interactions/application-commands#registering-a-command">global commands</a>, so the command might take a while to show up 😅
</aside>

However, the process of creating commands can get really repetitive and error-prone. A command framework could help with this, or you could make a small helper:

```tsx
import type { Client, CommandInteraction } from "discord.js"

interface Command {
	// Command name
	name: string
	// A mandatory description for the command
	description: string
	// Specific handler for the command
	run: (interaction: CommandInteraction) => Promise<void> | void
}

function handleCommands(client: Client, commands: Command[]) {
	client.once(Events.ClientReady, () => {
		for (const { name, description } of commands) {
			client.application?.commands.create({ name, description })
		}
	})

	client.on(Events.InteractionCreate, (interaction) => {
		if (interaction.isCommand()) {
			for (const command of commands) {
				if (interaction.commandName === command.name) {
					command.run(interaction)
				}
			}
		}
	})
}
```

```tsx
handleCommands(client, [
	{
		name: "ping",
		description: "pong!",
		run: (interaction) => {
			reacord.createInteractionReply(interaction).render(<>pong!</>)
		},
	},
	{
		name: "hi",
		description: "say hi",
		run: (interaction) => {
			reacord.createInteractionReply(interaction).render(<>hi</>)
		},
	},
])
```

## Ephemeral Command Replies

Ephemeral replies are replies that only appear for one user. To create them, use the `.createInteractionReply()` function and provide `ephemeral` option.

```tsx
handleCommands(client, [
	{
		name: "pong",
		description: "pong, but in secret",
		run: (interaction) => {
			reacord
				.createInteractionReply(interaction, { ephemeral: true })
				.render(<>(pong)</>)
		},
	},
])
```

## Text-to-Speech Command Replies

Additionally interaction replies may have `tts` option to turn on text-to-speech ability for the reply. To create such reply, use `.createInteractionReply()` function and provide `tts` option.

```tsx
handleCommands(client, [
	{
		name: "pong",
		description: "pong, but converted into audio",
		run: (interaction) => {
			reacord
				.createInteractionReply(interaction, { tts: true })
				.render(<>pong!</>)
		},
	},
])
```
