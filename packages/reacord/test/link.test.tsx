import { test } from "vitest"
import { Link } from "../library/main"
import { ReacordTester } from "./test-adapter"

const tester = new ReacordTester()

test("link", async () => {
	await tester.assertRender(
		<>
			<Link url="https://example.com/">link text</Link>
			<Link label="link text" url="https://example.com/" />
			<Link label="link text" url="https://example.com/" disabled />
		</>,
		[
			{
				content: "",
				embeds: [],
				actionRows: [
					[
						{
							type: "link",
							url: "https://example.com/",
							label: "link text",
						},
						{
							type: "link",
							url: "https://example.com/",
							label: "link text",
						},
						{
							type: "link",
							url: "https://example.com/",
							label: "link text",
							disabled: true,
						},
					],
				],
			},
		],
	)
})
