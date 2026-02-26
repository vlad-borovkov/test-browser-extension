import { StorageManager } from '../storage';

// Keep track of active recording sessions
let isRecording = false;

// Initialize state from storage if needed, or default to false
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isRecording: false });
});

// Listen for messages from Popup or DevTools Panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_RECORDING_STATUS') {
        sendResponse({ isRecording });
    }
    if (message.type === 'SET_RECORDING_STATUS') {
        isRecording = message.status;
        chrome.storage.local.set({ isRecording });

        // Update badge
        chrome.action.setBadgeText({ text: isRecording ? 'ON' : '' });
        chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });

        sendResponse({ success: true });
    }
});
