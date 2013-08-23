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

#-----------------------------------------------------------------------------
# Install Postgres 9.2
#-----------------------------------------------------------------------------

PSQL_CONFIG_DIR=/etc/postgresql/9.2/main/

apt-get -y install python-software-properties
add-apt-repository -y ppa:pitti/postgresql
apt-get update
apt-get -y install postgresql-9.2 postgresql-client-9.2 postgresql-contrib-9.2
apt-get -y install postgresql-server-dev-9.2 libpq-dev

# symlink missing postgres bin files to /usr/bin
cd /usr/bin
for file in `find /usr/lib/postgresql/9.2/bin/* -maxdepth 1 -executable -printf '%f\n'`; do
  if [ ! -e /usr/bin/$file ]; then
    ln -s ../share/postgresql-common/pg_wrapper $file
  fi
done

# change permissions so that users other than postgres can start a db
chmod 777 /var/run/postgresql/

# Note: initdb will not be able to create a db in the /vagrant directory.  All
# dbs will need to be created elsewhere.
