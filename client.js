// Ensure that Socket.io client library is loaded in your HTML
// <script src="/socket.io/socket.io.js"></script>

// Establish socket connection
const socket = io('https://solacelink.vercel.app/');


// DOM Elements
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.message-container');
const sendBtn = document.getElementById('sendBtn');
const optionsContainer = document.getElementById('options');
const landingContainer = document.getElementById('landingContainer');
const chatContainer = document.getElementById('chatContainer');
const startBtn = document.getElementById('startBtn');
const mentalHealthBtn = document.getElementById('mentalHealthBtn');
const mentalHealthContainer = document.getElementById('mentalHealthContainer');
const moodRatingContainer = document.getElementById('moodRatingContainer');
const moodOptionsContainer = document.getElementById('moodOptionsContainer');
const submitMoodRatingBtn = document.getElementById('submitMoodRatingBtn');
const submitMoodOptionsBtn = document.getElementById('submitMoodOptionsBtn');
const relaxMessage = document.getElementById('relaxMessage');
const relaxingMusic = document.getElementById('relaxingMusic');
const breathingInstructions = document.getElementById('breathingInstructions');
const instructionMessage = document.getElementById('instructionMessage');
const postBreathingScreen = document.getElementById('postBreathingScreen');
const redObjectCountScreen = document.getElementById('redObjectCountScreen');
const submitRedObjectCountBtn = document.getElementById('submitRedObjectCountBtn');
const redObjectCount = document.getElementById('redObjectCount');
const panicAttackScreen = document.getElementById('panicAttackScreen');
const panicYesBtn = document.getElementById('panicYesBtn');
const panicNoBtn = document.getElementById('panicNoBtn');
const quoteScreen = document.getElementById('quoteScreen');
const soundIdentificationScreen = document.getElementById('soundIdentificationScreen');
const soundInput = document.getElementById('soundInput');
const submitSoundBtn = document.getElementById('submitSoundBtn');
const seeingIdentificationScreen = document.getElementById('seeingIdentificationScreen');
const seeingInput = document.getElementById('seeingInput');
const submitSeeingBtn = document.getElementById('submitSeeingBtn');


// Establish socket connection with reconnection attempts


socket.on('reconnect_attempt', () => {
    appendMessage('Attempting to reconnect...', 'bot');
});

socket.on('reconnect', (attemptNumber) => {
    appendMessage('Reconnected successfully!', 'bot');
});

socket.on('reconnect_failed', () => {
    appendMessage('Reconnection failed. Please check your connection.', 'bot');
});

socket.on('disconnect', () => {
    appendMessage('You are disconnected from the server.', 'bot');
});

socket.on('connect_error', (error) => {
    appendMessage('Connection error. Retrying...', 'bot');
});

// Mood Options
const moodOptions = [
    "Currently having panic attacks",
    "Having stress regarding some issue",
    "Not feeling up to it",
    "Having bad dreams",
    "Negative thoughts",
    "Feeling suicidal"
];

// Options for different user roles
const optionsForHelpers = [
    "Want to give financial assistance to someone",
    "Want to support someone suffering from family issues",
    "Want to help someone with relationship problems or divorce",
    "Want to support someone grieving the death of a loved one",
    "Want to help someone with depression or any mental disorder",
    "Want to support someone dealing with work stress",
    "Want to help someone with health issues"
];

const challengesForSeekers = [
    "Money Issues",
    "Family Issues",
    "Relationship Problems",
    "Grieving a Death",
    "Depression or Mental Disorder",
    "Work Stress",
    "Health Issues"
];

const optionsForBored = [
    "Singing",
    "Dancing",
    "Art & Crafts",
    "Reading",
    "Traveling",
    "Cooking",
    "Sports",
    "Music"
];

const problemsForUrgent = [
    "Self-doubt",
    "Loss of interest in activities you once enjoyed",
    "Feeling of isolation",
    "Lack of motivation",
    "Harming issues",
    "Changes in sleep patterns"
];

// Function to append messages to the chat container
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);
    messageElement.innerText = message;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the newest message
};

