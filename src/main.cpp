// Copyright 2019 Pete Wall <pete@petewall.net>

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include <WebSocketsServer.h>

const int httpPort = 80;
const int socketPort = 1337;

void setupFileSystem() {
  Serial.print("Starting filesystem... ");
  if (LittleFS.begin()) {
    Serial.println("Done");
  } else {
    Serial.println("Failed!");
  }
}

const String ssid = "Planet Express";
const String passphrase = "w1r3l3ss";
void setupWifi() {
  Serial.printf("Connecting to %s", ssid.c_str());
  WiFi.begin(ssid, passphrase);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

AsyncWebServer server(httpPort);

void serveIndex(AsyncWebServerRequest *request) {
  IPAddress remote_ip = request->client()->remoteIP();
  Serial.println("[" + remote_ip.toString() + "] HTTP GET request of " + request->url());
  request->send(LittleFS, "/index.html", "text/html");
}

void serveFavicon(AsyncWebServerRequest *request) {
  IPAddress remote_ip = request->client()->remoteIP();
  Serial.println("[" + remote_ip.toString() + "] HTTP GET request of " + request->url());
  request->send(LittleFS, "/favicon.ico", "image/x-icon");
}

void serveSocketScript(AsyncWebServerRequest *request) {
  IPAddress remote_ip = request->client()->remoteIP();
  Serial.println("[" + remote_ip.toString() + "] HTTP GET request of " + request->url());
  request->send(LittleFS, "/socket.js", "application/javascript");
}

void serveStylesheet(AsyncWebServerRequest *request) {
  IPAddress remote_ip = request->client()->remoteIP();
  Serial.println("[" + remote_ip.toString() + "] HTTP GET request of " + request->url());
  request->send(LittleFS, "/style.css", "text/css");
}

void serve404(AsyncWebServerRequest *request) {
  IPAddress remote_ip = request->client()->remoteIP();
  Serial.println("[" + remote_ip.toString() + "] HTTP GET request of " + request->url());
  request->send(404, "text/plain", "Not found");
}

void setupWebServer() {
  server.on("/", HTTP_GET, serveIndex);
  server.on("/favicon.ico", HTTP_GET, serveFavicon);
  server.on("/socket.js", HTTP_GET, serveSocketScript);
  server.on("/style.css", HTTP_GET, serveStylesheet);
  server.onNotFound(serve404);

  Serial.print("Starting web server... ");
  server.begin();
  Serial.println("Done");
}

WebSocketsServer socket(socketPort, "", "echo-protocol");

void onWebSocketEvent(uint8_t client_num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.printf("Socket connected: %u\n", client_num);
      break;
    case WStype_DISCONNECTED:
      Serial.printf("Socket disconnected: %u\n", client_num);
      break;
    case WStype_TEXT:
      socket.sendTXT(client_num, "pong");
    default:
      break;
  }
}

void setupWebSocketServer() {
  Serial.print("Starting websocket server... ");
  socket.begin();
  socket.onEvent(onWebSocketEvent);
  Serial.println("Done");
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  setupFileSystem();
  setupWifi();
  setupWebServer();
  setupWebSocketServer();
}

void loop() {
  socket.loop();
}
