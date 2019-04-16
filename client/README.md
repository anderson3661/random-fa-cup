## What does this app do

This app was inspired by my love of web development, football and statistics.

It is written using React 16.x and uses React Router and Redux.

This app allows you to play all the rounds of a football cup competition, like the FA or League Cup.
The way it works is that for each minute of each fixture a random number is generated and if that number is within a certain tolerance then a goal is scored.
You start by entering teams and various factors on <span>1st Round Draw</span> to create the ties for the 1st round.
Then click on the link to play the <span>1st Round fixtures</span>.
Once each round has been completed the <span>Fixtures and Results</span> page will be updated, and the draw for the succeeding round will become available.
For each round of the competition (excluding the semi-finals and final), if the scores are level after 90 minutes, then a fixture will go to a replay.
For replays and the semi-finals and final, if the scores are level after 90 minutes, then extra time and, if necessary, penalties will be played.

You can specify:
* which <span>teams</span> from each league make up the competition
* <span>My Watchlist Teams</span>, i.e. teams to more easily monitor during the competition
* the <span>top teams</span>, and whether they have a slight advantage
* whether the <span>home teams</span> have a slight advantage
* the <span>periods</span> during a match which are more likely to produce goals
* the advantage that teams from a <span>higher division</span> have over teams from lower divisions
* whether you want high-scoring or low-scoring matches
* the <span>speed</span> at which the fixtures are updated
