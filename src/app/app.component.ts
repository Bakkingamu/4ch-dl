import { Component } from '@angular/core';
import { Thread } from './thread';
import { ElectronService } from 'ngx-electron';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FileService } from './file.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public threadForm: FormGroup;
  public page = 'home';
  public currentThread: number = 0;

  public threads: Thread[] = [];

  public window;
  constructor(private _electronService: ElectronService, private file: FileService) {

  }

  ngOnInit(): void {
    this.threadForm = new FormGroup({
      'name': new FormControl('', [
        Validators.required
      ]),
      'url': new FormControl('', [
        Validators.required,
        Validators.pattern(/\w+\/thread\/\d*/)
      ]),
      'folder': new FormControl('', [
        Validators.required
      ])
    });
    this.restoreThreads();
    if (this._electronService.remote) {
      this.window = this._electronService.remote.getCurrentWindow()
    }
    interval(10000).subscribe(() => {
      this.file.writeThreadFile(this.threads);
    })
    // this.addSample()
    // this.clickThread(this.threads[0].id)
  }

  clickHome() {
    this.page = 'home'
  }
  clickThreads() {
    this.page = 'thread'
  }
  clickThread(id: number){
    this.currentThread = id;
    this.page = 'thread-page'
  }
  addThread() {
    this.threadForm.valid;
    let folder = this.threadForm.get("folder").value + '\\' + this.threadForm.get("name").value
    this.threads.push(
      new Thread(
        this.threadForm.get("url").value,
        folder,
        this.threadForm.get("name").value))
    this.file.writeThreadFile(this.threads)
  }
  removeThread(thread: Thread) {
    let index = this.threads.indexOf(thread)
    if (index > -1) {
      this.threads.splice(index, 1)
    }
    this.file.writeThreadFile(this.threads);
  }
  public openDirectory() {
    if (this._electronService.remote) {
      let downloadFolder = this._electronService.remote.dialog.showOpenDialog({ properties: ['openDirectory'] })[0];
      this.threadForm.patchValue({ folder: downloadFolder })
    } else {
      this.threadForm.patchValue({ folder: 'C:/' })
    }
  }
  public pasteUrl() {
    if (this._electronService.remote) {
      let paste = this._electronService.clipboard.readText()
      if (paste.match(/\w+\/thread\/\d*/)[0]) {
        this.threadForm.patchValue({ url: paste })
      }
    }
  }
  addSample() {
    this.threads.push(new Thread("https://boards.4chan.org/v/thread/420485083", "C:/", "cute pics"))

  }
  restoreThreads() {
    let threads = this.file.readThreadFile()['threads']
    if (threads) {
      for (let thread of threads) {
        this.threads.push(Thread.fromJSON(thread))
      }
    }
  }

  // WINDOW BUTTONS
  closeWindow() {
    this.file.writeThreadFile(this.threads);
    this.window.close();
  }
  minMax() {
    if (!this.window.isMaximized()) {
      this.window.maximize();
    } else {
      this.window.unmaximize();
    }
  }
  minimize() {
    this.window.minimize();
  }

}
