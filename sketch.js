var dog, dogImg, happyDog, sadDog, database, foodS, foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var gameState = "Playing";
var changeGameState, readGameState;
var bedroomImg, washroomImg, gardenImg;
//Ma'am I am not getting anything in this project. Ma'am please help me in this project!

function preload()
{
  dogImg = loadImage("virtual pet images/Dog.png");
  happyDog = loadImage("virtual pet images/happy dog.png");
  sadDog = loadImage("virtual pet images/deadDog.png");
  bedroomImg = loadImage("virtual pet images/Bed Room.png");
  washroomImg = loadImage("virtual pet images/Wash Room.png");
  gardenImg = loadImage("virtual pet images/Garden.png");
}

function setup() 
{
  database = firebase.database();
  console.log(database);
  createCanvas(500, 500);
  dog = createSprite(250, 250, 10, 10);
  dog.addImage(dogImg);
  dog.scale = 0.5;
  foodObj = new Food(100, 10, 100, 200);
  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);
  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
  //var dogPosition = database.ref('dog/position');
  //dogPosition.on("value", readPosition, showError);
  foodstock = database.ref('Food');
  foodStock.on("value, readStock");
  textSize(20);
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data)
  {
    lastFed = data.val();
  }
  );
  readGameState = database.ref('gameState');
  readGameState.on("value", function(data)
  {
    gameState = data.val();
  });
}


function draw() 
{  
  background(46, 139, 87);
  if(keyWentDown(UP_ARROW))
  {
    writeStock(foodS);
    dog.addImage(happyDog);
    //Food = Food - 1;
  }
  drawSprites();
  foodStock.display();
  fill("black");
  text("food remaining: " + foodS, 170, 200);
  textSize(13);
  text("Note: Use UP Arrow Key To Feed The Dog Milk!", 250, 50);
  fill("white");
  stroke(6);
  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12)
  {
    text("Last Feed : " + lastFed%12 + " PM", 350, 30);
  }
  else if(lastFed == 0)
  {
    text("Last Fed : 12 AM", 350, 30);
  }
  else
  {
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }
  currentTime = hour();
  if(currentTime == (lastFed+1))
  {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed+2))
  {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))
  {
    update("Bathing");
    foodObj.washroom();
  }
  else
  {
    update("Hungry");
    foodObj.display();
  }
  if(gameState!="Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
}

function readStock(data)
{
  foodS = data.val();
}

function writeStock(x)
{
  if(x<=0)
  {
    x = 0;
  }
  else 
  {
    x = x - 1;
  }
  database.ref('/').update
  (
    {
      Food:x
    }
  )
}
function feedDog()
{
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update
  (
    {
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    }
  )
}
function addFood()
{
  foodS++;
  database.ref('/').update
  (
    {
      Food:foodS
    }
  )
}
function update(state)
{
  database.ref('/').update
  (
    {
      gameState:state
    }
  );
}



