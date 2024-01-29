# Game of Life

## Introduction
An Implementation of the [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
in Javascript Canvas. Here is a short explanation of the game from Wikipedia. 

> The Game of Life, also known simply as Life, is a cellular automaton devised by the British
mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution
is determined by its initial state, requiring no further input. One interacts with the Game of
Life by creating an initial configuration and observing how it evolves. It is Turing complete
and can simulate a universal constructor or any other Turing machine.

The game logic is made up 4 simple rules:
- Any live cell with fewer than two live neighbors dies, as if by underpopulation.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any live cell with more than three live neighbors dies, as if by overpopulation.
- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

## Interaction
The game will start with a `Glider` pattern. Of course, You are able to draw any pattern as you 
wish and start the game. Then you just need to sit back and watch how it evolves and how generations
will change over time.

There are also GUI controls which you can adjust game settings such as update interval,
cell size, cell gap, etc.

Use the `left click` to draw and `right click` to erase. However, on touch devices the default 
behavior is drawing and you need to enable the eraser mode from the GUI controls.

If you are using a keyboard input you can also use the following shortcut keys:

- `[S]` **Step forward**: evolve the game one generation forward
- `[L]` **Live Edit**: Enable/Disable live editing of cells during the evolution
- `[E]` **Loop Edges**: Enable/Disable looping of edges
- `[R]` **Reset**: Reset the generation to a totally empty state
- `[P]` **Play/Pause**: Play/Pause the evolution
- `[H]` **Hide Controls**: Hide/Show the GUI controls

## Credits
Special thanks to [dat.gui](https://github.com/dataarts/dat.gui) for the GUI controls library.

## Demo
A live demo of this game can be found at [Game of Life](https://hmak-dev.github.io/game-of-life).