// Function to display options as buttons
const showOptions = (options, callback) => {
    optionsContainer.innerHTML = ''; // Clear previous options
    messageInput.style.display = 'none'; // Hide message input
    optionsContainer.style.display = 'block'; // Show options container
    options.forEach((option) => {
        const optionElement = document.createElement('button');
        optionElement.classList.add('option-button');
        optionElement.innerText = option;
        optionElement.onclick = () => {
            optionsContainer.style.display = 'none'; // Hide options after selection
            messageInput.style.display = 'block'; // Show message input
            callback(option);
        };
        optionsContainer.appendChild(optionElement);
    });
};

// Function to display checkbox options
const showCheckboxOptions = (options, callback) => {
    optionsContainer.innerHTML = ''; // Clear previous options
    messageInput.style.display = 'none'; // Hide message input
    optionsContainer.style.display = 'block'; // Show options container
    options.forEach((option) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('checkbox-option');
        optionElement.innerHTML = `
            <input type="checkbox" id="${option}" name="${option}" value="${option}">
            <label for="${option}">${option}</label>
        `;
        optionsContainer.appendChild(optionElement);
    });

    // Submit button for checkbox selections
    const submitButton = document.createElement('button');
    submitButton.classList.add('option-button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = () => {
        const selectedOptions = Array.from(document.querySelectorAll('.checkbox-option input:checked')).map(el => el.value);
        if (selectedOptions.length === 0) {
            alert('Please select at least one option.');
            return;
        }
        optionsContainer.style.display = 'none'; // Hide options after submission
        messageInput.style.display = 'block'; // Show message input
        callback(selectedOptions);
    };
    optionsContainer.appendChild(submitButton);
};
// Container references

const stressIssueContainer = document.getElementById('stressIssueContainer');

// Function to show a specific container and hide others
function showContainer(containerToShow) {
    // Hide all containers
    landingContainer.style.display = 'none';
    mentalHealthContainer.style.display = 'none';
    chatContainer.style.display = 'none';
    stressIssueContainer.style.display = 'none';
    badDreamsContainer.style.display ='none';
    // Show the selected container
    motivationalMessageContainer.style.display ='none';
    quoteScreen.style.display ='none';
    soundIdentificationScreen.style.display ='none';
    seeingIdentificationScreen.style.display ='none';
    redObjectCountScreen.style.display='none';
    

    containerToShow.style.display = 'block';
}

// Navigation with history push for each main view
document.getElementById('mentalHealthBtn').addEventListener('click', () => {
    showContainer(mentalHealthContainer);
    history.pushState({ container: 'mentalHealthContainer' }, '');
});

document.getElementById('startBtn').addEventListener('click', () => {
    showContainer(chatContainer);
    history.pushState({ container: 'chatContainer' }, '');
});

document.getElementById('submitMoodOptionsBtn').addEventListener('click', () => {
    const selectedOptions = Array.from(document.querySelectorAll('.checkbox-option input:checked')).map(el => el.value);

    if (selectedOptions.includes("Having bad dreams")) {
        showContainer(badDreamsContainer, 'badDreamsContainer');
        history.pushState({ container: 'badDreamsContainer' }, '');
    } 
    else if (selectedOptions.includes("Negative thoughts")) {
        showContainer(motivationalMessageContainer, 'motivationalMessageContainer');
        history.pushState({ container: 'motivationalMessageContainer' }, '');
    } 
    else if (selectedOptions.includes("Feeling suicidal")) {
        showContainer(document.getElementById('helpContainer'), 'helpContainer');
        history.pushState({ container: 'helpContainer' }, '');
    } 
    else if (selectedOptions.includes("Not feeling up to it")) {
        showContainer(document.getElementById('lowMoodContainer'), 'lowMoodContainer');
        history.pushState({ container: 'lowMoodContainer' }, '');
    } 
    else if (selectedOptions.includes("Currently having panic attacks")) {
        showContainer(document.getElementById('panicContainer'), 'panicContainer');
        history.pushState({ container: 'panicContainer' }, '');
    } 
    else if (selectedOptions.includes("Having stress regarding some issue")) {
        showContainer(stressIssueContainer, 'stressIssueContainer');
        history.pushState({ container: 'stressIssueContainer' }, '');
    } 
    else {
        alert('Please select an option.');
    }
});
document.getElementById('submitDreamDescriptionBtn').addEventListener('click', () => {
    showContainer(quoteScreen, 'quoteScreen');
    history.pushState({ container: 'quoteScreen' }, '', '');
});

