let time = 0;
let wave = [];
let slider;
let speedSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);  
  slider = createSlider(1, 50, 5); 
  speedSlider = createSlider(0.01, 0.1, 0.02, 0.01); 
  
  slider.position(width * 0.05, height * 0.85);
  speedSlider.position(width * 0.05, height * 0.80);
  
  let harmonicLabel = createDiv('Number of Harmonics');
  harmonicLabel.position(width * 0.05, height * 0.87);

  let speedLabel = createDiv('Speed');
  speedLabel.position(width * 0.05, height * 0.82);
  
  // Remove any default margins or padding from the browser and prevent scrolling
  noStroke();
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.documentElement.style.overflow = 'hidden';  // Prevent scrolling
  document.body.style.overflow = 'hidden';
}

function draw() {
  background(255);
  
  // Center the drawing and apply horizontal offset (adjusted for window size)
  translate(width / 2.5, height / 2.5);

  let speedFactor = speedSlider.value();  

  let x = 0;
  let y = 0;

  // Draw the Fourier components (harmonics), scale the radius based on window size
  for (let i = 0; i < slider.value(); i++) {
    let prevx = x;
    let prevy = y;

    let n = i * 2 + 1;
    let radius = width / 10 * (4 / (n * PI));  
    x += radius * cos(n * time);
    y += radius * sin(n * time);

    stroke(0);
    noFill();
    ellipse(prevx, prevy, radius * 2);

    stroke(0);
    line(prevx, prevy, x, y);
  }

  wave.unshift(y);

  translate(width * 0.2, 0);  
  strokeWeight(1);  

  let horizontalLineLength = (x - width * 0.2); 
  line(horizontalLineLength, y, 0, wave[0]);

  // Draw the wave path
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);  
  }
  endShape();

  time -= speedFactor;  

  if (wave.length > 250) {
    wave.pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  slider.position(width * 0.05, height * 0.85);
  speedSlider.position(width * 0.05, height * 0.80);
  
  let harmonicLabel = selectAll('div')[0];
  harmonicLabel.position(width * 0.05, height * 0.87);

  let speedLabel = selectAll('div')[1];
  speedLabel.position(width * 0.05, height * 0.82);
}
