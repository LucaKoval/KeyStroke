#include <Wire.h>
#include "pitches.h"

byte b1 = 12;
byte b2 = 11;
byte b3 = 10;
byte b4 = 6;
byte b5 = 5;
byte b6 = A5;
byte b7 = A4;
byte b8 = A2;
byte b9 = A1;
byte b10 = A3;
byte b11 = A0;
byte b12 = 13;


void setup() {
    pinMode(b1, INPUT);
    pinMode(b2, INPUT);
    pinMode(b3, INPUT);
    pinMode(b4, INPUT);
    pinMode(b5, INPUT);
    pinMode(b6, INPUT);
    pinMode(b7, INPUT);
    pinMode(b8, INPUT);
    pinMode(b9, INPUT);
    pinMode(b10, INPUT);
    pinMode(b11, INPUT);
    pinMode(b12, INPUT);

    Wire.begin(2);
    Wire.onRequest(requestEvent);
}

void loop() {
    String msg;
    pollButtons(msg);
}

void requestEvent() {
   // Wire.write("Play music");
    String msg="";
    pollButtons(msg);
    
    char charMsg[25];

    msg.toCharArray(charMsg, 25);

    Wire.write(charMsg);
    
}

void pollButtons(String &msg){
    msg = " ";
    
    if(digitalRead(b1) == HIGH) {
      msg += "1 ";
      Serial.println(1);
    }
    if(digitalRead(b2) == HIGH) {
      msg += "2 ";
      Serial.println(2);
      tone(9, NOTE_DS4,90*2);
    }
    if(digitalRead(b3) == HIGH) {
      msg += "3 ";
      Serial.println(3);
      tone(9, NOTE_FS4,90*2);
    }
    if(digitalRead(b4) == HIGH) {
      msg += "4 ";
      Serial.println(4);
      tone(9, NOTE_GS4,90*2);
    }
    if(digitalRead(b5) == HIGH) {
      msg += "5 ";
      Serial.println(5);
      tone(9, NOTE_AS4,90*2);
    }
    if(digitalRead(b6) == HIGH) {
      msg += "6 ";
      Serial.println(6);
      tone(9, NOTE_B4,90*2);
      //tone(9, NOTE_C4,90*2);
    }
    if(digitalRead(b7) == HIGH) {
      msg += "7 ";
      Serial.println(7);
      tone(9, NOTE_A4,90*2);
      //tone(9, NOTE_D4,90*2);
    }
    if(digitalRead(b8) == HIGH) {
      msg += "8 ";
      Serial.println(8);
      //tone(9, NOTE_F4,90*2);
      tone(9, NOTE_G4,90*2);  
    }
    if(digitalRead(b9) == HIGH) {
      msg += "9 ";
      Serial.println(9);
      tone(9, NOTE_F4,90*2);  
    }
    if(digitalRead(b10) == HIGH) {
      msg += "10 ";
      Serial.println(10);
      tone(9, NOTE_E4,90*2);  
      //tone(9, NOTE_G4,90*2);
    }
    if(digitalRead(b11) == HIGH) {
      msg += "11 ";
      Serial.println(11);
      tone(9, NOTE_D4,90*2);
      //tone(9, NOTE_A4,90*2);
    }
    if(digitalRead(b12) == HIGH) {
      msg += "12 ";
      Serial.println(12);
      tone(9, NOTE_C4,90*2);
      //tone(9, NOTE_B4,90*2);
    }
}
