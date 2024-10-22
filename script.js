document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('input', autoCorrect);
document.getElementById('message-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('copilot-textarea').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of adding a new line
        const cannedResponses = [
            "I understand you’d like to cancel your booking—let me assist you with that right away.",
            "Would you prefer to amend your reservation instead of canceling? I can help with that too.",
            "Your cancellation is being processed; you'll receive a confirmation shortly.",
            "If you'd like, I can check availability for alternative dates before we proceed with the cancellation.",
            "I’m happy to assist with changing the details of your booking—what would you like to modify?",
            "I see you’re requesting a refund; let me review your booking’s cancellation policy.",
            "If there's anything specific you'd like changed about your stay, please let me know.",
            "I’ve amended your reservation as requested; please review the changes in your confirmation email.",
            "The cancellation is complete—if there’s anything else I can assist with, feel free to ask.",
            "Is there anything else I can do to ensure your stay is as smooth as possible?",
        ];
        const randomResponse = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
        const messageInput = document.getElementById('message-input');

        setTimeout(() => {
            messageInput.value += (messageInput.value ? ' ' : '') + randomResponse;
            document.getElementById('copilot-textarea').value = '';
        }, 2000);
    }
});

document.querySelectorAll('.insert-button').forEach(button => {
    button.addEventListener('click', function () {
        const content = this.getAttribute('data-content');
        document.getElementById('message-input').value = content;
    });
});

const dictionary = {
    "teh": "the",
    "recieve": "receive",
    "adress": "address",
    "occured": "occurred",
    "seperate": "separate"
};

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        addMessage('user', message);
        messageInput.value = '';
        setTimeout(() => {
            addMessage('customer', getMockResponse());
        }, 1000);
    }
}

function clearMessage() {
    document.getElementById('message-input').value = '';
}

function addMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', sender);

    const senderName = sender === 'user' ? 'You' : 'Kublai Khan';
    const timestamp = new Date().toLocaleTimeString();

    const headerElement = document.createElement('div');
    headerElement.classList.add('message-header');
    headerElement.textContent = `${senderName} • ${timestamp}`;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;

    messageContainer.appendChild(headerElement);
    messageContainer.appendChild(messageElement);
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getMockResponse() {
    const responses = [
        "Your booking has been amended.",
        "Please provide more details.",
        "Your request is being processed.",
        "Amendment confirmed.",
        "Thank you for your patience."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function autoCorrect(event) {
    const input = event.target;
    const value = input.value;
    if (value.endsWith('.')) {
        const words = value.split(' ');
        const correctedWords = words.map(word => {
            const lowerCaseWord = word.toLowerCase().replace('.', '');
            return dictionary[lowerCaseWord] ? dictionary[lowerCaseWord] : word;
        });
        input.value = correctedWords.join(' ') + '.';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);

    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function () {
            const icon = this.querySelector('.material-icons');
            if (icon.textContent === 'arrow_drop_down') {
                icon.textContent = 'arrow_drop_up';
            } else {
                icon.textContent = 'arrow_drop_down';
            }
        });
    });

    // Add Tailwind CSS tab switching logic
    document.querySelectorAll('.tabs a').forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            document.querySelectorAll('.tabs a').forEach(t => t.classList.remove('text-blue-500', 'active'));
            document.querySelectorAll('.tabs a').forEach(t => t.classList.add('text-gray-700'));

            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

            // Add active class to the clicked tab
            this.classList.add('text-blue-500', 'active');
            this.classList.remove('text-gray-700');

            // Show the target tab content
            document.getElementById(targetTab).classList.remove('hidden');
        });
    });

    const divider = document.getElementById('drag-handle');
    let isDragging = false;

    divider.addEventListener('mousedown', function (e) {
        isDragging = true;
        document.body.style.cursor = 'ew-resize';
        divider.classList.add('active');
    });

    // Accordion logic
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.material-icons');

            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.textContent = 'arrow_drop_up';
            } else {
                content.classList.add('hidden');
                icon.textContent = 'arrow_drop_down';
            }
        });
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        const container = document.querySelector('.container');
        const chatWindow = document.querySelector('.chat-window');
        const sidebar = document.querySelector('.sidebar');
        const containerRect = container.getBoundingClientRect();
        const newChatWindowWidth = e.clientX - containerRect.left;
        const newSidebarWidth = containerRect.right - e.clientX;

        if (newChatWindowWidth > 100 && newSidebarWidth > 100) {
            chatWindow.style.width = `${newChatWindowWidth}px`;
            sidebar.style.width = `${newSidebarWidth}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        document.body.style.cursor = 'default';
        divider.classList.remove('active');
    });
});