// Sound Identification Submit Button with pushState
document.getElementById('submitSoundBtn').addEventListener('click', () => {
    showContainer(soundIdentificationScreen, 'soundIdentificationScreen');
    history.pushState({ container: 'soundIdentificationScreen' }, '', '');
});
document.getElementById('submitRedObjectCountBtn').addEventListener('click', () => {
    showContainer(redObjectCountScreen, 'redObjectCountScreen');
    history.pushState({ container: 'redObjectCountScreen' }, '', '');
});

// Seeing Identification Submit Button with pushState
document.getElementById('submitSeeingBtn').addEventListener('click', () => {
    showContainer(seeingIdentificationScreen, 'seeingIdentificationScreen');
    history.pushState({ container: 'seeingIdentificationScreen' }, '', '');
});
// Optional: If there are other buttons to navigate to other sections, add similar listeners
// Example for a "Meditation" button if it exists



// Back navigation handling
window.addEventListener('popstate', (event) => {
    clearPanicAttackInstructions()
    if (event.state) {
        // Retrieve the saved state container ID and display the respective container
        const containerId = event.state.container;
        showContainer(document.getElementById(containerId));
    } else {
        // If no specific state, default back to the landing container
        showContainer(landingContainer);
    }
});

// Function to start the motivational flow after dream processing

// Event listener for the "Mental Health" button
if (mentalHealthBtn) {
    mentalHealthBtn.addEventListener('click', () => {
        landingContainer.style.display = 'none';
        mentalHealthContainer.style.display = 'block';
    });
}
function showMotivationalQuote() {
    const quoteScreen = document.getElementById('quoteScreen');
    quoteScreen.style.display = 'block';

    // Add motivational quote
    const quoteMessage = document.createElement('div');
    quoteMessage.classList.add('message', 'bot');
    quoteMessage.innerText = "Believe in yourself, everything will be okay!";
    quoteScreen.appendChild(quoteMessage);

    // After showing the quote, ask about fear
    setTimeout(askAboutFear, 4000);
}
const stressIssues = [
    "Somebody hurt you",
    "Relationship issue",
    "Financial issue",
    "Work stress",
    "Family problem",
    "Health concerns"
];

// When 'Having stress regarding some issue' is selected from mood options
// Extended motivational messages with multiple points
const detailedMotivationalMessages = {
    "Somebody hurt you": [
        "1. Remember: People's words can't define who you are. Your worth is not determined by others.",
        "2. Reflect on your strengths and focus on your self-growth. You have control over your reactions.",
        "3. Surround yourself with positive influences. Seek out friends or family who uplift you.",
        "4. Practice mindfulness or meditation to calm your mind and reduce emotional distress."
    ],
    "Relationship issue": [
        "1. Communication is key. Talk openly with your partner or loved one about your concerns.",
        "2. It's okay to take a step back and reflect on your needs and boundaries in a relationship.",
        "3. Consider seeking professional counseling if needed to work through deeper issues.",
        "4. Prioritize self-love and remind yourself that you deserve respect and happiness."
    ],
    "Financial issue": [
        "1. Create a realistic budget and track your spending. Small steps can lead to big improvements.",
        "2. Seek advice from a financial advisor or use online tools to help manage your finances.",
        "3. Focus on what you can control and take action, like cutting unnecessary expenses.",
        "4. Remind yourself that financial setbacks are temporary and don't define your future."
    ],
    "Work stress": [
        "1. Prioritize tasks. Break big projects into smaller steps to reduce feeling overwhelmed.",
        "2. Take breaks regularly. Step away from work and engage in activities you enjoy.",
        "3. Communicate with your manager or team if you're feeling overloaded—ask for support.",
        "4. Remember to maintain a work-life balance. Your mental health is just as important as your job."
    ],
    "Family problem": [
        "1. It's okay to set boundaries with family members when needed for your own well-being.",
        "2. Open communication can help, but it’s also okay to distance yourself from toxic situations.",
        "3. Seek a family therapist if needed, or talk to a trusted friend for support.",
        "4. Remember that every family faces challenges, and it’s not your responsibility to fix everything."
    ],
    "Health concerns": [
        "1. Focus on what you can control—your diet, exercise, and daily routine can impact your well-being.",
        "2. Keep a positive outlook, and seek support from health professionals when necessary.",
        "3. Remember that healing takes time. Be patient with yourself.",
        "4. Engage in relaxing activities that help reduce stress and promote recovery."
    ]
};

