// Copyright 2019 Pete Wall <pete@petewall.net>

#include <Arduino.h>
#include "firmware.h"

void setup() {
  Serial.begin(115200);
  setupWifi();
  setupWebSocket();
  setupHTTPService();
}

void loop() {
  deviceLoop();
}
