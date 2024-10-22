document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const copilotTextarea = document.getElementById('copilot-textarea');
    const menuIcon = document.querySelector('.menu-icon');
    const contextualMenu = document.getElementById('contextual-menu');
    const transferModal = document.getElementById('transfer-modal');
    const closeModal = document.getElementById('close-modal');
    const closeTransferModal = document.getElementById('close-transfer-modal');
    const closeCloseModal = document.getElementById('close-close-modal');
    const transferOption = document.getElementById('transfer-option');
    const closeOption = document.getElementById('close-option');
    const confirmClose = document.getElementById('confirm-close');
    const cancelClose = document.getElementById('cancel-close');
    const agentList = document.getElementById('agent-list');
    const agentSearch = document.getElementById('agent-search');
    const divider = document.getElementById('drag-handle');
    const tabs = document.querySelectorAll('.tabs a');
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

    const agents = [
        'Aran Chaiyaphum', 'Niran Kittisak', 'Sunan Prasert', 'Wichai Srisuriyawong', 'Yingyot Thongchai',
        'Aisyah Binti Ahmad', 'Farid Bin Hassan', 'Nurul Huda Binti Ismail', 'Rashid Bin Rahman', 'Zainab Binti Zulkifli'
    ];

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

    const dictionary = {
        "teh": "the",
        "recieve": "receive",
        "adress": "address",
        "occured": "occurred",
        "seperate": "separate"
    };

    let isDragging = false;

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('input', autoCorrect);
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    copilotTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action of adding a new line
            const randomResponse = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
            setTimeout(() => {
                messageInput.value += (messageInput.value ? ' ' : '') + randomResponse;
                copilotTextarea.value = '';
            }, 2000);
        }
    });

    document.querySelectorAll('.insert-button').forEach(button => {
        button.addEventListener('click', function () {
            const content = this.getAttribute('data-content');
            messageInput.value = content;
        });
    });

    menuIcon.addEventListener('click', (event) => {
        contextualMenu.style.top = `${event.clientY}px`;
        contextualMenu.style.left = `${event.clientX}px`;
        contextualMenu.classList.toggle('hidden');
    });

    transferOption.addEventListener('click', () => {
        contextualMenu.classList.add('hidden');
        transferModal.classList.remove('hidden');
        populateAgentList(agents);
    });

    closeOption.addEventListener('click', () => {
        contextualMenu.classList.add('hidden');
        closeModal.classList.remove('hidden');
    });

    closeTransferModal.addEventListener('click', () => {
        transferModal.classList.add('hidden');
    });

    closeCloseModal.addEventListener('click', () => {
        closeModal.classList.add('hidden');
    });

    confirmClose.addEventListener('click', () => {
        closeModal.classList.add('hidden');
        alert('Conversation closed');
    });

    cancelClose.addEventListener('click', () => {
        closeModal.classList.add('hidden');
    });

    agentSearch.addEventListener('input', () => {
        const searchTerm = agentSearch.value.toLowerCase();
        const filteredAgents = agents.filter(agent => agent.toLowerCase().includes(searchTerm));
        populateAgentList(filteredAgents);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('text-blue-500', 'active'));
            tabs.forEach(t => t.classList.add('text-gray-700'));

            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

            // Add active class to the clicked tab
            tab.classList.add('text-blue-500', 'active');
            tab.classList.remove('text-gray-700');

            // Show the target tab content
            document.getElementById(targetTab).classList.remove('hidden');
        });
    });

    collapsibleHeaders.forEach(header => {
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

    divider.addEventListener('mousedown', () => {
        isDragging = true;
        document.body.style.cursor = 'ew-resize';
        divider.classList.add('active');
    });

    document.addEventListener('mousemove', (e) => {
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

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default';
        divider.classList.remove('active');
    });

    // Functions
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage('user', message);
            messageInput.value = '';
            setTimeout(() => {
                addMessage('customer', getMockResponse());
            }, 1000);
        }
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

    function populateAgentList(agentArray) {
        agentList.innerHTML = '';
        agentArray.forEach(agent => {
            const li = document.createElement('li');
            li.textContent = agent;
            agentList.appendChild(li);
        });
    }
});