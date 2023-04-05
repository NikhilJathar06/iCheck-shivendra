import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: { message: string, vesselName: string, questionNo: string }[] = [];

  addNotification(vesselName: string, questionNo: string) {
    const message = `You have a new message from ${vesselName} for question ${questionNo}`;
    const existingNotification = this.notifications.find(notification => notification.questionNo === questionNo);

 // if the questionNo is not in the notifications array, add the new notification
 if (!existingNotification) {
  this.notifications.push({ message, vesselName, questionNo });
}  }
}