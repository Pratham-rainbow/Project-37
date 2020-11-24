//Pratham Agarwal.
//Virtual pet-3

var dog, happyDog, dogImg, database, food, foodStock;
var gameState = "Hungry";
var feedButton, addButton, input, name;
var fedtime;
var backgroundImg;

var washroomImg, gardenImg, bedroomImg;
var currentTime;

var readingGameState;

var lastFed;

var canvas;

function preload(){
	dogImg = loadImage("images/dogImg.png");
	happyDog = loadImage("images/dogImg1.png");
	bedroomImg = loadImage("ImagesOfPet/BedRoom.png");
	gardenImg = loadImage("ImagesOfPet/Garden.png");
	washroomImg = loadImage("ImagesOfPet/WashRoom.png");
}

function setup() {
	database = firebase.database();

	canvas = createCanvas(480, 600);

	dog = createSprite(width/2+200, height/2+100);
	dog.addImage(dogImg);
	dog.scale = 0.2;

	backgroundImg = createSprite(width/2, height/2-100);
	backgroundImg.visible = false;

  foodStock = database.ref("Food");
	foodStock.on("value", readStock);

	feedButton = createButton("Feed the Dog.");
	feedButton.position(width - 320, 80);
	feedButton.mousePressed(feedDog);

	addButton = createButton("Add more Food.");
	addButton.position(width-220, 80);
	addButton.mousePressed(addFood);

	input = createInput("Name your Dog");
	input.position(width-180, height/2+10);

  name = input.value();

	food = new Food();
}


function draw() {
	background(46, 139, 87);

  food.display();

	readingGameState = database.ref("gameState");
  readingGameState.on("value", function(data){
    gameState = data.val();
  });

	fedtime = database.ref("FeedTime");
	fedtime.on("value", function(data){
		lastFed = data.val();
	});

	if(gameState!="Hungry"){
	   feedButton.hide();
		 addButton.hide();
		 input.hide();
		 dog.remove();
	} else {
		feedButton.show();
		addButton.show();
		input.show();
		dog.addImage(dogImg);
	}

  push();
	textSize(19);
	fill(255);
	if(lastFed>=12){
    text("Last Fed: "+ lastFed % 12 + " PM",25,50);
  } else if(lastFed===0){
    text("Last Fed: 12AM",25,50);
  } else{
    text("Last Fed: "+ lastFed + " AM",25,50);
  }
	pop();

	currentTime = hour();
	if(currentTime === (lastFed+1)){
		update("playing");
		backgroundImg.visible = true;
		backgroundImg.addImage(gardenImg);
	} else if(currentTime === (lastFed+2)){
		update("sleeping");
		backgroundImg.visible = true;
		backgroundImg.addImage(bedroomImg);
  	} else if(currentTime > (lastFed+2) && currentTime <= (lastFed+4)){
		update("bathing");
		backgroundImg.visible = true;
		backgroundImg.addImage(washroomImg);
	} else {
		update("Hungry");
		food.display();
	}

  drawSprites();
}

function update(state){
	database.ref("/").update({
		gameState:state
	})
}

function feedDog(){
  dog.addImage(happyDog);

  if(foodStock<=0){
    foodStock=0;
    } else{
      foodStock = foodStock-1;
    }
  database.ref('/').update({
    FeedTime:hour(),
    Food:foodStock
  })
}

function addFood(){
  foodStock = foodStock + 1;

  database.ref('/').update({
    Food:foodStock
  })

}

function readStock(data){
	foodStock = data.val();
	food.updateFoodStock(foodStock);
}

function writeStock(x){
	if(x<=0){
		x = 0;
	} else {
		x = x - 1;
	}
	database.ref("/").update({
		"Food":x
	})
}
