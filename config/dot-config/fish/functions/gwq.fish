function gwq --description 'A gwq command wrapper'
    if test (count $argv) -eq 0
        cd $(gwq get)
    else
        command gwq $argv
    end
end
