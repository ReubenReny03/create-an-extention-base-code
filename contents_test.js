// content.js
// Function to send data to the server and get the words to highlight
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
        console.log(data.words)
        highlightWord(data.words); // Assuming 'words' is the array of words to highlight
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to highlight words on the page
function highlightWord(word) {
    const regex = new RegExp(word, "gi"); // "g" for global, "i" for case-insensitive
    const bodyText = document.body.innerHTML;

    // Replace the word in the body's HTML with a highlighted version
    // Caution: This can disrupt the page's functionality if the word appears within tags or attributes
    document.body.innerHTML = bodyText.replace(regex, match => {
        return `<span style="background-color: yellow; color: black;">${match}</span>`;
    });
}
// Extract all text from the body of the webpage
// content.js

// Function to create the highlight wrapper
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
                // The highlighted text
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

// Function to start highlighting process
function startHighlighting(word) {
    highlightText(document.body, word);
}

// Example usage
const wordsToHighlight = ["subscription", "premium"]; // Replace with actual words
wordsToHighlight.forEach(word => startHighlighting(word));
