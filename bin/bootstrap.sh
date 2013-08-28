set -e

if [ ! -e /.installed ]; then
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

  # required for phantomjs
  apt-get install -y libfontconfig1 fontconfig libfontconfig1-dev libfreetype6-dev
fi

#-----------------------------------------------------------------------------
# Headless Browsers
#-----------------------------------------------------------------------------

if [ ! -e /.installed ]; then
  # add googles public key to opt
  wget -q -O - "https://dl-ssl.google.com/linux/linux_signing_key.pub" | apt-key add -

  # add google to the opt-get source list
  echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list

  # update and install
  apt-get update
  apt-get install -y openjdk-7-jre google-chrome-stable firefox xvfb unzip

  # download / copy selenium and chromedriver to /usr/local/bin
  cd /tmp
  wget 'https://chromedriver.googlecode.com/files/chromedriver_linux64_2.2.zip'
  wget 'https://selenium.googlecode.com/files/selenium-server-standalone-2.35.0.jar'
  unzip chromedriver_linux64_2.2.zip
  mv chromedriver /usr/local/bin
  mv selenium-server-standalone-2.35.0.jar /usr/local/bin

  # phantomjs
  su vagrant -l -c "npm install -g phantomjs"

  # xvfb init script
  cp /vagrant/etc/init/xvfb.conf /etc/init
  service xvfb start

  # make sure DISPLAY has been set in ~vagrant/.bashrc
  echo 'export DISPLAY=:0' >> ~vagrant/.bashrc
fi

#-----------------------------------------------------------------------------
# Install Postgres 9.2
#-----------------------------------------------------------------------------

if [ ! -e /.installed ]; then
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
  mkdir -p /var/run/postgresql/
  chmod 777 /var/run/postgresql/

  # stop and disable the system wide instance of postgresql
  service postgresql stop
  sudo update-rc.d postgresql disable

  # Note: initdb will not be able to create a db in the /vagrant directory.  All
  # dbs will need to be created elsewhere.
fi

# so that running `vagrant provision` doesn't redownload everything
touch /.installed
