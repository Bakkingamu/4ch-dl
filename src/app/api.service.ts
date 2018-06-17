import { Injectable } from '@angular/core';
import { Config } from './constants'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = Config.apiUrl;
  thread = Config.thread;
  json = Config.json;
  cdnUrl = Config.cdnUrl;


  constructor(private http: HttpClient) { }

  public getThread(no: number, board: string) {
    return this.http.get(this.getApiUrl(no, board))
  }

  public getImage(board: string, image: number, ext: string) {
    return this.http.get(this.getCdnUrl(board, image, ext), this.getCdnHeaders())
  }

  public getApiUrl(no: number, board: string): string {
    return this.apiUrl + board + this.thread + no + this.json;
  }

  public getCdnUrl(board: string, image: number, ext: string) {
    return this.cdnUrl + board + "/" + image + ext;
  }
  public getCdnThumbUrl(board: string, image: number, ext: string) {
    return this.cdnUrl + board + "/" + image + 's' + ext;
  }
  private getCdnHeaders(): {} {
    let rheaders = new HttpHeaders({
      'Origin': '',
      'Referer': ''
    });
    return {
      responseType: 'arraybuffer'
    };
  }


}
