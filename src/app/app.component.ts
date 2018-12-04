import { Component, ViewChild, AfterViewInit, ElementRef, Pipe, PipeTransform } from '@angular/core';

import * as html2canvas from "html2canvas";
import * as saveAs from 'file-saver';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  public title = 'RageParser';
  public chatlog: Chat[] = new Array<Chat>();
  public uploading: boolean = false;

  public _savingChatlog: boolean = false;
  public get savingChatlog(): boolean { return this._savingChatlog; }

  upload($event): any {
    this.uploading = true;
    this.chatlog = new Array<Chat>();
    const file: File = $event.files[0];

    if (file) {
      let fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        const result = fileReader.result.toString();
        const settings: SettingsFile = JSON.parse(result);
        
        this.parseChatlog(settings.chatlog);
      }
      
      fileReader.readAsText(file);
    }

    this.uploading = false;
  }

  public renderPng(): void {
    let chatOutput = document.getElementById('chatOutput') as HTMLElement;
    chatOutput.setAttribute('style', 'overflow-y: visible !important; height: auto !important');
    html2canvas(document.querySelector('#chatOutput'), {
      backgroundColor: null
    })
    .then(canvas => {
      chatOutput.removeAttribute('style');
      saveAs.saveAs(canvas.toDataURL("image/png"), "rage-rp-chatlog-" + new Date().toUTCString());
    });
  };

  private parseChatlog(content: string[]) {
    for (let chatString of content) {
      let chat: Chat = new Chat;
      chat.text = chatString;

      this.chatlog.push(chat);
    }
  }
}

export class SettingsFile {
  "maxvol": number;
  "login": boolean;
  "chatlog": string[];
}

export class Chat {
  "text": string;
  "colour": string;
}