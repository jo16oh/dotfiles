brew_prefix = ENV['HOMEBREW_PREFIX']

brew 'fish'
brew 'mise'
brew 'stow'
brew 'mas'
brew 'trash'
brew 'smartmontools'

brew 'lima'
brew 'colima', restart_service: true
brew 'docker'
brew 'docker-compose'
brew 'docker-buildx'

system 'mkdir -p ~/.docker/cli-plugins'
system "ln -s -f #{brew_prefix}/bin/docker-cli-plugin-docker-compose ~/.docker/cli-plugins/docker-compose"
system "ln -s -f #{brew_prefix}/bin/docker-cli-plugin-docker-buildx ~/.docker/cli-plugins/docker-buildx"

# ruby build dependencies
brew 'openssl@3'
brew 'readline'
brew 'libyaml'
brew 'gmp'
brew 'autoconf'

cask 'adobe-creative-cloud'
cask 'battery'
cask 'betterdisplay'
cask 'bitwarden'
cask 'discord'
cask 'figma'
cask 'firefox'
cask 'font-jetbrains-mono-nerd-font'
cask 'font-udev-gothic-nf'
cask 'font-hackgen-nerd'
cask 'font-source-sans-3'
cask 'font-harano-aji'
cask 'font-noto-sans-jp'
cask 'font-noto-serif-jp'
cask 'font-biz-udgothic'
cask 'ghostty'
cask 'google-chrome'
cask 'hiddenbar'
cask 'iina'
cask 'karabiner-elements'
cask 'keka'
cask 'logseq'
cask 'microsoft-auto-update'
cask 'microsoft-excel'
cask 'microsoft-powerpoint'
cask 'microsoft-word'
cask 'microsoft-teams'
cask 'obsidian'
cask 'raycast'
cask 'scroll-reverser'
cask 'the-unarchiver'
cask 'visual-studio-code'
cask 'workflowy'
cask 'zed'
cask 'zen'
cask 'zoom'
cask 'nani'

mas 'Bear', id: 1_091_189_122
mas 'Bitwarden', id: 1_352_778_147
mas 'CotEditor', id: 1_024_640_650
mas 'Ethernet Status', id: 1_186_187_538
mas 'Keynote', id: 409_183_694
mas 'LINE', id: 539_883_307
mas 'Magnet', id: 441_258_766
mas '辞書 by 物書堂', id: 1_380_563_956
mas 'Slack for Desktop', id: 803_453_959
mas 'Kosshi', id: 6_759_483_880
