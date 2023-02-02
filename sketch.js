//Variables
let msDelay = 1;

let canvasWidth = (window.innerWidth%2 == 0 ? window.innerWidth : --window.innerWidth);
let canvasHeight = (window.innerHeight%2 == 0 ? window.innerHeight : --window.innerHeight)-100;
let numElements = canvasWidth/2;

let nums = [];

let width = 0;
let height = 0;

let index = 0;
let doSort = true;
let stopSort = false;

//Elements
let speedSlider;
let numElementsSlider;
let startButton;
let resetButton;
let sortSelect;



function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  fill(220);
  noStroke();
  doSort = false;

  speedSlider = createSlider(0, 300, 295, 1);
  speedSlider.position(10, canvasHeight + 50)
  speedSlider.style('width', '200px');

  numElementsSlider = createSlider(2, canvasWidth, canvasWidth/4, 1);
  numElementsSlider.position(250, canvasHeight + 50);
  numElementsSlider.style('width', '200px');
  
  numElements = numElementsSlider.value();
  for(let i = 1; i<=numElements; i++){  
    nums.push(i);
  }
  for(let i = 0; i<numElements; i++){
    nums = runAlg(nums, scramble, i);
  }
  width = canvasWidth/numElements;
  height = canvasHeight/numElements;

  startButton = createButton("Run Animation");
  startButton.position(canvasWidth-150, canvasHeight + 25);
  startButton.mousePressed(toggleSort);

  resetButton = createButton("Shuffle");
  resetButton.position(canvasWidth-150, canvasHeight + 45);
  resetButton.mousePressed(reset);

  sortSelect = createSelect();
  sortSelect.position(500, canvasHeight + 50);
  sortSelect.option('Quick sort');
  sortSelect.option('Bubble sort');
  sortSelect.option('Insertion sort');
  sortSelect.changed(sortSelectChanged);
}

//Note: function copied off StackOverflow
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleSort(){
  doSort = !doSort;
  if(doSort){
    startButton.html("Stop Animation");
  } else {
    startButton.html("Run Animation");
  }
}

function scramble(array, index) {
  let r = floor(random(index+1, array.length-1))

  let temp = array[index];

  array[index] = array[r];
  array[r] = temp;

  return array;
}

function insertionSort(array, index) {
  let i = 0, key = 0, j = 0;
  for (i = 1; i < index; i++) {
    key = array[i];
    j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j = j - 1;
    }
    array[j + 1] = key;
  }
}

function bubbleSort(array) {
  for(let i = 0; i<array.length-1; i++){
    if(array[i] > array[i+1]){
      let temp = array[i];
      array[i] = array[i+1];
      array[i+1] = temp;
    }
  }
}

async function swap(array, index1, index2){
  await sleep(msDelay);

  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
}

async function quickSort(array, start, end) {
  //take pivot to be first element in array
  if(stopSort){
    return;
  }

  while(!doSort){
    await sleep(1);
  }

  let arrStart = start;
  let arrEnd = end;
  
  if(end-start < 0){
    return;
  }

  if(end-start == 0) {
    if(array[start]<array[end]) {
      await swap(array, start, end);
      return;
    }
    return;
  }

  let pivot = array[start];
  start++;

  while(start<=end){
    let changedPos = false;

    if(array[start] < pivot){
      start++;
      changedPos = true;
    }
    if(array[end] >= pivot){
      end--;
      changedPos = true;
    }

    if(!changedPos){
      await swap(array, start, end);
    }
  }
  
  await swap(array, arrStart, end);

  await quickSort(array, arrStart, end-1);
  await quickSort(array, end+1, arrEnd);
}

function runAlg(array, algorithm, index){
  let r = algorithm(array, index);

  return r;
}

function reset(){
  stopSort = true;
  doSort = false;
  startButton.html("Run Animation");

  numElements = numElementsSlider.value();
  width = canvasWidth/numElements;
  height = canvasHeight/numElements;

  nums = [];
  for(let i = 1; i<=numElements; i++){  
    nums.push(i);
  }
  for(let i = 0; i<numElements; i++){
    nums = runAlg(nums, scramble, i);
  }

  stopSort = false;
  index = 0;
}

function draw() {
  background(22);
  msDelay = (301 - speedSlider.value());
  if(numElementsSlider.value() != numElements){
    reset();
  }

  //Control elements
  fill(22);
  rect(0,canvasHeight,canvasWidth,100)
  //Labels  
  fill(255);
  textSize(20);
  text('Animation Speed', 20, canvasHeight + 40);
  text('Number of Elements', 260, canvasHeight + 40);
  fill(220);


  for (let i = 0; i < nums.length; i++) {
    let element = nums[i];
    rect(i*width, canvasHeight - (element*height), width, element*height);
  }

  if(sortSelect.value()=='Quick sort'){
    if(index < 1) {
      quickSort(nums, 0, nums.length-1);
      index ++;
    }
  } else if(sortSelect.value()=='Bubble sort' || sortSelect.value()=='Insertion sort'){
    if(doSort){
      if(index>numElements){
        toggleSort();
      } else {
        switch(sortSelect.value()){
          case "Bubble sort":
            bubbleSort(nums);
            break;
          case "Insertion sort":
            insertionSort(nums, index);
        }
        index++;
      }
    }
  }
}

function sortSelectChanged(){
  reset();
}

