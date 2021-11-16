## unreleased

- user-faced changes
    - added
        - style for dark mode browser (partially solves #28). it does not support manual toggling.
    - changed
        - button icons are replaced from emoji to svg image, to change color of it.
    - fixed
        - will not prevent you anymore to add your custom-schemed URLs, like `moz-extension://`.
- internal changes
    - changed
        - (dependency) vue 2 -> vue 3, vuex 3 -> vuex 4
        - (develop only) parcel 1 -> parcel 2
    - removed
        - (develop only) gulp script is removed (parcel 2 natively handles it)

## 0.1.0

untracked