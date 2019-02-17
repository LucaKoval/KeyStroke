/*
 *  Simple HTTP get webclient test
 */

 
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include "pitches.h"

const char* ssid     = "RedRover";
const char* password = "";
 
const char* host = "10.148.8.186";
 
void setup() {
  Wire.begin();
  Serial.begin(115200);
  delay(100);
 
  // We start by connecting to a WiFi network
 
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
 
int value = 0;
 
void loop() {
  //delay(500);
  ++value;
 
  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 8000;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  else {
    Serial.println("connection success");
  }

  Serial.println();
  Serial.println();

  // Code for the master slave interactions

  int bytesFromLights = 10;
  int lightsDevice = 1;
  Wire.requestFrom(lightsDevice, bytesFromLights);

  String responseL = "";
  while (Wire.available()) {
    char c = Wire.read();
    responseL += c;
  }

  Serial.println(responseL);

  int bytesFromKeys = 100;
  int keysDevice = 2;
  Wire.requestFrom(keysDevice, bytesFromKeys);

  String keysPressed = "";
  while (Wire.available()) {
    char c = Wire.read();
    if (isDigit(c) || isSpace(c)) keysPressed+=c;
  }

  String buttons="";
  String freq="";

  boolean frequency = false;
  for (int j=0; j<keysPressed.length(); j++) {

      if (frequency) {
        freq+=keysPressed[j];
      }
      else {
        buttons+=keysPressed[j];
      }
      
      if (keysPressed[j]==' ') {
        if (frequency == false) {
          frequency = true;
          buttons+=" ";
        }
        else {
          frequency = false;
          freq+=" ";
        }
      }

  }

  HTTPClient http;

  http.begin("http://10.148.8.186:8000");
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

http.POST("keyPressed="+freq+"&keyDurration="+buttons);
  String payload = http.getString();

//http.POST("keyDurration="+freq);
  //payload = http.getString();


  http.end();

  Serial.println(buttons);
  Serial.println(freq);

  Serial.println();
  Serial.println();
}
