document.addEventListener('DOMContentLoaded', function() {
  const btnsContainer = document.querySelector('.controller-buttons-container');
  btnsContainer.addEventListener('click', handleButtonClick);
  const loadingSpinner = document.querySelector('.loading-spinner');
  loadingSpinner.style.display = 'none';

  const localFilesButton = document.getElementById('local-files-button');
  const localConfirmButton = document.getElementById('local-clear-button');
  const localViewButton = document.getElementById('local-view-button');

  localFilesButton.addEventListener('click', () => {
    if (!lastSelectedRow) {
      console.log('No row selected');
      return;
    }
    localConfirmButton.classList.toggle('hidden');
    localViewButton.classList.toggle('hidden');
  });

  localViewButton.addEventListener('click', handleViewButtonClick); // Updated event listener

  async function handleButtonClick(event) {
    const button = event.target.closest('.button');
    if (!button) return;

    const action = button.dataset.action;
    if (action === 'screenshot') {
        const overlay = document.createElement('div');
        const popup = document.createElement('div');
        popup.classList.add('popup', 'fade-in', 'visible');
        popup.innerHTML = `
          <div class="waviy">
            <span>Grabbing Screenshot...</span>
          </div>
          <div class="loading-spinner"></div>`;
        overlay.classList.add('overlay', 'visible');
        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        try {
          overlay.style.display = 'block';
          await makeAjaxRequest(action);
          refreshImageSlider();
        } catch (error) {
          console.error('Error during AJAX request:', error);
        } finally {
          overlay.remove();
          popup.remove();
        }

    } else if (action === 'update') {
      if (!lastSelectedRow) {
        console.log('No row selected');
        return;
      }
      const overlay = document.createElement('div');
      const popup = document.createElement('container');
      popup.classList.add('popup', 'fade-in');
      setTimeout(() => {
        popup.classList.remove('visible');
        void popup.offsetWidth; // Trigger reflow to restart the animation
        popup.classList.add('visible');
      }, 50);
      overlay.classList.add('overlay');
      document.body.appendChild(overlay);
      popup.innerHTML = `
        <h1>Update ${lastSelectedRow.cells[2].innerText}?</h1>
        <div class="popup-buttons">
          <button id="yes-button">Yes</button>
          <button id="no-button">No</button>
        </div>`;
      document.body.appendChild(popup);
      const yesButton = document.getElementById('yes-button');
      const noButton = document.getElementById('no-button');
      yesButton.addEventListener('click', handleUpdateConfirmation);
      noButton.addEventListener('click', () => {
        popup.remove();
        overlay.classList.remove('visible');
        document.body.removeChild(overlay);
      });
    } else if (action === 'sysinfo') {
        const overlay = document.createElement('div');
        const popup = document.createElement('div');
        popup.classList.add('popup', 'fade-in', 'visible');
        popup.innerHTML = `
          <div class="waviy">
            <span>Grabbing sysInfo...</span>
          </div>
          <div class="popup-loading">
            <div class="loading-spinner"></div>
          </div>`;
        overlay.classList.add('overlay', 'visible');
        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        try {
          overlay.style.display = 'block';
          await makeAjaxRequest(action);
          refreshImageSlider();
        } catch (error) {
          console.error('Error during AJAX request:', error);
        } finally {
          overlay.remove();
          popup.remove();
        }
    } else if (action === 'restart') {
      if (!lastSelectedRow) {
        console.log('No row selected');
        return;
      }
      const overlay = document.createElement('div');
      const popup = document.createElement('container');
      popup.classList.add('popup', 'fade-in');
      setTimeout(() => {
        popup.classList.remove('visible');
        void popup.offsetWidth; // Trigger reflow to restart the animation
        popup.classList.add('visible');
      }, 50);
      overlay.classList.add('overlay');
      document.body.appendChild(overlay);
      popup.innerHTML = `
        <h1>Restart ${lastSelectedRow.cells[2].innerText}?</h1>
        <div class="popup-buttons">
          <button id="yes-button">Yes</button>
          <button id="no-button">No</button>
        </div>`;
      document.body.appendChild(popup);
      const yesButton = document.getElementById('yes-button');
      const noButton = document.getElementById('no-button');
      yesButton.addEventListener('click', handleRestartConfirmation);
      noButton.addEventListener('click', () => {
        popup.remove();
        overlay.classList.remove('visible');
        document.body.removeChild(overlay);
      });
    } else if (action === 'tasks') {
      if (!lastSelectedRow) {
        console.log('No row selected');
        return;
      }
      button.removeEventListener('click', handleButtonClick); // Remove event listener from the clicked button
      makeAjaxRequest('tasks');
    } else {
      makeAjaxRequest(action);
    }
  }

  async function handleViewButtonClick() {
    if (!lastSelectedRow) {
      console.log('No row selected');
      return;
    }

    try {
      await makeAjaxRequest('view'); // Send AJAX request with action 'view'
    } catch (error) {
      console.error('Error during AJAX request:', error);
    }
  }

  function handleRestartConfirmation() {
    makeAjaxRequest('restart');
    const popup = document.querySelector('.popup');
    popup.remove();
    location.reload();
  }

  function handleUpdateConfirmation() {
    makeAjaxRequest('update');
    const popup = document.querySelector('.popup');
    popup.remove();
    location.reload();
  }

  async function makeAjaxRequest(data) {
    try {
      const response = await fetch('/controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({ data, station })
      });
      const responseData = await response.json();
      console.log('Received response from Flask backend:', responseData);
      if (data === 'error') {
        console.log('error', data);
      }

      if (responseData.type === 'system' || responseData.type === 'tasks') {
        if (responseData.type === 'system') {
          var fileName = responseData.fileName;
          var fileContent = responseData.fileContent;
          var preElement = document.createElement('pre');
          preElement.textContent = responseData.fileContent;

          // Clear the information container before updating
          while (informationContainer.firstChild) {
            informationContainer.firstChild.remove();
          }

          informationContainer.appendChild(preElement);

          refreshImageSlider();
          console.log('responseData', fileName);
        } else if (responseData.type === 'tasks') {
          var fileName = responseData.fileName;
          var fileContent = responseData.fileContent;

          var tasksContainer = document.querySelector('.tasks-container');
          tasksContainer.innerHTML = '';
          var preElement = document.createElement('pre');
          preElement.textContent = responseData.fileContent;
          tasksContainer.appendChild(preElement);

          refreshImageSlider();
          console.log('responseData', fileName);

        } else if (responseData.type === 'error') {
          console.log('error', responseData.error);
        }
      }
    } catch (error) {
      console.error('Error in makeAjaxRequest:', error);
    }
  }
});