// Event listener for submitting stress options
const submitStressOptionsBtn = document.getElementById('submitStressOptionsBtn');
if (submitStressOptionsBtn) {
    submitStressOptionsBtn.addEventListener('click', () => {
        const selectedStressOptions = Array.from(document.querySelectorAll('#stressOptions input:checked')).map(el => el.value);
        
        if (selectedStressOptions.length === 0) {
            alert('Please select at least one option.');
            return;
        }

        // Clear previous messages
        const motivationalMessagesDiv = document.getElementById('motivationalMessages');
        motivationalMessagesDiv.innerHTML = '';

        // Display motivational messages based on selected options
        selectedStressOptions.forEach(option => {
            if (detailedMotivationalMessages[option]) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('motivation-message');

                // Create and display motivational points as a list
                const pointsList = document.createElement('ul');
                detailedMotivationalMessages[option].forEach(point => {
                    const listItem = document.createElement('li');
                    listItem.innerText = point;
                    pointsList.appendChild(listItem);
                });
                
                messageElement.appendChild(pointsList);
                motivationalMessagesDiv.appendChild(messageElement);
            }
        });

        // Show the motivational message container
        stressIssueContainer.style.display = 'none';
        const motivationalMessageContainer = document.getElementById('motivationalMessageContainer');
        motivationalMessageContainer.style.display = 'block';
    });
}

// Event listener to go back to the home/landing screen
const backToLandingBtn = document.getElementById('backToLandingBtn');
if (backToLandingBtn) {
    backToLandingBtn.addEventListener('click', () => {
        motivationalMessageContainer.style.display = 'none';
        landingContainer.style.display = 'block'; // Show the landing page again
    });
}

