document.addEventListener("DOMContentLoaded", function() {
    const minecraftForm = document.getElementById('minecraft-config-form');
		const editionSelect = document.getElementById("minecraft-edition-select");
		const versionSelect = document.getElementById("minecraft-version-select");
		const villagerDataDiv = document.getElementById("villager-data");

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
	
					// Check if the form has become sticky
					if (formRect.top <= 0) {
							minecraftForm.classList.add('sticky');
					} else {
							minecraftForm.classList.remove('sticky');
					}
			});

		function populateVersionOptions() {
				const selectedEdition = editionSelect.value;
				versionSelect.innerHTML = ""; // Clear existing options

				// Ensure there's data for the selected edition
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
								displayVillagerData(); // Show data for the first version
						} else {
								versionSelect.disabled = true;
						}
				} else {
						versionSelect.disabled = true;
				}
		}

		function getItemImage(itemName) {
				// Convert item name to lowercase and replace spaces with underscores
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
		
				if (Object.keys(versionData).length === 0) {
						villagerDataDiv.innerHTML = "<p>No villager data available for this version.</p>";
						return;
				}
		
				for (const villager in versionData) {
						const villagerInfo = versionData[villager];
		
						const villagerContainer = document.createElement("div");
						villagerContainer.classList.add("villager-container");
		
						const tableHTML = `
								<h3>${villager}</h3>
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
		
						// Loop through all trade types (e.g., "Novice", "Apprentice", etc.)
						const tradeTypes = Object.keys(villagerInfo);
						tradeTypes.forEach(tradeType => {
								if (tradeType !== "image" && tradeType !== "job-block") {
										const tradeData = villagerInfo[tradeType];
		
										const tradeTableHTML = `
												<h4>${tradeType} Trades:</h4>
												<table>
														<thead>
																<tr class="header">
																		<th>Item Wanted</th>
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
																		const itemGivenEnchanted = trade["Enchanted"] === true; // Check if the item is enchanted
																		return `
																		<tr>
																				<td>
																						${getItemImage(trade["Item Wanted"])} 
																						${getShimmerText(trade["Item Wanted"], false)}
																				</td>
																				<td>${trade["Default Quantity"]}</td>
																				<td>${trade["Price Multiplier"]}</td>
																				<td>
																						${getItemImage(trade["Item Given"])} 
																						${getShimmerText(trade["Item Given"], itemGivenEnchanted)}
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

		// Display data on form submit
		document.getElementById("minecraft-config-form").addEventListener("submit", function(e) {
				e.preventDefault();
				displayVillagerData();
		});
});
