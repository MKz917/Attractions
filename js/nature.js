document.addEventListener('DOMContentLoaded', () => {
    const attractionDetails = document.getElementById('attractionDetails');
    let attractions = [];

    // Load XML data
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../xml/attractions.xml', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xmlDoc = xhr.responseXML;
            const attractionNodes = xmlDoc.getElementsByTagName('attraction');
            
            attractions = Array.from(attractionNodes)
                .filter(node => node.getElementsByTagName('category')[0].textContent === 'Nature')
                .map(node => ({
                    placeID: node.getElementsByTagName('placeID')[0].textContent,
                    name: node.getElementsByTagName('name')[0].textContent,
                    city: node.getElementsByTagName('city')[0].textContent,
                    state: node.getElementsByTagName('state')[0].textContent,
                    description: node.getElementsByTagName('description')[0].textContent,
                    openingHours: node.getElementsByTagName('openingHours')[0].textContent,
                    ticket: node.getElementsByTagName('ticket')[0].textContent,
                    price: node.getElementsByTagName('price')[0].textContent,
                    image: node.getElementsByTagName('image')[0].textContent
                }));

            displayAttractionDetails();
        }
    };
    xhr.send();

    // Display attraction details
    function displayAttractionDetails() {
        attractionDetails.innerHTML = '';
        attractions.forEach(attraction => {
            const card = document.createElement('div');
            card.className = 'attraction-card';
            card.innerHTML = `
                <h2>${attraction.name} (${attraction.placeID})</h2>
                <p><strong>Location:</strong> ${attraction.city}, ${attraction.state}</p>
                <p><strong>Opening Hours:</strong> ${attraction.openingHours}</p>
                <p><strong>Ticket Required:</strong> ${attraction.ticket}</p>
                <p><strong>Price:</strong> RM${attraction.price}</p>
                <p>${attraction.description}</p>
                <img src="../images/${attraction.image}" alt="${attraction.name}" style="max-width: 100%; margin-top: 1rem;">
            `;
            attractionDetails.appendChild(card);
        });
    }
}); 