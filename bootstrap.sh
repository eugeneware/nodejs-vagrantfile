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
PSQL_DB_NAME=testdb
PSQL_DB_USER=testuser
PSQL_DB_PASS=testpassword

apt-get -y install python-software-properties
add-apt-repository -y ppa:pitti/postgresql
apt-get update
apt-get -y install postgresql-9.2 postgresql-client-9.2 postgresql-contrib-9.2
apt-get -y install postgresql-server-dev-9.2 libpq-dev

# create and update user permissions
echo "CREATE USER $PSQL_DB_USER WITH PASSWORD '$PSQL_DB_PASS';
      CREATE DATABASE $PSQL_DB_NAME;
      GRANT ALL PRIVILEGES ON DATABASE $PSQL_DB_NAME TO $PSQL_DB_USER;" | \
  sudo su postgres -l -c psql

# setup hostbased auth
cp $PSQL_CONFIG_DIR/pg_hba.conf $PSQL_CONFIG_DIR/pg_hba.conf.BACKUP
grep '^#' $PSQL_CONFIG_DIR/pg_hba.conf.BACKUP > $PSQL_CONFIG_DIR/pg_hba.conf

cat <<EOF >> $PSQL_CONFIG_DIR/pg_hba.conf
local  all  postgres                peer
local  all  all                     md5
host   all  all       127.0.0.1/32  md5  # IPv4 local connections
host   all  all       ::1/128       md5  # IPv6 local connections
host   all  all       samenet       md5
EOF

# auto configure postgres
apt-get -y install bc
echo 'n' | sh /vagrant/pgsql-autoconf.sh oltp

# restart postgres
service postgresql restart

cat <<EOF
==============================================================================
PostgreSQL database '$PSQL_DB_NAME' created
Connect using: psql -h 10.10.10.10 -d $PSQL_DB_NAME -U $PSQL_DB_USER
Password: '$PSQL_DB_PASS'
==============================================================================
EOF
