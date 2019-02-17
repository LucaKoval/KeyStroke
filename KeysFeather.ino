#include <Wire.h>

byte b1 = 12;
byte b2 = 11;
byte b3 = 10;
byte b4 = 6;
byte b5 = 5;
byte b6 = A5;
byte b7 = A4;
byte b8 = A3;
byte b9 = A2;
byte b10 = A1;
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
    sendData(msg);
    delay(100);
}

void requestEvent() {
    Wire.write("Play music");
}

void sendData(String msg){
    char charMsg[25];

    msg.toCharArray(charMsg, 8);

    Wire.beginTransmission(44);
    Wire.write(charMsg);
    Wire.endTransmission();
}

void pollButtons(String &msg){
    msg = " ";

    if(digitalRead(b1) == HIGH) msg += "1 ";
    if(digitalRead(b2) == HIGH) msg += "2 ";
    if(digitalRead(b3) == HIGH) msg += "3 ";
    if(digitalRead(b4) == HIGH) msg += "4 ";
    if(digitalRead(b5) == HIGH) msg += "5 ";
    if(digitalRead(b6) == HIGH) msg += "6 ";
    if(digitalRead(b7) == HIGH) msg += "7 ";
    if(digitalRead(b8) == HIGH) msg += "8 ";
    if(digitalRead(b9) == HIGH) msg += "9 ";
    if(digitalRead(b10) == HIGH) msg += "10 ";
    if(digitalRead(b11) == HIGH) msg += "11 ";
    if(digitalRead(b12) == HIGH) msg += "12 ";
}