// Event listener for submitting mood options (including "Having bad dreams")
if (submitMoodOptionsBtn) {
    submitMoodOptionsBtn.addEventListener('click', () => {
        const selectedOptions = Array.from(document.querySelectorAll('.checkbox-option input:checked')).map(el => el.value);
        
        if (selectedOptions.length === 0) {
            alert('Please select at least one option.');
            return;
        }

        if (selectedOptions.includes("Having bad dreams")) {
            // Hide other containers, show badDreamsContainer
            mentalHealthContainer.style.display = 'none';
            const badDreamsContainer = document.getElementById('badDreamsContainer');
            badDreamsContainer.style.display = 'block';

            // Event listener for selecting dream image
            document.querySelectorAll('.dream-thumbnail').forEach(image => {
                image.addEventListener('click', () => selectImage(image));
            });

            // Event listener for submitting dream description
            const submitDreamDescriptionBtn = document.getElementById('submitDreamDescriptionBtn');
            submitDreamDescriptionBtn.addEventListener('click', () => {
                const dreamDescription = document.getElementById('dreamDescription').value.trim();
                if (dreamDescription) {
                    alert('You are stronger than you think! just focus on the positives around you');
                    badDreamsContainer.style.display = 'none';
                    showMotivationalQuote();
                } else {
                    alert('Concentrate on the picture and write whatever you love about the picture');
                }
            });
        } 
        else if (selectedOptions.includes("Currently having panic attacks")) {
            // Show relaxation instructions and play music
            relaxMessage.style.display = 'block';
            relaxingMusic.play();
            const instructionMessage = document.createElement('div');
            instructionMessage.id = 'instructionMessage'; 
    instructionMessage.textContent = "Please close your eyes and listen to the music for a moment.";
    instructionMessage.style.fontSize = '18px'; // Adjust font size as needed
    instructionMessage.style.color = 'blue'; // Adjust color as needed
    instructionMessage.style.marginTop = '10px'; // Add some spacing
    document.body.appendChild(instructionMessage);
            setTimeout(() => {
                relaxingMusic.pause();
                relaxingMusic.currentTime = 0; // Reset music to start
                relaxMessage.style.display = 'none';
                instructionMessage.remove();
                alert('Music has ended. You can open your eyes.');
                startBreathingExercise();
            }, 60000); // 60 seconds
        }
        else if (selectedOptions.includes("Not feeling up to it")) {
            mentalHealthContainer.style.display = 'none';
        
            // Display motivational tips
            const motivationalMessageContainer = document.getElementById('motivationalMessageContainer');
            motivationalMessageContainer.innerHTML = `
                <h2>Feeling Low?</h2>
                <p>Try one of these activities to lift your spirits:</p>
                <ul>
                    <li>Take a short walk outside.</li>
                    <li>Listen to your favorite music.</li>
                    <li>Write down three things you’re grateful for.</li>
                    <li>Do a small act of kindness for someone else.</li>
                </ul>
            `;
            motivationalMessageContainer.style.display = 'block';
        }
        else if (selectedOptions.includes("Negative thoughts")) {
            mentalHealthContainer.style.display = 'none';
        
            const journalContainer = document.createElement('div');
            journalContainer.innerHTML = `
                <h2>Journaling Exercise</h2>
                <p>Write down what’s on your mind. This can help to clear your thoughts.</p>
                <textarea id="negativeThoughtsJournal" placeholder="Write down your thoughts..." rows="4" style="width: 100%;"></textarea>
                <button id="submitJournalBtn">Submit</button>
            `;
            document.body.appendChild(journalContainer);
        
            document.getElementById('submitJournalBtn').addEventListener('click', () => {
                const journalEntry = document.getElementById('negativeThoughtsJournal').value.trim();
                if (journalEntry) {
                    journalContainer.style.display = 'none';
        
                    // Show affirmations
                    motivationalMessageContainer.innerHTML = `
                        <h2>You are stronger than you think.</h2>
                        <p>Here are some affirmations to help you counter negative thoughts:</p>
                        <ul>
                            <li>You are enough, just as you are.</li>
                            <li>Believe in your ability to overcome challenges.</li>
                            <li>Your worth is not defined by your thoughts.</li>
                        </ul>
                    `;
                    motivationalMessageContainer.style.display = 'block';
                } else {
                    alert("Please write something to continue.");
                }
            });
        }
        else // Existing 'Feeling suicidal' option click event
        if (selectedOptions.includes("Feeling suicidal")) {
            mentalHealthContainer.style.display = 'none';
        
            // Update motivational message container
            motivationalMessageContainer.innerHTML = `
                <h2>Help is Available</h2>
                <p>Please remember, you are not alone. Here are some steps that might help:</p>
                <ul>
                    <li>Reach out to a trusted friend or family member.</li>
                    <li>Consider calling a mental health hotline for immediate support.</li>
                    <li>You can also connect with one of our volunteers for assistance.</li>
                </ul>
                <button id="connectToHelperBtn">Connect to a Helper</button>
            `;
            motivationalMessageContainer.style.display = 'block';
        
            // Add event listener for 'Connect to a Helper' button
            document.getElementById('connectToHelperBtn').addEventListener('click', () => {
                // Socket emit for backend connection
                socket.emit('request-helper', { urgent: true });
        
                // List of helpline numbers
                const helplines = [
                    { country: "USA", number: "1-800-273-8255" },
                    { country: "Canada", number: "1-833-456-4566" },
                    { country: "UK", number: "116 123" },
                    { country: "India", number: "9152987821" },
                    { country: "Australia", number: "13 11 14" }
                ];
        
                // Display helpline numbers as clickable links
                const helplineList = document.createElement('div');
                helplineList.innerHTML = `<h3>Available Helplines:</h3>`;
                helplines.forEach(helpline => {
                    const helplineItem = document.createElement('a');
                    helplineItem.href = `tel:${helpline.number}`;
                    helplineItem.innerText = `${helpline.country}: ${helpline.number}`;
                    helplineItem.classList.add('helpline-link');
                    helplineItem.style.display = 'block';
                    helplineList.appendChild(helplineItem);
                });
        
                // Append helpline list to motivational message container
                motivationalMessageContainer.appendChild(helplineList);
        
                // Inform user helper is being connected
    
            });
        }
        
                        
        else if (selectedOptions.includes("Having stress regarding some issue")) {
            // Hide other containers, show stress options
            mentalHealthContainer.style.display = 'none';
            const stressIssueContainer = document.getElementById('stressIssueContainer');
            stressIssueContainer.style.display = 'block';
        
            // Populate the stress options
            const stressOptionsDiv = document.getElementById('stressOptions');
            stressOptionsDiv.innerHTML = ''; // Clear previous options
            
            stressIssues.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('checkbox-option');
                optionElement.innerHTML = `
                    <input type="checkbox" id="${option}" name="${option}" value="${option}">
                    <label for="${option}">${option}</label>
                `;
                stressOptionsDiv.appendChild(optionElement);
            });

            // Event listener for submitting stress options
            const submitStressOptionsBtn = document.getElementById('submitStressOptionsBtn');
            submitStressOptionsBtn.addEventListener('click', () => {
                const selectedStressOptions = Array.from(document.querySelectorAll('#stressOptions input:checked')).map(el => el.value);
                
                if (selectedStressOptions.length === 0) {
                    alert('Please select at least one option.');
                    return;
                }

                alert(`You are feeling stress due to: ${selectedStressOptions.join(', ')}`);
                // Here you can add further logic or navigation based on selected stress options.
            });
        }
     else {
            alert('Please describe your dream.');
        }
    });
}


