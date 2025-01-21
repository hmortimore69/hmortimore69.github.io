document.addEventListener("DOMContentLoaded", function() {
    const minecraftForm = document.getElementById('minecraft-config-form');
    const editionSelect = document.getElementById("minecraft-edition-select");
    const versionSelect = document.getElementById("minecraft-version-select");
    const villagerDataDiv = document.getElementById("villager-data");

    const toggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';

    let minecraftData = {};

    // Fetch trades data from the JSON file
    fetch('./trades.json')
        .then(response => response.json())
        .then(data => {
            minecraftData = data;
            populateVersionOptions();
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
        });

    window.addEventListener('scroll', function() {
            const formRect = minecraftForm.getBoundingClientRect();
    
            if (formRect.top <= 0) {
                minecraftForm.classList.add('sticky');
            } else {
                minecraftForm.classList.remove('sticky');
            }
        });
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
        const isChecked = toggle.checked;
        document.body.classList.toggle('dark-mode', isChecked);
        
        localStorage.setItem('dark-mode', isChecked);
    });

    function populateVersionOptions() {
        const selectedEdition = editionSelect.value;
        versionSelect.innerHTML = ""; 

        if (minecraftData[selectedEdition]) {
            const versions = Object.keys(minecraftData[selectedEdition]);
            versions.forEach(version => {
                const option = document.createElement("option");
                option.value = version;
                option.textContent = version;
                versionSelect.appendChild(option);
            });
            if (versions.length > 0) {
                versionSelect.disabled = false;
                displayVillagerData();
            } else {
                versionSelect.disabled = true;
            }
        } else {
            versionSelect.disabled = true;
        }
    }

    function getItemImage(itemName) {
        const formattedName = itemName.toLowerCase().replace(/ /g, "_");
        const imgSrc = `trade-item-images/${formattedName}.png`;
        return `<img class="trade-item-img" src="${imgSrc}" alt="${itemName}">`;
    }

    function getShimmerText(itemName, isEnchanted) {
        if (isEnchanted) {
            return `<span class="shimmer-text">${itemName}</span>`;
        } else {
            return `<span>${itemName}</span>`;
        }
    }

    function displayVillagerData() {
        const selectedEdition = editionSelect.value;
        const selectedVersion = versionSelect.value;
        const versionData = minecraftData[selectedEdition] ? minecraftData[selectedEdition][selectedVersion] : {};
        
        villagerDataDiv.innerHTML = "";
        document.getElementById("villager-matrix").innerHTML = "";
    
        if (Object.keys(versionData).length === 0) {
            villagerDataDiv.innerHTML = "<p>No villager data available for this version.</p>";
            return;
        }
    
        // Create the job-block matrix
        const jobBlocks = new Set();
    
        for (const villager in versionData) {
            const villagerInfo = versionData[villager];
            
            if (villagerInfo["job-block"] && villagerInfo["job-block"][0]) {
                jobBlocks.add(villagerInfo["job-block"][0]);
            }
        }
    
        // Populate the job-block matrix with clickable images
        const matrixContainer = document.getElementById("villager-matrix");
        jobBlocks.forEach(jobBlock => {
            const jobBlockImage = document.createElement("img");
            jobBlockImage.src = `job-block-images/${jobBlock.toLowerCase().replace(/ /g, "_")}.png`; // Assuming images are named by job block names
            jobBlockImage.alt = jobBlock;
            jobBlockImage.classList.add("job-block-matrix-img");
            
            jobBlockImage.addEventListener("click", () => {
                const villagerSection = document.getElementById(jobBlock); // Assuming each villager section has an ID matching the job block
                
                if (villagerSection) {
                    const stickySection = document.querySelector("#trading-information")
        
                    const styles = window.getComputedStyle(stickySection);
                    const marginTop = parseInt(styles.marginTop, 10) || 18.72; 
                    const stickyHeight = stickySection.offsetHeight;
                
                    window.scrollTo({
                        top: villagerSection.offsetTop - stickyHeight - marginTop,
                        behavior: "smooth" 
                    });
                }
            });
            
            matrixContainer.appendChild(jobBlockImage);
        });
    
        // Loop through all villagers and create their content
        for (const villager in versionData) {
            const villagerInfo = versionData[villager];
    
            const villagerContainer = document.createElement("div");
            villagerContainer.classList.add("villager-container");
            const tableHTML = `
                <h3 id="${villagerInfo["job-block"][0]}">${villager}</h3>   
                <table class="villager-info-table">
                    <tr>
                        <th>Image</th>
                        <td><img class="villager-img" src="${villagerInfo.image}" alt="${villager}"></td>
                    </tr>
                    <tr>
                        <th>Workstation</th>
                        <td><img class="job-block-img" src="${villagerInfo["job-block"][1]}" alt="Job Block Image">${villagerInfo["job-block"][0]}</td>
                    </tr>
                </table>
            `;
            villagerContainer.innerHTML = tableHTML;
    
            const tradeTypeColors = {
                "Novice": "#FFB000",
                "Apprentice": "#00ccff",
                "Journeyman": "#40ED62",  
                "Expert": "#CC5AC6", 
                "Master": "#ff5733", 
            };

            const tradeTypes = Object.keys(villagerInfo);
            tradeTypes.forEach(tradeType => {
                if (tradeType !== "image" && tradeType !== "job-block") {
                    const tradeData = villagerInfo[tradeType];
                    const tradeTypeColor = tradeTypeColors[tradeType] || "#f0f8ff";

                    const tradeTableHTML = `
                        <h4 style="border-left: 5px solid ${tradeTypeColor};">${tradeType} Trades:</h4>
                        <table class="trade-table">
                            <thead>
                                <tr class="header" style="background-color: ${tradeTypeColor};">
                                    <th>Items Wanted</th>
                                    <th>Default Quantity</th>
                                    <th>Price Multiplier</th>
                                    <th>Item Given</th>
                                    <th>Quantity</th>
                                    <th>Trades Until Disabled</th>
                                    <th>Villager XP</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tradeData.map(trade => {
                                    // Handle multiple required items (Item Wanted)
                                    const wantedItemsHTML = trade["Item Wanted"].map(item => {
                                        return `${getItemImage(item.name)} ${item.name}`;
                                    }).join(`<br>`);

                                    const wantedItemQuantity = trade["Item Wanted"].map(item => {
                                        return `<p>${item.quantity}</p>`;
                                    }).join("");
    
                                    const itemGivenEnchanted = trade["Enchanted"] === true; // Check if the item is enchanted

                                    const tooltipHTML = trade["Tooltip"] ? `<span class="tooltip" data-tooltip="${trade["Tooltip"]}">[?]</span>` : '';
                                    return `
                                        <tr>
                                            <td>${wantedItemsHTML}</td>
                                            <td class="default-quantity">${wantedItemQuantity}</td>
                                            <td>${trade["Price Multiplier"]}</td>
                                            <td>
                                                ${getItemImage(trade["Item Given"])} 
                                                ${getShimmerText(trade["Item Given"], itemGivenEnchanted)}
                                                ${tooltipHTML}
                                            </td>
                                            <td>${trade["Quantity"]}</td>
                                            <td>${trade["Trades Until Disabled"]}</td>
                                            <td>${trade["Villager XP"]}</td>
                                        </tr>`;
                                }).join("")}
                            </tbody>
                        </table>
                    `;
                    villagerContainer.innerHTML += tradeTableHTML;
                }
            });
    
            villagerDataDiv.appendChild(villagerContainer);
        }
    }

    // Update versions when edition changes
    editionSelect.addEventListener("change", () => {
        populateVersionOptions();
    });

    // Display villager data when version changes
    versionSelect.addEventListener("change", displayVillagerData);
});