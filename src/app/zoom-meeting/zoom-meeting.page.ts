import { Component, OnInit } from '@angular/core';
import { ZoomMtg } from '@zoomus/websdk';
import { HttpClient } from '@angular/common/http';

ZoomMtg.setZoomJSLib('https://source.zoom.us/lib', '/av'); // Asegúrate de que la versión sea correcta
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

@Component({
  selector: 'app-zoom-meeting',
  templateUrl: './zoom-meeting.page.html',
  styleUrls: ['./zoom-meeting.page.scss'],
})
export class ZoomMeetingPage implements OnInit {

  apiKey = 'wEf2KFZ4TPOCXgSQYydqcA';
  meetingNumber = '84888951295';
  role = 0; // 0 para participante, 1 para anfitrión
  leaveUrl = 'http://localhost:8100'; // URL a la que redirigir después de dejar la reunión
  userName = 'kike';
  userEmail = ''; // opcional
  passWord = 'rrjX56n3wnNhVBONy8aquMXsZlhIi2.1';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.startMeeting();
  }

  startMeeting() {
    this.generateSignature().then(signature => {
      if (signature) {
        ZoomMtg.init({
          leaveUrl: this.leaveUrl,
          isSupportAV: true,
          success: (success: any) => {
            console.log(success);

            ZoomMtg.join({
              signature: signature,
              meetingNumber: this.meetingNumber,
              userName: this.userName,
              sdkKey: this.apiKey,
              userEmail: this.userEmail,
              passWord: this.passWord,
              success: (success: any) => {
                console.log(success);
              },
              error: (error: any) => {
                console.log(error);
              }
            });
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      } else {
        console.error('Signature is undefined');
      }
    }).catch(error => {
      console.error('Error generating signature', error);
    });
  }


  async generateSignature(): Promise<string | undefined> {
    const url = `http://localhost:3000/zoom/signature?meetingNumber=${this.meetingNumber}&role=${this.role}`;
    try {
      const response = await this.http.get<{ signature: string }>(url).toPromise();
      console.log(response);
      return response?.signature;
    } catch (error) {
      console.error('Error fetching signature', error);
      return undefined;
    }
  }
}
