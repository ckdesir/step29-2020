#!/bin/bash
#
# The starter script for each VM instance of VMN
# It installs the VNCServer, sets its password, starts a server, and
# initiates noVNC's Websocket to TCP proxy/bridge Websockify.
#
set -e
# This URL accesses the metadata value of key "session-id" of the current
# VM, it will be used as a password to connect to the VNCServer.
PASSWRD=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/session-id -H "Metadata-Flavor: Google")
VNCPASSWD_PATH=~/.vnc/passwd
export USER=/root
apt-get update
sudo apt install -y xfce4 xfce4-goodies tightvncserver
git clone https://github.com/novnc/noVNC.git
mkdir ~/.vnc
echo "${PASSWRD}" | vncpasswd -f > ${VNCPASSWD_PATH}
chmod 600 ${VNCPASSWD_PATH}
HOME=~ vncserver
cd noVNC || exit
./utils/launch.sh --vnc localhost:5901
