# canon-interval
NodeJS application for controlling Canon DSLR cameras using a Raspberry Pi
<br><br>

### Installation routine on Pi3B/Pi3B+/Pi4:<br>
Install Raspian Buster on SD<br><br>

$apt update & apt upgrade<br>
$apt install curl<br>
$curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash<br>
$nvm install 10<br>
$npm install<br>
$apt install libgphoto2-dev<br>
$apt install pkg-config | dpkg<br>
$apt install clang<br>
$npm install gphoto2<br>
$npm install express<br>
$npm install socketio<br><br>

### Configure network shares:<br>
#### On file server (to store photos):<br>
$apt install samba<br>
$apt install samba-client<br>
$nano /etc/samba/smb.conf<br><br>

[canon]<br>
path = /home/someuser/folder/folder<br>
valid users = someuser,root<br>
read only = no<br>
guest ok = yes<br>
create mask = 0777<br>
create directory mask = 0777<br><br>

$sudo service smbd restart<br>
$smbpasswd -a someuser<br><br><br>


#### On Pi:<br>
Permanent share:<br><br>

$pico /etc/fstab<br>
<br>
Add:<br>
//<server ip>/sharefolder /media/yourfolderonserver cifs username=someuser,password=yourpassword,uid=1000,gid=1000,users,exec,noauto,x-systemd.automount 0 0<br><br>

<br>

### Boot node script on startup / Install NodeJS script as a service:<br>
$npm install -g forever<br>
$npm install -g forever-service<br>
$cd /home/user/yournodescriptfolder/<br>
$forever-service install yourservice --script yournodescript.js<br><br>
 
### Node logs:<br>
$pico /var/log/yourservice.log<br><br>

### Live trace:<br>
$tail -f /var/log/yourservice.log<br><br>

### Restart/Status nodeJS service:<br>
$service yourservice restart<br>
$service yourservice status<br><br>
