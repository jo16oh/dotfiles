# Set homebrew path
if status is-interactive
    eval (/opt/homebrew/bin/brew shellenv)
end

# Add local bin to PATH
fish_add_path -g ~/.local/bin

# Vi-style bindings that inherit emacs-style bindings in all modes
function fish_hybrid_key_bindings
    for mode in default insert visual
        fish_default_key_bindings -M $mode
    end
    fish_vi_key_bindings --no-erase
end
set -g fish_key_bindings fish_hybrid_key_bindings

# Block style cursor in vi-mode
# https://github.com/fish-shell/fish-shell/issues/7458#issuecomment-756295678
set fish_vi_force_cursor 1
set -gx fish_cursor_default block
set -gx fish_cursor_insert line
set -gx fish_cursor_visual block
set -gx fish_cursor_replace_one underscore

# Clipboard bindings in vi-mode
# https://github.com/fish-shell/fish-shell/issues/4028
bind yy fish_clipboard_copy
bind Y fish_clipboard_copy
bind p fish_clipboard_paste

# Set command color in prompt
set -x fish_color_command blue

# Set config path for lazygit
set -x LG_CONFIG_FILE ~/.config/lazygit/config.yml

# Aliases
alias rm='trash'
alias lg='lazygit'

# Init starship
starship init fish | source
