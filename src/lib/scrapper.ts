import { BatchBody } from "@/types/requests";
import axios from "axios";

type Success<T> = {
    success: true
    data: T,
}

type Failure = {
    success: false,
    error: string,
    username: string
};

export class GeeksForGeeksProfileScraper {
    baseUrl: string;
    headers: Record<string, string>;

    constructor() {
        this.baseUrl = 'https://www.geeksforgeeks.org/profile/';
        this.headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        };
    }

    getProfileData = async (
        username: string,
        user_id: string
    ): Promise<Success<Partial<BatchBody>> | Failure> => {
        try {
            const url = `${this.baseUrl}${username}?tab=activity`;

            const response = await axios.get(url, {
                headers: this.headers,
                timeout: 15000,
                responseType: 'text',
                validateStatus: (status: number) => status === 200
            });

            const html = response.data;
            return this.fallbackRegexExtraction(html, username, user_id);

        } catch (error: any) {
            console.error(`[${username}] Fatal Error:`, error.message);
            return {
                success: false,
                error: error.message,
                username: username
            };
        }
    }

    extractUserData = (
        html: string, // Fix required!
        username: string,
        user_id: string) => {
        // Look for the userData object in the page props
        // Pattern: "userData":{"message":"data retrieved successfully","data":{...}
        const userDataMatch = html.match(/"userData":\s*(\{[^}]*"data":\{[^}]*\}[^}]*\})/);

        if (userDataMatch) {
            try {
                // Decode Unicode escapes and parse
                let jsonStr = userDataMatch[1]
                    .replace(/\\u0026/g, '&')
                    .replace(/\\"/g, '"');

                const userData = JSON.parse(jsonStr);

                if (userData.data) {
                    const d = userData.data;
                    return {
                        success: true,
                        data: {
                            id: user_id,
                            username: username,
                            fullName: d.name,
                            institution: d.institute_name,
                            codingScore: d.score,
                            problemsSolved: d.total_problems_solved,
                            instituteRank: d.institute_rank,
                            streak: d.pod_solved_current_streak,
                            longestStreak: d.pod_solved_longest_streak,
                            scrapedAt: new Date().toISOString(),
                        },
                        source: "json_parser"
                    };
                }
            } catch (e: any) {
                console.log(`JSON parse error: ${e.message}`);
            }
        }

        return null;
    }

    fallbackRegexExtraction = (
        html: string,
        username: string,
        user_id: string): Success<Partial<BatchBody>> => {
        // Extract values - improved to handle escaped strings better
        const extract = (key: string) => {
            // This regex captures values between quotes/escaped quotes and stops at comma, quote, or brace
            const re = new RegExp(`\\\\?"${key}\\\\?"\\s*:\\s*\\\\?"?([^,"\\\\}]+)`, 'i');
            const match = html.match(re);
            if (match && match[1]) {
                // Clean up the captured value - remove any trailing backslashes or quotes
                return match[1]
                    .replace(/\\+$/g, '')  // Remove trailing backslashes
                    .replace(/"+$/g, '')   // Remove trailing quotes
                    .replace(/\\u0026/g, '&')  // Decode &
                    .trim();
            }
            return null;
        };

        const extractName = () => {
            // CRITICAL FIX: First, look for the user's own data structures that match the username

            // Strategy 1: Extract from the mentor object that matches the requested username
            // We need to find: \"mentor\":{\"handle\":\"kartik\",\"name\":\"kartik\"
            // The current regex was too broad and matched ANY mentor object

            // Improved pattern: look for mentor object with this specific username
            const mentorPattern = new RegExp(`\\\\"mentor\\\\":\\\\{.*?\\\\"handle\\\\":\\\\"${username}\\\\".*?\\\\"name\\\\":\\\\"([^"]+)\\\\"`, 's');
            let match = html.match(mentorPattern);
            if (match && match[1]) {
                const name = match[1];
                if (name && name.trim()) {
                    return name.replace(/\\u0026/g, '&').trim();
                }
            }

            // Strategy 2: Extract from userData object (this is the most reliable source)
            const userDataPattern = /\\"userData\\":\\{[^}]*\\"data\\":\\{[^}]*\\"name\\":\\"([^"]+)\\"/;
            match = html.match(userDataPattern);
            if (match && match[1]) {
                const name = match[1];
                if (name && name.trim()) {
                    return name.replace(/\\u0026/g, '&').trim();
                }
            }

            // Strategy 3: Fallback - look for name in the specific JSON at the end
            // This avoids picking up names from "topExperts" or other sections
            const jsonEndPattern = /6:\[.*?\\"name\\":\\"([^"]+)\\"/s;
            match = html.match(jsonEndPattern);
            if (match && match[1]) {
                const name = match[1];
                if (name && name.trim()) {
                    return name.replace(/\\u0026/g, '&').trim();
                }
            }

            // Strategy 4: As last resort, look for any name but exclude known "topExperts" patterns
            // This regex specifically avoids the "topExperts" section
            const safeNamePattern = /\\"name\\":\\"([^"]+)\\"(?!.*topExperts)/s;
            match = html.match(safeNamePattern);
            if (match && match[1]) {
                const name = match[1];
                // Additional validation: not a username from topExperts list
                const topExpertsUsernames = ['shubhspj', 'monika13', 'asutosh98', 'lovernat89ch', 'erkhushbossg9', 'namansinghal2'];
                if (name && !topExpertsUsernames.includes(name.toLowerCase()) && name.trim()) {
                    return name.replace(/\\u0026/g, '&').trim();
                }
            }

            return null;
        }

        const score = parseInt(extract('score') || '0', 10);
        const problems = parseInt(extract('total_problems_solved') || '0', 10);
        const rank = parseInt(extract('institute_rank') || '0', 10);
        const streak = parseInt(extract('pod_solved_current_streak') || '0', 10);
        const longestStreak = parseInt(extract('pod_solved_longest_streak') || '0', 10);
        const name = extractName();
        const institute = extract('institute_name');

        if (score === 0 && problems === 0 && !name) {
            throw new Error("Fallback extraction failed. Unable to find profile data.");
        }

        return {
            success: true,
            data: {
                id: user_id,
                username: username,
                fullName: name || undefined,
                institution: institute || undefined,
                codingScore: score,
                problemsSolved: problems,
                instituteRank: rank,
                streak: streak,
                longestStreak: longestStreak,
                scrapedAt: new Date().toISOString(),
            }
        };
    }
};