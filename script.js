// Number of blocks in rows and columns (border blocks are player colour's)
let BLOCKS_WIDTH = 6;
let BLOCKS_HEIGHT = 5;

let BLOCK_HEX_CONST = 0.25;		// Multiple of the individual block width which is set back to crate a hexagon
let BLOCK_SPACING = 0.05;		// Multiple of container width which spaces blocks apart
let CONTAINER_ASPECT = 1.333;	// Width of the container as a ratio of the height

// Colours for blocks
const YELLOW = "#CABD00";	// Also shows the letter
const WHITE = "#DBD9DB";
const BLUE = "#2FA1DA";

let id_count = 0;		// Counter for polygon IDs
let current_round = -1;	// Round in use

function StartBlockbusters(){
	// Setup container to resize and remain square
	window.onresize = ResizeContainer;
	ResizeContainer();
	
	// Generate round dropdown
	let dropdown = document.getElementById("rounds");
	
	for (let i = 0; i < ROUNDS.length; i++){
		let option = document.createElement("option");
		option.setAttribute("value", i);
		option.innerHTML = ROUNDS[i][0];
		
		dropdown.appendChild(option);
	}
	
	// Load the first round
	LoadRound(0);
}

// Load a new round (will clear existing one)
function LoadRound(round){
	// Don't reload the same round
	if (round == current_round){
		return;
	}
	
	current_round = round;
	
	// Clear
	let blocks = document.getElementById("blocks");
	blocks.innerHTML = "";
	
	// Load
	let letter_index = 1;
	let letters = ROUNDS[round];
	
	for (let x = 0; x < BLOCKS_WIDTH + 1; x++){
		for (let y = 0; y < BLOCKS_HEIGHT + 1; y++){
			let colour = YELLOW;
			let letter = "";
			
			if (y == 0 || y > BLOCKS_HEIGHT - 1){
				colour = WHITE;
			}
			
			if (x == 0 || x > BLOCKS_WIDTH - 1){
				colour = BLUE;
			}
			
			if (colour == YELLOW){
				letter = letters[letter_index];
				letter_index = letter_index + 1;
			}
			
			CreateBlock(x, y, colour, letter);
		}
	}
}

function CreateBlock(gx, gy, colour, letter){
	// Block width and height in percent
	let block_width = (100 * CONTAINER_ASPECT) / (BLOCKS_WIDTH + (BLOCKS_WIDTH * BLOCK_HEX_CONST) + (BLOCKS_WIDTH * BLOCK_SPACING));
	let block_height = 100 / (BLOCKS_HEIGHT + (BLOCKS_HEIGHT * BLOCK_SPACING));
	
	// Convert X and Y to percentage coordinates
	x = ((100 * CONTAINER_ASPECT) * (gx / BLOCKS_WIDTH)) - (block_width / 2);	// X is the left of the square block
	y = (100 * (gy / BLOCKS_HEIGHT)) - (block_height / 3);	// Y is the top of the block
	
	if (gx % 2 == 1){	// If X is odd, shift Y up (for staggering)
		y -= (block_height / 2) + (BLOCKS_HEIGHT * BLOCK_SPACING);
	}
	
	// Common calculations
	let hh = block_height / 2;					// Half Height
	let xsb = block_width * BLOCK_HEX_CONST;	// X Set Back
	
	// Create points for Hexagon
	let points =	(x - xsb).toString() + "," + (y + hh).toString() + " ";					// Left
	points +=		x.toString() + "," + y.toString() + " ";				// Top Left
	points +=		(x + block_width).toString() + "," + y.toString() + " ";	// Top Right
	points +=		(x + block_width + xsb).toString() + "," + (y + hh).toString() + " ";	// Right
	points +=		(x + block_width).toString() + "," + (y + block_height).toString() + " ";	// Bottom Right
	points +=		x.toString() + "," + (y + block_height).toString() + " ";	// Bottom Left
	points +=		(x - xsb).toString() + "," + (y + hh).toString() + " ";					// Left
	
	let block = document.createElement("polygon");
	block.setAttribute("points", points);
	block.setAttribute("style", "fill:" + colour + ";stroke-width:0;");
	
	let blocks = document.getElementById("blocks");
	blocks.appendChild(block);
	
	// Create letter (if yellow)
	if (colour == YELLOW){
		let text = document.createElement("text");
		text.innerHTML = letter;
		
		text.setAttribute("x", (x + (block_width * 0.52)).toString());
		text.setAttribute("y", (y - (block_height * -0.85)).toString());
		text.setAttribute("style", "font-size:90%;font-family:CfLCD;cursor:pointer;");
		text.setAttribute("text-anchor", "middle");
		text.setAttribute("id", "T" + id_count.toString());
		
		blocks.appendChild(text);
		
		// Add colour changing magic
		let change_colour_function = "ChangeColour(" + id_count.toString() + ");";
		
		block.setAttribute("style", block.getAttribute("style") + "cursor:pointer;");
		block.setAttribute("id", "P" + id_count.toString());
		block.setAttribute("onClick", change_colour_function);
		
		text.setAttribute("onClick", change_colour_function);
		
		id_count++;
	}
	
	blocks.innerHTML += "";	// Hack to update it
}

function ChangeColour(ID){
	let block = document.getElementById("P" + ID.toString());
	let block_style = block.getAttribute("style");

	let text = document.getElementById("T" + ID.toString());

	// Rotate colour
	if (block_style.includes(YELLOW)){
		block_style = "fill:" + BLUE + ";stroke-width:0;cursor:pointer;";
		text.setAttribute("visibility", "hidden");
		
	}else if (block_style.includes(BLUE)){
		block_style = "fill:" + WHITE + ";stroke-width:0;cursor:pointer;";
		
	}else{
		block_style = "fill:" + YELLOW + ";stroke-width:0;cursor:pointer;";
		text.removeAttribute("visibility");
	}
	
	block.setAttribute("style", block_style);
	console.log(block_style);
}	

function ResizeContainer(){
	// Calculate container size and position from the left in pixels
	let height = window.innerHeight;
	let width = height * CONTAINER_ASPECT;
	
	let left = (window.innerWidth - width) / 2.0;
	
	// Set size and position
	let style = "width:" + width.toString() + "px;";
	style +=	"height:" + height.toString() + "px;";
	style +=	"left:" + left.toString() + "px;";
	
	let container = document.getElementById("container");
	container.setAttribute("style", style);
	
	// Set SVG to the same size
	let blocks = document.getElementById("blocks");
	blocks.setAttribute("width", width.toString());
	blocks.setAttribute("height", height.toString());
	
	blocks.setAttribute("viewBox", "0 0 " + (100 * CONTAINER_ASPECT).toString() + " 100");// + width.toString() + " " + height.toString());
}