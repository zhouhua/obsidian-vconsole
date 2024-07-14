import { Plugin } from "obsidian";
import VConsole from "vconsole";

export default class VConsolePlugin extends Plugin {
	vConsole?: VConsole;
	async onload() {
		this.vConsole = new VConsole();
	}

	onunload() {
		this.vConsole?.destroy();
	}
}
