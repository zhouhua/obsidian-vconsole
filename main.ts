import { VConsoleOptions } from "core/options.interface";
import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import VConsole from "vconsole";

interface VConsolePluginSettings {
	showSwitchButton: boolean;
}

const DEFAULT_SETTINGS: VConsolePluginSettings = {
	showSwitchButton: true
}

class VConsoleWrapper extends VConsole {
	constructor(options?: VConsoleOptions) {
		super(options);
	}

	toggle() {
		// @ts-ignore
		if(this.compInstance.show) {
			this.hide();
		} else {
			this.show();
		}
	}
}

export default class VConsolePlugin extends Plugin {
	settings: VConsolePluginSettings;
	vConsole?: VConsoleWrapper;

	async onload() {
		await this.loadSettings();

		this.vConsole = new VConsoleWrapper();
		if (this.settings.showSwitchButton) {
			this.vConsole.showSwitch();
		}else{
			this.vConsole.hideSwitch();
		}

		// 添加命令
		this.addCommand({
			id: 'toggle-vconsole-panel',
			name: 'Toggle VConsole Panel',
			callback: () => {
				this.vConsole?.toggle();
			}
		});

		// 添加设置选项卡
		this.addSettingTab(new VConsoleSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		this.vConsole?.destroy();
	}
}

class VConsoleSettingTab extends PluginSettingTab {
	plugin: VConsolePlugin;

	constructor(app: App, plugin: VConsolePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Show Switch Button')
			.setDesc('Show/Hide the VConsole floating switch button')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showSwitchButton)
				.onChange(async (value) => {
					this.plugin.settings.showSwitchButton = value;
					if (value) {
						this.plugin.vConsole?.showSwitch();
					} else {
						this.plugin.vConsole?.hideSwitch();
					}
					await this.plugin.saveSettings();
				}));
	}
}
