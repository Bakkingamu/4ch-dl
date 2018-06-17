export interface IPost {
    no: number;
    resto: number;
    sticky: number;
    closed: number;
    archived: number;
    archived_on: number;
    now: string;
    time: number;
    name: string;
    trip: string;
    id: string;
    capcode: string;
    country: string;
    country_name: string;
    sub: string;
    com: string;
    tim: number;
    filename: string;
    ext: string;
    fsize: string;
    md5: string;
    w: number;
    h: number;
    tn_w: number;
    tn_h: number;
    filedeleted: number;
    spoiler: number;
    custom_spoiler: number;
    ommited_posts: number;
    ommited_images: number;
    replies: number;
    images: number;
    bumplimit: number;
    imagelimit: number;
    capcode_replies: {};
    last_modified: number;
    tag: string;
    semantic_url: string;
    since4pass: number;
}

export class Post {
    static download(post: IPost, path: string) {
        //--TODO FUCKING IMPLEMENT SOMETHING
    }
    static createPostFromOBJ(postObj: {}): IPost {
        let post: IPost = <IPost>postObj;
        return post;
    }
    static createPostsFromOBJ(postsObj: {}[]): IPost[] {
        let posts: IPost[] = []
        for (let post of postsObj) {
            posts.push(this.createPostFromOBJ(post))
        }
        return posts;
    }
}

// export interface Employee {
//     typeOfEmployee_id: number;
//     department_id: number;
//     permissions_id: number;
//     maxWorkHours: number;
//     employee_id: number;
//     firstname: string;
//     lastname: string;
//     username: string;
//     birthdate: Date;
//     lastUpdate: Date;
// }

// let jsonObj: any = JSON.parse(employeeString); // string to generic object first
// let employee: Employee = <Employee>jsonObj;