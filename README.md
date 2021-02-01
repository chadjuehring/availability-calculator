# Availability Block Calculator

This utility library is to assist in development of a larger application. I am making this logic generalized in this modular fashion because it could be useful to others.

## Scenario

A worker has a large block of time scheduled for task availability. This availability is expressed in terms of beginning and ending time blocks.

ex: Mondays, 9am-12pm.

This worker has a variety of tasks that they can be assigned and these tasks vary in length. For simplicity, these times
will be in sizes of 30 minute increments.

For the above situation, this tool should generate the following list of available timeslots for that Monday for a 30 minute task to be:

- 900-930
- 930-1000
- 1000-1030
- 1030-1100
- 1100-1130
- 1130-1200

Similarly, for tasks that take 1 hour, this list of times should be generated:

- 900-1000
- 930-1030
- 1000-1100
- 1030-1130
- 1100-1200

## Availability Modeling

Availability will be modeled with positive assertions for working hours, masked by other already-booked tasks.

Building on the previous example, if two other 30-minute tasks were already scheduled for this person, then the list should instead be this when seeking slots for a 30 minute task:

available: Mondays, 9am-12pm.
booked: 930-1000, 1100-1130

- 900-930
- 1000-1030
- 1030-1100
- 1130-1200

this same availability applied to seeking a 60 minute task would yield this:

- 1000-1100
