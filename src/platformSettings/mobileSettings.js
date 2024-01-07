

export function initControlPanel(movement) {
    const controls = {
      btnCntrlU: false,
      btnCntrlD: false,
      btnCntrlL: false,
      btnCntrlR: false
    };
  
    // Function to set the control state
    function setControlState(control, state) {
      switch (control) {
        case 'btnCntrlU':
          movement.up = state;
          movement.left = false;
          movement.right = false;
          break;
        case 'btnCntrlL':
          movement.left = state;
          movement.up = state;
          break;
        case 'btnCntrlR':
          movement.right = state;
          movement.up = state;
          break;
      }
      controls[control] = state;
    }

      // Function to reset all movement
    function resetMovement() {
      movement.up = false;
    }

    // Add event listeners for the reset button
    document.getElementById('btnReset').addEventListener('mousedown', resetMovement);
    document.getElementById('btnReset').addEventListener('touchstart', resetMovement);
  
    // Add event listeners for each button
    document.getElementById('btnCntrlU').addEventListener('mousedown', () => setControlState('btnCntrlU', true));
    document.getElementById('btnCntrlU').addEventListener('mouseup', () => setControlState('btnCntrlU', false));
    document.getElementById('btnCntrlU').addEventListener('touchstart', () => setControlState('btnCntrlU', true));
    document.getElementById('btnCntrlU').addEventListener('touchend', () => setControlState('btnCntrlU', false));
  
    document.getElementById('btnCntrlL').addEventListener('mousedown', () => setControlState('btnCntrlL', true));
    document.getElementById('btnCntrlL').addEventListener('mouseup', () => setControlState('btnCntrlL', false));
    document.getElementById('btnCntrlL').addEventListener('touchstart', () => setControlState('btnCntrlL', true));
    document.getElementById('btnCntrlL').addEventListener('touchend', () => setControlState('btnCntrlL', false));
  
    document.getElementById('btnCntrlR').addEventListener('mousedown', () => setControlState('btnCntrlR', true));
    document.getElementById('btnCntrlR').addEventListener('mouseup', () => setControlState('btnCntrlR', false));
    document.getElementById('btnCntrlR').addEventListener('touchstart', () => setControlState('btnCntrlR', true));
    document.getElementById('btnCntrlR').addEventListener('touchend', () => setControlState('btnCntrlR', false));
}

// Function to toggle the visibility of the control panel
export function toggleControlPanel() {
  const ctrlPanel = document.getElementById('ctrlBtnArea');
  if (ctrlPanel) {
      if (ctrlPanel.style.display === 'none' || ctrlPanel.style.display === '') {
          ctrlPanel.style.display = 'block'; // Show the controls
      } else {
          ctrlPanel.style.display = 'none'; // Hide the controls
      }
  }
}