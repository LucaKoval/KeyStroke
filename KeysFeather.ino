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

    Serial.println(msg);
    
    char charMsg[100];

    msg.toCharArray(charMsg, 100);

    Wire.write(charMsg);
    
}

long times1 = millis();
    long times2 = millis();
    long times3 = millis();
    long times4 = millis();
    long times5 = millis();
    long times6 = millis();
    long times7 = millis();
    long times8 = millis();
    long times9 = millis();
    long times10 = millis();
    long times11 = millis();
    long times12 = millis();
    long totalTime;

void pollButtons(String &msg){
    msg = " ";
    
    if(digitalRead(b1) == HIGH) {
      msg += "1 ";
      Serial.println(1);
      tone(9, NOTE_CS4,90*2);
      totalTime = millis() - times1;
      msg += totalTime;
      Serial.println(millis());
      Serial.println(totalTime);
    } else {
      times1 = millis();
    }
    if(digitalRead(b2) == HIGH) {
      msg += "2 ";
      Serial.println(2);
      tone(9, NOTE_DS4,90*2);
      totalTime = millis() - times2;
      msg += totalTime;
    } else {
      times2 = millis();
    }
    if(digitalRead(b3) == HIGH) {
      msg += "3 ";
      Serial.println(3);
      tone(9, NOTE_FS4,90*2);
      totalTime = millis() - times3;
      msg += totalTime;
    } else {
      times3 = millis();
    }
    if(digitalRead(b4) == HIGH) {
      msg += "4 ";
      Serial.println(4);
      tone(9, NOTE_GS4,90*2);
      totalTime = millis() - times4;
      msg += totalTime;
    } else {
      times4 = millis();
    }
    if(digitalRead(b5) == HIGH) {
      msg += "5 ";
      Serial.println(5);
      tone(9, NOTE_AS4,90*2);
      totalTime = millis() - times5;
      msg += totalTime;
    } else {
      times5 = millis();
    }
    if(digitalRead(b6) == HIGH) {
      msg += "6 ";
      Serial.println(6);
      tone(9, NOTE_B4,90*2);
      totalTime = millis() - times6;
      msg += totalTime;
    } else {
      times6 = millis();
    }
    if(digitalRead(b7) == HIGH) {
      msg += "7 ";
      Serial.println(7);
      tone(9, NOTE_A4,90*2);
      totalTime = millis() - times7;
      msg += totalTime;
    } else {
      times7 = millis();
    }
    if(digitalRead(b8) == HIGH) {
      msg += "8 ";
      Serial.println(8);
      tone(9, NOTE_G4,90*2); 
      totalTime = millis() - times8;
      msg += totalTime;
    } else {
      times8 = millis();
    }
    if(digitalRead(b9) == HIGH) {
      msg += "9 ";
      Serial.println(9);
      tone(9, NOTE_F4,90*2);
      totalTime = millis() - times9;
      msg += totalTime; 
    } else {
      times9 = millis();
    }
    if(digitalRead(b10) == HIGH) {
      msg += "10 ";
      Serial.println(10);
      tone(9, NOTE_E4,90*2);  
      totalTime = millis() - times10;
      msg += totalTime;
    } else {
      times10 = millis();
    }
    if(digitalRead(b11) == HIGH) {
      msg += "11 ";
      Serial.println(11);
      tone(9, NOTE_D4,90*2);
      totalTime = millis() - times11;
      msg += totalTime;
    } else {
      times11 = millis();
    }
    if(digitalRead(b12) == HIGH) {
      msg += "12 ";
      Serial.println(12);
      tone(9, NOTE_C4,90*2);
      totalTime = millis() - times12;
      msg += totalTime;
    } else {
      times12 = millis();
    }
}
