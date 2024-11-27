

document.addEventListener('DOMContentLoaded', function() {
    const gameProgression = document.getElementById('game-progression');
    const newRoundForm = document.getElementById('shotgun-rounds-form');
    const burnerPhoneForm = document.getElementById('burner-phone-form');

    const burnerPhoneLocationSelect = document.getElementById('shell-location-select');
    const burnerPhoneLiveBlankSelect = document.getElementById('shell-live-blank-select');

    const shotgunMag = document.getElementById('shotgun-mag');
    const blankShellsRemainingSpan = document.getElementById('blank-shells-remaining');
    const liveShellsRemainingSpan = document.getElementById('live-shells-remaining'); 

    const liveShellFiredButton = document.getElementById('live-shell-fired');
    const blankShellFiredButton = document.getElementById('blank-shell-fired');
    const knownShellFiredButton = document.getElementById('known-shell-fired');

    var bulletCounter = 0;

    newRoundForm.reset();
    burnerPhoneForm.reset();


    function updateBurnerPhoneLiveBlankSelect() {
        const liveCount = parseInt(liveShellsRemainingSpan.textContent);
        const blankCount = parseInt(blankShellsRemainingSpan.textContent);

        while (burnerPhoneLiveBlankSelect.length > 0) {
            burnerPhoneLiveBlankSelect.remove(0);
        }

        if (liveCount > 0) {
            // Add live shell option
            const liveOption = document.createElement('option');
            liveOption.value = 'live';
            liveOption.textContent = 'Live';
            burnerPhoneLiveBlankSelect.appendChild(liveOption);
        }
        
        if (blankCount > 0) {
            // Add blank shell option
            const blankOption = document.createElement('option');
            blankOption.value = 'blank';
            blankOption.textContent = 'Blank';
            burnerPhoneLiveBlankSelect.appendChild(blankOption);
        }
    }

    function initialiseShellLocations() {
        function getNumberSuffix(number) {
            if (number % 10 === 1 && number % 100 !== 11) {
                return 'st';
            } else if (number % 10 === 2 && number % 100 !== 12) {
                return 'nd';
            } else if (number % 10 === 3 && number % 100 !== 13) {
                return 'rd';
            } else {
                return 'th';
            }
        }
    
        // Create options dynamically
        for (let i = 0; i < 8; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i + 1}${getNumberSuffix(i + 1)}`;
            burnerPhoneLocationSelect.appendChild(option);
        }
    }

    function updateNextShell() {
        // Remove the green border from any previously marked shell
        const previousShell = shotgunMag.querySelector('#current-shell');
        if (previousShell) {
            previousShell.removeAttribute('id', 'current-shell');
        }
    
        // Find the next shell to be fired and add the green border
        const currentShellIndex = bulletCounter;
        const currentShell = shotgunMag.querySelectorAll('.shotgun-shells')[currentShellIndex];

        if (currentShell) {
            currentShell.setAttribute('id', 'current-shell');

            // Check if the current shell has either the live-shells or blank-shells class
            if (currentShell.classList.contains('live-shells') || currentShell.classList.contains('blank-shells')) {
                document.getElementById('known-shell-fired').disabled = false;
            } else {
                document.getElementById('known-shell-fired').disabled = true;
            }
        }
        bulletCounter++;
    }

    newRoundForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const liveCount = parseInt(newRoundForm.elements['live-count'].value, 10) || 0;
        const blankCount = parseInt(newRoundForm.elements['blank-count'].value, 10) || 0;

        const totalRounds = liveCount + blankCount;

        if (totalRounds > 8 || totalRounds < 1) {
            alert('You must enter between 1 and 8 total shells.');
            return;
        }

        newRoundForm.reset();
        burnerPhoneForm.reset();
        bulletCounter = 0;

        // Clear only the shotgun sections
        const shotgunSections = shotgunMag.querySelectorAll('.shotgun-shells');
        shotgunSections.forEach(section => section.remove());

        // Create and append sections to shotgun-mag
        for (let i = 0; i < totalRounds; i++) {
            const shotgun = document.createElement('div');
            shotgun.classList.add('shotgun-shells');
            shotgun.classList.add('unknown-shells');

            shotgunMag.appendChild(shotgun);
        }

        initialiseShellLocations();

        // Remove unreachable locations in the magazine
        for (let i = burnerPhoneLocationSelect.options.length - 1; i >= totalRounds; i--) {
            burnerPhoneLocationSelect.remove(i);
        }

        liveShellsRemainingSpan.textContent = liveCount;
        blankShellsRemainingSpan.textContent = blankCount;
        updateBurnerPhoneLiveBlankSelect();
        updateNextShell()

        gameProgression.hidden = false;
        document.getElementById('burner-phone-div').style.display = '';
        
    });
    
    function removeLastShellLocation() {
        if (burnerPhoneLocationSelect.options.length > 0) {
            burnerPhoneLocationSelect.remove(burnerPhoneLocationSelect.options.length - 1);
        }
    }

    liveShellFiredButton.addEventListener('click', function() {
        let liveCount = parseInt(liveShellsRemainingSpan.textContent, 10);
        if (liveCount > 0 && liveCount < 8) {
            liveCount--;
    
            liveShellsRemainingSpan.textContent = liveCount;
    
            const nextShell = shotgunMag.querySelector('.unknown-shells');
            if (nextShell) {
                nextShell.classList.remove('unknown-shells');
                nextShell.classList.add('live-shells');
            }

            updateBurnerPhoneLiveBlankSelect();
            removeLastShellLocation();
            updateNextShell()
        }
    });
    
    blankShellFiredButton.addEventListener('click', function() {
        let blankCount = parseInt(blankShellsRemainingSpan.textContent, 10);
        if (blankCount > 0 && blankCount < 8) {
            blankCount--;
    
            blankShellsRemainingSpan.textContent = blankCount;
    
            const nextShell = shotgunMag.querySelector('.unknown-shells');
            if (nextShell) {
                nextShell.classList.remove('unknown-shells');
                nextShell.classList.add('blank-shells');
            }

            updateBurnerPhoneLiveBlankSelect();
            removeLastShellLocation();
            updateNextShell()
        }
    });


    burnerPhoneForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const knownShellIndex = parseInt(burnerPhoneForm.elements['shell-location-select'].value, 10);
        const selectedShellType = burnerPhoneForm.elements['shell-live-blank-select'].value;
        const shells = shotgunMag.querySelectorAll('.shotgun-shells');

        const targetIndex = shells.length - blankShellsRemainingSpan.textContent - liveShellsRemainingSpan.textContent + knownShellIndex;

        if (targetIndex >= 0 && targetIndex < shells.length) {
            const shell = shells[targetIndex];
            shell.classList.remove('unknown-shells', 'live-shells', 'blank-shells');

            if (selectedShellType === 'live') {
                shell.classList.add('live-shells');
                liveShellsRemainingSpan.textContent = parseInt(liveShellsRemainingSpan.textContent, 10) - 1
                updateBurnerPhoneLiveBlankSelect();



            } else if (selectedShellType === 'blank') {
                shell.classList.add('blank-shells');
                blankShellsRemainingSpan.textContent = parseInt(blankShellsRemainingSpan.textContent, 10) - 1
                updateBurnerPhoneLiveBlankSelect();

            }

            if (burnerPhoneLocationSelect.options.length > 0) {
                burnerPhoneLocationSelect.remove(burnerPhoneForm.elements['shell-location-select'].value);
            }
        }
    });

    knownShellFiredButton.addEventListener('click', function() {
        updateNextShell();
    });
});