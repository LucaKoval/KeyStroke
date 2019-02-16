/*
 *  Simple HTTP get webclient test
 */
 
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>

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
  delay(5000);
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

  HTTPClient http;

  http.begin("http://10.148.8.186:8000");
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

//  int httpCode = http.POST("msg='HelloLuca'");
http.POST("msg=5");
  String payload = http.getString();

  Serial.println();
//  Serial.println(httpCode);
  Serial.println(payload);

  http.end();

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

  int bytesFromKeys = 10;
  int keysDevice = 2;
  Wire.requestFrom(keysDevice, bytesFromKeys);

  String responseK = "";
  while (Wire.available()) {
    char c = Wire.read();
    responseK+=c;
  }

  Serial.println(responseK);

  
  Serial.println();
  Serial.println();
}
