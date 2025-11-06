<template>
  <div class="mototec-logo">
    <span class="letter">M</span>
    <span class="letter">O</span>
    <span class="letter">T</span>
    <div class="ring-container">
      <div class="ring blue"></div>
      <div class="ring orange"></div>
      <div class="ring gray"></div>
      <div class="ring black"></div>
    </div>
    <span class="letter">T</span>
    <span class="letter">E</span>
    <span class="letter">C</span>
    <sup>TM</sup>
  </div>
</template>

<style scoped>
.mototec-logo {
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  color: #000;
}

.letter {
  margin: 0;
  padding: 0;
}

.ring-container {
  position: relative;
  width: 24px;
  height: 24px;
  margin: 0 2px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid;
  box-sizing: border-box;
}

.blue {
  border-color: #0072c6;
  clip: rect(0, 24px, 12px, 0);
}

.orange {
  border-color: #f7941d;
  clip: rect(12px, 24px, 24px, 0);
  transform: rotate(90deg);
  transform-origin: center;
}

.gray {
  border-color: #666;
  clip: rect(0, 24px, 12px, 0);
  transform: rotate(180deg);
  transform-origin: center;
}

.black {
  border-color: #000;
  clip: rect(12px, 24px, 24px, 0);
  transform: rotate(270deg);
  transform-origin: center;
}

sup {
  font-size: 10px;
  vertical-align: super;
  margin-left: 2px;
}
</style>
