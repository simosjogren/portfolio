

export function initControlPanel() {
    const controls = {
      btnCntrlU: false,
      btnCntrlD: false,
      btnCntrlL: false,
      btnCntrlR: false
    };
  
    // Function to set the control state
    function setControlState(control, state) {
      controls[control] = state;
      console.log(control, state)
      // You can call your movement function here
      // moveCharacter();
    }
  
    // Add event listeners for each button
    document.getElementById('btnCntrlU').addEventListener('mousedown', () => setControlState('btnCntrlU', true));
    document.getElementById('btnCntrlU').addEventListener('mouseup', () => setControlState('btnCntrlU', false));
    document.getElementById('btnCntrlU').addEventListener('touchstart', () => setControlState('btnCntrlU', true));
    document.getElementById('btnCntrlU').addEventListener('touchend', () => setControlState('btnCntrlU', false));
  
    document.getElementById('btnCntrlD').addEventListener('mousedown', () => setControlState('btnCntrlD', true));
    document.getElementById('btnCntrlD').addEventListener('mouseup', () => setControlState('btnCntrlD', false));
    document.getElementById('btnCntrlD').addEventListener('touchstart', () => setControlState('btnCntrlD', true));
    document.getElementById('btnCntrlD').addEventListener('touchend', () => setControlState('btnCntrlD', false));
  
    document.getElementById('btnCntrlL').addEventListener('mousedown', () => setControlState('btnCntrlL', true));
    document.getElementById('btnCntrlL').addEventListener('mouseup', () => setControlState('btnCntrlL', false));
    document.getElementById('btnCntrlL').addEventListener('touchstart', () => setControlState('btnCntrlL', true));
    document.getElementById('btnCntrlL').addEventListener('touchend', () => setControlState('btnCntrlL', false));
  
    document.getElementById('btnCntrlR').addEventListener('mousedown', () => setControlState('btnCntrlR', true));
    document.getElementById('btnCntrlR').addEventListener('mouseup', () => setControlState('btnCntrlR', false));
    document.getElementById('btnCntrlR').addEventListener('touchstart', () => setControlState('btnCntrlR', true));
    document.getElementById('btnCntrlR').addEventListener('touchend', () => setControlState('btnCntrlR', false));
  
    // Repeat for btnCntrlD, btnCntrlL, btnCntrlR...
}