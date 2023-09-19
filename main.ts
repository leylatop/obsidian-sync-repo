import { Plugin } from 'obsidian';
import { exec, spawn } from 'child_process';
import * as process from 'process';

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default'
}

async function syncLocaleNote(script: string, cwd: string): Promise<{ stdout: string, stderr: string }> {
  return new Promise((resolve, reject) => {
    console.log('cwd', cwd)
    exec(script, { cwd }, (err, stdout, stderr) => {
      if (err) {
        // 获取当前报错路径
        const cwd2 = process.cwd();
        console.log(cwd2)
        reject(cwd2);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  async onload() {
    await this.loadSettings();
    const ribbonIconEl = this.addRibbonIcon('sync', 'Sample Plugin', async (evt: MouseEvent) => {
    //   new Notice('aaaa!');
    //   console.log('------')
      const cwd = this.app.vault.adapter.basePath;
      const term = spawn('open', ['-a', 'iTerm', cwd]);

      // 这行代码的意思是，当子进程有输出时，将子进程的输出打印到主进程的控制台中
      // spawn('pwd', { cwd, stdio: 'inherit' });
    //   // exec(`cd ${cwd} && pwd`, (err, stdout, stderr) => {
    //   //   console.log(err, stdout, stderr)
    //   // })

    // exec(`sh ${cwd}/.ci/sync-note.sh`, { cwd }, (err, stdout, stderr) => {})

    //   exec(`open -a iTerm ${cwd} && npm --help`, (err, stdout, stderr) => {
    //     console.log(err, stdout, stderr)
    //   })
    //   // exec('sh .ci/sync-note.sh', { cwd, shell: true }, (err, stdout, stderr) => {
    //   //   if (err) {
    //   //     console.error(err);
    //   //     return;
    //   //   }
    //   //   console.log(stdout);
    //   //   console.log(stderr);
    //   // });


      // await syncLocaleNote(`sh .ci/sync-note.sh`, cwd)
    });
    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}