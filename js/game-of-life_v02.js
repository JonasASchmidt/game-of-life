$(function() {
  	//alert('ready');
	
	var gridCanvas = document.getElementById("grid");
	var preCanvas = document.createElement('canvas');
    var counterSpan = document.getElementById("counter");
    var controlLink = document.getElementById("controlLink");
    var clearLink = document.getElementById("clearLink");
    var regenLink = document.getElementById("regenLink");
    var minimumSelect = document.getElementById("minimumSelect");
    var maximumSelect = document.getElementById("maximumSelect");
    var spawnSelect = document.getElementById("spawnSelect");
    
    var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
  	
	function resizeCanvas() {
		/*var gridSize = document.getElementById('grid');*/
		gridCanvas.width = newWidth;
		gridCanvas.height = newHeight;
		
		preCanvas.width = newWidth;
		preCanvas.height = newHeight;
		
		/*updateAnimations();*/
		/*update();*/
		/*regenGrid();*/
	}			
				
	resizeCanvas();
				
    // From JavaScript: The good parts - Chapter 6. Arrays,
    // Section 6.7. Dimensions
    Array.matrix = function (m, n, initial) {
      var a, i, j, mat = [];
      for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
          a[j] = 0;
        }
        mat[i] = a;
      }
      return mat;
    };

	//var newWidth = window.innerWidth;
	//var newHeight = window.innerHeight;

    var Life = {};

    Life.CELL_SIZE = 16;
    Life.X = newWidth;
    Life.Y = newHeight;
    //Life.WIDTH = Math.round(Life.X / Life.CELL_SIZE);
    Life.WIDTH = (0.5 + (Life.X / Life.CELL_SIZE)) | 0;
    //Life.HEIGHT = Math.round(Life.Y / Life.CELL_SIZE);
    Life.HEIGHT = (0.5 + (Life.Y / Life.CELL_SIZE)) | 0;
    Life.DEAD = 0;
    Life.DEAD = 0;
    Life.ALIVE = 1;
    Life.DELAY = 250;
    Life.STOPPED = 0;
    Life.RUNNING = 1;

    Life.minimum = 2;
    Life.maximum = 3;
    Life.spawn = 3;
    Life.chance = 0.5;

    Life.state = Life.STOPPED;
    Life.interval = null;

    Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);

    Life.counter = 0;

    Life.updateState = function() {
      var neighbours;
      var nextGenerationGrid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);

      for (var h = 0; h < Life.HEIGHT; h++) {
        for (var w = 0; w < Life.WIDTH; w++) {
          neighbours = Life.calculateNeighbours(h, w);
          if (Life.grid[h][w] !== Life.DEAD) {
            if ((neighbours >= Life.minimum) &&
              (neighbours <= Life.maximum)) {
                nextGenerationGrid[h][w] = Life.ALIVE;
            }
          } else {
            if (neighbours === Life.spawn) {
              nextGenerationGrid[h][w] = Life.ALIVE;
            }
          }
        }
      }
      Life.copyGrid(nextGenerationGrid, Life.grid);
      Life.counter++;
    };

    Life.calculateNeighbours = function(y, x) {
      var total = (Life.grid[y][x] !== Life.DEAD) ? -1 : 0;
      for (var h = -1; h <= 1; h++) {
        for (var w = -1; w <= 1; w++) {
          if (Life.grid
            [(Life.HEIGHT + (y + h)) % Life.HEIGHT]
            [(Life.WIDTH + (x + w)) % Life.WIDTH] !== Life.DEAD) {
                total++;
          }
        }
      }
      return total;
    };

    Life.copyGrid = function(source, destination) {
      for (var h = 0; h < Life.HEIGHT; h++) {
        /*
        for (var w = 0; w < Life.WIDTH; w++) {
          destination[h][w] = source[h][w];
        }
        */
        destination[h] = source[h].slice(0);
      }
    };

    function Cell(row, column) {
      this.row = row;
      this.column = column;
    }

    controlLink.onclick = function() {
      if (Life.state === Life.STOPPED) {
        /*
        Life.interval = (function (){
          update();
          setTimeout(arguments.callee, Life.DELAY)    
        })();
        */
        
        Life.interval = setInterval(function() {
          update();
        }, Life.DELAY);
        
        Life.state = Life.RUNNING;
        } else {
          clearInterval(Life.interval);
          Life.state = Life.STOPPED;
      }
    };

    clearLink.onclick = function() {
      Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);
      Life.counter = 0;
      clearInterval(Life.interval);
      Life.state = Life.STOPPED;
      updateAnimations();
    };
    
    regenLink.onclick = function() {
      Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);
      Life.counter = 0;
      clearInterval(Life.interval);
      Life.state = Life.STOPPED;
      placeRandomCells();
    };

    minimumSelect.onchange = function() {
      clearInterval(Life.interval);
      Life.state = Life.STOPPED;
      Life.minimum = minimumSelect.value;
    };

    maximumSelect.onchange = function() {
      clearInterval(Life.interval);
      Life.state = Life.STOPPED;
      Life.maximum = maximumSelect.value;
    };

    spawnSelect.onchange = function() {
      clearInterval(Life.interval);
      Life.state = Life.STOPPED;
      Life.spawn = spawnSelect.value;
    };

    function updateAnimations() {
      for (var h = 0; h < Life.HEIGHT; h++) {
        for (var w = 0; w < Life.WIDTH; w++) {
          if (Life.grid[h][w] === Life.ALIVE) {
            ctx.fillStyle = "#000";
          } else {
            ctx.fillStyle = "#eee";
            //ctx.clearRect();
          }
          //ctx.fill();
          ctx.fillRect(
            w * Life.CELL_SIZE +1,
            h * Life.CELL_SIZE +1,
            Life.CELL_SIZE -1,
            Life.CELL_SIZE -1);
        }
      }
      counterSpan.innerHTML = Life.counter;
    }

    function update() {
      Life.updateState();
      //updateInput();
      //updateAI();
      //updatePhysics();
      updateAnimations();
      //updateSound();
      //updateVideo();
    }

	
    if (gridCanvas.getContext) {
    
      var ctx = gridCanvas.getContext('2d');
      var offset = Life.CELL_SIZE;

      for (var x = 0; x <= Life.X; x += Life.CELL_SIZE) {
        
        //ctx.beginPath();  
		//ctx.arc(25,25,25,0,Math.PI*2,true); // Outer circle  
		//ctx.closePath();
		//ctx.fill();
		
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, Life.Y);
      }
      for (var y = 0; y <= Life.Y; y += Life.CELL_SIZE) {
        ctx.moveTo(0, 0.5 + y);
        ctx.lineTo(Life.X, 0.5 + y);
      }
      ctx.strokeStyle = "#fff";
      ctx.stroke();    
      
      //var context = gridCanvas.getContext('2d');
	  //context.drawImage(ctx, 0, 0); 
	  
	  

      function canvasOnClickHandler(event) {
        var cell = getCursorPosition(event);
        var state = Life.grid[cell.row][cell.column]
          == Life.ALIVE ? Life.DEAD : Life.ALIVE;
        Life.grid[cell.row][cell.column] = state;
        updateAnimations();
      }

      function getCursorPosition(event) {
        var x;
        var y;
        if (event.pageX || event.pageY) {
          x = event.pageX;
          y = event.pageY;
        } else {
          x = event.clientX
            + document.body.scrollLeft
            + document.documentElement.scrollLeft;
          y = event.clientY
            + document.body.scrollTop
            + document.documentElement.scrollTop;
        }

        x -= gridCanvas.offsetLeft;
        y -= gridCanvas.offsetTop;
		/*
        var cell = new Cell(Math.floor(y / Life.CELL_SIZE),
          Math.floor(x / Life.CELL_SIZE));
          */
        var cell = new Cell( (y / Life.CELL_SIZE - 0.5) | 1,
          (x / Life.CELL_SIZE) -0.5 | 1);  
        return cell;
      }
      
      gridCanvas.addEventListener("click", canvasOnClickHandler, false);
    } else {
      alert("Canvas is not supported in your browser.");
    }
    
    function placeRandomCells () {
		for (var h = 0; h < Life.HEIGHT; h++) {
			for (var w = 0; w < Life.WIDTH; w++) {
				if (Math.random() > Life.chance) {
					Life.grid[h][w] = Life.ALIVE;
				} else {
					Life.grid[h][w] = Life.DEAD;
				}
			}
		}
		updateAnimations();
	}
	
	placeRandomCells();
    
    window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('orientationchange', resizeCanvas, false);
	
  }
);