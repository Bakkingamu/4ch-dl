import { IPost, Post } from "./post";
import { ApiService } from "./api.service"
import { HttpClient } from "@angular/common/http";
export class Thread {
    //mutable
    public active: boolean = false;
    private posts: IPost[] = []
    public thumb: string;

    //Generated
    public id: number;
    public board: string;

    //Constructables
    public folder: string;
    public url: string;
    public name: string;
    //((http|ftp|https):\/\/)?(boards\.)?4chan.org(\/.\/thread\/\d*)
    //https://boards.4chan.org/a/thread/174207186#p174207359?djfhaskdjfh
    //4chan.org/a/thread/174207186

    constructor(url: string, folder: string, name: string = null) {
        this.url = url;
        this.id = this.createId(url);
        this.board = this.createBoard(url);
        this.folder = folder;
        if (name)
            this.name = name;
        else
            this.name = this.id.toString();
    }


    private createId(url: string): number {
        let pieces = this.getSplice(url).split('/');
        return +pieces[2]
    }

    private createBoard(url: string): string {
        let pieces = this.getSplice(url).split('/');
        return pieces[0]
    }

    private getSplice(url: string): string {
        return url.match(/\w+\/thread\/\d*/)[0]
    }
    public pushPost(post: IPost) {
        this.posts.push(post);
    }
    public getPosts(): IPost[] {
        return this.posts;
    }
    toJSON(): {} {
        return {
            url: this.url,
            folder: this.folder,
            name: this.name,
            active: this.active,
            thumb: this.thumb
        }
    }
    static fromJSON(json) {
        let thread = new Thread(json['url'], json['folder'], json['name'])
        thread.active = json.active;
        thread.thumb = json["thumb"];
        return thread;
    }
}
