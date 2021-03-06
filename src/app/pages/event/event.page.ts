import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { SettingService } from 'src/app/services/setting.service';
import { PreniumProtectionService } from 'src/app/prenium-protection.service';
import * as moment from 'moment';


@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

    friendList: any;
    private isPremiumFromService: boolean;
    private timestamp: any;

    constructor( 
        private eventService: EventService, 
        private loginService: LoginService, 
        private http: HttpClient,
        private preniumProtectionService: PreniumProtectionService) {
            this.isPremiumFromService = this.preniumProtectionService.getCurrentValue();
            console.log("EventPage - the user is prenium? "+this.isPremiumFromService)
         }

    ionViewWillEnter(){
        this.isPremiumFromService = this.preniumProtectionService.getCurrentValue();
        console.log("EventPage - ionViewWillEnter")
    }

    ngOnInit() {
        this.getFriends()
            .then(() => console.log('ok'))
            .catch(() => {
                this.eventService.getFriends()
                    .then(value => {
                        if (value) {
                            this.setFriendList(value);
                        }
                    })
                    .catch(() => console.log('error reaching local storage'))
            });
        

            this.setTimestamp();
    }

    async getFriends () {
        let user = await this.loginService.getUserInfo();
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.Token}`
        });

        this.http.get('https://core-api-525.herokuapp.com/api/Client/friend', { headers })
            .subscribe(data => {
                console.log(JSON.stringify(data));
                this.friendList = data;
                this.eventService.saveFriends(data)
                    .then(() => console.log("friends saved") )
                    .catch(err => console.log(err))
            }, error => {
                console.log("could not get friends");
                console.log(error);
            })
    }

    setFriendList(list) {
        this.friendList = list;
    }

    setTimestamp () {
        this.timestamp = moment().format("DD-MM hh:mm");
    }
}
