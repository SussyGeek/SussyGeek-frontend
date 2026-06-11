export const appwriteConfig = {
  projectId: import.meta.env.VITE_PUBLIC_APPWRITE_PROJECT_ID,
  projectName: import.meta.env.VITE_PUBLIC_APPWRITE_PROJECT_NAME,
  endpoint: import.meta.env.VITE_PUBLIC_APPWRITE_ENDPOINT,
  databaseId: import.meta.env.VITE_PUBLIC_APPWRITE_DATABASE_ID,
  institutionTableId: import.meta.env.VITE_PUBLIC_APPWRITE_TABLE_INSTITUTION_ID,
  studentTableId: import.meta.env.VITE_PUBLIC_APPWRITE_TABLE_STUDENT_ID,
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY 
}