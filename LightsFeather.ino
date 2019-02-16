#include <Wire.h>

void setup() {
  Wire.begin(1);
  Wire.onRequest(requestEvent);
}

void loop() {
  delay(100);
}

void requestEvent() {
  Wire.write("I am lit");
}
