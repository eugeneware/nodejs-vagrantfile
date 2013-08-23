# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX_NAME = ENV['BOX_NAME'] || "ubuntu"
BOX_URI = ENV['BOX_URI'] || "http://files.vagrantup.com/precise64.box"
VF_BOX_URI = ENV['BOX_URI'] || "http://files.vagrantup.com/precise64_vmware_fusion.box"
DEV_DOMAIN = ENV["DEV_DOMAIN"] || "devbox"
DEV_IP = ENV["DEV_IP"] || "10.10.10.10"

Vagrant::configure("2") do |config|
  config.vm.provision :shell, :path => "bin/bootstrap.sh"
  config.vm.network :forwarded_port, guest: 80, host: 8080
  config.vm.hostname = "#{DEV_DOMAIN}"
  config.vm.network :private_network, ip: DEV_IP
  
  config.vm.provider :virtualbox do |vb|
    config.vm.box = BOX_NAME
    config.vm.box_url = BOX_URI
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  end

  config.vm.provider :vmware_fusion do |f, override|
    override.vm.box = BOX_NAME
    override.vm.box_url = VF_BOX_URI
    config.vm.network :public_network
    f.vmx["displayName"] = "devbox"
  end
end
