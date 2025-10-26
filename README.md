For all the stats, see [out.json](https://github.com/kd8lvt/dj-boardgame-stats/blob/main/out.json)  
For the code that calculates everything, see [index.js](https://github.com/kd8lvt/dj-boardgame-stats/blob/main/index.js)  

Each player's input stats were manually recorded by watching the video, and pausing to write them down as they happen. I'm fairly certain they're accurate!  
A roll of zero indicates either Heavy Duty Boots or an Eon Flute was used.  

The code is fully commented, and written in Javascript. It can be run on any modern NodeJS-like that supports the `fs.readFileSync`, `fs.writeFileSync`, `JSON.parse`, and`JSON.stringify` functions.  
The code _does not_ currently calculate the chance a player had of winning any particular battle, though it _can_ do so in the future - I just haven't gotten around to it.
