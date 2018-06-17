import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Thread } from '../thread';
import { ApiService } from '../api.service';
import { Post } from '../post';
import { DomSanitizer } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';
import { FileService } from '../file.service';
import { BehaviorSubject, Subject, Observable, of, interval, Subscription, timer } from 'rxjs';
import { Config } from '../constants';
@Component({
  selector: 'app-thread-page',
  templateUrl: './thread-page-full.component.html',
  styleUrls: ['./thread-page-full.component.css']
})
export class ThreadPageComponent implements OnInit {
  @Input() thread: Thread;
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
  fs;
  public progress: number;
  private downloader$: Subscription;
  public thumb: string;
  public bar = 'indeterminate';
  constructor(private api: ApiService, private file: FileService, private _electronService: ElectronService) {
    if (this._electronService.remote)
      this.fs = this._electronService.remote.require('fs');
  }

  ngOnInit() {
    if (this.thread.active) {
      this.downloader$ = this.download()
    }
    if (this.thread.thumb && this.file.existFile(this.thread.thumb)) {
      this.setThreadThumb(this.thread.thumb)
    } else {
      this.thumb = Config.placeholderImage;
    }

  }
  download() {
    return timer(0, 120000).subscribe(() => {
      this.bar = 'indeterminate';
      this.api.getThread(this.thread.id, this.thread.board).subscribe((res) => {
        let posts = Post.createPostsFromOBJ(res['posts']);
        let imagePosts = posts.filter((post) => post.tim)
        let total = imagePosts.length;
        this.progress = (100 * (0 / total))
        let count = 0;
        for (let post of imagePosts) {
          this.bar = 'determinate';
          if (!this.file.exists(this.thread.folder, post.tim + post.ext)) {
            this.api.getImage(this.thread.board, post.tim, post.ext).subscribe((image) => {
              this.file.write(this.thread.folder, +post.tim + post.ext, image)
              if (this.thumb == Config.placeholderImage) {
                  this.setThreadThumb(this.thread.folder + '\\' + post.tim + post.ext);
                  this.thread.thumb = this.thread.folder + '\\' + post.tim + post.ext;
              }
            })
          }
          if (this.thumb == Config.placeholderImage) {
            if (this.file.existFile(this.thread.folder + '\\' + post.tim + post.ext)) {
              this.setThreadThumb(this.thread.folder + '\\' + post.tim + post.ext)
              this.thread.thumb = this.thread.folder + '\\' + post.tim + post.ext;
            }
          }
          count++;
          this.progress = (100 * (count / total));
          if (!this.thread.active) {
            break;
          }
        }
      })
    });
  }
  activateToggle() {
    this.thread.active = !this.thread.active;
    if (this.thread.active) {
      this.downloader$ = this.download();
    } else {
      this.downloader$.unsubscribe();
    }
  }
  ngOnDestroy() {
    if (this.downloader$) {
      this.downloader$.unsubscribe();
    }

    this.delete.emit('ded');
  }

  setThreadThumb(image: string) {
    if(this.file.existFile(image)){
      this.thumb = 'file://' + image;
    }
  }


  openUrl() {
    if (this._electronService.remote) {
      this._electronService.remote.shell.openExternal(this.thread.url);
    }
  }
  openFolder() {
    if (this._electronService.remote) {
      this._electronService.remote.shell.openItem(this.thread.folder);
    }
  }

}
