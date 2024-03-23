# TODO

- [ ] List recent [Connection trends]
    - [ ] Open up more server processes moments before the trend is reached(in time)
    - [ ] Assert that numbers of processes is correct

- [ ] If the server load is high
    - [ ] Fork server child processses

# [Connection trend]

When the server is likely to be most active.
This is a [Pattern detection] mechanism.

- [ ] Store connections every X time span and detect the highest and most optimal time to fork the server into a child process