function selectImage(image) {
    // Hide the thumbnail section and display the enlarged image
    document.querySelector('.picture-options').style.display = 'none';
    const enlargedImageContainer = document.getElementById('enlargedImageContainer');
    enlargedImageContainer.style.display = 'block';

    // Set the source of the enlarged image
    const enlargedImage = document.getElementById('enlargedImage');
    enlargedImage.src = image.src;

    // Display the interactive input area for writing about the picture
    document.getElementById('interactiveInputArea').style.display = 'block';

    // Optionally add an animation effect (e.g., fade-in or zoom)
    enlargedImage.classList.add('animate-enlarge');
}

// Event listener for submitting mood rating
// Event listener for submitting mood options (handling "Having bad dreams" option)

// Event listener for submitting mood rating
if (submitMoodRatingBtn) {
    submitMoodRatingBtn.addEventListener('click', () => {
        const moodRating = parseInt(document.getElementById('moodRating').value, 10);
        if (!isNaN(moodRating)) {
            if (moodRating >= 1 && moodRating <= 6) {
                moodRatingContainer.style.display = 'none';
                moodOptionsContainer.style.display = 'block';
                const moodOptionsDiv = document.getElementById('moodOptions');
                moodOptionsDiv.innerHTML = ''; // Clear previous options

                moodOptions.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('checkbox-option');
                    optionElement.innerHTML = `
                        <input type="checkbox" id="${option}" name="${option}" value="${option}">
                        <label for="${option}">${option}</label>
                    `;
                    moodOptionsDiv.appendChild(optionElement);
                });
            } else {
                alert('Thank you for rating. Have a nice day!');
                landingContainer.style.display = 'block';
                mentalHealthContainer.style.display = 'none';
            }
        } else {
            alert('Please enter a valid mood rating between 1 and 10.');
        }
    });
}

// Event listener for submitting mood options


// Function to start breathing exercise
const startBreathingExercise = () => {
    mentalHealthContainer.style.display = 'none';
    breathingInstructions.style.display = 'flex';
    instructionMessage.innerText = 'Breathe in...';

    let cycleCount = 0;
    const maxCycles = 10; // Each cycle has breathe in and out, so total 5 full cycles

    const handleBreathingCycle = () => {
        if (cycleCount < maxCycles) {
            instructionMessage.innerText = cycleCount % 2 === 0 ? 'Breathe in...' : 'Breathe out...';
            cycleCount++;
            setTimeout(handleBreathingCycle, 4000); // 4 seconds per instruction
        } else {
            breathingInstructions.style.display = 'none';
            showRedObjectCountScreen();
        }
    };

    handleBreathingCycle();
};

// Function to show red object count screen
const showRedObjectCountScreen = () => {
    postBreathingScreen.style.display = 'block';
    alert('Your breathing exercise has been completed.');
    redObjectCountScreen.style.display = 'block';
};

// Event listener for submitting red object count
if (submitRedObjectCountBtn) {
    submitRedObjectCountBtn.addEventListener('click', () => {
        const redObjectCountValue = redObjectCount.value;
        if (redObjectCountValue !== '') {
            showPanicAttackScreen();
        } else {
            alert('Please enter the number of red objects you counted.');
        }
    });
}

// Function to show panic attack screen
const showPanicAttackScreen = () => {
    redObjectCountScreen.style.display = 'none';
    panicAttackScreen.style.display = 'block';
};

