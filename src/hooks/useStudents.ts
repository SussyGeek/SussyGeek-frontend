import { useState, useEffect, useCallback } from 'react';
import { getRegularStudents, getSortedStudents } from '@/api/services/studentService';

export type SortField = 'score' | 'solved' | 'streak' | null;
export type SortOrder = 'asc' | 'desc';

export const useStudents = (
    instituteId: string | undefined, 
    sortBy: SortField = null, 
    order: SortOrder = 'desc'
) => {
    // We buffer backend pages (which are 100 items each)
    const [bufferedStudents, setBufferedStudents] = useState<any[]>([]);
    const [displayedStudents, setDisplayedStudents] = useState<any[]>([]);
    
    // UI state
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    
    // Backend pagination state (pageNo for backend, increments by 1 for every 100 items)
    const [backendPage, setBackendPage] = useState<number>(1);
    // Frontend pagination state (how many items we are currently displaying)
    const [displayCount, setDisplayCount] = useState<number>(10);

    const fetchStudents = useCallback(async (pageNum: number, isReset = false) => {
        if (!instituteId) return;
        setIsLoading(true);
        
        let result;
        if (sortBy) {
            result = await getSortedStudents(instituteId, pageNum, sortBy, order);
        } else {
            result = await getRegularStudents(instituteId, pageNum);
        }
        
        if (result.success && result.data) {
            const newStudents = result.data;
            if (newStudents.length === 0) {
                setHasMore(false);
            } else {
                setBufferedStudents(prev => isReset ? newStudents : [...prev, ...newStudents]);
                setHasMore(newStudents.length >= 100); // 100 page buffer limit
            }
        } else {
            setHasMore(false);
        }
        setIsLoading(false);
    }, [instituteId, sortBy, order]);

    // Initial load and sort change
    useEffect(() => {
        if (instituteId) {
            setBackendPage(1);
            setDisplayCount(10);
            setHasMore(true);
            setBufferedStudents([]);
            setDisplayedStudents([]);
            fetchStudents(1, true);
        }
    }, [instituteId, sortBy, order, fetchStudents]);

    // Update displayed students whenever buffer or displayCount changes
    useEffect(() => {
        setDisplayedStudents(bufferedStudents.slice(0, displayCount));
    }, [bufferedStudents, displayCount]);

    const loadMore = () => {
        if (isLoading) return;
        
        const nextDisplayCount = displayCount + 10;
        
        // Do we need to fetch more from backend?
        if (nextDisplayCount > bufferedStudents.length && hasMore) {
            const nextBackendPage = backendPage + 1;
            setBackendPage(nextBackendPage);
            fetchStudents(nextBackendPage, false);
        }
        
        setDisplayCount(nextDisplayCount);
    };

    return { students: displayedStudents, isLoading, hasMore: hasMore || displayCount < bufferedStudents.length, loadMore };
};
