import { remediesData } from '../data/remedies';

/**
 * Safely retrieves remedy data for a given disease class.
 * Returns a fallback object if the disease class is not found or data is missing.
 * 
 * @param {string} diseaseClass - The classification string from the model (e.g., "Apple___Black_rot")
 * @returns {object} - The remedy data object with diagnosis, immediateAction, prevention, etc.
 */
export const getRemedyData = (diseaseClass) => {
    // Default fallback data
    const fallback = {
        diagnosis: "No specific diagnosis data available for this classification.",
        immediateAction: "Consult with a local agricultural extension officer or plant pathologist for specific advice.",
        prevention: "Maintain general good agricultural practices: proper spacing, watering, and sanitation.",
        immediateActions: ["Consult an expert", "Monitor plant closely"], // Array format for compatibility
        preventionSteps: ["Maintain good hygiene", "Regular monitoring"] // Array format
    };

    if (!diseaseClass || !remediesData[diseaseClass]) {
        return fallback;
    }

    const data = remediesData[diseaseClass];

    // Ensure all expected fields exist, even if the source data is partial
    return {
        diagnosis: data.diagnosis || fallback.diagnosis,
        immediateAction: data.immediateAction || fallback.immediateAction,
        prevention: data.prevention || fallback.prevention,
        // vital for array mapping in UI
        immediateActions: Array.isArray(data.immediateActions)
            ? data.immediateActions
            : (data.immediateAction ? [data.immediateAction] : fallback.immediateActions),
        preventionSteps: Array.isArray(data.prevention)
            ? data.prevention
            : (data.prevention ? [data.prevention] : fallback.preventionSteps)
    };
};

/**
 * Helper to get a clean crop name from the class string
 */
export const getCropName = (diseaseClass) => {
    if (!diseaseClass) return 'Unknown';
    return diseaseClass.split('___')[0] || 'Unknown';
};

/**
 * Helper to get a clean disease name from the class string
 */
export const getDiseaseName = (diseaseClass) => {
    if (!diseaseClass) return 'Unknown';
    const parts = diseaseClass.split('___');
    return parts.length > 1 ? parts[1].replace(/_/g, ' ') : diseaseClass.replace(/_/g, ' ');
};
