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
        
        burnerPhoneLocationSelect.innerHTML = '';
        
        // Get all shotgun shells
        const shotgunShells = document.querySelectorAll('.shotgun-shells');
        const currentShellIndex = bulletCounter;

        // Check if currentShellIndex is valid
        if (currentShellIndex !== -1 && currentShellIndex < shotgunShells.length) {
            // Create options dynamically from current shell to the end
            for (let i = currentShellIndex; i < shotgunShells.length; i++) {
                const shell = shotgunShells[i];
                const optionIndex = i - currentShellIndex + 1;
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${optionIndex}${getNumberSuffix(optionIndex)}`;
                burnerPhoneLocationSelect.appendChild(option);
            }
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
                document.getElementById('blank-shell-fired').disabled = true;
                document.getElementById('live-shell-fired').disabled = true;
            } else {
                document.getElementById('known-shell-fired').disabled = true;
                document.getElementById('blank-shell-fired').disabled = false;
                document.getElementById('live-shell-fired').disabled = false;
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

    liveShellFiredButton.addEventListener('click', function() {
        let liveCount = parseInt(liveShellsRemainingSpan.textContent, 10);
        if (liveCount > 0 && liveCount < 8) {
            liveCount--;
    
            liveShellsRemainingSpan.textContent = liveCount;
    
            const nextShell = shotgunMag.querySelector('#current-shell');
            if (nextShell) {
                nextShell.classList.remove('unknown-shells');
                nextShell.classList.add('live-shells');
            }

            updateBurnerPhoneLiveBlankSelect();
            initialiseShellLocations();
            updateNextShell()
        }
    });
    
    blankShellFiredButton.addEventListener('click', function() {
        let blankCount = parseInt(blankShellsRemainingSpan.textContent, 10);
        if (blankCount > 0 && blankCount < 8) {
            blankCount--;
    
            blankShellsRemainingSpan.textContent = blankCount;
    
            const nextShell = shotgunMag.querySelector('#current-shell');
            if (nextShell) {
                nextShell.classList.remove('unknown-shells');
                nextShell.classList.add('blank-shells');
            }

            updateBurnerPhoneLiveBlankSelect();
            initialiseShellLocations();
            updateNextShell()
        }
    }); 


    // broken
    burnerPhoneForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const magLocation = parseInt(burnerPhoneForm.elements['shell-location-select'].value, 10);
        const liveOrBlank = burnerPhoneForm.elements['shell-live-blank-select'].value;

        console.log(bulletCounter, magLocation);
        const knownShell = shotgunMag.querySelectorAll('.shotgun-shells')[magLocation];

        if (knownShell.classList.contains('live-shells') || knownShell.classList.contains('blank-shells')) {
            return;
        }

        if (liveOrBlank === 'live' && liveShellsRemainingSpan.textContent > 0) {
            knownShell.classList.add('live-shells');
            liveShellsRemainingSpan.textContent--;  
        } else if (liveOrBlank === 'blank' && blankShellsRemainingSpan.textContent > 0) {
            knownShell.classList.add('blank-shells');
            blankShellsRemainingSpan.textContent--;  
        }

        // Check if the shell location is the first one
        if (magLocation === bulletCounter - 1) {
            bulletCounter--;
            updateNextShell();
        }

        updateBurnerPhoneLiveBlankSelect();
    });

    knownShellFiredButton.addEventListener('click', function() {
        initialiseShellLocations()
        updateNextShell();
    });
});