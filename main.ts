import { Plugin } from "obsidian";
import VConsole from "vconsole";

export default class VConsolePlugin extends Plugin {
	async onload() {
		new VConsole();
	}

	onunload() {}
}
