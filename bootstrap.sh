set -e

echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list

apt-get update
apt-get -y upgrade

apt-get install -y git curl man

# Install node
su vagrant -l -c "curl https://raw.github.com/creationix/nvm/master/install.sh | sh"
su vagrant -l -c "nvm install 0.10"
su vagrant -l -c "nvm alias default 0.10"

# Install global npm packages
su vagrant -l -c "npm install -g jshint bower yo grunt-cli generator-angular mocha karma selenium-server protractor less"

# Install postgres
apt-get install -y postgresql postgresql-contrib
