# canon-interval
NodeJS application for controlling Canon DSLR cameras using a Raspberry Pi
<br><br>

### Installation routine on Pi3B/Pi3B+/Pi4:<br>
Install Raspian Buster on SD<br>
```
$apt update & apt upgrade
$apt install curl
$curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
$nvm install 10
$npm install
$apt install libgphoto2-dev
$apt install pkg-config | dpkg
$apt install clang
$npm install gphoto2
$npm install express
$npm install socketio<br>
```
### Configure network shares:<br>
#### On file server (to store photos):<br>
```
$apt install samba
$apt install samba-client
$nano /etc/samba/smb.conf<br>
```
```
[canon]
path = /home/someuser/folder/folder
valid users = someuser,root
read only = no
guest ok = yes
create mask = 0777
create directory mask = 0777
```
```
$sudo service smbd restart
$smbpasswd -a someuser
```

#### On Pi:<br>
Permanent share:<br>
```
$pico /etc/fstab
```
<br>
Add:<br>
```
//<server ip>/sharefolder /media/yourfolderonserver cifs username=someuser,password=yourpassword,uid=1000,gid=1000,users,exec,noauto,x-systemd.automount 0 0
```
<br>

### Boot node script on startup / Install NodeJS script as a service:<br>
```
$npm install -g forever
$npm install -g forever-service
$cd /home/user/yournodescriptfolder/
$forever-service install yourservice --script yournodescript.js
```

### Node logs:<br>
```
$pico /var/log/yourservice.log<br>
```

### Live trace:<br>
```
$tail -f /var/log/yourservice.log
```

### Restart/Status nodeJS service:<br>
```
$service yourservice restart
$service yourservice status
```
