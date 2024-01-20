// content.js
// Function to send data to the server and get the words to highlight
function startHighlighting(word) {
    highlightText(document.body, word);
}

function getWordsToHighlight(text) {
    // Endpoint where your Python server is listening
    const serverEndpoint = 'http://localhost:5000/highlight';

    // Prepare data to send, you might want to send the entire page HTML or just the text
    const dataToSend = { text: text };

    // Sending a POST request to the server
    fetch(serverEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data.words)
        data.words.forEach(word => startHighlighting(word));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to highlight words on the page
function createHighlightElement(text) {
    const highlightElement = document.createElement('span');
    highlightElement.textContent = text;
    highlightElement.style.backgroundColor = 'yellow';
    highlightElement.style.color = 'black';
    return highlightElement;
}

// Recursive function to process each node
function highlightText(node, word) {
    const regex = new RegExp(word, 'gi'); // global, case insensitive

    // Only proceed with text nodes (nodeType === 3)
    if (node.nodeType === 3) {
        const matches = [...node.textContent.matchAll(regex)];
        if (matches.length > 0) {
            const span = document.createDocumentFragment();
            let lastIdx = 0;
            matches.forEach(match => {
                // Text before the match
                span.appendChild(document.createTextNode(node.textContent.substring(lastIdx, match.index)));
                // The highlighteinnerTextd text
                span.appendChild(createHighlightElement(match[0]));
                lastIdx = match.index + match[0].length;
            });
            // Text after the last match
            span.appendChild(document.createTextNode(node.textContent.substring(lastIdx)));
            node.parentNode.replaceChild(span, node);
        }
    } else {
        // For non-text nodes, process each child node
        node.childNodes.forEach(child => highlightText(child, word));
    }
}
// Extract all text from the body of the webpage
const bodyText = document.body.innerText || "";
console.log(bodyText)

getWordsToHighlight(bodyText);
