import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Thread } from './thread';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private available: boolean;
  private fs;
  constructor(private _electronService: ElectronService) {
    this.available = (this._electronService.remote) ? true : false;
    if (this.available) {
      this.fs = this._electronService.remote.require('fs');
    }
  }

  public write(folder: string, filename: string, file: any) {
    if(!this.existFile(folder)){
      this.fs.mkdirSync(folder);
    }
    if (this.available) {
      this.fs.appendFileSync(folder + '/' + filename, new Buffer(file))
    } else {
      console.log("write: fs not available")
    }
  }
  public exists(folder: string, filename: string): boolean {
    if (this.available) {
      return this.fs.existsSync(folder + '/' + filename);
    } else {
      return false;
    }
  }
  public existFile(file: string): boolean {
    if (this.available) {
      return this.fs.existsSync(file);
    } else {
      return false;
    }
  }
  public readThreadFile(): any {
    if (this.available) {
      return JSON.parse(this.fs.readFileSync('threads.json', 'utf8'))
    } else {
      return {}
    }

  }
  public writeThreadFile(threads: Thread[]) {
    if (this.available) {
      let jsonThreads = []
      for (let thread of threads) {
        jsonThreads.push(thread.toJSON())
      }
      this.fs.writeFileSync('threads.json', JSON.stringify({ 'threads': jsonThreads }, null, '\t'))
    } else {
      console.log("write threads: fs not available");
    }
  }

}
