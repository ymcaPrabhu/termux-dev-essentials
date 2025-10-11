# BMad Shell Customizations
# Task 1: Define default aliases and PS1

# Helpful aliases
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias cls='clear'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline -10'
alias gd='git diff'

# Enhanced prompt with git branch support
parse_git_branch() {
    git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

# Color codes
COLOR_RESET='\[\033[0m\]'
COLOR_USER='\[\033[01;32m\]'
COLOR_HOST='\[\033[01;34m\]'
COLOR_DIR='\[\033[01;36m\]'
COLOR_GIT='\[\033[01;33m\]'

# Task 2: Define custom PS1
export PS1="${COLOR_USER}\u${COLOR_RESET}@${COLOR_HOST}\h${COLOR_RESET}:${COLOR_DIR}\w${COLOR_GIT}\$(parse_git_branch)${COLOR_RESET}\$ "

# Additional helpful settings
export EDITOR=nano
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoredups:erasedups

echo "✅ BMad shell customizations loaded"