// Event listeners for panic attack screen buttons
if (panicYesBtn) {
    panicYesBtn.addEventListener('click', () => {
        showQuoteScreen();
    });
}

if (panicNoBtn) {
    panicNoBtn.addEventListener('click', () => {
        showSoundIdentificationScreen();
    });
}

// Function to show quote screen
const showQuoteScreen = () => {
    panicAttackScreen.style.display = 'none';
    quoteScreen.style.display = 'block';
};

// Function to show sound identification screen
const showSoundIdentificationScreen = () => {
    panicAttackScreen.style.display = 'none';
    soundIdentificationScreen.style.display = 'block';
};

// Event listener for submitting sound identification
if (submitSoundBtn) {
    submitSoundBtn.addEventListener('click', () => {
        const sounds = soundInput.value;
        if (sounds.trim() !== '') {
            showSeeingIdentificationScreen();
        } else {
            alert('Please enter the sounds you identified.');
        }
    });
}

// Function to show seeing identification screen
const showSeeingIdentificationScreen = () => {
    soundIdentificationScreen.style.display = 'none';
    seeingIdentificationScreen.style.display = 'block';
};

// Event listener for submitting seeing identification
if (submitSeeingBtn) {
    submitSeeingBtn.addEventListener('click', () => {
        const seeing = seeingInput.value;
        if (seeing.trim() !== '') {
            alert('Thank you for sharing. Please take a moment to relax.');
            postBreathingScreen.style.display = 'none';
            landingContainer.style.display = 'block';
        } else {
            alert('Please enter the things you saw.');
        }
    });
};

// Function to show scenery screen
// Function to show scenery screen

// Function to show scenery screen


// Make sure this is called correctly when "Having bad dreams" is selected




// Event listener for submitting scenery thoughts
sendBtn.style.display = 'none';


// Event listener for the "Start" button
if (startBtn) {
    startBtn.addEventListener('click', () => {
        landingContainer.style.display = 'none'; // Hide landing container
        chatContainer.style.display = 'block'; // Show chat container
        

        let name = '';
        while (!name) { // Loop until a valid name is entered
            name = prompt("Enter your name to join");
            if (!name) {
                alert("Name cannot be empty. Please enter a valid name.");
            }
        }
        
        socket.emit('new-user-joined', name);
        appendMessage(`Welcome ${name}! Why are you here?`, 'bot');

        showOptions([
            "1- Want to help someone in need",
            "2- Just feeling bored and want to interact with people and know them",
            "3- Urgent need to connect with someone as feeling unwell"
        ], (selectedOption) => {
            const userDetails = { name, socketId: socket.id };

            if (selectedOption.startsWith('1')) {
                userDetails.role = 1;
                showOptions(optionsForHelpers, (helpType) => {
                    userDetails.helpType = helpType;
                    socket.emit('user-details', userDetails);
                    appendMessage(`You selected to help: ${helpType}`, 'user');
                });
            } else if (selectedOption.startsWith('2')) {
                userDetails.role = 2;
                showOptions(optionsForBored, (interest) => {
                    userDetails.interests = interest;
                    socket.emit('user-details', userDetails);
                    appendMessage(`You selected interest: ${interest}`, 'user');
                });
            } else if (selectedOption.startsWith('3')) {
                userDetails.role = 3;
                showCheckboxOptions(problemsForUrgent, (problems) => {
                    userDetails.problems = problems;
                    showOptions(challengesForSeekers, (mainIssue) => {
                        userDetails.mainIssue = mainIssue;
                        socket.emit('user-details', userDetails);
                        appendMessage(`You selected issues: ${problems.join(', ')} with main issue: ${mainIssue}`, 'user');
                    });
                });
            }
        });
    });
}

// Event listener for the "Send" button
if (sendBtn) {
    
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('send', message);
            appendMessage(`You: ${message}`, 'right');  // Assuming 'right' class for user messages
            messageInput.value = '';
        }
    });
}



// Socket event listeners
socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left'); // Assuming 'left' class for bot messages
});

socket.on('connect-user', name => {
    appendMessage(`You are connected to ${name}`, 'bot');
    sendBtn.style.display = 'block';
});

socket.on('waiting', message => {
    appendMessage(message, 'bot');
});

socket.on('user-disconnected', message => {
    appendMessage(message, 'bot'); 
    
    sendBtn.style.display = 'none'; 
    
});
