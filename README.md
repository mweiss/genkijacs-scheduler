# GenkiJacs Scheduler

To install dependencies, change into the base directory and run

```
npm install
```

To run the server in debug mode, use the www script:

```
./bin/www
```

# install base System (local)

get Virtualbox: https://www.virtualbox.org/
get virtualboximage: http://sourceforge.net/projects/virtualboximage/files/CentOS/6.0/CentOS-6-i386.7z/download

username: root
default pw: reverse

start virtual machine

change root password and get ip to connect via ssh
```
passwd
ifconfig
```

install updates and other software:
```
yum -y update
yum install wget gcc gcc-c++ mysql-server
```

install nodejs
```
cd /usr/src
wget http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz
tar xzf node-v0.12.0.tar.gz
cd node-v0.12.0
./configure
make 
make install
```

iptables
```
iptables -I INPUT -j ACCEPT
```
