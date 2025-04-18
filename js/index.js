document.addEventListener('DOMContentLoaded', () => {
    const attractionsList = document.getElementById('attractionsList');
    let attractions = [];

    // Load XML data
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'xml/attractions.xml', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
                    const attractionNodes = xmlDoc.getElementsByTagName('attraction');
                    
                    attractions = Array.from(attractionNodes).map(node => ({
                        placeID: node.getElementsByTagName('placeID')[0].textContent,
                        name: node.getElementsByTagName('name')[0].textContent,
                        category: node.getElementsByTagName('category')[0].textContent
                    }));

                    // Sort attractions by PlaceID
                    attractions.sort((a, b) => parseInt(a.placeID) - parseInt(b.placeID));
                    displayAttractions();
                } catch (error) {
                    console.error('Error parsing XML:', error);
                }
            } else {
                console.error('Error loading XML:', xhr.status, xhr.statusText);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error occurred');
    };
    
    xhr.send();

    // Display attractions
    function displayAttractions() {
        if (!attractionsList) {
            console.error('attractionsList element not found');
            return;
        }

        attractionsList.innerHTML = '';
        attractions.forEach(attraction => {
            const card = document.createElement('div');
            card.className = 'attraction-card';
            
            // Create a link for each attraction
            const link = document.createElement('a');
            
            // Map category to correct HTML file
            let categoryFile = attraction.category.toLowerCase();
            if (categoryFile === 'urban landmark') {
                categoryFile = 'urban';
            } else if (categoryFile.includes(' ')) {
                categoryFile = categoryFile.replace(' ', '_');
            }
            
            link.href = `${categoryFile}.html`;
            link.textContent = `${attraction.placeID} - ${attraction.name}`;
            
            const heading = document.createElement('h2');
            heading.appendChild(link);
            
            card.appendChild(heading);
            attractionsList.appendChild(card);
        });
    }
}); 